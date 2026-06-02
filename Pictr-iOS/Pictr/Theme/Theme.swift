//
//  Theme.swift
//  Central design tokens — colors, gradients, spacing, typography.
//

import SwiftUI

enum Theme {
    // MARK: Brand colors
    static let indigo = Color(red: 0.36, green: 0.24, blue: 0.62)
    static let violet = Color(red: 0.55, green: 0.40, blue: 0.95)
    static let coral  = Color(red: 1.00, green: 0.48, blue: 0.54)
    static let peach  = Color(red: 1.00, green: 0.70, blue: 0.52)
    static let accent = Color(red: 0.498, green: 0.404, blue: 0.953)

    // MARK: Surfaces (dark, cinematic)
    static let background = Color(red: 0.05, green: 0.04, blue: 0.09)
    static let surface    = Color(red: 0.11, green: 0.10, blue: 0.16)
    static let surfaceHi  = Color(red: 0.16, green: 0.15, blue: 0.22)

    // MARK: Text
    static let textPrimary   = Color.white
    static let textSecondary = Color.white.opacity(0.66)
    static let textTertiary  = Color.white.opacity(0.42)

    // MARK: Gradients
    static let brand = LinearGradient(
        colors: [indigo, violet, coral],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let brandSoft = LinearGradient(
        colors: [violet.opacity(0.85), coral.opacity(0.85)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    static let warm = LinearGradient(
        colors: [coral, peach],
        startPoint: .leading,
        endPoint: .trailing
    )

    static func appBackground() -> some View {
        ZStack {
            background
            // Soft ambient orbs for depth.
            Circle()
                .fill(violet.opacity(0.28))
                .frame(width: 380, height: 380)
                .blur(radius: 120)
                .offset(x: -150, y: -260)
            Circle()
                .fill(coral.opacity(0.22))
                .frame(width: 360, height: 360)
                .blur(radius: 130)
                .offset(x: 160, y: 320)
        }
        .ignoresSafeArea()
    }

    // MARK: Metrics
    static let corner: CGFloat = 24
    static let cornerSmall: CGFloat = 14
}

// MARK: - Reusable card style

struct CardBackground: ViewModifier {
    var cornerRadius: CGFloat = Theme.corner
    func body(content: Content) -> some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(Theme.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                            .stroke(Color.white.opacity(0.06), lineWidth: 1)
                    )
            )
    }
}

extension View {
    func card(cornerRadius: CGFloat = Theme.corner) -> some View {
        modifier(CardBackground(cornerRadius: cornerRadius))
    }
}
