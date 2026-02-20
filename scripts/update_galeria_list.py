#!/usr/bin/env python3
"""
Gera galeria-data.js com a lista de imagens da pasta galeria.
Execute após adicionar novas fotos para que apareçam no carrossel.
"""

import re
from pathlib import Path

GALERIA_DIR = Path(__file__).parent.parent / "assets" / "galeria"
OUTPUT_FILE = Path(__file__).parent.parent / "assets" / "galeria-data.js"


def natural_sort_key(name: str):
    """Ordena galeria-01, galeria-02, ..., galeria-10 corretamente."""
    m = re.match(r"galeria-(\d+)", name, re.I)
    return (0, 0) if not m else (0, int(m.group(1)))


def main():
    imagens = []
    for f in sorted(GALERIA_DIR.iterdir(), key=lambda x: natural_sort_key(x.name)):
        if f.is_file() and f.suffix.lower() in {".webp", ".jpg", ".jpeg", ".png"}:
            # Caminho relativo a assets/
            imagens.append(f"galeria/{f.name}")

    if not imagens:
        print("Nenhuma imagem encontrada em", GALERIA_DIR)
        return

    js_content = f"window.GALERIA_IMAGES = {imagens!r};\n"
    OUTPUT_FILE.write_text(js_content, encoding="utf-8")
    print(f"Gerado {OUTPUT_FILE.name} com {len(imagens)} imagens.")


if __name__ == "__main__":
    main()
