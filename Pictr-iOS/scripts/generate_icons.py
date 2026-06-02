#!/usr/bin/env python3
"""
Pictr — AI-generated app icon.

Draws a premium "camera aperture / a-photo-a-day" mark on a warm sunset
gradient, the way a designer would: supersampled for crisp anti-aliasing,
a soft inner glow, a 6-blade iris pinwheel, and a subtle highlight.

Output: Pictr/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png
        (plus a rounded marketing preview for the README)
"""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ICON_DIR = os.path.join(ROOT, "Pictr", "Assets.xcassets", "AppIcon.appiconset")

SS = 4                 # supersample factor
SIZE = 1024
S = SIZE * SS
C = S / 2.0


def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(int(round(lerp(c1[i], c2[i], t))) for i in range(3))


def unit(deg):
    r = math.radians(deg)
    return math.cos(r), math.sin(r)


def diagonal_gradient(size, top_left, bottom_right):
    """Smooth 45-degree linear gradient."""
    img = Image.new("RGB", (size, size))
    px = img.load()
    maxd = (size - 1) * 2.0
    for y in range(size):
        for x in range(size):
            t = (x + y) / maxd
            px[x, y] = mix(top_left, bottom_right, t)
    return img


def radial_glow(size, center, radius, color, max_alpha):
    glow = Image.new("L", (size, size), 0)
    gp = glow.load()
    cx, cy = center
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - cx, y - cy)
            t = max(0.0, 1.0 - d / radius)
            gp[x, y] = int(max_alpha * (t ** 1.7))
    layer = Image.new("RGB", (size, size), color)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(layer, (0, 0), glow)
    return out


def build():
    # --- Brand palette: indigo night -> magenta -> warm coral sunset
    top_left = (60, 38, 122)       # deep indigo
    bottom_right = (255, 122, 138)  # warm coral
    base = diagonal_gradient(S, top_left, bottom_right).convert("RGBA")

    # Warm glow in lower-right (the "sun")
    base = Image.alpha_composite(
        base, radial_glow(S, (C * 1.32, C * 1.42), S * 0.62, (255, 196, 140), 150)
    )
    # Cool glow upper-left for depth
    base = Image.alpha_composite(
        base, radial_glow(S, (C * 0.62, C * 0.55), S * 0.7, (138, 96, 230), 90)
    )

    draw = ImageDraw.Draw(base, "RGBA")

    # --- Aperture geometry (proper camera iris: filled lens, swept blade edges)
    N = 6
    twist = 8.0
    R_out = S * 0.300     # lens body radius
    R_in = S * 0.150      # opening (hexagon) radius
    sweep = 360.0 / N

    def at(radius, deg):
        cx, cy = unit(deg)
        return (C + radius * cx, C + radius * cy)

    def V(i):
        return at(R_in, i * sweep + twist)

    # Soft outer halo ring (lens barrel)
    halo_r = S * 0.352
    draw.ellipse(
        [C - halo_r, C - halo_r, C + halo_r, C + halo_r],
        outline=(255, 255, 255, 40),
        width=int(S * 0.011),
    )

    # Lens body — solid light disc (the metal of the iris)
    draw.ellipse(
        [C - R_out, C - R_out, C + R_out, C + R_out],
        fill=(245, 245, 250, 250),
    )

    # Subtle metallic shading on the lens, composited on its own layer so the
    # low-alpha wedges actually blend (ImageDraw writes opaque onto an opaque base).
    shade_layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade_layer, "RGBA")
    for i in range(N):
        a0 = i * sweep + twist
        a1 = (i + 1) * sweep + twist
        sector = [(C, C), at(R_out, a0)]
        steps = 8
        for s in range(steps + 1):
            sector.append(at(R_out, lerp(a0, a1, s / steps)))
        sd.polygon(sector, fill=(20, 12, 40, 26) if i % 2 == 0 else (255, 255, 255, 30))
    base = Image.alpha_composite(base, shade_layer)
    draw = ImageDraw.Draw(base, "RGBA")

    # Hexagonal opening — gradient shows through a darkened lens core
    hexagon = [V(i) for i in range(N)]
    draw.polygon(hexagon, fill=(26, 16, 48, 235))

    # Swept blade edges: chord from each opening vertex to the next blade tip
    for i in range(N):
        v = V(i)
        w = at(R_out, (i + 1) * sweep + twist)
        draw.line([v, w], fill=(70, 52, 104, 150), width=int(S * 0.012))
        draw.line([v, w], fill=(255, 255, 255, 90), width=int(S * 0.004))

    # Crisp white rim around the opening
    draw.line(hexagon + [hexagon[0]], fill=(255, 255, 255, 95), width=int(S * 0.006), joint="curve")

    # Tiny bright catch-light in the opening (a captured "moment")
    gr = S * 0.026
    gx, gy = C + R_in * 0.30, C - R_in * 0.34
    draw.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=(255, 235, 210, 235))

    # Top sheen across the whole icon for a glassy finish
    sheen = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sd.ellipse([-S * 0.3, -S * 0.85, S * 1.3, S * 0.35], fill=(255, 255, 255, 26))
    base = Image.alpha_composite(base, sheen)

    # Downsample for anti-aliasing
    icon = base.convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)

    os.makedirs(ICON_DIR, exist_ok=True)
    out_path = os.path.join(ICON_DIR, "AppIcon-1024.png")
    icon.save(out_path, "PNG")
    print("wrote", out_path)

    # Rounded marketing preview (squircle-ish) for docs
    preview = icon.copy().convert("RGBA")
    mask = Image.new("L", (SIZE, SIZE), 0)
    md = ImageDraw.Draw(mask)
    rad = int(SIZE * 0.2237)  # iOS continuous-corner approximation
    md.rounded_rectangle([0, 0, SIZE, SIZE], radius=rad, fill=255)
    preview.putalpha(mask)
    prev_path = os.path.join(ROOT, "AppIconPreview.png")
    preview.resize((512, 512), Image.LANCZOS).save(prev_path, "PNG")
    print("wrote", prev_path)


if __name__ == "__main__":
    build()
