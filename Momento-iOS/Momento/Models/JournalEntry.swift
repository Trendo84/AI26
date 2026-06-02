//
//  JournalEntry.swift
//  A single day's captured moment.
//

import Foundation

struct JournalEntry: Identifiable, Codable, Equatable, Hashable {
    let id: UUID
    /// The calendar day this entry represents, normalized to the start of day.
    var day: Date
    var imageFileName: String
    var caption: String
    var mood: Mood?
    var createdAt: Date

    init(id: UUID = UUID(),
         day: Date,
         imageFileName: String,
         caption: String = "",
         mood: Mood? = nil,
         createdAt: Date = Date()) {
        self.id = id
        self.day = day
        self.imageFileName = imageFileName
        self.caption = caption
        self.mood = mood
        self.createdAt = createdAt
    }
}

enum Mood: String, Codable, CaseIterable, Identifiable, Hashable {
    case amazing, good, okay, low, rough

    var id: String { rawValue }

    var emoji: String {
        switch self {
        case .amazing: return "🤩"
        case .good:    return "🙂"
        case .okay:    return "😐"
        case .low:     return "😕"
        case .rough:   return "😢"
        }
    }

    var label: String {
        switch self {
        case .amazing: return "Amazing"
        case .good:    return "Good"
        case .okay:    return "Okay"
        case .low:     return "Low"
        case .rough:   return "Rough"
        }
    }
}
