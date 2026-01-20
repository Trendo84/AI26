//
//  PackRightApp.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

@main
struct PackRightApp: App {
    @StateObject private var boxViewModel = BoxViewModel()
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    
    var body: some Scene {
        WindowGroup {
            if hasCompletedOnboarding {
                MainTabView()
                    .environmentObject(boxViewModel)
            } else {
                OnboardingView(hasCompletedOnboarding: $hasCompletedOnboarding)
            }
        }
    }
}
