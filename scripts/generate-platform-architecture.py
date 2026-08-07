"""Generate the Last Mile Physical Operations Platform architecture artwork.

The diagram is rendered deterministically so its exact copy, icon vocabulary,
transparent background, and responsive formats remain consistent.
"""

from __future__ import annotations

import math
from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "images" / "platform"
CONCEPTS = OUTPUT / "concepts"
ICON_DIR = OUTPUT / "iconography-original"
WEB_STEM = "last-mile-physical-operations-platform-pale-blue-v1"
W, H = 3840, 2160

C = {
    "deep": (38, 50, 68, 248),
    "deep_2": (45, 62, 83, 248),
    "card": (38, 52, 70, 246),
    "card_hi": (48, 65, 87, 246),
    "sage": (76, 134, 198, 255),
    "sage_dim": (49, 95, 145, 255),
    "teal": (94, 143, 175, 255),
    "steel": (168, 188, 203, 255),
    "title_steel": (38, 50, 68, 255),
    "pale_blue": (223, 234, 244, 255),
    "line": (168, 188, 203, 118),
    "line_soft": (139, 180, 207, 78),
    "white": (248, 250, 252, 255),
    "copy": (218, 228, 236, 255),
    "muted": (168, 188, 203, 255),
}

FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")

PRODUCTS = [
    ("product-signal", "INFINIT-SIGNAL", "Consumes and validates operational evidence from existing brokers, platforms, historians, and controls"),
    ("product-network", "SINGULARITY / SSOM", "Canonical identity, topology, condition, evidence, time, and outcome model"),
    ("product-flow", "INFINIT-FLOW", "Incidents, work, approvals, escalation, provider coordination, and guarded automation"),
    ("product-dashboard", "INFINIT-CONTROL", "Operator cases, live state, evidence timelines, work, and verified outcomes"),
]

ECOSYSTEM = [
    ("ecosystem-mqtt", "MQTT + INDUSTRIAL DATA", "HiveMQ · EMQX · HighByte · Litmus"),
    ("ecosystem-control", "CONTROL, SCADA + MES", "Ignition · Siemens · Rockwell · Schneider"),
    ("ecosystem-historian", "HISTORIANS + DATA PLATFORMS", "AVEVA / PI · Cognite"),
    ("ecosystem-building", "WORK + FACILITIES", "ServiceChannel · SAP · Maximo"),
    ("ecosystem-worker", "INDUSTRIAL SERVICE EXECUTION", "Dykman · AMM Services · JR Automation · Convergix"),
]

PLANT = [
    ("plant-sensor", "Sensors +\nInstrumentation"),
    ("plant-plc", "PLCs +\nControllers"),
    ("plant-hmi", "HMI / Operator\nInterfaces"),
    ("plant-scada", "SCADA\nSystems"),
    ("plant-sis", "SIS\nSystems"),
    ("plant-mes", "MES\nSystems"),
    ("plant-database", "Historians +\nDatabases"),
    ("plant-robot", "Machines +\nEquipment"),
    ("plant-worker", "Site Operations +\nMaintenance"),
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size=size)


def text(draw, xy, value, size, *, color="white", bold=False, anchor="la", spacing=8, align="left"):
    draw.multiline_text(
        xy,
        value,
        font=font(size, bold),
        fill=C[color] if isinstance(color, str) else color,
        anchor=anchor,
        spacing=spacing,
        align=align,
    )


def wrapped(value: str, chars: int) -> str:
    return "\n".join(wrap(value, width=chars, break_long_words=False))


def rounded_gradient(image: Image.Image, box, *, top, bottom, radius=30, outline=None, width=2, glow=None):
    x1, y1, x2, y2 = map(int, box)
    bw, bh = x2 - x1, y2 - y1
    gradient = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gradient)
    for y in range(bh):
        t = y / max(1, bh - 1)
        rgba = tuple(round(top[i] * (1-t) + bottom[i] * t) for i in range(4))
        gd.line((0, y, bw, y), fill=rgba)
    mask = Image.new("L", (bw, bh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, bw-1, bh-1), radius=radius, fill=255)
    if glow:
        glow_layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
        gmask = Image.new("L", image.size, 0)
        ImageDraw.Draw(gmask).rounded_rectangle(box, radius=radius, outline=210, width=max(4, width))
        blurred = gmask.filter(ImageFilter.GaussianBlur(14))
        glow_layer.paste((*glow[:3], 95), (0, 0), blurred)
        image.alpha_composite(glow_layer)
    image.paste(gradient, (x1, y1), mask)
    if outline:
        ImageDraw.Draw(image).rounded_rectangle(box, radius=radius, outline=outline, width=width)


