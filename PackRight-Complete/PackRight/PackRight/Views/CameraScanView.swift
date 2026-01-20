//
//  CameraScanView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct CameraScanView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @State private var showingImagePicker = false
    
    var body: some View {
        NavigationStack {
            VStack(spacing: 32) {
                Spacer()
                
                // Camera Icon
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color("AccentColor").opacity(0.2), Color("AccentColor").opacity(0.1)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 120, height: 120)
                    
                    Image(systemName: "camera.fill")
                        .font(.system(size: 48))
                        .foregroundColor(Color("AccentColor"))
                }
                
                VStack(spacing: 12) {
                    Text("Scan Your Box")
                        .font(.system(size: 28, weight: .bold))
                    
                    Text("Take a photo of your open box and let AI identify all items automatically")
                        .font(.system(size: 17))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                
                Spacer()
                
                VStack(spacing: 16) {
                    Button {
                        showingImagePicker = true
                    } label: {
                        HStack {
                            Image(systemName: "camera.fill")
                            Text("Take Photo")
                        }
                        .font(.system(size: 17, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                colors: [Color("PrimaryColor"), Color("SecondaryColor")],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .foregroundColor(.white)
                        .cornerRadius(16)
                    }
                    
                    Button {
                        // Select from gallery
                    } label: {
                        HStack {
                            Image(systemName: "photo.on.rectangle")
                            Text("Choose from Gallery")
                        }
                        .font(.system(size: 17, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(Color(.systemGray6))
                        .foregroundColor(.primary)
                        .cornerRadius(16)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
            .navigationTitle("Scan Box")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $showingImagePicker) {
            Text("Camera view would go here")
        }
    }
}

#Preview {
    CameraScanView()
        .environmentObject(BoxViewModel())
}
