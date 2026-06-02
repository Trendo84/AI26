//
//  PictrApp.swift
//  Pictr — one photo, every day.
//

import SwiftUI

@main
struct PictrApp: App {
    @StateObject private var store = JournalStore()
    @State private var phase: AppPhase = .splash

    var body: some Scene {
        WindowGroup {
            ZStack {
                switch phase {
                case .splash:
                    SplashView {
                        withAnimation(.easeInOut(duration: 0.55)) { phase = .ready }
                    }
                    .transition(.opacity)
                case .ready:
                    RootView()
                        .environmentObject(store)
                        .transition(.opacity)
                }
            }
            .preferredColorScheme(.dark)
        }
    }
}

enum AppPhase {
    case splash
    case ready
}
