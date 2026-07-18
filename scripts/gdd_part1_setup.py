"""
NOT GUILTY — Game Design Document v0.1
Script de generación del PDF (cuerpo, sin cover).
"""
import os
import sys
import hashlib
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Image, KeepTogether, CondPageBreak, HRFlowable, ListFlowable, ListItem
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from PIL import Image as PILImage

# ── Path setup ─────────────────────────────────────────────
PDF_SKILL_DIR = '/home/z/my-project/skills/pdf'
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, 'scripts'))
from pdf import install_font_fallback

# ── Font registration ─────────────────────────────────────
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Noto Sans SC', f'{FONT_DIR}/truetype/lxgw-wenkai/LXGWWenKai-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Noto Sans SC Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('SarasaMonoSC', f'{FONT_DIR}/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif', f'{FONT_DIR}/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', f'{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', f'{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', f'{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')
registerFontFamily('Noto Sans SC', normal='Noto Sans SC', bold='Noto Sans SC Bold')
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold',
                   italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans')

install_font_fallback()

# ── Palette (from palette.cascade) ────────────────────────
PAGE_BG       = colors.HexColor('#f2f2f1')
SECTION_BG    = colors.HexColor('#eae9e7')
CARD_BG       = colors.HexColor('#f0f0ed')
TABLE_STRIPE  = colors.HexColor('#f1f0ee')
HEADER_FILL   = colors.HexColor('#696149')
COVER_BLOCK   = colors.HexColor('#635a3d')
BORDER        = colors.HexColor('#c2bba5')
ICON          = colors.HexColor('#88753c')
ACCENT        = colors.HexColor('#866f2c')
ACCENT_2      = colors.HexColor('#4ba3c1')
TEXT_PRIMARY  = colors.HexColor('#1d1c1a')
TEXT_MUTED    = colors.HexColor('#8d8a83')
SEM_SUCCESS   = colors.HexColor('#44945f')
SEM_WARNING   = colors.HexColor('#98804f')
SEM_ERROR     = colors.HexColor('#884d47')
SEM_INFO      = colors.HexColor('#486684')

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = TABLE_STRIPE

# ── Page geometry ─────────────────────────────────────────
PAGE_W, PAGE_H = A4
LEFT_M = 22 * mm
RIGHT_M = 22 * mm
TOP_M = 25 * mm
BOT_M = 25 * mm
AVAIL_W = PAGE_W - LEFT_M - RIGHT_M

# ── Styles ────────────────────────────────────────────────
STY = {}

STY['h1'] = ParagraphStyle(
    name='H1', fontName='FreeSerif-Bold', fontSize=20, leading=26,
    textColor=TEXT_PRIMARY, spaceBefore=18, spaceAfter=12,
    alignment=TA_LEFT,
)
STY['h2'] = ParagraphStyle(
    name='H2', fontName='FreeSerif-Bold', fontSize=14, leading=18,
    textColor=HEADER_FILL, spaceBefore=14, spaceAfter=8,
    alignment=TA_LEFT,
)
STY['h3'] = ParagraphStyle(
    name='H3', fontName='FreeSerif-Bold', fontSize=11.5, leading=15,
    textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=4,
    alignment=TA_LEFT,
)
STY['body'] = ParagraphStyle(
    name='Body', fontName='FreeSerif', fontSize=10.5, leading=16,
    textColor=TEXT_PRIMARY, spaceBefore=0, spaceAfter=8,
    alignment=TA_JUSTIFY, firstLineIndent=0,
)
STY['body_left'] = ParagraphStyle(
    name='BodyLeft', parent=STY['body'], alignment=TA_LEFT,
)
STY['bullet'] = ParagraphStyle(
    name='Bullet', fontName='FreeSerif', fontSize=10.5, leading=15,
    textColor=TEXT_PRIMARY, spaceBefore=2, spaceAfter=2,
    leftIndent=18, bulletIndent=4, alignment=TA_LEFT,
)
STY['callout'] = ParagraphStyle(
    name='Callout', fontName='FreeSerif-Italic', fontSize=10.5, leading=15,
    textColor=TEXT_PRIMARY, spaceBefore=4, spaceAfter=4,
    leftIndent=12, alignment=TA_LEFT,
)
STY['kicker'] = ParagraphStyle(
    name='Kicker', fontName='FreeSerif', fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, spaceBefore=0, spaceAfter=2,
    alignment=TA_LEFT,
)
STY['caption'] = ParagraphStyle(
    name='Caption', fontName='FreeSerif-Italic', fontSize=9, leading=12,
    textColor=TEXT_MUTED, spaceBefore=4, spaceAfter=14,
    alignment=TA_CENTER,
)
STY['mono'] = ParagraphStyle(
    name='Mono', fontName='DejaVuSans', fontSize=9, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
)
STY['th'] = ParagraphStyle(
    name='TH', fontName='FreeSerif-Bold', fontSize=9.5, leading=12,
    textColor=colors.white, alignment=TA_LEFT,
)
STY['th_c'] = ParagraphStyle(
    name='THC', parent=STY['th'], alignment=TA_CENTER,
)
STY['td'] = ParagraphStyle(
    name='TD', fontName='FreeSerif', fontSize=9.5, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
)
STY['td_c'] = ParagraphStyle(
    name='TDC', parent=STY['td'], alignment=TA_CENTER,
)
STY['td_mono'] = ParagraphStyle(
    name='TDMono', fontName='DejaVuSans', fontSize=8.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER,
)
STY['stat_big'] = ParagraphStyle(
    name='StatBig', fontName='FreeSerif-Bold', fontSize=20, leading=24,
    textColor=ACCENT, alignment=TA_CENTER,
)
STY['stat_lbl'] = ParagraphStyle(
    name='StatLbl', fontName='FreeSerif', fontSize=8.5, leading=11,
    textColor=TEXT_MUTED, alignment=TA_CENTER,
)

