//
//  TimelineView.swift
//  The "Memories" tab — a grid or calendar of every captured day.
//

import SwiftUI

struct TimelineView: View {
    @EnvironmentObject private var store: JournalStore
    @State private var mode: Mode = .grid
    @State private var detailEntry: JournalEntry?

    enum Mode: String, CaseIterable { case grid = "Grid", calendar = "Calendar" }

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 6), count: 3)

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                headerBar
                if store.entries.isEmpty {
                    emptyState
                } else {
                    ScrollView {
                        if mode == .grid { gridContent } else { CalendarMonthView(onSelect: open) }
                        Color.clear.frame(height: 100)
                    }
                    .scrollIndicators(.hidden)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(item: $detailEntry) { entry in
                EntryDetailView(entry: entry)
            }
        }
    }

    private var headerBar: some View {
        VStack(spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Memories")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("\(store.totalCount) \(store.totalCount == 1 ? "moment" : "moments") captured")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
                Spacer()
            }

            Picker("View", selection: $mode) {
                ForEach(Mode.allCases, id: \.self) { Text($0.rawValue).tag($0) }
            }
            .pickerStyle(.segmented)
        }
        .padding(.horizontal, 20)
        .padding(.top, 12)
        .padding(.bottom, 12)
    }

    private var gridContent: some View {
        LazyVGrid(columns: columns, spacing: 6) {
            ForEach(store.sortedEntries) { entry in
                Button { open(entry) } label: {
                    GridCell(entry: entry)
                }
                .buttonStyle(PressableStyle(scale: 0.94))
            }
        }
        .padding(.horizontal, 12)
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Spacer()
            ApertureMark(openAmount: 0.5)
                .frame(width: 90, height: 90)
                .opacity(0.6)
            Text("No memories yet")
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Text("Capture your first photo to start your story.")
                .font(.system(size: 15, weight: .medium, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
                .multilineTextAlignment(.center)
            Spacer()
            Spacer()
        }
        .padding(40)
    }

    private func open(_ entry: JournalEntry) {
        Haptics.tap()
        detailEntry = entry
    }
}

struct GridCell: View {
    @EnvironmentObject private var store: JournalStore
    let entry: JournalEntry

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            if let image = store.image(for: entry) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
            } else {
                Rectangle().fill(Theme.surfaceHi)
            }
            LinearGradient(colors: [.clear, .black.opacity(0.55)], startPoint: .center, endPoint: .bottom)
            HStack(spacing: 3) {
                Text(entry.day.monthDayLabel)
                    .font(.system(size: 10, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                if let mood = entry.mood {
                    Text(mood.emoji).font(.system(size: 9))
                }
            }
            .padding(6)
        }
        .aspectRatio(1, contentMode: .fill)
        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
    }
}
