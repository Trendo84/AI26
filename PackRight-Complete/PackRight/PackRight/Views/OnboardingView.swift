//
//  OnboardingView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct OnboardingView: View {
    @Binding var hasCompletedOnboarding: Bool
    @State private var currentPage = 0
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                colors: [
                    Color("PrimaryColor").opacity(0.05),
                    Color("SecondaryColor").opacity(0.05)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            VStack {
                // Skip button
                HStack {
                    Spacer()
                    if currentPage < 2 {
                        Button("Skip") {
                            hasCompletedOnboarding = true
                        }
                        .foregroundColor(.secondary)
                        .padding()
                    }
                }
                
                TabView(selection: $currentPage) {
                    OnboardingPage(
                        icon: "📦",
                        title: "Welcome to PackRight",
                        description: "The smartest way to organize your move. Let AI handle the tedious work while you focus on what matters."
                    )
                    .tag(0)
                    
                    OnboardingPage(
                        icon: "📸",
                        title: "Snap & Catalog",
                        description: "Just take a photo of your open box. Our AI instantly recognizes and catalogs every item inside."
                    )
                    .tag(1)
                    
                    OnboardingPage(
                        icon: "🔍",
                        title: "Find Anything Instantly",
                        description: "Search for any item and know exactly which box it's in. No more digging through dozens of boxes."
                    )
                    .tag(2)
                }
                .tabViewStyle(.page(indexDisplayMode: .always))
                .indexViewStyle(.page(backgroundDisplayMode: .always))
                
                // Page indicators
                HStack(spacing: 8) {
                    ForEach(0..<3) { index in
                        Circle()
                            .fill(currentPage == index ? Color("AccentColor") : Color.gray.opacity(0.3))
                            .frame(width: 8, height: 8)
                            .animation(.spring(), value: currentPage)
                    }
                }
                .padding(.bottom, 24)
                
                // Action button
                Button {
                    if currentPage < 2 {
                        withAnimation {
                            currentPage += 1
                        }
                    } else {
                        hasCompletedOnboarding = true
                    }
                } label: {
                    Text(currentPage < 2 ? "Continue" : "Get Started")
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
                .padding(.horizontal, 32)
                .padding(.bottom, 40)
            }
        }
    }
}

struct OnboardingPage: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            Text(icon)
                .font(.system(size: 120))
            
            VStack(spacing: 16) {
                Text(title)
                    .font(.system(size: 32, weight: .bold))
                    .multilineTextAlignment(.center)
                
                Text(description)
                    .font(.system(size: 17))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .lineSpacing(4)
                    .padding(.horizontal, 32)
            }
            
            Spacer()
        }
    }
}

#Preview {
    OnboardingView(hasCompletedOnboarding: .constant(false))
}