# ── TOC styles ────────────────────────────────────────────
STY['toc1'] = ParagraphStyle(
    name='TOC1', fontName='FreeSerif-Bold', fontSize=11, leading=18,
    textColor=TEXT_PRIMARY, leftIndent=0, rightIndent=20, spaceBefore=4,
)
STY['toc2'] = ParagraphStyle(
    name='TOC2', fontName='FreeSerif', fontSize=10, leading=15,
    textColor=TEXT_PRIMARY, leftIndent=18, rightIndent=20,
)
STY['toc_title'] = ParagraphStyle(
    name='TOCTitle', fontName='FreeSerif-Bold', fontSize=18, leading=22,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=12,
)

# ── TocDocTemplate ────────────────────────────────────────
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

def add_heading(text, style, level=0):
    key = 'h_' + hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph(f'<a name="{key}"/>{text}', style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

# ── Header / Footer ───────────────────────────────────────
def draw_header_footer(canvas, doc):
    canvas.saveState()
    # Header: title left, accent rule
    canvas.setFont('FreeSerif', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_M, PAGE_H - 14 * mm, 'NOT GUILTY  ·  Game Design Document v0.2')
    canvas.setFillColor(TEXT_MUTED)
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT_M, PAGE_H - 16 * mm, PAGE_W - RIGHT_M, PAGE_H - 16 * mm)
    # Accent micro line
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(1.5)
    canvas.line(LEFT_M, PAGE_H - 16 * mm, LEFT_M + 30 * mm, PAGE_H - 16 * mm)

    # Footer: page number + author
    canvas.setFont('FreeSerif', 7.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_M, 12 * mm, 'DRAFT · No distribuir')
    page_num = canvas.getPageNumber()
    canvas.drawRightString(PAGE_W - RIGHT_M, 12 * mm, f'Página {page_num}')
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.3)
    canvas.line(LEFT_M, 14 * mm, PAGE_W - RIGHT_M, 14 * mm)
    canvas.restoreState()

# ── Helpers ───────────────────────────────────────────────
def fit_image(path, max_w=None, max_h=None):
    if max_w is None: max_w = AVAIL_W
    if max_h is None: max_h = PAGE_H * 0.40
    pil = PILImage.open(path)
    ow, oh = pil.size
    rw = max_w / ow if ow > max_w else 1.0
    rh = max_h / oh if oh > max_h else 1.0
    r = min(rw, rh)
    return Image(path, width=ow * r, height=oh * r)

def make_table(data, col_ratios, header=True, body_align=None):
    """Crea tabla centrada con header de HEADER_FILL."""
    col_widths = [r * AVAIL_W for r in col_ratios]
    t = Table(data, colWidths=col_widths, hAlign='CENTER', repeatRows=1 if header else 0)
    style = [
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.3, BORDER),
    ]
    if header:
        style += [
            ('BACKGROUND', (0,0), (-1,0), HEADER_FILL),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('TOPPADDING', (0,0), (-1,0), 8),
            ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ]
        # Stripe odd rows (row 1, 3, 5 ...)
        for i in range(1, len(data)):
            if i % 2 == 1:
                style.append(('BACKGROUND', (0,i), (-1,i), TABLE_ROW_EVEN))
            else:
                style.append(('BACKGROUND', (0,i), (-1,i), TABLE_ROW_ODD))
    t.setStyle(TableStyle(style))
    return t

def callout_box(text_html, label='PRINCIPIO'):
    """Caja destacada con borde izquierdo accent."""
    inner = Paragraph(text_html, STY['callout'])
    lbl = Paragraph(f'<b>{label}</b>', ParagraphStyle(
        name='CalloutLbl', fontName='FreeSerif-Bold', fontSize=8,
        textColor=ACCENT, alignment=TA_LEFT, spaceAfter=4,
    ))
    t = Table([[lbl], [inner]], colWidths=[AVAIL_W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('LINEBEFORE', (0,0), (-1,-1), 3, ACCENT),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    return t

def divider():
    return HRFlowable(width='100%', thickness=0.4, color=BORDER,
                       spaceBefore=10, spaceAfter=10)

def safe_keep(elements, max_ratio=0.4):
    max_h = PAGE_H * max_ratio
    total = 0
    for el in elements:
        try:
            _, h = el.wrap(AVAIL_W, PAGE_H)
            total += h
        except Exception:
            total += 50
    if total <= max_h:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)

print("Setup OK — styles and helpers loaded")
print(f"AVAIL_W = {AVAIL_W:.1f}pt")
