"""Make the reversed horizontal header lockup from the approved MHSC artwork.

The two cropped regions are from images/mhsc-logo-official.png.  This script
only changes the original green pixels to the approved warm white; gold pixels
and the artwork's silhouettes and lettering are retained.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "images/mhsc-logo-official.png"
DESTINATION = ROOT / "images/mhsc-logo-official-header.png"
GREEN = (30, 74, 51)
GOLD = (211, 154, 30)
CREAM = (247, 243, 232)


def reversed_crop(source: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    cropped = source.crop(box).convert("RGBA")
    pixels = cropped.load()
    for y in range(cropped.height):
        for x in range(cropped.width):
            red, green, blue, alpha = pixels[x, y]
            if not alpha:
                continue
            green_distance = sum((a - b) ** 2 for a, b in zip((red, green, blue), GREEN))
            gold_distance = sum((a - b) ** 2 for a, b in zip((red, green, blue), GOLD))
            if green_distance < gold_distance:
                pixels[x, y] = (*CREAM, alpha)
            else:
                pixels[x, y] = (*GOLD, alpha)
    return cropped


source = Image.open(SOURCE)
icon = reversed_crop(source, (218, 247, 1437, 1003)).resize((234, 144), Image.Resampling.LANCZOS)
wordmark = reversed_crop(source, (151, 1116, 1653, 1608)).resize((495, 162), Image.Resampling.LANCZOS)
lockup = Image.new("RGBA", (771, 162), (0, 0, 0, 0))
lockup.alpha_composite(icon, (0, 18))
lockup.alpha_composite(wordmark, (276, 0))
lockup.save(DESTINATION, optimize=True)
