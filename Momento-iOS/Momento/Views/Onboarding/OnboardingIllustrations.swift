//
//  OnboardingIllustrations.swift
//  Lightweight, self-animating vector illustrations for each onboarding page.
//

import SwiftUI

// MARK: - Page 1: floating memory cards around the iris

struct FloatingCardsIllustration: View {
    var active: Bool
    @State private var float = false
    @State private var spin: Double = 0

    private let cards: [(CGSize, Double, [Color])] = [
        (CGSize(width: -110, height: -70), -14, [Theme.violet, Theme.indigo]),
        (CGSize(width: 120, height: -50), 12, [Theme.coral, Theme.peach]),
        (CGSize(width: -90, height: 90), -8, [Theme.peach, Theme.coral]),
        (CGSize(width: 110, height: 100), 10, [Theme.indigo, Theme.violet]),
    ]

    var body: some View {
        ZStack {
            ForEach(Array(cards.enumerated()), id: \.offset) { index, card in
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(LinearGradient(colors: card.2, startPoint: .topLeading, endPoint: .bottomTrailing))
                    .frame(width: 74, height: 92)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(.white.opacity(0.25), lineWidth: 1)
                    )
                    .shadow(color: .black.opacity(0.3), radius: 12, y: 8)
                    .rotationEffect(.degrees(card.1))
                    .offset(card.0)
                    .offset(y: float ? -8 : 8)
                    .animation(
                        .easeInOut(duration: 2.4 + Double(index) * 0.3)
                        .repeatForever(autoreverses: true),
                        value: float
                    )
            }

            ApertureMark(openAmount: 1, rotation: spin)
                .frame(width: 130, height: 130)
                .shadow(color: Theme.violet.opacity(0.5), radius: 24)
        }
        .onAppear { startIfActive() }
        .onChange(of: active) { _, _ in startIfActive() }
    }

    private func startIfActive() {
        guard active else { return }
        float = true
        withAnimation(.linear(duration: 40).repeatForever(autoreverses: false)) {
            spin = 360
        }
    }
}

// MARK: - Page 2: a pulsing capture button dropping a new day onto a stack

struct CaptureIllustration: View {
    var active: Bool
    @State private var pulse = false
    @State private var drop = false

    var body: some View {
        ZStack {
            // Stack of captured days
            ForEach(0..<3) { i in
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Theme.surfaceHi)
                    .frame(width: 150, height: 150)
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(.white.opacity(0.08), lineWidth: 1)
                    )
                    .offset(x: CGFloat(i) * 10 - 10, y: CGFloat(i) * 10 + 30)
                    .opacity(0.5 - Double(i) * 0.12)
            }

            // New incoming photo card
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .fill(Theme.warm)
                .frame(width: 158, height: 158)
                .overlay(
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 44, weight: .bold))
                        .foregroundStyle(.white)
                        .opacity(drop ? 1 : 0)
                )
                .shadow(color: .black.opacity(0.35), radius: 16, y: 10)
                .offset(y: drop ? 18 : -140)
                .opacity(drop ? 1 : 0)

            // Capture button
            ZStack {
                Circle()
                    .stroke(.white.opacity(0.85), lineWidth: 5)
                    .frame(width: 78, height: 78)
                Circle()
                    .fill(Theme.coral)
                    .frame(width: 60, height: 60)
                    .scaleEffect(pulse ? 0.86 : 1)
            }
            .offset(y: 150)
            .scaleEffect(pulse ? 1.04 : 1)
        }
        .frame(height: 320)
        .onAppear { run() }
        .onChange(of: active) { _, _ in run() }
    }

    private func run() {
        guard active else { return }
        withAnimation(.easeInOut(duration: 1).repeatForever(autoreverses: true)) {
            pulse = true
        }
        drop = false
        withAnimation(.spring(response: 0.6, dampingFraction: 0.6).delay(0.3)) {
            drop = true
        }
    }
}

// MARK: - Page 3: a calendar grid lighting up with memories

struct GridFillIllustration: View {
    var active: Bool
    @State private var filled = 0

    private let columns = Array(repeating: GridItem(.fixed(46), spacing: 10), count: 4)
    private let total = 16

    var body: some View {
        LazyVGrid(columns: columns, spacing: 10) {
            ForEach(0..<total, id: \.self) { i in
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(i < filled
                          ? AnyShapeStyle(gradient(for: i))
                          : AnyShapeStyle(Theme.surfaceHi))
                    .frame(width: 46, height: 46)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12, style: .continuous)
                            .stroke(.white.opacity(0.06), lineWidth: 1)
                    )
                    .scaleEffect(i < filled ? 1 : 0.82)
                    .opacity(i < filled ? 1 : 0.5)
                    .animation(.spring(response: 0.4, dampingFraction: 0.7), value: filled)
            }
        }
        .frame(width: 232)
        .onAppear { run() }
        .onChange(of: active) { _, _ in run() }
    }

    private func gradient(for index: Int) -> LinearGradient {
        let palettes: [[Color]] = [
            [Theme.violet, Theme.indigo],
            [Theme.coral, Theme.peach],
            [Theme.indigo, Theme.violet],
            [Theme.peach, Theme.coral],
        ]
        return LinearGradient(colors: palettes[index % palettes.count],
                              startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    private func run() {
        guard active else { return }
        filled = 0
        for i in 1...total {
            DispatchQueue.main.asyncAfter(deadline: .now() + Double(i) * 0.06) {
                if active { filled = i }
            }
        }
    }
}

// MARK: - Page 4 (expert): a film strip resolving into a play button

struct MovieIllustration: View {
    var active: Bool
    @State private var reveal = false
    @State private var shimmer = false

    var body: some View {
        ZStack {
            // Film strip
            HStack(spacing: 8) {
                ForEach(0..<4) { i in
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(LinearGradient(
                            colors: [Theme.violet, Theme.coral],
                            startPoint: .top, endPoint: .bottom))
                        .frame(width: 44, height: 60)
                        .opacity(reveal ? 1 : 0)
                        .offset(y: reveal ? 0 : 20)
                        .animation(.spring(response: 0.5, dampingFraction: 0.7)
                            .delay(Double(i) * 0.08), value: reveal)
                }
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(Theme.surface)
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(.white.opacity(0.08), lineWidth: 1)
                    )
            )
            .offset(y: -70)

            // Play button
            ZStack {
                Circle()
                    .fill(Theme.warm)
                    .frame(width: 110, height: 110)
                    .shadow(color: Theme.coral.opacity(0.6), radius: shimmer ? 30 : 14)
                Image(systemName: "play.fill")
                    .font(.system(size: 42, weight: .black))
                    .foregroundStyle(.white)
                    .offset(x: 4)
            }
            .scaleEffect(reveal ? 1 : 0.6)
            .opacity(reveal ? 1 : 0)
            .offset(y: 70)
            .animation(.spring(response: 0.6, dampingFraction: 0.6).delay(0.3), value: reveal)
        }
        .frame(height: 300)
        .onAppear { run() }
        .onChange(of: active) { _, _ in run() }
    }

    private func run() {
        guard active else { return }
        reveal = false
        withAnimation { reveal = true }
        withAnimation(.easeInOut(duration: 1.4).repeatForever(autoreverses: true)) {
            shimmer = true
        }
    }
}
