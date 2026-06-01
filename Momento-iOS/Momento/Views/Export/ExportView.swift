//
//  ExportView.swift
//  The "Movie" tab — configure and render a timelapse, then preview & share.
//

import SwiftUI
import AVKit
import Photos

struct ExportView: View {
    @EnvironmentObject private var store: JournalStore

    @State private var settings = MovieSettings()
    @State private var range: DateRange = .all
    @State private var phase: Phase = .configure
    @State private var progress: Double = 0
    @State private var resultURL: URL?
    @State private var player: AVPlayer?
    @State private var errorMessage: String?
    @State private var saveState: SaveState = .idle

    private let exporter = MovieExporter()

    enum Phase { case configure, rendering, result }
    enum SaveState { case idle, saving, saved, failed }

    enum DateRange: String, CaseIterable, Identifiable {
        case last7 = "7 days", last30 = "30 days", thisYear = "This year", all = "All time"
        var id: String { rawValue }
    }

    var body: some View {
        ZStack {
            switch phase {
            case .configure: configureView
            case .rendering: renderingView
            case .result:    resultView
            }
        }
        .animation(.easeInOut, value: phase)
    }

    private var eligiblePhotos: [JournalEntry] {
        let entries = store.chronologicalEntries
        let calendar = Calendar.current
        let now = Date()
        switch range {
        case .all: return entries
        case .last7:
            guard let from = calendar.date(byAdding: .day, value: -6, to: calendar.startOfDay(for: now)) else { return entries }
            return entries.filter { $0.day >= from }
        case .last30:
            guard let from = calendar.date(byAdding: .day, value: -29, to: calendar.startOfDay(for: now)) else { return entries }
            return entries.filter { $0.day >= from }
        case .thisYear:
            return entries.filter { calendar.component(.year, from: $0.day) == calendar.component(.year, from: now) }
        }
    }

    // MARK: Configure

    private var configureView: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Image(systemName: "film.stack.fill").foregroundStyle(Theme.coral)
                        Text("Create a Movie")
                            .font(.system(size: 28, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                    }
                    Text("Turn your photos into a cinematic timelapse.")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }

                section("Time range") {
                    chips(DateRange.allCases, selection: range) { range = $0 }
                }

                section("Pace") {
                    VStack(spacing: 10) {
                        ForEach(MovieSettings.Speed.allCases) { speed in
                            speedRow(speed)
                        }
                    }
                }

                section("Format") {
                    chips(MovieSettings.Aspect.allCases, selection: settings.aspect) { settings.aspect = $0 }
                }

                section("Overlays") {
                    VStack(spacing: 0) {
                        toggleRow("Crossfade transitions", isOn: $settings.crossfade)
                        Divider().overlay(Color.white.opacity(0.06))
                        toggleRow("Show dates", isOn: $settings.showDate)
                        Divider().overlay(Color.white.opacity(0.06))
                        toggleRow("Show captions", isOn: $settings.showCaption)
                    }
                    .padding(.horizontal, 14)
                    .card(cornerRadius: 16)
                }

