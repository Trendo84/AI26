//
//  CaptureView.swift
//  The capture + compose flow: pick a photo, add a caption and mood, save.
//  Also used to edit an existing day's entry.
//

import SwiftUI
import PhotosUI

struct CaptureView: View {
    @EnvironmentObject private var store: JournalStore
    @Environment(\.dismiss) private var dismiss

    /// The day being captured/edited (defaults to today).
    var date: Date = Date()
    /// If provided, we're editing an existing entry.
    var editing: JournalEntry? = nil

    @State private var image: UIImage?
    @State private var caption: String = ""
    @State private var mood: Mood? = nil
    @State private var showCamera = false
    @State private var photoItem: PhotosPickerItem?
    @State private var appear = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.appBackground()
                content
            }
            .navigationTitle(editing == nil ? "New Moment" : "Edit Moment")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(Theme.textSecondary)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save", action: save)
                        .fontWeight(.bold)
                        .foregroundStyle(image == nil ? Theme.textTertiary : Theme.coral)
                        .disabled(image == nil)
                }
            }
        }
        .onAppear(perform: configureForEditing)
        .sheet(isPresented: $showCamera) {
            CameraPicker { picked in
                withAnimation(.spring) { image = picked }
            }
            .ignoresSafeArea()
        }
        .onChange(of: photoItem) { _, newValue in
            guard let newValue else { return }
            Task {
                if let data = try? await newValue.loadTransferable(type: Data.self),
                   let ui = UIImage(data: data) {
                    await MainActor.run {
                        withAnimation(.spring) { image = ui }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var content: some View {
        ScrollView {
            VStack(spacing: 22) {
                photoArea
                    .padding(.top, 8)

                if image != nil {
                    captionField
                    moodPicker
                }
            }
            .padding(20)
            .padding(.bottom, 40)
        }
    }

    // MARK: Photo area

    private var photoArea: some View {
        Group {
            if let image {
                ZStack(alignment: .topTrailing) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity)
                        .frame(height: 360)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))

                    HStack(spacing: 10) {
                        if CameraPicker.isAvailable {
                            Button { showCamera = true } label: {
                                overlayIcon("camera.fill")
                            }
                        }
                        PhotosPicker(selection: $photoItem, matching: .images) {
                            overlayIcon("photo.fill.on.rectangle.fill")
                        }
                    }
                    .padding(12)
                }
            } else {
                sourceChooser
            }
        }
    }

    private func overlayIcon(_ name: String) -> some View {
        Image(systemName: name)
            .font(.system(size: 16, weight: .bold))
            .foregroundStyle(.white)
            .padding(10)
            .background(.ultraThinMaterial, in: Circle())
    }

    private var sourceChooser: some View {
        VStack(spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                    .fill(Theme.surface)
                    .frame(height: 300)
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                            .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [9, 7]))
                            .foregroundStyle(.white.opacity(0.12))
                    )
                VStack(spacing: 12) {
                    ApertureMark(openAmount: appear ? 1 : 0.2, rotation: appear ? 0 : -40)
                        .frame(width: 72, height: 72)
                    Text("Add today's photo")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text(date.relativeDayLabel)
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
            }

            HStack(spacing: 12) {
                if CameraPicker.isAvailable {
                    sourceButton(title: "Camera", icon: "camera.fill", gradient: Theme.brand) {
                        showCamera = true
                    }
                }
                PhotosPicker(selection: $photoItem, matching: .images) {
                    sourceButtonLabel(title: "Library", icon: "photo.fill.on.rectangle.fill",
                                      gradient: Theme.warm)
                }
            }
        }
        .onAppear {
            withAnimation(.spring(response: 0.7, dampingFraction: 0.7)) { appear = true }
        }
    }

    private func sourceButton(title: String, icon: String, gradient: LinearGradient, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            sourceButtonLabel(title: title, icon: icon, gradient: gradient)
        }
        .bounceOnTap()
    }

    private func sourceButtonLabel(title: String, icon: String, gradient: LinearGradient) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
            Text(title)
        }
        .font(.system(size: 16, weight: .bold, design: .rounded))
        .foregroundStyle(.white)
        .frame(maxWidth: .infinity)
        .frame(height: 54)
        .background(RoundedRectangle(cornerRadius: 16, style: .continuous).fill(gradient))
    }

    // MARK: Caption + mood

    private var captionField: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Caption")
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
            TextField("What made today memorable?", text: $caption, axis: .vertical)
                .lineLimit(1...4)
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundStyle(.white)
                .padding(14)
                .card(cornerRadius: 16)
        }
    }

    private var moodPicker: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Mood")
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
            HStack(spacing: 10) {
                ForEach(Mood.allCases) { option in
                    Button {
                        Haptics.selection()
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                            mood = (mood == option) ? nil : option
                        }
                    } label: {
                        VStack(spacing: 4) {
                            Text(option.emoji).font(.system(size: 26))
                            Text(option.label)
                                .font(.system(size: 10, weight: .semibold, design: .rounded))
                                .foregroundStyle(mood == option ? .white : Theme.textTertiary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(mood == option ? AnyShapeStyle(Theme.brandSoft) : AnyShapeStyle(Theme.surface))
                        )
                        .scaleEffect(mood == option ? 1.05 : 1)
                    }
                }
            }
        }
    }

    // MARK: Actions

    private func configureForEditing() {
        guard let editing else { return }
        caption = editing.caption
        mood = editing.mood
        image = store.image(for: editing)
    }

    private func save() {
        guard let image else { return }
        Haptics.success()
        store.save(image: image, caption: caption.trimmingCharacters(in: .whitespacesAndNewlines),
                   mood: mood, for: editing?.day ?? date)
        dismiss()
    }
}
