"""Extract and recolor the exact icon pixels from the original platform art.

This is a one-time migration helper. The generated transparent icon sprites are
consumed by ``generate-platform-architecture.py`` so future renders preserve the
original icon shapes instead of redrawing approximations.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    "product-signal": (101, 154, 244, 228),
    "product-network": (425, 150, 551, 231),
    "product-flow": (699, 154, 890, 229),
    "product-dashboard": (1011, 160, 1140, 232),
    "ecosystem-mqtt": (45, 613, 105, 693),
    "ecosystem-control": (272, 612, 343, 681),
    "ecosystem-historian": (524, 618, 606, 683),
    "ecosystem-building": (780, 617, 839, 682),
    "ecosystem-worker": (997, 615, 1056, 684),
    "plant-sensor": (66, 777, 124, 835),
    "plant-plc": (192, 777, 254, 836),
    "plant-hmi": (326, 777, 406, 836),
    "plant-scada": (463, 778, 532, 836),
    "plant-sis": (593, 777, 668, 836),
    "plant-mes": (698, 779, 770, 831),
    "plant-database": (827, 775, 886, 837),
    "plant-robot": (955, 774, 1031, 835),
    "plant-worker": (1086, 773, 1153, 835),
}

SAGE = (117, 189, 167)
STEEL = (132, 172, 182)
WHITE = (224, 235, 235)


def clamp(value: float) -> int:
    return max(0, min(255, round(value)))


def recolor_icon(crop: Image.Image) -> Image.Image:
    src = crop.convert("RGB")
    out = Image.new("RGBA", src.size, (0, 0, 0, 0))
    src_px = src.load()
    out_px = out.load()

    for y in range(src.height):
        for x in range(src.width):
            r, g, b = src_px[x, y]
            peak = max(r, g, b)
            # The source artwork sits on an almost-black blue-green panel. This
            # response preserves its antialiasing and glow while removing the panel.
            chroma = max(r, g, b) - min(r, g, b)
            signal = peak + chroma * 0.45
            alpha = clamp((signal - 43.0) * 3.8)
            if alpha <= 3:
                continue

            if min(r, g, b) > peak * 0.72:
                base = WHITE
            elif g >= b * 0.88:
                base = SAGE
            else:
                base = STEEL

            intensity = 0.64 + min(0.38, peak / 430.0)
            out_px[x, y] = (
                clamp(base[0] * intensity),
                clamp(base[1] * intensity),
                clamp(base[2] * intensity),
                alpha,
            )
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    args = parser.parse_args()

    source = Image.open(args.source).convert("RGB")
    args.out_dir.mkdir(parents=True, exist_ok=True)
    for name, box in CROPS.items():
        icon = recolor_icon(source.crop(box))
        if name == "ecosystem-historian":
            # The source label begins inside the icon's broad crop; remove only
            # that label fragment while retaining the lower-right trend line.
            icon.paste((0, 0, 0, 0), (64, 0, icon.width, 37))
            icon.paste((0, 0, 0, 0), (67, 37, icon.width, icon.height))
        icon.save(args.out_dir / f"{name}.png", format="PNG", optimize=True)
    print(f"Extracted {len(CROPS)} exact icon sprites to {args.out_dir}")


if __name__ == "__main__":
    main()
