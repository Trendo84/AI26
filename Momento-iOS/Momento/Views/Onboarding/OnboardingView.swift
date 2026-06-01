//
//  OnboardingView.swift
//  Interactive, animated, swipeable onboarding.
//

import SwiftUI

struct OnboardingView: View {
    var onComplete: () -> Void

    @State private var page = 0
    private let pageCount = 4

    var body: some View {
        ZStack {
            Theme.appBackground()

            VStack(spacing: 0) {
                // Skip
                HStack {
                    Spacer()
                    Button("Skip") {
                        Haptics.tap()
                        onComplete()
                    }
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundStyle(Theme.textSecondary)
                    .padding(.horizontal, 24)
                    .padding(.top, 12)
                    .opacity(page == pageCount - 1 ? 0 : 1)
                    .animation(.easeInOut, value: page)
                }

                TabView(selection: $page) {
                    OnboardingPage(
                        illustration: AnyView(FloatingCardsIllustration(active: page == 0)),
                        title: "Capture your\nevery day",
                        subtitle: "Momento turns ordinary moments into a beautiful visual diary — one photo at a time."
                    ).tag(0)

                    OnboardingPage(
                        illustration: AnyView(CaptureIllustration(active: page == 1)),
                        title: "One tap,\none memory",
                        subtitle: "Snap today's photo, add a caption and a mood. Build a streak you'll love coming back to."
                    ).tag(1)

                    OnboardingPage(
                        illustration: AnyView(GridFillIllustration(active: page == 2)),
                        title: "Relive your\njourney",
                        subtitle: "Browse your story as a stunning grid or calendar. Watch the months fill with color."
                    ).tag(2)

                    OnboardingPage(
                        illustration: AnyView(MovieIllustration(active: page == 3)),
                        title: "Turn a year\ninto a movie",
                        subtitle: "The expert touch: stitch your photos into a cinematic timelapse and share it anywhere.",
                        badge: "PRO FEATURE"
                    ).tag(3)
                }
                .tabViewStyle(.page(indexDisplayMode: .never))
                .animation(.easeInOut, value: page)

                // Custom page dots
                HStack(spacing: 8) {
                    ForEach(0..<pageCount, id: \.self) { i in
                        Capsule()
                            .fill(i == page ? AnyShapeStyle(Theme.warm) : AnyShapeStyle(Color.white.opacity(0.22)))
                            .frame(width: i == page ? 26 : 8, height: 8)
                            .animation(.spring(response: 0.35, dampingFraction: 0.7), value: page)
                    }
                }
                .padding(.bottom, 24)

                // Primary action
                Button(action: advance) {
                    Text(page == pageCount - 1 ? "Get Started" : "Continue")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 58)
                        .background(
                            RoundedRectangle(cornerRadius: 18, style: .continuous)
                                .fill(Theme.brand)
                                .shadow(color: Theme.violet.opacity(0.5), radius: 16, y: 8)
                        )
                }
                .bounceOnTap()
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
    }

    private func advance() {
        Haptics.tap(.medium)
        if page == pageCount - 1 {
            Haptics.success()
            onComplete()
        } else {
            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                page += 1
            }
        }
    }
}

private struct OnboardingPage: View {
    let illustration: AnyView
    let title: String
    let subtitle: String
    var badge: String? = nil

    var body: some View {
        VStack(spacing: 36) {
            Spacer(minLength: 0)

            illustration
                .frame(height: 300)

            VStack(spacing: 14) {
                if let badge {
                    Text(badge)
                        .font(.system(size: 12, weight: .heavy, design: .rounded))
                        .tracking(1.5)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Capsule().fill(Theme.warm))
                }

                Text(title)
                    .font(.system(size: 32, weight: .bold, design: .rounded))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.white)

                Text(subtitle)
                    .font(.system(size: 16, weight: .medium, design: .rounded))
                    .multilineTextAlignment(.center)
                    .foregroundStyle(Theme.textSecondary)
                    .padding(.horizontal, 36)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: 0)
        }
        .padding(.top, 8)
    }
}

#Preview {
    OnboardingView(onComplete: {})
}
