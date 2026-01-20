//
//  SearchView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct SearchView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @State private var searchText = ""
    @FocusState private var isSearchFocused: Bool
    
    var searchResults: [(box: Box, item: BoxItem)] {
        if searchText.isEmpty {
            return []
        }
        return viewModel.searchItems(query: searchText)
    }
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search Bar
                HStack(spacing: 12) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    
                    TextField("Search items, boxes, or rooms...", text: $searchText)
                        .focused($isSearchFocused)
                    
                    if !searchText.isEmpty {
                        Button {
                            searchText = ""
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                    }
                }
                .padding(16)
                .background(Color(.systemGray6))
                .cornerRadius(16)
                .padding(.horizontal, 24)
                .padding(.top, 24)
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        if searchText.isEmpty {
                            // Recent Searches
                            VStack(alignment: .leading, spacing: 12) {
                                Text("RECENT SEARCHES")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.secondary)
                                
                                RecentSearchItem(
                                    itemName: "Coffee maker",
                                    boxNumber: "#001",
                                    room: "Kitchen"
                                )
                                
                                RecentSearchItem(
                                    itemName: "HDMI cable",
                                    boxNumber: "#002",
                                    room: "Living Room"
                                )
                                
                                RecentSearchItem(
                                    itemName: "Passport",
                                    boxNumber: "#005",
                                    room: "Office"
                                )
                            }
                            .padding(.horizontal, 24)
                            .padding(.top, 24)
                        } else {
                            // Search Results
                            VStack(alignment: .leading, spacing: 12) {
                                Text("RESULTS")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.secondary)
                                
                                if searchResults.isEmpty {
                                    VStack(spacing: 16) {
                                        Image(systemName: "magnifyingglass")
                                            .font(.system(size: 48))
                                            .foregroundColor(.secondary)
                                        
                                        Text("No items found")
                                            .font(.system(size: 17, weight: .semibold))
                                        
                                        Text("Try searching for something else")
                                            .font(.system(size: 15))
                                            .foregroundColor(.secondary)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding(.top, 60)
                                } else {
                                    ForEach(searchResults, id: \.item.id) { result in
                                        NavigationLink(destination: BoxDetailView(box: result.box)) {
                                            SearchResultRow(
                                                itemName: result.item.name,
                                                emoji: result.item.emoji,
                                                boxNumber: result.box.number,
                                                room: result.box.room
                                            )
                                        }
                                    }
                                }
                            }
                            .padding(.horizontal, 24)
                            .padding(.top, 24)
                        }
                    }
                }
            }
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.large)
            .onAppear {
                isSearchFocused = true
            }
        }
    }
}

struct RecentSearchItem: View {
    let itemName: String
    let boxNumber: String
    let room: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(itemName)
                    .font(.system(size: 15))
                
                Text("\(boxNumber) • \(room)")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "arrow.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.secondary)
        }
        .padding(16)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

struct SearchResultRow: View {
    let itemName: String
    let emoji: String
    let boxNumber: String
    let room: String
    
    var body: some View {
        HStack(spacing: 16) {
            Text(emoji)
                .font(.system(size: 32))
            
            VStack(alignment: .leading, spacing: 4) {
                Text(itemName)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(.primary)
                
                Text("\(boxNumber) • \(room)")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Image(systemName: "arrow.right")
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.secondary)
        }
        .padding(16)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

#Preview {
    SearchView()
        .environmentObject(BoxViewModel())
}