                createButton
                Color.clear.frame(height: 100)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
        }
        .scrollIndicators(.hidden)
    }

    private var createButton: some View {
        let count = eligiblePhotos.count
        return VStack(spacing: 8) {
            Button(action: startExport) {
                HStack(spacing: 10) {
                    Image(systemName: "wand.and.stars")
                    Text(count == 0 ? "No photos in range" : "Create Movie")
                }
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 58)
                .background(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .fill(count == 0 ? AnyShapeStyle(Theme.surfaceHi) : AnyShapeStyle(Theme.brand))
                        .shadow(color: count == 0 ? .clear : Theme.violet.opacity(0.5), radius: 16, y: 8)
                )
            }
            .bounceOnTap()
            .disabled(count == 0)

            if count > 0 {
                Text("\(count) \(count == 1 ? "photo" : "photos") • ~\(estimatedSeconds, specifier: "%.1f")s")
                    .font(.system(size: 13, weight: .medium, design: .rounded))
                    .foregroundStyle(Theme.textTertiary)
                    .frame(maxWidth: .infinity)
            }
        }
        .padding(.top, 4)
    }

    private var estimatedSeconds: Double {
        let count = Double(eligiblePhotos.count)
        let hold = settings.speed.holdSeconds
        let trans = settings.crossfade ? 0.35 : 0
        return count * hold + max(0, count - 1) * trans
    }

    // MARK: Rendering

    private var renderingView: some View {
        VStack(spacing: 28) {
            Spacer()
            ZStack {
                Circle()
                    .stroke(Theme.surfaceHi, lineWidth: 12)
                    .frame(width: 160, height: 160)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Theme.warm, style: StrokeStyle(lineWidth: 12, lineCap: .round))
                    .frame(width: 160, height: 160)
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 0.2), value: progress)
                VStack(spacing: 2) {
                    Text("\(Int(progress * 100))%")
                        .font(.system(size: 34, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("rendering")
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
            }
            Text("Crafting your movie…")
                .font(.system(size: 18, weight: .semibold, design: .rounded))
                .foregroundStyle(.white)
            Spacer(); Spacer()
        }
        .padding(40)
    }

    // MARK: Result

    private var resultView: some View {
        ScrollView {
            VStack(spacing: 20) {
                HStack {
                    Text("Your Movie")
                        .font(.system(size: 26, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Spacer()
                    Button {
                        resetToConfigure()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundStyle(Theme.textTertiary)
                    }
                }

                if let player {
                    VideoPlayer(player: player)
                        .aspectRatio(settings.aspect == .square ? 1 : 9.0/16.0, contentMode: .fit)
                        .frame(maxWidth: .infinity)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
                        .shadow(color: .black.opacity(0.4), radius: 16, y: 8)
                        .onAppear {
                            player.seek(to: .zero)
                            player.play()
                        }
                }

                VStack(spacing: 12) {
                    if let resultURL {
                        ShareLink(item: resultURL) {
                            actionLabel("Share", icon: "square.and.arrow.up", gradient: Theme.brand)
                        }
                    }
                    Button(action: { if let resultURL { saveToPhotos(resultURL) } }) {
                        saveLabel
                    }
                    .bounceOnTap()
                    .disabled(saveState == .saving || saveState == .saved)

                    Button(action: resetToConfigure) {
                        Text("Create Another")
                            .font(.system(size: 16, weight: .semibold, design: .rounded))
                            .foregroundStyle(Theme.textSecondary)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                    }
                }

                Color.clear.frame(height: 100)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
        }
        .scrollIndicators(.hidden)
    }

    private var saveLabel: some View {
        Group {
            switch saveState {
            case .idle:    actionLabel("Save to Photos", icon: "square.and.arrow.down", gradient: Theme.warm)
            case .saving:  actionLabel("Saving…", icon: "arrow.down.circle", gradient: Theme.warm)
            case .saved:   actionLabel("Saved ✓", icon: "checkmark.circle.fill", gradient: Theme.warm)
            case .failed:  actionLabel("Couldn't save — retry", icon: "exclamationmark.triangle", gradient: Theme.warm)
            }
        }
    }

    // MARK: Reusable bits

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
            content()
        }
    }

    private func chips<T: Identifiable & Equatable & RawRepresentable>(
        _ items: [T], selection: T, onTap: @escaping (T) -> Void
    ) -> some View where T.RawValue == String {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(items) { item in
                    let isSelected = item == selection
                    Button {
                        Haptics.selection()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { onTap(item) }
                    } label: {
                        Text(item.rawValue)
                            .font(.system(size: 14, weight: .semibold, design: .rounded))
                            .foregroundStyle(isSelected ? .white : Theme.textSecondary)
                            .padding(.horizontal, 16).padding(.vertical, 10)
                            .background(
                                Capsule().fill(isSelected ? AnyShapeStyle(Theme.brandSoft) : AnyShapeStyle(Theme.surface))
                            )
                    }
                }
            }
        }
    }

    private func speedRow(_ speed: MovieSettings.Speed) -> some View {
        let isSelected = settings.speed == speed
        return Button {
            Haptics.selection()
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) { settings.speed = speed }
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(speed.rawValue)
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text(speed.subtitle)
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
                Spacer()
                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 22))
                    .foregroundStyle(isSelected ? AnyShapeStyle(Theme.coral) : AnyShapeStyle(Theme.textTertiary))
            }
            .padding(14)
            .background(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(isSelected ? Theme.surfaceHi : Theme.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(isSelected ? Theme.coral.opacity(0.5) : .white.opacity(0.05), lineWidth: 1)
                    )
            )
        }
    }

    private func toggleRow(_ title: String, isOn: Binding<Bool>) -> some View {
        Toggle(isOn: isOn) {
            Text(title)
                .font(.system(size: 15, weight: .medium, design: .rounded))
                .foregroundStyle(.white)
        }
        .tint(Theme.coral)
        .padding(.vertical, 12)
    }

    private func actionLabel(_ title: String, icon: String, gradient: LinearGradient) -> some View {
        HStack(spacing: 10) {
            Image(systemName: icon)
            Text(title)
        }
        .font(.system(size: 17, weight: .bold, design: .rounded))
        .foregroundStyle(.white)
        .frame(maxWidth: .infinity)
        .frame(height: 54)
        .background(RoundedRectangle(cornerRadius: 16, style: .continuous).fill(gradient))
    }

    // MARK: Actions

    private func startExport() {
        let entries = eligiblePhotos
        guard !entries.isEmpty else { return }
        Haptics.tap(.medium)

        // Load images on the main actor before handing off to the exporter.
        let photos: [ExportPhoto] = entries.compactMap { entry in
            guard let image = store.image(for: entry) else { return nil }
            return ExportPhoto(image: image,
                               dateLabel: entry.day.formatted("MMM d, yyyy"),
                               caption: entry.caption)
        }
        guard !photos.isEmpty else { return }

        progress = 0
        errorMessage = nil
        phase = .rendering

        Task {
            do {
                let url = try await exporter.export(photos: photos, settings: settings) { p in
                    progress = p
                }
                await MainActor.run {
                    resultURL = url
                    player = AVPlayer(url: url)
                    saveState = .idle
                    Haptics.success()
                    phase = .result
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    Haptics.warning()
                    phase = .configure
                }
            }
        }
    }

    private func resetToConfigure() {
        player?.pause()
        player = nil
        resultURL = nil
        saveState = .idle
        phase = .configure
    }

    private func saveToPhotos(_ url: URL) {
        saveState = .saving
        PHPhotoLibrary.requestAuthorization(for: .addOnly) { status in
            guard status == .authorized || status == .limited else {
                DispatchQueue.main.async { saveState = .failed }
                return
            }
            PHPhotoLibrary.shared().performChanges {
                PHAssetCreationRequest.creationRequestForAssetFromVideo(atFileURL: url)
            } completionHandler: { success, _ in
                DispatchQueue.main.async {
                    saveState = success ? .saved : .failed
                    if success { Haptics.success() } else { Haptics.warning() }
                }
            }
        }
    }
}
