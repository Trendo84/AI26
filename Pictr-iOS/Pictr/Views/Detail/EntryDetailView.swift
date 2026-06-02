//
//  EntryDetailView.swift
//  Full-screen view of a single day, swipeable across the whole journal.
//

import SwiftUI

struct EntryDetailView: View {
    @EnvironmentObject private var store: JournalStore
    @Environment(\.dismiss) private var dismiss

    let entry: JournalEntry

    @State private var selection: UUID
    @State private var editingEntry: JournalEntry?
    @State private var showDeleteConfirm = false

    init(entry: JournalEntry) {
        self.entry = entry
        _selection = State(initialValue: entry.id)
    }

    private var entries: [JournalEntry] { store.sortedEntries }

    var body: some View {
        ZStack {
            Theme.appBackground()

            TabView(selection: $selection) {
                ForEach(entries) { item in
                    DetailPage(entry: item)
                        .tag(item.id)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                Text(currentEntry?.day.formatted("EEEE, MMM d, yyyy") ?? "")
                    .font(.system(size: 15, weight: .semibold, design: .rounded))
                    .foregroundStyle(.white)
            }
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    if let current = currentEntry {
                        Button { editingEntry = current } label: {
                            Label("Edit", systemImage: "pencil")
                        }
                        if let image = store.image(for: current) {
                            ShareLink(item: Image(uiImage: image),
                                      preview: SharePreview(current.caption.isEmpty ? "Pictr" : current.caption,
                                                            image: Image(uiImage: image))) {
                                Label("Share", systemImage: "square.and.arrow.up")
                            }
                        }
                        Divider()
                        Button(role: .destructive) { showDeleteConfirm = true } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundStyle(.white)
                }
            }
        }
        .sheet(item: $editingEntry) { item in
            CaptureView(date: item.day, editing: item)
                .environmentObject(store)
        }
        .confirmationDialog("Delete this moment?", isPresented: $showDeleteConfirm, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                if let current = currentEntry {
                    Haptics.warning()
                    let remaining = entries.filter { $0.id != current.id }
                    store.delete(current)
                    if remaining.isEmpty {
                        dismiss()
                    } else {
                        selection = remaining.first!.id
                    }
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("This photo will be permanently removed.")
        }
    }

    private var currentEntry: JournalEntry? {
        store.entries.first { $0.id == selection }
    }
}

private struct DetailPage: View {
    @EnvironmentObject private var store: JournalStore
    let entry: JournalEntry

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                if let image = store.image(for: entry) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFit()
                        .frame(maxWidth: .infinity)
                        .clipShape(RoundedRectangle(cornerRadius: Theme.corner, style: .continuous))
                        .shadow(color: .black.opacity(0.4), radius: 16, y: 8)
                }

                VStack(alignment: .leading, spacing: 14) {
                    HStack(spacing: 10) {
                        Text(entry.day.relativeDayLabel)
                            .font(.system(size: 20, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                        Spacer()
                        if let mood = entry.mood {
                            HStack(spacing: 6) {
                                Text(mood.emoji)
                                Text(mood.label)
                                    .font(.system(size: 13, weight: .semibold, design: .rounded))
                                    .foregroundStyle(Theme.textSecondary)
                            }
                            .padding(.horizontal, 12).padding(.vertical, 7)
                            .background(Capsule().fill(Theme.surface))
                        }
                    }

                    if !entry.caption.isEmpty {
                        Text(entry.caption)
                            .font(.system(size: 16, weight: .medium, design: .rounded))
                            .foregroundStyle(Theme.textPrimary.opacity(0.9))
                            .fixedSize(horizontal: false, vertical: true)
                    } else {
                        Text("No caption")
                            .font(.system(size: 15, weight: .medium, design: .rounded))
                            .foregroundStyle(Theme.textTertiary)
                            .italic()
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(18)
                .card()

                Color.clear.frame(height: 30)
            }
            .padding(.horizontal, 20)
            .padding(.top, 8)
        }
        .scrollIndicators(.hidden)
    }
}
