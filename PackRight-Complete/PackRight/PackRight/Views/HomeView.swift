//
//  HomeView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @State private var showingSettings = false
    
    private var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 12 {
            return "Good morning"
        } else if hour < 18 {
            return "Good afternoon"
        } else {
            return "Good evening"
        }
    }
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 0) {
                    // Hero Section
                    VStack(alignment: .leading, spacing: 20) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("\(greeting), Ivan")
                                .font(.system(size: 28, weight: .bold))
                            
                            Text("Let's keep your move organized")
                                .font(.system(size: 15))
                                .foregroundColor(.secondary)
                        }
                        
                        // Moving Progress Card
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Moving Progress")
                                    .font(.system(size: 14, weight: .semibold))
                                
                                Spacer()
                                
                                Text("\(Int(viewModel.movingProgress * 100))%")
                                    .font(.system(size: 20, weight: .bold))
                                    .foregroundStyle(
                                        LinearGradient(
                                            colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                                            startPoint: .leading,
                                            endPoint: .trailing
                                        )
                                    )
                            }
                            
                            ProgressView(value: viewModel.movingProgress)
                                .tint(Color("PrimaryColor"))
                            
                            HStack {
                                Text("\(viewModel.totalPackedItems) items packed")
                                    .font(.system(size: 12))
                                    .foregroundColor(.secondary)
                                
                                Spacer()
                                
                                Text("\(viewModel.totalItems - viewModel.totalPackedItems) items remaining")
                                    .font(.system(size: 12))
                                    .foregroundColor(.secondary)
                            }
                        }
                        .padding(20)
                        .background(Color(.systemBackground))
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 24)
                    .padding(.bottom, 20)
                    .background(
                        LinearGradient(
                            colors: [
                                Color("PrimaryColor").opacity(0.08),
                                Color("SecondaryColor").opacity(0.08)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    
                    // Quick Actions
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Quick Actions")
                            .font(.system(size: 18, weight: .bold))
                            .padding(.horizontal, 24)
                        
                        LazyVGrid(columns: [
                            GridItem(.flexible()),
                            GridItem(.flexible())
                        ], spacing: 12) {
                            QuickActionCard(
                                icon: "camera.fill",
                                title: "Scan Box",
                                description: "Add items with AI",
                                color: Color("PrimaryColor")
                            )
                            
                            QuickActionCard(
                                icon: "magnifyingglass",
                                title: "Find Item",
                                description: "Search inventory",
                                color: Color("AccentColor")
                            )
                            
                            QuickActionCard(
                                icon: "qrcode",
                                title: "Print Labels",
                                description: "QR codes & tags",
                                color: Color("SecondaryColor")
                            )
                            
                            QuickActionCard(
                                icon: "chart.bar.fill",
                                title: "View Stats",
                                description: "Moving insights",
                                color: Color.orange
                            )
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.vertical, 20)
                    
                    // Recent Boxes
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Your Boxes")
                                .font(.system(size: 18, weight: .bold))
                            
                            Spacer()
                            
                            Button("See All") {
                                // TODO: Navigate to all boxes
                            }
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.secondary)
                        }
                        .padding(.horizontal, 24)
                        
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.boxes.prefix(5)) { box in
                                NavigationLink(destination: BoxDetailView(box: box)) {
                                    BoxRowCard(box: box)
                                }
                            }
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 100)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    HStack(spacing: 10) {
                        Image("AppLogo")
                            .resizable()
                            .frame(width: 32, height: 32)
                        
                        Text("PackRight")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingSettings = true
                    } label: {
                        Image(systemName: "gearshape.fill")
                            .foregroundColor(.primary)
                    }
                }
            }
            .sheet(isPresented: $showingSettings) {
                SettingsView()
            }
        }
    }
}

struct QuickActionCard: View {
    let icon: String
    let title: String
    let description: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 32))
                .foregroundColor(color)
                .padding(.bottom, 4)
            
            Text(title)
                .font(.system(size: 14, weight: .semibold))
            
            Text(description)
                .font(.system(size: 11))
                .foregroundColor(.secondary)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
        .padding(.horizontal, 16)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)
    }
}

struct BoxRowCard: View {
    let box: Box
    
    var body: some View {
        HStack(spacing: 16) {
            Text(box.emoji)
                .font(.system(size: 24))
                .frame(width: 60, height: 60)
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
                .cornerRadius(12)
            
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 8) {
                    Text(box.number)
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(.secondary)
                    
                    Text(box.title)
                        .font(.system(size: 15, weight: .semibold))
                        .lineLimit(1)
                }
                
                HStack(spacing: 12) {
                    Text("\(box.itemCount) items")
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                    
                    Text("•")
                        .foregroundColor(.secondary)
                    
                    Text(box.room)
                        .font(.system(size: 12))
                        .foregroundColor(.secondary)
                }
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
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
    HomeView()
        .environmentObject(BoxViewModel())
}
