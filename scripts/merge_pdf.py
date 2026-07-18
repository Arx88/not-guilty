"""
Merge cover.pdf + gdd_body.pdf → final PDF en /home/z/my-project/download/
"""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89

def normalize_page_to_a4(page):
    box = page.mediabox
    w, h = float(box.width), float(box.height)
    if abs(w - A4_W) > 0.5 or abs(h - A4_H) > 0.5:
        page.scale_to(A4_W, A4_H)
    return page

COVER = '/home/z/my-project/scripts/cover.pdf'
BODY = '/home/z/my-project/scripts/gdd_body.pdf'
OUT = '/home/z/my-project/download/NOT_GUILTY_GDD_v0.1.pdf'

writer = PdfWriter()

# Cover (page 1)
cover_page = PdfReader(COVER).pages[0]
writer.add_page(normalize_page_to_a4(cover_page))

# Body
body_reader = PdfReader(BODY)
for page in body_reader.pages:
    writer.add_page(normalize_page_to_a4(page))

writer.add_metadata({
    '/Title': 'NOT GUILTY — Game Design Document v0.1',
    '/Author': 'Z.ai',
    '/Creator': 'Z.ai',
    '/Subject': 'Game Design Document para NOT GUILTY — Acusado vs IA judicial',
    '/Producer': 'http://z.ai',
})

with open(OUT, 'wb') as f:
    writer.write(f)

print(f"OK: {OUT}")
print(f"  Cover: 1 page")
print(f"  Body:  {len(body_reader.pages)} pages")
print(f"  Total: {1 + len(body_reader.pages)} pages")
