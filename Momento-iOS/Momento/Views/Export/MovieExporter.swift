//
//  MovieExporter.swift
//  The "expert" feature — stitches journal photos into an H.264 movie /
//  timelapse with optional crossfades and date/caption overlays.
//

import AVFoundation
import UIKit

struct ExportPhoto {
    let image: UIImage
    let dateLabel: String
    let caption: String
}

struct MovieSettings {
    enum Aspect: String, CaseIterable, Identifiable {
        case square = "Square"
        case portrait = "Portrait"
        var id: String { rawValue }
        var size: CGSize {
            switch self {
            case .square:   return CGSize(width: 1080, height: 1080)
            case .portrait: return CGSize(width: 1080, height: 1920)
            }
        }
    }

    enum Speed: String, CaseIterable, Identifiable {
        case cinematic = "Cinematic"
        case standard = "Standard"
        case timelapse = "Timelapse"
        var id: String { rawValue }
        /// Seconds each photo is held on screen.
        var holdSeconds: Double {
            switch self {
            case .cinematic: return 1.1
            case .standard:  return 0.55
            case .timelapse: return 0.22
            }
        }
        var subtitle: String {
            switch self {
            case .cinematic: return "Slow & filmic"
            case .standard:  return "A steady recap"
            case .timelapse: return "Fast & punchy"
            }
        }
    }

    var aspect: Aspect = .portrait
    var speed: Speed = .standard
    var crossfade: Bool = true
    var showDate: Bool = true
    var showCaption: Bool = true
}

enum ExportError: LocalizedError {
    case noPhotos
    case writerSetup
    case failed(String)

    var errorDescription: String? {
        switch self {
        case .noPhotos:        return "Add at least one photo to create a movie."
        case .writerSetup:     return "Couldn't set up the video writer."
        case .failed(let msg): return msg
        }
    }
}

final class MovieExporter {
    private let fps: Int32 = 30

    private enum Frame {
        case still(Int)
        case blend(Int, Int, CGFloat) // from, to, progress 0...1
    }

    /// Renders the photos into an .mp4 file and returns its URL.
    func export(photos: [ExportPhoto],
                settings: MovieSettings,
                progress: @escaping (Double) -> Void) async throws -> URL {
        guard !photos.isEmpty else { throw ExportError.noPhotos }

        let size = settings.aspect.size
        let holdFrames = max(1, Int((settings.speed.holdSeconds * Double(fps)).rounded()))
        let transitionFrames = settings.crossfade ? max(1, Int(0.35 * Double(fps))) : 0

        // Build a flat plan of frames.
        var plan: [Frame] = []
        for i in photos.indices {
            for _ in 0..<holdFrames { plan.append(.still(i)) }
            if settings.crossfade, i < photos.count - 1 {
                for t in 0..<transitionFrames {
                    let progress = CGFloat(t + 1) / CGFloat(transitionFrames + 1)
                    plan.append(.blend(i, i + 1, progress))
                }
            }
        }
        let totalFrames = plan.count

        // Output file
        let outputURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("Momento-\(Int(Date().timeIntervalSince1970)).mp4")
        try? FileManager.default.removeItem(at: outputURL)

        guard let writer = try? AVAssetWriter(url: outputURL, fileType: .mp4) else {
            throw ExportError.writerSetup
        }

        let videoSettings: [String: Any] = [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: Int(size.width),
            AVVideoHeightKey: Int(size.height),
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: 8_000_000,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
            ]
        ]

        let input = AVAssetWriterInput(mediaType: .video, outputSettings: videoSettings)
        input.expectsMediaDataInRealTime = false

