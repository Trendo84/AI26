//
//  SplashView.swift
//  Animated launch screen — the iris opens, the wordmark rises.
//

import SwiftUI

struct SplashView: View {
    var onFinish: () -> Void

    @State private var open: Double = 0
    @State private var spin: Double = -90
    @State private var markScale: CGFloat = 0.6
    @State private var markOpacity: Double = 0
    @State private var titleOffset: CGFloat = 18
    @State private var titleOpacity: Double = 0
    @State private var ringScale: CGFloat = 0.8
    @State private var ringOpacity: Double = 0

    var body: some View {
        ZStack {
            Theme.appBackground()

            // Expanding ring flourish
            Circle()
                .stroke(Theme.brandSoft, lineWidth: 2)
                .frame(width: 240, height: 240)
                .scaleEffect(ringScale)
                .opacity(ringOpacity)

            VStack(spacing: 26) {
                ApertureMark(openAmount: open, rotation: spin)
                    .frame(width: 132, height: 132)
                    .scaleEffect(markScale)
                    .opacity(markOpacity)

                VStack(spacing: 8) {
                    Text("Pictr")
                        .font(.system(size: 38, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Text("One photo, every day.")
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .foregroundStyle(Theme.textSecondary)
                }
                .offset(y: titleOffset)
                .opacity(titleOpacity)
            }
        }
        .onAppear(perform: runAnimation)
    }

    private func runAnimation() {
        withAnimation(.spring(response: 0.7, dampingFraction: 0.7)) {
            markScale = 1
            markOpacity = 1
        }
        withAnimation(.easeOut(duration: 1.1)) {
            open = 1
            spin = 0
        }
        withAnimation(.easeOut(duration: 1.4)) {
            ringScale = 1.25
            ringOpacity = 0.0001
        }
        withAnimation(.easeOut(duration: 0.6).delay(0.05)) {
            ringOpacity = 0.6
        }
        withAnimation(.spring(response: 0.6, dampingFraction: 0.8).delay(0.45)) {
            titleOffset = 0
            titleOpacity = 1
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
            Haptics.tap(.medium)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            onFinish()
        }
    }
}

#Preview {
    SplashView(onFinish: {})
}
