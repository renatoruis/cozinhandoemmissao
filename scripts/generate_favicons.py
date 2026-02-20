#!/usr/bin/env python3
"""
Gera favicons em múltiplos tamanhos a partir de assets/favicon.png.
Execute: python scripts/generate_favicons.py
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow não encontrado. Instale: pip install Pillow")
    sys.exit(1)

SOURCE = Path(__file__).parent.parent / "assets" / "favicon.png"
ASSETS = Path(__file__).parent.parent / "assets"
SIZES = [16, 32, 48, 180, 192, 512]


def main():
    if not SOURCE.exists():
        print(f"Arquivo não encontrado: {SOURCE}")
        sys.exit(1)

    img = Image.open(SOURCE)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGBA")
    else:
        img = img.convert("RGB")

    for s in SIZES:
        out = ASSETS / f"favicon-{s}x{s}.png"
        resized = img.resize((s, s), Image.Resampling.LANCZOS)
        resized.save(out)
        print(f"  {out.name}")

    img32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img32.save(ASSETS / "favicon.ico", format="ICO")
    print("  favicon.ico")

    print("Favicons gerados.")


if __name__ == "__main__":
    main()
