//
//  HomeView.swift
//  The "Today" tab — greeting, streak, today's moment, and memories.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var store: JournalStore
    var openCapture: () -> Void

    @State private var editingEntry: JournalEntry?
    @State private var detailEntry: JournalEntry?
    @State private var now = Date()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    header
                    statsRow
                    todayCard
                    onThisDaySection
                    Color.clear.frame(height: 90) // tab bar clearance
                }
                .padding(.horizontal, 20)
                .padding(.top, 8)
            }
            .scrollIndicators(.hidden)
            .background(Color.clear)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(item: $detailEntry) { entry in
                EntryDetailView(entry: entry)
            }
        }
        .sheet(item: $editingEntry) { entry in
            CaptureView(date: entry.day, editing: entry)
                .environmentObject(store)
        }
    }

    // MARK: Header

    private var header: some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text(greeting)
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .foregroundStyle(Theme.textSecondary)
                Text(now.formatted("EEEE, MMMM d"))
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
            }
            Spacer()
            ApertureMark(openAmount: 1)
                .frame(width: 40, height: 40)
        }
        .padding(.top, 4)
    }

    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: now)
        switch hour {
        case 5..<12:  return "Good morning ☀️"
        case 12..<17: return "Good afternoon"
        case 17..<22: return "Good evening 🌆"
        default:      return "Good night 🌙"
        }
    }

    // MARK: Stats

    private var statsRow: some View {
        HStack(spacing: 12) {
            StatCard(value: "\(store.currentStreak)",
                     label: store.currentStreak == 1 ? "day streak" : "day streak",
                     icon: "flame.fill",
                     tint: Theme.coral)
            StatCard(value: "\(store.totalCount)",
                     label: "moments",
                     icon: "photo.stack.fill",
                     tint: Theme.violet)
        }
    }

    // MARK: Today card

    @ViewBuilder
    private var todayCard: some View {
        if let entry = store.todaysEntry, let image = store.image(for: entry) {
            Button {
                Haptics.tap()
                detailEntry = entry
            } label: {
                VStack(alignment: .leading, spacing: 0) {
                    ZStack(alignment: .topLeading) {
                        Image(uiImage: image)
                            .resizable()
                            .scaledToFill()
                            .frame(height: 380)
                            .frame(maxWidth: .infinity)
                            .clipped()
                        LinearGradient(colors: [.black.opacity(0.5), .clear, .black.opacity(0.35)],
                                       startPoint: .top, endPoint: .bottom)
                        VStack(alignment: .leading) {
                            Text("TODAY")
                                .font(.system(size: 12, weight: .heavy, design: .rounded))
                                .tracking(2)
                                .foregroundStyle(.white)
                                .padding(.horizontal, 10).padding(.vertical, 5)
                                .background(Capsule().fill(Theme.warm))
                            Spacer()
                            HStack {
                                if let mood = entry.mood {
                                    Text(mood.emoji).font(.system(size: 22))
                                }
                                if !entry.caption.isEmpty {
                                    Text(entry.caption)
                                        .font(.system(size: 16, weight: .semibold, design: .rounded))
                                        .foregroundStyle(.white)
                                        .lineLimit(2)
                                }
                                Spacer()
                            }
                        }
                        .padding(16)
                    }
                }
                .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                        .stroke(.white.opacity(0.08), lineWidth: 1)
                )
            }
            .buttonStyle(PressableStyle(scale: 0.98))
            .contextMenu {
                Button { editingEntry = entry } label: { Label("Edit", systemImage: "pencil") }
            }
        } else {
            EmptyTodayCard(action: openCapture)
        }
    }

    // MARK: On this day

    @ViewBuilder
    private var onThisDaySection: some View {
        let memories = store.onThisDay(reference: now)
        if !memories.isEmpty {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 6) {
                    Image(systemName: "sparkles")
                        .foregroundStyle(Theme.peach)
                    Text("On this day")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                }
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(memories) { entry in
                            Button {
                                Haptics.tap()
                                detailEntry = entry
                            } label: {
                                MemoryThumb(entry: entry)
                            }
                            .buttonStyle(PressableStyle(scale: 0.95))
                        }
                    }
                }
            }
            .padding(.top, 4)
        }
    }
}

// MARK: - Supporting views

struct StatCard: View {
    let value: String
    let label: String
    let icon: String
    let tint: Color

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 20, weight: .bold))
                .foregroundStyle(tint)
                .frame(width: 44, height: 44)
                .background(Circle().fill(tint.opacity(0.15)))
            VStack(alignment: .leading, spacing: 0) {
                Text(value)
                    .font(.system(size: 22, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                Text(label)
                    .font(.system(size: 12, weight: .medium, design: .rounded))
                    .foregroundStyle(Theme.textSecondary)
            }
            Spacer()
        }
        .padding(14)
        .card()
    }
}

struct EmptyTodayCard: View {
    var action: () -> Void
    @State private var pulse = false

    var body: some View {
        Button(action: { Haptics.tap(.medium); action() }) {
            VStack(spacing: 18) {
                ZStack {
                    Circle()
                        .fill(Theme.brand)
                        .frame(width: 88, height: 88)
                        .shadow(color: Theme.violet.opacity(0.6), radius: pulse ? 26 : 12)
                        .scaleEffect(pulse ? 1.05 : 1)
                    Image(systemName: "camera.fill")
                        .font(.system(size: 34, weight: .bold))
                        .foregroundStyle(.white)
                }
                VStack(spacing: 6) {
                    Text("Capture today's moment")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("You haven't added a photo yet today.")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 48)
            .card()
            .overlay(
                RoundedRectangle(cornerRadius: Theme.corner, style: .continuous)
                    .strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [9, 7]))
                    .foregroundStyle(Theme.violet.opacity(0.4))
            )
        }
        .buttonStyle(PressableStyle(scale: 0.98))
        .onAppear {
            withAnimation(.easeInOut(duration: 1.6).repeatForever(autoreverses: true)) {
                pulse = true
            }
        }
    }
}

struct MemoryThumb: View {
    @EnvironmentObject private var store: JournalStore
    let entry: JournalEntry

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            if let image = store.image(for: entry) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 130, height: 160)
                    .clipped()
            } else {
                Rectangle().fill(Theme.surfaceHi).frame(width: 130, height: 160)
            }
            LinearGradient(colors: [.clear, .black.opacity(0.6)], startPoint: .center, endPoint: .bottom)
            Text(entry.day.formatted("MMM d, yyyy"))
                .font(.system(size: 11, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .padding(8)
        }
        .frame(width: 130, height: 160)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}
