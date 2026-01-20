//
//  Box.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import Foundation

struct Box: Identifiable, Codable {
    let id: UUID
    var number: String
    var title: String
    var room: String
    var items: [BoxItem]
    var emoji: String
    var createdAt: Date
    var updatedAt: Date
    
    init(
        id: UUID = UUID(),
        number: String,
        title: String,
        room: String,
        items: [BoxItem] = [],
        emoji: String = "📦",
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.number = number
        self.title = title
        self.room = room
        self.items = items
        self.emoji = emoji
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
    
    var itemCount: Int {
        items.count
    }
    
    var packedItemCount: Int {
        items.filter { $0.isPacked }.count
    }
}

struct BoxItem: Identifiable, Codable {
    let id: UUID
    var name: String
    var emoji: String
    var isPacked: Bool
    
    init(
        id: UUID = UUID(),
        name: String,
        emoji: String = "📦",
        isPacked: Bool = false
    ) {
        self.id = id
        self.name = name
        self.emoji = emoji
        self.isPacked = isPacked
    }
}
