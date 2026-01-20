//
//  BoxViewModel.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import Foundation
import SwiftUI

@MainActor
class BoxViewModel: ObservableObject {
    @Published var boxes: [Box] = []
    @Published var searchText: String = ""
    @AppStorage("selectedTheme") var selectedTheme: String = "light"
    @AppStorage("isDarkMode") var isDarkMode: Bool = false
    
    private let saveKey = "SavedBoxes"
    
    init() {
        loadBoxes()
        
        // Add sample data if empty
        if boxes.isEmpty {
            addSampleData()
        }
    }
    
    // MARK: - Box Management
    
    func addBox(_ box: Box) {
        boxes.append(box)
        saveBoxes()
    }
    
    func deleteBox(_ box: Box) {
        boxes.removeAll { $0.id == box.id }
        saveBoxes()
    }
    
    func updateBox(_ box: Box) {
        if let index = boxes.firstIndex(where: { $0.id == box.id }) {
            boxes[index] = box
            saveBoxes()
        }
    }
    
    func toggleItemPacked(boxId: UUID, itemId: UUID) {
        if let boxIndex = boxes.firstIndex(where: { $0.id == boxId }),
           let itemIndex = boxes[boxIndex].items.firstIndex(where: { $0.id == itemId }) {
            boxes[boxIndex].items[itemIndex].isPacked.toggle()
            boxes[boxIndex].updatedAt = Date()
            saveBoxes()
        }
    }
    
    // MARK: - Search
    
    var filteredBoxes: [Box] {
        if searchText.isEmpty {
            return boxes
        }
        return boxes.filter { box in
            box.title.localizedCaseInsensitiveContains(searchText) ||
            box.room.localizedCaseInsensitiveContains(searchText) ||
            box.items.contains { $0.name.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    func searchItems(query: String) -> [(box: Box, item: BoxItem)] {
        var results: [(box: Box, item: BoxItem)] = []
        for box in boxes {
            for item in box.items where item.name.localizedCaseInsensitiveContains(query) {
                results.append((box, item))
            }
        }
        return results
    }
    
    // MARK: - Stats
    
    var totalBoxes: Int {
        boxes.count
    }
    
    var totalItems: Int {
        boxes.reduce(0) { $0 + $1.items.count }
    }
    
    var totalRooms: Int {
        Set(boxes.map { $0.room }).count
    }
    
    var totalPackedItems: Int {
        boxes.reduce(0) { $0 + $1.packedItemCount }
    }
    
    var movingProgress: Double {
        guard totalItems > 0 else { return 0 }
        return Double(totalPackedItems) / Double(totalItems)
    }
    
    // MARK: - Persistence
    
    private func saveBoxes() {
        if let encoded = try? JSONEncoder().encode(boxes) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }
    
    private func loadBoxes() {
        if let data = UserDefaults.standard.data(forKey: saveKey),
           let decoded = try? JSONDecoder().decode([Box].self, from: data) {
            boxes = decoded
        }
    }
    
    // MARK: - Sample Data
    
    private func addSampleData() {
        let sampleBoxes = [
            Box(
                number: "#001",
                title: "Kitchen Essentials",
                room: "Kitchen",
                items: [
                    BoxItem(name: "Coffee Maker", emoji: "☕"),
                    BoxItem(name: "Cutting Board", emoji: "🔪", isPacked: true),
                    BoxItem(name: "Mixing Bowls (Set of 3)", emoji: "🥣"),
                    BoxItem(name: "Silverware Set", emoji: "🍴"),
                    BoxItem(name: "Measuring Cups", emoji: "📏"),
                    BoxItem(name: "Kitchen Towels (4)", emoji: "🧻"),
                    BoxItem(name: "Spatula Set", emoji: "🥄"),
                    BoxItem(name: "Salt & Pepper Grinders", emoji: "🧂")
                ],
                emoji: "📦"
            ),
            Box(
                number: "#002",
                title: "Electronics",
                room: "Living Room",
                items: [
                    BoxItem(name: "HDMI Cables", emoji: "🔌"),
                    BoxItem(name: "Phone Chargers", emoji: "🔋"),
                    BoxItem(name: "Laptop Stand", emoji: "💻"),
                    BoxItem(name: "Wireless Mouse", emoji: "🖱️"),
                    BoxItem(name: "Headphones", emoji: "🎧")
                ],
                emoji: "💻"
            ),
            Box(
                number: "#003",
                title: "Books & Decor",
                room: "Bedroom",
                items: [
                    BoxItem(name: "Fiction Books", emoji: "📚"),
                    BoxItem(name: "Photo Frames", emoji: "🖼️"),
                    BoxItem(name: "Candles", emoji: "🕯️"),
                    BoxItem(name: "Decorative Vase", emoji: "🏺")
                ],
                emoji: "📚"
            ),
            Box(
                number: "#004",
                title: "Bathroom Supplies",
                room: "Bathroom",
                items: [
                    BoxItem(name: "Towels", emoji: "🧴"),
                    BoxItem(name: "Toiletries", emoji: "🧼"),
                    BoxItem(name: "First Aid Kit", emoji: "⚕️")
                ],
                emoji: "🧴"
            ),
            Box(
                number: "#005",
                title: "Office Supplies",
                room: "Office",
                items: [
                    BoxItem(name: "Notebooks", emoji: "📓"),
                    BoxItem(name: "Pens & Pencils", emoji: "✏️"),
                    BoxItem(name: "Desk Lamp", emoji: "💡"),
                    BoxItem(name: "File Folders", emoji: "📁")
                ],
                emoji: "✏️"
            )
        ]
        
        boxes = sampleBoxes
        saveBoxes()
    }
}
