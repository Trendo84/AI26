//
//  BoxDetailView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct BoxDetailView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @Environment(\.dismiss) var dismiss
    let box: Box
    @State private var showingShareSheet = false
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header with box number
                VStack(spacing: 16) {
                    Text(box.number)
                        .font(.system(size: 72, weight: .bold, design: .monospaced))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color("AccentColor"), Color("AccentColor").opacity(0.7)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                }
                .frame(maxWidth: .infinity)
                .frame(height: 200)
                .background(
                    LinearGradient(
                        colors: [
                            Color("PrimaryColor").opacity(0.15),
                            Color("SecondaryColor").opacity(0.15)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                
                VStack(alignment: .leading, spacing: 8) {
                    Text(box.title)
                        .font(.system(size: 28, weight: .bold))
                    
                    Text("\(box.itemCount) items • Last updated \(timeAgo(box.updatedAt))")
                        .font(.system(size: 14))
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 24)
                
                // Action buttons
                HStack(spacing: 8) {
                    Button {
                        // TODO: Generate QR Code
                    } label: {
                        Text("Generate QR Code")
                            .font(.system(size: 14, weight: .semibold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 12)
                            .background(
                                LinearGradient(
                                    colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .foregroundColor(.white)
                            .cornerRadius(12)
                    }
                    
                    Button {
                        showingShareSheet = true
                    } label: {
                        Image(systemName: "square.and.arrow.up")
                            .font(.system(size: 14, weight: .semibold))
                            .padding(.vertical, 12)
                            .padding(.horizontal, 20)
                            .background(Color(.systemBackground))
                            .foregroundColor(.primary)
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(.systemGray5), lineWidth: 1)
                            )
                    }
                }
                .padding(.horizontal, 24)
                
                // Items List
                VStack(alignment: .leading, spacing: 12) {
                    Text("CONTENTS")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 24)
                    
                    LazyVStack(spacing: 12) {
                        ForEach(box.items) { item in
                            ItemRow(
                                item: item,
                                onToggle: {
                                    viewModel.toggleItemPacked(boxId: box.id, itemId: item.id)
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 24)
                }
                .padding(.bottom, 40)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showingShareSheet) {
            ShareSheet(items: ["Check out my PackRight box: \(box.title)"])
        }
    }
    
    private func timeAgo(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct ItemRow: View {
    let item: BoxItem
    let onToggle: () -> Void
    
    var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 16) {
                Image(systemName: item.isPacked ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 24))
                    .foregroundColor(item.isPacked ? Color("AccentColor") : .secondary)
                
                Text(item.name)
                    .font(.system(size: 15))
                    .foregroundColor(item.isPacked ? .secondary : .primary)
                    .strikethrough(item.isPacked)
                
                Spacer()
                
                Text(item.emoji)
                    .font(.system(size: 20))
            }
            .padding(16)
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    NavigationStack {
        BoxDetailView(box: Box(
            number: "#001",
            title: "Kitchen Essentials",
            room: "Kitchen",
            items: [
                BoxItem(name: "Coffee Maker", emoji: "☕"),
                BoxItem(name: "Cutting Board", emoji: "🔪", isPacked: true),
                BoxItem(name: "Mixing Bowls", emoji: "🥣")
            ]
        ))
        .environmentObject(BoxViewModel())
    }
}
