"""Create the site's pale blue 4K content-image masters and web variants."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "public" / "images"
W, H = 3840, 2160

PALETTE = {
    "canvas": "#F1F3F6",
    "surface": "#FFFFFF",
    "ink": "#263244",
    "copy": "#58687A",
    "wash": "#E7EDF3",
    "blue": "#4C86C6",
    "blue_dark": "#315F91",
    "blue_gray": "#5E8FAF",
    "pale_blue": "#8BB4CF",
    "steel": "#A8BCCB",
}

FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size=size)


def pale_blueprint(source_path: Path, crop: tuple[int, int, int, int] | None = None) -> Image.Image:
    """Invert a dark blueprint into pale paper with medium-blue linework."""
    with Image.open(source_path).convert("RGB") as source:
        if crop:
            source = source.crop(crop)
            # The transform maps dark source pixels to pale paper, so pad with
            # black before conversion to avoid colored pillar-box bands.
            fitted = ImageOps.pad(source, (W, H), Image.Resampling.LANCZOS, color="#000000")
        else:
            fitted = ImageOps.fit(source, (W, H), Image.Resampling.LANCZOS)
    gray = ImageOps.grayscale(fitted)
    gray = ImageOps.autocontrast(gray, cutoff=(0.4, 0.2))
    lut = [round(255 * (max(0, value - 5) / 250) ** 0.7) for value in range(256)]
    signal = gray.point(lut).filter(ImageFilter.MaxFilter(3))
    paper = Image.new("RGB", (W, H), PALETTE["canvas"])
    linework = Image.new("RGB", (W, H), PALETTE["blue_dark"])
    transformed = Image.composite(linework, paper, signal)
    # A translucent white veil keeps dense original glows from feeling harsh.
    veil = Image.new("RGB", (W, H), PALETTE["surface"])
    return Image.blend(transformed, veil, 0.08)


def chuck_landscape() -> Image.Image:
    """Preserve the original operator portrait in a clean 4K landscape composition."""
    source_path = IMAGES / "Chuck1.png"
    with Image.open(source_path).convert("RGB") as source:
        background = ImageOps.fit(source, (W, H), Image.Resampling.LANCZOS)
        background = background.filter(ImageFilter.GaussianBlur(70))
        background = Image.blend(background, Image.new("RGB", (W, H), PALETTE["canvas"]), 0.8)

        portrait = ImageOps.fit(source, (1460, 1900), Image.Resampling.LANCZOS, centering=(0.5, 0.35))

    canvas = background
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((160, 160, 2020, 2000), radius=80, fill=PALETTE["surface"], outline="#D8E1EA", width=4)
    draw.ellipse((320, 380, 1460, 1520), fill="#DFEAF4")
    draw.line((420, 1710, 1720, 1710), fill=PALETTE["pale_blue"], width=12)
    draw.line((420, 1760, 1420, 1760), fill=PALETTE["steel"], width=8)

    mask = Image.new("L", portrait.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, portrait.width-1, portrait.height-1), radius=70, fill=255)
    canvas.paste(portrait, (2220, 130), mask)
    draw.rounded_rectangle((2220, 130, 3680, 2030), radius=70, outline="#C8D5E0", width=5)
    return canvas


def theme_board() -> Image.Image:
    canvas = Image.new("RGB", (W, H), PALETTE["canvas"])
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((180, 170, W-180, H-170), radius=64, fill=PALETTE["surface"], outline="#D8E1EA", width=4)
    draw.text((340, 300), "Last Mile Theme Colors", font=font(118, True), fill=PALETTE["ink"])
    draw.text((340, 450), "Pale blue, steel and neutral panel system", font=font(52), fill=PALETTE["copy"])
    swatches = [
        ("Surface", "#FFFFFF"),
        ("Ink", "#263244"),
        ("Body copy", "#58687A"),
        ("Panel wash", "#E7EDF3"),
        ("Primary blue", "#4C86C6"),
        ("Blue grey", "#5E8FAF"),
        ("Pale blue", "#8BB4CF"),
        ("Steel", "#A8BCCB"),
    ]
    start_x, start_y = 340, 700
    card_w, card_h, gap_x, gap_y = 730, 470, 70, 70
    for index, (label, value) in enumerate(swatches):
        row, col = divmod(index, 4)
        x = start_x + col * (card_w + gap_x)
        y = start_y + row * (card_h + gap_y)
        draw.rounded_rectangle((x, y, x+card_w, y+card_h), radius=34, fill="#F8FAFC", outline="#D8E1EA", width=3)
        draw.rounded_rectangle((x+34, y+34, x+card_w-34, y+260), radius=24, fill=value)
        text_color = PALETTE["ink"]
        draw.text((x+34, y+302), label, font=font(40, True), fill=text_color)
        draw.text((x+34, y+370), value, font=font(34), fill=PALETTE["copy"])
    return canvas


def save_set(image: Image.Image, directory: Path, stem: str) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    image.save(directory / f"{stem}.png", format="PNG", optimize=True)
    for width in (1440, 960):
        resized = image.resize((width, width * 9 // 16), Image.Resampling.LANCZOS)
        resized.save(directory / f"{stem}-{width}.webp", format="WEBP", quality=90, method=6)
        resized.save(directory / f"{stem}-{width}.avif", format="AVIF", quality=78, speed=4)


def main() -> None:
    blueprint_dir = IMAGES / "blueprint"
    platform_dir = IMAGES / "platform"
    blueprint_jobs = [
        (blueprint_dir / "platform-core-blueprint.png", blueprint_dir, "platform-core-blueprint-pale-4k", None),
        (blueprint_dir / "servicenow-integrations-blueprint.png", blueprint_dir, "servicenow-integrations-blueprint-pale-4k", (190, 30, 834, 546)),
        (blueprint_dir / "signal-2-action-blueprint.png", blueprint_dir, "signal-2-action-blueprint-pale-4k", None),
        (platform_dir / "last-mile-operating-layer.png", platform_dir, "last-mile-operating-layer-pale-4k", None),
    ]
    for source, directory, stem, crop in blueprint_jobs:
        save_set(pale_blueprint(source, crop), directory, stem)

    save_set(chuck_landscape(), IMAGES, "chuck-operator-pale-4k")
    theme_board().save(IMAGES / "Theme Colors.png", format="PNG", optimize=True)

    # The social image uses the same pale industrial system at a full 4K 16:9 master.
    og = pale_blueprint(blueprint_dir / "platform-core-blueprint.png")
    og.save(IMAGES / "last-mile-og-4k.jpg", format="JPEG", quality=92, optimize=True)
    print("Generated pale blue 4K masters and responsive AVIF/WebP variants.")


if __name__ == "__main__":
    main()
