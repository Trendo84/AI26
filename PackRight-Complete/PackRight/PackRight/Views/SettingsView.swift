//
//  SettingsView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @Environment(\.dismiss) var dismiss
    @AppStorage("autoSavePhotos") private var autoSavePhotos = true
    @AppStorage("notificationsEnabled") private var notificationsEnabled = true
    @State private var showingThemePicker = false
    
    var body: some View {
        NavigationStack {
            List {
                // Appearance Section
                Section {
                    Toggle("Dark Mode", isOn: $viewModel.isDarkMode)
                        .tint(Color("AccentColor"))
                    
                    Button {
                        showingThemePicker = true
                    } label: {
                        HStack {
                            Text("Theme")
                            Spacer()
                            Text(themeName)
                                .foregroundColor(.secondary)
                            Image(systemName: "chevron.right")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.secondary)
                        }
                    }
                    .foregroundColor(.primary)
                } header: {
                    Text("Appearance")
                }
                
                // General Section
                Section {
                    Toggle("Auto-Save Photos", isOn: $autoSavePhotos)
                        .tint(Color("AccentColor"))
                    
                    Toggle("Notifications", isOn: $notificationsEnabled)
                        .tint(Color("AccentColor"))
                } header: {
                    Text("General")
                } footer: {
                    Text("Save box photos to your gallery automatically")
                }
                
                // Support Section
                Section {
                    NavigationLink {
                        Text("Help & Support")
                    } label: {
                        Label("Help & Support", systemImage: "questionmark.circle")
                    }
                    
                    Button {
                        // Rate app
                    } label: {
                        Label("Rate PackRight", systemImage: "star")
                    }
                    .foregroundColor(.primary)
                    
                    NavigationLink {
                        Text("Privacy Policy")
                    } label: {
                        Label("Privacy Policy", systemImage: "hand.raised")
                    }
                } header: {
                    Text("Support")
                }
                
                Section {
                    HStack {
                        Spacer()
                        VStack(spacing: 4) {
                            Text("PackRight")
                                .font(.system(size: 15, weight: .semibold))
                            Text("Version 1.0.0")
                                .font(.system(size: 13))
                                .foregroundColor(.secondary)
                        }
                        Spacer()
                    }
                    .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .sheet(isPresented: $showingThemePicker) {
                ThemePickerView(selectedTheme: $viewModel.selectedTheme)
            }
        }
    }
    
    private var themeName: String {
        switch viewModel.selectedTheme {
        case "light": return "Purple Gradient"
        case "ocean": return "Ocean Blue"
        case "sunset": return "Sunset Orange"
        case "forest": return "Forest Green"
        default: return "Purple Gradient"
        }
    }
}

struct ThemePickerView: View {
    @Binding var selectedTheme: String
    @Environment(\.dismiss) var dismiss
    
    let themes = [
        ("light", "Purple Gradient", Color("PrimaryColor")),
        ("ocean", "Ocean Blue", Color.blue),
        ("sunset", "Sunset Orange", Color.orange),
        ("forest", "Forest Green", Color.green)
    ]
    
    var body: some View {
        NavigationStack {
            List {
                ForEach(themes, id: \.0) { theme in
                    Button {
                        selectedTheme = theme.0
                        dismiss()
                    } label: {
                        HStack {
                            Circle()
                                .fill(theme.2)
                                .frame(width: 32, height: 32)
                            
                            Text(theme.1)
                                .foregroundColor(.primary)
                            
                            Spacer()
                            
                            if selectedTheme == theme.0 {
                                Image(systemName: "checkmark")
                                    .foregroundColor(Color("AccentColor"))
                            }
                        }
                    }
                }
            }
            .navigationTitle("Choose Theme")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(BoxViewModel())
}
