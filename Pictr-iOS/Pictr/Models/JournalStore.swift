//
//  JournalStore.swift
//  Persistence + business logic for the photo journal.
//
//  Entries are stored as JSON metadata in Documents/entries.json and their
//  photos as JPEGs in Documents/Photos. Thumbnails are cached in memory.
//

import SwiftUI
import UIKit

@MainActor
final class JournalStore: ObservableObject {
    @Published private(set) var entries: [JournalEntry] = []

    private let calendar = Calendar.current
    private let fileManager = FileManager.default
    private let imageCache = NSCache<NSString, UIImage>()

    private var documentsURL: URL {
        fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }
    private var photosURL: URL {
        documentsURL.appendingPathComponent("Photos", isDirectory: true)
    }
    private var entriesURL: URL {
        documentsURL.appendingPathComponent("entries.json")
    }

    init() {
        createPhotosDirectoryIfNeeded()
        load()
    }

    // MARK: - Derived state

    /// Entries sorted newest-day first.
    var sortedEntries: [JournalEntry] {
        entries.sorted { $0.day > $1.day }
    }

    /// Entries in chronological order (oldest first) — used for export.
    var chronologicalEntries: [JournalEntry] {
        entries.sorted { $0.day < $1.day }
    }

    var todaysEntry: JournalEntry? {
        let today = calendar.startOfDay(for: Date())
        return entries.first { calendar.isDate($0.day, inSameDayAs: today) }
    }

    var hasEntryToday: Bool { todaysEntry != nil }

    func entry(on date: Date) -> JournalEntry? {
        entries.first { calendar.isDate($0.day, inSameDayAs: date) }
    }

    /// Memories captured on this same calendar day in previous months/years.
    func onThisDay(reference: Date = Date()) -> [JournalEntry] {
        let refComponents = calendar.dateComponents([.day], from: reference)
        let today = calendar.startOfDay(for: reference)
        return sortedEntries.filter { entry in
            guard !calendar.isDate(entry.day, inSameDayAs: today) else { return false }
            let comps = calendar.dateComponents([.day], from: entry.day)
            return comps.day == refComponents.day
        }
    }

    /// Current consecutive-day streak counting back from today (or yesterday).
    var currentStreak: Int {
        let days = Set(entries.map { calendar.startOfDay(for: $0.day) })
        guard !days.isEmpty else { return 0 }

        var cursor = calendar.startOfDay(for: Date())
        // Allow the streak to still "count" if today isn't captured yet but
        // yesterday was — the chain isn't broken until a full day is missed.
        if !days.contains(cursor) {
            guard let yesterday = calendar.date(byAdding: .day, value: -1, to: cursor),
                  days.contains(yesterday) else { return 0 }
            cursor = yesterday
        }

        var streak = 0
        while days.contains(cursor) {
            streak += 1
            guard let previous = calendar.date(byAdding: .day, value: -1, to: cursor) else { break }
            cursor = previous
        }
        return streak
    }

    var totalCount: Int { entries.count }

    // MARK: - Mutations

    /// Create or replace the entry for a given day.
    func save(image: UIImage, caption: String, mood: Mood?, for date: Date = Date()) {
        let day = calendar.startOfDay(for: date)

        if let existing = entry(on: day) {
            // Reuse the same file name to avoid orphaned images.
            writeImage(image, named: existing.imageFileName)
            imageCache.removeObject(forKey: existing.imageFileName as NSString)
            if let idx = entries.firstIndex(where: { $0.id == existing.id }) {
                entries[idx].caption = caption
                entries[idx].mood = mood
            }
        } else {
            let fileName = "\(UUID().uuidString).jpg"
            writeImage(image, named: fileName)
            let entry = JournalEntry(day: day, imageFileName: fileName, caption: caption, mood: mood)
            entries.append(entry)
        }
        persist()
    }

    /// Update caption/mood without changing the photo.
    func update(_ entry: JournalEntry, caption: String, mood: Mood?) {
        guard let idx = entries.firstIndex(where: { $0.id == entry.id }) else { return }
        entries[idx].caption = caption
        entries[idx].mood = mood
        persist()
    }

    func delete(_ entry: JournalEntry) {
        let url = photosURL.appendingPathComponent(entry.imageFileName)
        try? fileManager.removeItem(at: url)
        imageCache.removeObject(forKey: entry.imageFileName as NSString)
        entries.removeAll { $0.id == entry.id }
        persist()
    }

    // MARK: - Images

    func image(for entry: JournalEntry) -> UIImage? {
        if let cached = imageCache.object(forKey: entry.imageFileName as NSString) {
            return cached
        }
        let url = photosURL.appendingPathComponent(entry.imageFileName)
        guard let image = UIImage(contentsOfFile: url.path) else { return nil }
        imageCache.setObject(image, forKey: entry.imageFileName as NSString)
        return image
    }

    // MARK: - Persistence

    private func createPhotosDirectoryIfNeeded() {
        if !fileManager.fileExists(atPath: photosURL.path) {
            try? fileManager.createDirectory(at: photosURL, withIntermediateDirectories: true)
        }
    }

    private func writeImage(_ image: UIImage, named fileName: String) {
        // Normalize orientation and bound the size for performance.
        let bounded = image.boundedTo(maxDimension: 2200)
        guard let data = bounded.jpegData(compressionQuality: 0.86) else { return }
        let url = photosURL.appendingPathComponent(fileName)
        try? data.write(to: url, options: .atomic)
    }

    private func load() {
        guard let data = try? Data(contentsOf: entriesURL) else {
            entries = []
            return
        }
        let decoder = JSONDecoder()
        entries = (try? decoder.decode([JournalEntry].self, from: data)) ?? []
    }

    private func persist() {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted]
        guard let data = try? encoder.encode(entries) else { return }
        try? data.write(to: entriesURL, options: .atomic)
    }

    #if DEBUG
    /// Populates the journal with placeholder days so previews/screenshots
    /// have something to show. Safe to call repeatedly.
    func seedSampleDataIfEmpty() {
        guard entries.isEmpty else { return }
        let palettes: [[UIColor]] = [
            [UIColor(red: 0.36, green: 0.24, blue: 0.62, alpha: 1), UIColor(red: 1.0, green: 0.48, blue: 0.54, alpha: 1)],
            [UIColor(red: 0.10, green: 0.45, blue: 0.62, alpha: 1), UIColor(red: 0.30, green: 0.85, blue: 0.70, alpha: 1)],
            [UIColor(red: 0.95, green: 0.62, blue: 0.20, alpha: 1), UIColor(red: 0.95, green: 0.30, blue: 0.45, alpha: 1)],
            [UIColor(red: 0.20, green: 0.22, blue: 0.40, alpha: 1), UIColor(red: 0.55, green: 0.40, blue: 0.85, alpha: 1)],
        ]
        let captions = ["Golden hour walk", "Coffee + code", "First bloom of spring",
                        "City lights", "Quiet morning", "Made pasta from scratch", "Rain on the window"]
        let moods: [Mood] = [.amazing, .good, .okay, .good, .amazing]
        for offset in 0..<7 {
            guard let day = calendar.date(byAdding: .day, value: -offset, to: Date()) else { continue }
            let colors = palettes[offset % palettes.count]
            let img = UIImage.gradient(colors: colors, size: CGSize(width: 1000, height: 1000))
            save(image: img,
                 caption: captions[offset % captions.count],
                 mood: moods[offset % moods.count],
                 for: day)
        }
    }
    #endif
}