def glow_line(image: Image.Image, points, *, fill, width=7, blur=10):
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.line(points, fill=(*fill[:3], 160), width=width * 2, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    image.alpha_composite(glow)
    ImageDraw.Draw(image).line(points, fill=fill, width=width, joint="curve")


def arrow(draw, start, end, *, color, width=6, head=18, double=False):
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    angle = math.atan2(y2-y1, x2-x1)
    for direction, px, py in [(angle, x2, y2)] + ([(angle+math.pi, x1, y1)] if double else []):
        a1 = direction + math.pi * .78
        a2 = direction - math.pi * .78
        draw.polygon([(px, py), (px + head*math.cos(a1), py + head*math.sin(a1)), (px + head*math.cos(a2), py + head*math.sin(a2))], fill=color)


def glow_arrow(image: Image.Image, start, end, *, color, width=9, head=30, blur=8):
    """Render the legacy platform's substantial arrow treatment in theme green."""
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    arrow(glow_draw, start, end, color=(*color[:3], 105), width=width+8, head=head+12)
    image.alpha_composite(glow.filter(ImageFilter.GaussianBlur(blur)))
    arrow(ImageDraw.Draw(image), start, end, color=color, width=width, head=head)


def dashed_box(draw: ImageDraw.ImageDraw, box, *, color, width=4, dash=28, gap=18):
    x1, y1, x2, y2 = box
    for x in range(x1, x2, dash + gap):
        draw.line((x, y1, min(x+dash, x2), y1), fill=color, width=width)
        draw.line((x, y2, min(x+dash, x2), y2), fill=color, width=width)
    for y in range(y1, y2, dash + gap):
        draw.line((x1, y, x1, min(y+dash, y2)), fill=color, width=width)
        draw.line((x2, y, x2, min(y+dash, y2)), fill=color, width=width)


def vertical_label(image: Image.Image, value: str, *, x: int, center_y: int):
    label = Image.new("RGBA", (740, 96), (0, 0, 0, 0))
    ld = ImageDraw.Draw(label)
    text(ld, (370, 48), value, 40, color="title_steel", bold=True, anchor="mm", align="center")
    label = label.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)
    image.alpha_composite(label, (x, center_y-label.height//2))


def local_icon(kind: str, size=(280, 180), *, primary=None, secondary=None) -> Image.Image:
    """Draw the original diagram's icon vocabulary as crisp two-tone line art."""
    w, h = size
    primary = primary or C["sage"]
    secondary = secondary or C["steel"]
    icon = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(icon)
    s = max(4, round(w / 52))

    def ln(points, color=primary, width=s):
        d.line(points, fill=color, width=width, joint="curve")

    def rr(box, radius=10, color=secondary, width=s):
        d.rounded_rectangle(box, radius=radius, outline=color, width=width)

    def circ(box, color=primary, width=s, fill=None):
        d.ellipse(box, outline=color, width=width, fill=fill)

    def poly(points, color=primary, width=s, fill=None):
        d.polygon(points, fill=fill)
        ln(points + [points[0]], color, width)

    def ah(start, end, color=primary, width=s):
        arrow(d, start, end, color=color, width=width, head=max(10, s*2))

    if kind == "signal":
        for x, y in [(22, 52), (40, 38), (44, 70), (62, 50), (25, 88), (54, 98), (75, 67), (81, 108)]:
            d.rectangle((x, y, x+11, y+11), fill=primary)
        for offset in (0, 25, 50):
            ln([(86, 50+offset), (112, 50+offset), (132, 67+offset//3), (157, 67+offset//3)], secondary)
        rr((170, 26, 246, 151), 12, secondary)
        ln([(186, 52), (230, 52)], primary)
        ln([(186, 73), (230, 73)], primary)
        poly([(208, 100), (198, 119), (208, 132), (218, 119)], secondary, max(3, s-1))
    elif kind == "network":
        cx, cy, r = 140, 88, 42
        pts = [(cx+r*math.cos(math.radians(a)), cy+r*math.sin(math.radians(a))) for a in range(0, 360, 60)]
        poly(pts, primary, s)
        circ((cx-13, cy-13, cx+13, cy+13), secondary, s)
        nodes = [(140, 18), (218, 48), (218, 128), (140, 160), (62, 128), (62, 48)]
        for nx, ny in nodes:
            ln([(cx + 35*(nx-cx)/max(1, math.hypot(nx-cx, ny-cy)), cy + 35*(ny-cy)/max(1, math.hypot(nx-cx, ny-cy))), (nx, ny)], primary)
            circ((nx-10, ny-10, nx+10, ny+10), primary, s)
    elif kind == "flow":
        boxes = [(20, 30, 84, 60), (108, 30, 172, 60), (20, 118, 84, 148), (108, 118, 172, 148)]
        for box in boxes:
            rr(box, 5, secondary)
        ah((86, 45), (105, 45), secondary, max(3, s-1))
        ah((52, 64), (52, 113), primary, max(3, s-1))
        poly([(104, 82), (126, 62), (148, 82), (126, 102)], primary, max(3, s-1))
        ah((151, 82), (206, 82), secondary, max(3, s-1))
        ah((174, 45), (216, 45), secondary, max(3, s-1))
        ln([(216, 45), (216, 70)], secondary)
        circ((216, 98, 268, 150), secondary, s)
        ln([(230, 124), (241, 136), (256, 114)], primary, s)
    elif kind == "dashboard":
        rr((18, 22, 262, 154), 12, secondary)
        circ((40, 49, 126, 135), primary, s)
        d.pieslice((40, 49, 126, 135), 270, 360, fill=C["teal"])
        ln([(83, 53), (83, 92), (119, 92)], C["deep"], max(3, s-1))
        for yy, xx in [(49, 238), (75, 222), (101, 245)]:
            ln([(150, yy), (xx, yy)], primary)
        for i, bh in enumerate((28, 48, 70, 43)):
            x = 152 + i*23
            d.rectangle((x, 140-bh, x+12, 140), fill=secondary)
    elif kind in ("mqtt", "sensor"):
        cx = 95 if kind == "mqtt" else 140
        for r in (34, 55, 76):
            d.arc((cx-r, 12, cx+r, 12+r*1.25), 205, 335, fill=primary, width=s)
        circ((cx-7, 75, cx+7, 89), primary, max(3, s-1), fill=primary)
        if kind == "mqtt":
            d.ellipse((32, 94, 154, 123), outline=secondary, width=s)
            ln([(32, 108), (32, 156)], secondary)
            ln([(154, 108), (154, 156)], secondary)
            d.arc((32, 135, 154, 170), 0, 180, fill=secondary, width=s)
            d.arc((32, 119, 154, 152), 0, 180, fill=secondary, width=s)
    elif kind in ("control", "plc"):
        cabinets = [(22, 24, 82, 144), (90, 14, 158, 144), (166, 32, 232, 144)] if kind == "control" else [(50, 18, 132, 150), (145, 18, 227, 150)]
        for box in cabinets:
            rr(box, 3, secondary)
            x1, y1, x2, y2 = box
            ln([(x1+12, y1+24), (x2-12, y1+24)], primary, max(3, s-1))
            for yy in range(y1+42, y2-12, 24):
                circ((x1+12, yy, x1+20, yy+8), primary, max(2, s-2), fill=primary)
                ln([(x1+29, yy+4), (x2-12, yy+4)], secondary, max(2, s-2))
        if kind == "control":
            circ((188, 112, 248, 172), primary, max(3, s-1))
            for a in range(0, 360, 45):
                ln([(218+30*math.cos(math.radians(a)), 142+30*math.sin(math.radians(a))), (218+39*math.cos(math.radians(a)), 142+39*math.sin(math.radians(a)))], primary, max(3, s-1))
    elif kind in ("historian", "database"):
        left, right = (28, 132) if kind == "historian" else (72, 208)
        d.ellipse((left, 18, right, 56), outline=secondary, width=s)
        ln([(left, 38), (left, 105)], secondary)
        ln([(right, 38), (right, 105)], secondary)
        d.arc((left, 82, right, 122), 0, 180, fill=secondary, width=s)
        d.arc((left, 50, right, 88), 0, 180, fill=secondary, width=max(3, s-1))
        if kind == "historian":
            pts = [(146, 139), (174, 109), (200, 126), (228, 82), (258, 96)]
            ln(pts, primary, s)
            for x, y in pts:
                circ((x-6, y-6, x+6, y+6), primary, max(2, s-2), fill=C["deep"])
    elif kind == "building":
        rr((45, 43, 144, 151), 2, secondary)
        rr((145, 18, 228, 151), 2, primary)
        for x1, x2, ystart in [(60, 130, 62), (160, 214, 38)]:
            for yy in range(ystart, 128, 25):
                for xx in range(x1, x2, 25):
                    d.rectangle((xx, yy, xx+9, yy+9), fill=secondary)
        ln([(25, 151), (248, 151)], secondary)
    elif kind == "worker":
        circ((106, 40, 174, 108), secondary, s)
        d.arc((96, 24, 184, 92), 185, 355, fill=primary, width=s)
        ln([(96, 55), (184, 55)], primary)
        ln([(140, 17), (140, 51)], primary)
        d.arc((65, 93, 215, 188), 180, 360, fill=secondary, width=s)
        ln([(65, 140), (65, 170), (215, 170), (215, 140)], secondary)
        ln([(116, 110), (140, 140), (165, 110)], primary)
    elif kind == "hmi":
        rr((28, 20, 250, 135), 5, secondary)
        pts = [(56, 105), (90, 72), (122, 92), (158, 45), (198, 69), (225, 44)]
        ln(pts, primary, s)
        for x, y in pts:
            circ((x-6, y-6, x+6, y+6), primary, max(2, s-2), fill=C["deep"])
        ln([(112, 148), (168, 148)], secondary)
        ln([(140, 135), (140, 148)], secondary)
    elif kind == "scada":
        for y in (24, 88):
            rr((42, y, 238, y+50), 4, secondary)
            for x in (64, 86, 108):
                circ((x, y+20, x+8, y+28), primary, max(2, s-2), fill=primary)
            ln([(145, y+25), (213, y+25)], primary, max(3, s-1))
    elif kind == "sis":
        ln([(38, 150), (38, 96), (75, 96), (75, 66), (112, 85), (112, 48), (150, 85), (150, 150)], secondary)
        ln([(150, 150), (242, 150), (242, 110), (213, 110), (213, 82), (184, 82), (184, 120)], secondary)
        for x in (62, 100, 134, 176, 209):
            d.rectangle((x, 124, x+10, 139), fill=primary)
    elif kind == "mes":
        rr((30, 30, 250, 142), 9, secondary)
        text(d, (140, 87), "8888", 56, color="sage", bold=False, anchor="mm")
        for x in (48, 232):
            circ((x-5, 78, x+5, 88), primary, max(2, s-2), fill=primary)
    elif kind == "robot":
        rr((72, 142, 218, 166), 4, secondary)
        rr((96, 121, 178, 144), 3, secondary)
        ln([(137, 121), (112, 89), (158, 54), (205, 83), (230, 55)], primary, s+1)
        for x, y in [(112, 89), (158, 54), (205, 83)]:
            circ((x-11, y-11, x+11, y+11), secondary, s, fill=C["deep"])
        ln([(230, 55), (248, 38)], primary)
        ln([(230, 55), (253, 66)], primary)

    glow = icon.filter(ImageFilter.GaussianBlur(11))
    glow.putalpha(glow.getchannel("A").point(lambda a: min(110, a//2)))
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.alpha_composite(glow)
    result.alpha_composite(icon)
    return result


def paste_icon(image: Image.Image, kind: str, box, *, primary=None, secondary=None):
    x1, y1, x2, y2 = map(int, box)
    path = ICON_DIR / f"{kind}.png"
    if not path.exists():
        raise FileNotFoundError(f"Missing exact platform icon sprite: {path}")
    source = Image.open(path).convert("RGBA")
    # Preserve the exact original icon pixels and geometry while replacing the
    # legacy green accent with the new medium blue theme color.
    recolored = []
    for r, g, b, a in source.getdata():
        if a and g > r + 22 and g > b + 8:
            strength = min(1.0, max(0.0, (g-r) / 90))
            nr = round(r * (1-strength) + C["sage"][0] * strength)
            ng = round(g * (1-strength) + C["sage"][1] * strength)
            nb = round(b * (1-strength) + C["sage"][2] * strength)
            recolored.append((nr, ng, nb, a))
        else:
            recolored.append((r, g, b, a))
    source.putdata(recolored)
    max_w, max_h = x2-x1, y2-y1
    scale = min(max_w/source.width, max_h/source.height)
    icon = source.resize((max(1, round(source.width*scale)), max(1, round(source.height*scale))), Image.Resampling.LANCZOS)
    px = x1 + (max_w-icon.width)//2
    py = y1 + (max_h-icon.height)//2
    glow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    alpha = Image.new("L", image.size, 0)
    alpha.paste(icon.getchannel("A"), (px, py))
    alpha = alpha.filter(ImageFilter.GaussianBlur(11))
    glow.paste((*C["sage"][:3], 72), (0, 0), alpha)
    image.alpha_composite(glow)
    image.alpha_composite(icon, (px, py))


def card(image: Image.Image, box, *, strong=False):
    rounded_gradient(
        image,
        box,
        top=C["card_hi"] if strong else C["card"],
        bottom=C["deep_2"],
        radius=24,
        outline=C["steel"] if strong else C["line"],
        width=3 if strong else 2,
    )


def layer(image: Image.Image, box, title_value: str, *, primary=False, title_size=47, fill=None, divider=None, title_color="white"):
    fill_top, fill_bottom = (fill, fill) if fill else (C["deep_2"], C["deep"])
    rounded_gradient(
        image,
        box,
        top=fill_top,
        bottom=fill_bottom,
        radius=34,
        outline=C["sage"] if primary else C["steel"],
        width=4 if primary else 3,
        glow=C["sage"] if primary else None,
    )
    x1, y1, x2, _ = box
    draw = ImageDraw.Draw(image)
    text(draw, ((x1+x2)//2, y1+62), title_value, title_size, color=title_color, bold=True, anchor="mm", align="center")
    divider_y = y1 + (120 if title_size > 50 else 104)
    draw.line((x1+44, divider_y, x2-44, divider_y), fill=divider or C["line_soft"], width=4 if divider else 2)


def connectors(image: Image.Image, y1: int, y2: int, count=5):
    draw = ImageDraw.Draw(image)
    for i in range(count):
        x = 490 + i * 715
        glow_line(image, [(x, y1+8), (x, y2-8)], fill=C["sage"], width=3, blur=8)
        arrow(draw, (x, y1+8), (x, y2-8), color=C["sage"], width=3, head=14, double=True)


def platform_connectors(image: Image.Image, y1: int, y2: int):
    # Keep the center clear so the ecosystem title remains fully readable.
    for x in (520, 1180, 2660, 3320):
        glow_arrow(image, (x, y1+12), (x, y2-12), color=C["sage"], width=15, head=36, blur=8)


def build() -> Image.Image:
    image = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    # Tier 1: Last Mile Platform.
    top = (120, 190, 3720, 930)
    dashed_box(draw, (88, 162, 3752, 958), color=C["sage"], width=4, dash=30, gap=20)
    vertical_label(image, "The Missing Orchestration Layer", x=-14, center_y=(162+958)//2)
    layer(image, top, "THE LAST MILE PHYSICAL OPERATIONS PLATFORM", primary=True, title_size=58, fill=C["pale_blue"], divider=C["card"], title_color="title_steel")
    gap = 44
    inner_x = 180
    card_w = (W - 360 - gap*3) // 4
    card_y1, card_y2 = 325, 865
    for i, (kind, name, copy) in enumerate(PRODUCTS):
        x1 = inner_x + i*(card_w+gap)
        x2 = x1 + card_w
        card(image, (x1, card_y1, x2, card_y2), strong=True)
        paste_icon(image, kind, (x1+165, card_y1+35, x2-165, card_y1+235), primary=C["sage"], secondary=C["steel"])
        text(draw, ((x1+x2)//2, card_y1+285), name, 40, bold=True, anchor="mm", align="center")
        text(draw, ((x1+x2)//2, card_y1+358), wrapped(copy, 38), 35, color="white", anchor="ma", spacing=10, align="center")
        if i < len(PRODUCTS)-1:
            arrow(draw, (x2+7, card_y1+270), (x2+gap-7, card_y1+270), color=C["sage"], width=7, head=20)

    # Tier 2: existing ecosystem.
    middle = (120, 1065, 3720, 1570)
    dashed_box(draw, (88, 1038, 3752, 2125), color=C["sage"], width=4, dash=30, gap=20)
    vertical_label(image, "Typical Industrial Tech Stack", x=-14, center_y=(1038+2125)//2)
    layer(image, middle, "EXISTING OT, DATA, WORK + SERVICE ECOSYSTEM", title_size=47)
    platform_connectors(image, top[3], middle[1])
    gap2 = 24
    inner_x2 = 165
    eco_w = (W - 330 - gap2*4) // 5
    for i, (kind, name, copy) in enumerate(ECOSYSTEM):
        x1 = inner_x2 + i*(eco_w+gap2)
        x2 = x1 + eco_w
        card(image, (x1, 1206, x2, 1518))
        center_x = (x1+x2)//2
        paste_icon(image, kind, (center_x-112, 1220, center_x+112, 1335), primary=C["sage"], secondary=C["steel"])
        text(draw, (center_x, 1368), wrapped(name, 25), 38, bold=True, anchor="mm", spacing=6, align="center")
        text(draw, (center_x, 1438), wrapped(copy, 31), 29, color="white", anchor="ma", spacing=7, align="center")

    # Tier 3: plant/site/OT environment.
    bottom = (120, 1645, 3720, 2095)
    layer(image, bottom, "PLANT / SITE / OT ENVIRONMENT", title_size=47)
    connectors(image, middle[3], bottom[1], count=5)
    inner_x3 = 155
    cell_gap = 8
    cell_w = (W - 310 - cell_gap*8) // 9
    for i, (kind, label) in enumerate(PLANT):
        x1 = inner_x3 + i*(cell_w+cell_gap)
        x2 = x1 + cell_w
        if i:
            draw.line((x1-4, 1780, x1-4, 2045), fill=C["line_soft"], width=2)
        paste_icon(image, kind, (x1+66, 1790, x2-66, 1935), primary=C["sage"], secondary=C["steel"])
        text(draw, ((x1+x2)//2, 1992), label, 35, color="white", anchor="mm", spacing=9, align="center")

    return image


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    master = build()
    master.save(OUTPUT / "last-mile-physical-operations-platform.png", format="PNG", optimize=True)
    # Serve the current production artwork from a versioned filename so browser
    # and CDN caches cannot substitute an earlier diagram revision.
    master.save(OUTPUT / f"{WEB_STEM}.png", format="PNG", optimize=True)
    # Keep the previously reviewed Concept B path current so existing review
    # links resolve to the revised, sidecar-free artwork.
    CONCEPTS.mkdir(parents=True, exist_ok=True)
    master.save(CONCEPTS / "last-mile-platform-b-context-sidecar-4k.png", format="PNG", optimize=True)
    for width in (1440, 960):
        height = width * 9 // 16
        resized = master.resize((width, height), Image.Resampling.LANCZOS)
        resized.save(OUTPUT / f"last-mile-physical-operations-platform-{width}.webp", format="WEBP", quality=90, method=6)
        resized.save(OUTPUT / f"last-mile-physical-operations-platform-{width}.avif", format="AVIF", quality=76, speed=4)
        resized.save(OUTPUT / f"{WEB_STEM}-{width}.webp", format="WEBP", quality=90, method=6)
        resized.save(OUTPUT / f"{WEB_STEM}-{width}.avif", format="AVIF", quality=76, speed=4)
    print("Generated revised 4K platform architecture plus 1440/960 WebP and AVIF variants.")


if __name__ == "__main__":
    main()