        let attributes: [String: Any] = [
            kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
            kCVPixelBufferWidthKey as String: Int(size.width),
            kCVPixelBufferHeightKey as String: Int(size.height)
        ]
        let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input,
                                                           sourcePixelBufferAttributes: attributes)

        guard writer.canAdd(input) else { throw ExportError.writerSetup }
        writer.add(input)

        guard writer.startWriting() else {
            throw ExportError.failed(writer.error?.localizedDescription ?? "Could not start writing.")
        }
        writer.startSession(atSourceTime: .zero)

        let queue = DispatchQueue(label: "momento.export")

        return try await withCheckedThrowingContinuation { continuation in
            var frameIndex = 0
            var didResume = false

            func finish(_ result: Result<URL, Error>) {
                guard !didResume else { return }
                didResume = true
                continuation.resume(with: result)
            }

            input.requestMediaDataWhenReady(on: queue) {
                while input.isReadyForMoreMediaData {
                    if frameIndex >= totalFrames {
                        input.markAsFinished()
                        writer.finishWriting {
                            if writer.status == .completed {
                                finish(.success(outputURL))
                            } else {
                                finish(.failure(ExportError.failed(
                                    writer.error?.localizedDescription ?? "Export failed.")))
                            }
                        }
                        return
                    }

                    autoreleasepool {
                        guard let pool = adaptor.pixelBufferPool else {
                            finish(.failure(ExportError.writerSetup))
                            return
                        }
                        let frameImage = self.renderFrame(plan[frameIndex],
                                                          photos: photos,
                                                          size: size,
                                                          settings: settings)
                        if let buffer = self.pixelBuffer(from: frameImage, pool: pool, size: size) {
                            let time = CMTime(value: CMTimeValue(frameIndex), timescale: self.fps)
                            adaptor.append(buffer, withPresentationTime: time)
                        }
                        frameIndex += 1
                        let p = Double(frameIndex) / Double(totalFrames)
                        DispatchQueue.main.async { progress(p) }
                    }
                }
            }
        }
    }

    // MARK: - Frame rendering

    private func renderFrame(_ frame: Frame,
                             photos: [ExportPhoto],
                             size: CGSize,
                             settings: MovieSettings) -> UIImage {
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        format.opaque = true
        let renderer = UIGraphicsImageRenderer(size: size, format: format)
        return renderer.image { ctx in
            let rect = CGRect(origin: .zero, size: size)
            UIColor.black.setFill()
            ctx.fill(rect)

            switch frame {
            case .still(let i):
                draw(photos[i].image, in: size, alpha: 1)
                drawOverlay(photos[i], in: size, settings: settings, alpha: 1)
            case .blend(let a, let b, let t):
                draw(photos[a].image, in: size, alpha: 1)
                draw(photos[b].image, in: size, alpha: t)
                drawOverlay(photos[a], in: size, settings: settings, alpha: 1 - t)
                drawOverlay(photos[b], in: size, settings: settings, alpha: t)
            }
        }
    }

    private func draw(_ image: UIImage, in size: CGSize, alpha: CGFloat) {
        let imgSize = image.size
        guard imgSize.width > 0, imgSize.height > 0 else { return }
        let scale = max(size.width / imgSize.width, size.height / imgSize.height)
        let drawSize = CGSize(width: imgSize.width * scale, height: imgSize.height * scale)
        let origin = CGPoint(x: (size.width - drawSize.width) / 2,
                             y: (size.height - drawSize.height) / 2)
        image.draw(in: CGRect(origin: origin, size: drawSize), blendMode: .normal, alpha: alpha)
    }

    private func drawOverlay(_ photo: ExportPhoto, in size: CGSize, settings: MovieSettings, alpha: CGFloat) {
        guard alpha > 0.01, settings.showDate || (settings.showCaption && !photo.caption.isEmpty) else { return }
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let scrimHeight = size.height * 0.30
        let scrimRect = CGRect(x: 0, y: size.height - scrimHeight, width: size.width, height: scrimHeight)
        let colors = [UIColor.clear.cgColor, UIColor.black.withAlphaComponent(0.72 * alpha).cgColor] as CFArray
        if let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: colors, locations: [0, 1]) {
            ctx.saveGState()
            ctx.clip(to: scrimRect)
            ctx.drawLinearGradient(gradient,
                                   start: CGPoint(x: 0, y: scrimRect.minY),
                                   end: CGPoint(x: 0, y: scrimRect.maxY),
                                   options: [])
            ctx.restoreGState()
        }

        let margin = size.width * 0.06
        var cursorY = size.height - margin

        if settings.showCaption, !photo.caption.isEmpty {
            let captionFont = UIFont.systemFont(ofSize: size.width * 0.05, weight: .semibold)
            let attrs: [NSAttributedString.Key: Any] = [
                .font: captionFont,
                .foregroundColor: UIColor.white.withAlphaComponent(alpha)
            ]
            let maxWidth = size.width - margin * 2
            let bounding = (photo.caption as NSString).boundingRect(
                with: CGSize(width: maxWidth, height: size.height),
                options: [.usesLineFragmentOrigin, .usesFontLeading],
                attributes: attrs, context: nil)
            cursorY -= bounding.height
            (photo.caption as NSString).draw(
                with: CGRect(x: margin, y: cursorY, width: maxWidth, height: bounding.height),
                options: [.usesLineFragmentOrigin, .usesFontLeading],
                attributes: attrs, context: nil)
            cursorY -= size.height * 0.012
        }

        if settings.showDate {
            let dateFont = UIFont.systemFont(ofSize: size.width * 0.038, weight: .heavy)
            let attrs: [NSAttributedString.Key: Any] = [
                .font: dateFont,
                .foregroundColor: UIColor.white.withAlphaComponent(0.85 * alpha),
                .kern: 1.0
            ]
            let str = photo.dateLabel.uppercased() as NSString
            let sizeText = str.size(withAttributes: attrs)
            cursorY -= sizeText.height
            str.draw(at: CGPoint(x: margin, y: cursorY), withAttributes: attrs)
        }
    }

    // MARK: - Pixel buffer

    private func pixelBuffer(from image: UIImage, pool: CVPixelBufferPool, size: CGSize) -> CVPixelBuffer? {
        var pixelBufferOut: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &pixelBufferOut)
        guard let buffer = pixelBufferOut, let cgImage = image.cgImage else { return nil }

        CVPixelBufferLockBaseAddress(buffer, [])
        defer { CVPixelBufferUnlockBaseAddress(buffer, []) }

        guard let context = CGContext(
            data: CVPixelBufferGetBaseAddress(buffer),
            width: Int(size.width),
            height: Int(size.height),
            bitsPerComponent: 8,
            bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
        ) else { return nil }

        // Flip vertically so the UIKit-rendered frame is right-side up.
        context.translateBy(x: 0, y: size.height)
        context.scaleBy(x: 1, y: -1)
        context.draw(cgImage, in: CGRect(origin: .zero, size: size))
        return buffer
    }
}
