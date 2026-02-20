#!/usr/bin/env python3
"""
Converte imagens da galeria para WebP com qualidade preservada.
Renomeia para o padrão: galeria-01.webp, galeria-02.webp, etc.

Uso: python scripts/convert_galeria_webp.py
Requer Pillow: pip install Pillow
  Ou use o venv: .venv/bin/python scripts/convert_galeria_webp.py
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow não encontrado. Instale com:")
    print("  pip install Pillow")
    print("Ou use o venv do projeto:")
    print("  .venv/bin/python scripts/convert_galeria_webp.py")
    sys.exit(1)

import re
import subprocess
import sys

GALERIA_DIR = Path(__file__).parent.parent / "assets" / "galeria"
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp"}
QUALIDADE_WEBP = 90  # 90 preserva boa qualidade com boa compressão


def proximo_numero():
    """Retorna o próximo número disponível para galeria-NN.webp."""
    numeros = []
    for f in GALERIA_DIR.iterdir():
        if f.is_file() and f.name.startswith("galeria-") and f.suffix == ".webp":
            m = re.match(r"galeria-(\d+)\.webp", f.name, re.I)
            if m:
                numeros.append(int(m.group(1)))
    return max(numeros, default=0) + 1


def main():
    # Coletar imagens (exceto as que já são resultado do script)
    imagens = []
    for f in sorted(GALERIA_DIR.iterdir()):
        if f.is_file() and f.suffix.lower() in EXTENSOES:
            if f.name.startswith("galeria-") and f.suffix == ".webp":
                continue
            imagens.append(f)

    if not imagens:
        print("Nenhuma imagem nova encontrada.")
        # Atualizar lista mesmo sem conversões (ex: arquivos foram adicionados manualmente)
        subprocess.run([sys.executable, Path(__file__).parent / "update_galeria_list.py"], check=True)
        return

    inicio = proximo_numero()
    print(f"Encontradas {len(imagens)} imagens. Convertendo para WebP...")

    for i, img_path in enumerate(imagens):
        novo_nome = f"galeria-{inicio + i:02d}.webp"
        novo_path = GALERIA_DIR / novo_nome

        try:
            with Image.open(img_path) as img:
                # Converter para RGB se necessário (ex: PNG com transparência)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                elif img.mode != "RGB":
                    img = img.convert("RGB")

                img.save(
                    novo_path,
                    "WEBP",
                    quality=QUALIDADE_WEBP,
                    method=6,  # compressão máxima sem perda visível
                )

            # Remover original após conversão bem-sucedida
            img_path.unlink()
            print(f"  {img_path.name} → {novo_nome}")

        except Exception as e:
            print(f"  Erro em {img_path.name}: {e}")

    # Atualizar lista de imagens para o site
    subprocess.run([sys.executable, Path(__file__).parent / "update_galeria_list.py"], check=True)
    print("Concluído!")


if __name__ == "__main__":
    main()
