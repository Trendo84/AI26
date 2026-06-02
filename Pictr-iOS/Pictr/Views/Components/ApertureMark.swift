//
//  ApertureMark.swift
//  The Pictr brand mark — a camera iris that can open and rotate.
//

import SwiftUI

/// A regular polygon, used as the iris opening.
struct PolygonShape: Shape {
    var sides: Int = 6
    var scale: Double = 1.0
    var twistDegrees: Double = 8

    var animatableData: Double {
        get { scale }
        set { scale = newValue }
    }

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) * 0.5 * scale
        let twist = twistDegrees * .pi / 180
        let step = 2 * Double.pi / Double(max(sides, 3))
        for i in 0..<sides {
            let angle = Double(i) * step + twist
            let point = CGPoint(x: center.x + radius * CGFloat(cos(angle)),
                                y: center.y + radius * CGFloat(sin(angle)))
            if i == 0 { path.move(to: point) } else { path.addLine(to: point) }
        }
        path.closeSubpath()
        return path
    }
}

/// The blade-edge chords radiating from the opening to the lens rim.
struct IrisBladesShape: Shape {
    var blades: Int = 6
    var openAmount: Double = 1.0
    var twistDegrees: Double = 8

    var animatableData: Double {
        get { openAmount }
        set { openAmount = newValue }
    }

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let R = min(rect.width, rect.height) * 0.5
        let innerRadius = R * (0.18 + 0.34 * openAmount)
        let twist = twistDegrees * .pi / 180
        let step = 2 * Double.pi / Double(max(blades, 3))

        func point(_ radius: CGFloat, _ angle: Double) -> CGPoint {
            CGPoint(x: center.x + radius * CGFloat(cos(angle)),
                    y: center.y + radius * CGFloat(sin(angle)))
        }

        for i in 0..<blades {
            let v = point(innerRadius, Double(i) * step + twist)
            let w = point(R * 0.94, Double(i + 1) * step + twist)
            path.move(to: v)
            path.addLine(to: w)
        }
        return path
    }
}

struct ApertureMark: View {
    /// 0 = fully closed iris, 1 = fully open.
    var openAmount: Double = 1
    var rotation: Double = 0
    var showGlow: Bool = true

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack {
                if showGlow {
                    Circle()
                        .fill(Theme.brand)
                        .frame(width: s * 0.96, height: s * 0.96)
                        .blur(radius: s * 0.14)
                        .opacity(0.55)
                }

                // Lens body
                Circle()
                    .fill(
                        LinearGradient(
                            colors: [Color.white, Color(white: 0.9)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: s * 0.82, height: s * 0.82)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.5), lineWidth: s * 0.012)
                            .frame(width: s * 0.9, height: s * 0.9)
                    )

                // Iris opening (dark, shows the brand glow within)
                PolygonShape(sides: 6, scale: 0.18 + 0.34 * openAmount)
                    .fill(
                        LinearGradient(
                            colors: [Theme.indigo, Theme.coral],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: s * 0.82, height: s * 0.82)

                // Blade chords
                IrisBladesShape(blades: 6, openAmount: openAmount)
                    .stroke(Theme.indigo.opacity(0.55), style: StrokeStyle(lineWidth: s * 0.018, lineCap: .round))
                    .frame(width: s * 0.82, height: s * 0.82)

                // Opening rim
                PolygonShape(sides: 6, scale: 0.18 + 0.34 * openAmount)
                    .stroke(Color.white.opacity(0.85), lineWidth: s * 0.012)
                    .frame(width: s * 0.82, height: s * 0.82)
            }
            .rotationEffect(.degrees(rotation))
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

#Preview {
    ZStack {
        Theme.background.ignoresSafeArea()
        ApertureMark(openAmount: 1, rotation: 0)
            .frame(width: 200, height: 200)
    }
}
