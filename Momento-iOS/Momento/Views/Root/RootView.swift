//
//  RootView.swift
//  Hosts onboarding gating, the main tabs, and the floating tab bar.
//

import SwiftUI

enum AppTab: Int, CaseIterable {
    case today, memories, export, settings

    var icon: String {
        switch self {
        case .today:    return "sun.max.fill"
        case .memories: return "square.grid.2x2.fill"
        case .export:   return "film.fill"
        case .settings: return "gearshape.fill"
        }
    }

    var title: String {
        switch self {
        case .today:    return "Today"
        case .memories: return "Memories"
        case .export:   return "Movie"
        case .settings: return "Settings"
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var store: JournalStore
    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @State private var tab: AppTab = .today
    @State private var showCapture = false

    var body: some View {
        if !hasOnboarded {
            OnboardingView {
                withAnimation(.easeInOut) { hasOnboarded = true }
            }
            .transition(.opacity)
        } else {
            mainInterface
                .transition(.opacity)
        }
    }

    private var mainInterface: some View {
        ZStack(alignment: .bottom) {
            Theme.appBackground()

            Group {
                switch tab {
                case .today:    HomeView(openCapture: { showCapture = true })
                case .memories: TimelineView()
                case .export:   ExportView()
                case .settings: SettingsView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            CustomTabBar(selection: $tab, onCapture: {
                Haptics.tap(.medium)
                showCapture = true
            })
        }
        .sheet(isPresented: $showCapture) {
            CaptureView()
                .environmentObject(store)
        }
    }
}

struct CustomTabBar: View {
    @Binding var selection: AppTab
    var onCapture: () -> Void

    var body: some View {
        HStack(spacing: 0) {
            tabButton(.today)
            tabButton(.memories)

            // Raised capture button
            Button(action: onCapture) {
                ZStack {
                    Circle()
                        .fill(Theme.brand)
                        .frame(width: 62, height: 62)
                        .shadow(color: Theme.violet.opacity(0.6), radius: 12, y: 6)
                    Image(systemName: "camera.fill")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundStyle(.white)
                }
            }
            .bounceOnTap(scale: 0.9)
            .offset(y: -18)
            .frame(maxWidth: .infinity)

            tabButton(.export)
            tabButton(.settings)
        }
        .padding(.horizontal, 14)
        .frame(height: 64)
        .background(
            RoundedRectangle(cornerRadius: 28, style: .continuous)
                .fill(.ultraThinMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: 28, style: .continuous)
                        .stroke(.white.opacity(0.10), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.4), radius: 18, y: 8)
        )
        .padding(.horizontal, 18)
        .padding(.bottom, 6)
    }

    private func tabButton(_ item: AppTab) -> some View {
        Button {
            Haptics.selection()
            withAnimation(.spring(response: 0.4, dampingFraction: 0.7)) {
                selection = item
            }
        } label: {
            VStack(spacing: 4) {
                Image(systemName: item.icon)
                    .font(.system(size: 20, weight: .semibold))
                    .symbolEffect(.bounce, value: selection == item)
                Text(item.title)
                    .font(.system(size: 10, weight: .semibold, design: .rounded))
            }
            .foregroundStyle(selection == item ? AnyShapeStyle(Theme.warm) : AnyShapeStyle(Theme.textTertiary))
            .frame(maxWidth: .infinity)
        }
    }
}
