"""
Renderiza phases_diagram.html como PNG usando Playwright.
Salida: /home/z/my-project/scripts/phases_diagram.png
"""
import asyncio
from playwright.async_api import async_playwright

HTML_PATH = '/home/z/my-project/scripts/phases_diagram.html'
OUT_PATH = '/home/z/my-project/scripts/phases_diagram.png'

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={'width': 1260, 'height': 600},
                                         device_scale_factor=2)
        page = await ctx.new_page()
        await page.goto(f'file://{HTML_PATH}')
        await page.wait_for_load_state('networkidle')
        # Esperar fuentes
        await page.evaluate('document.fonts.ready')
        await page.wait_for_timeout(500)
        # Screenshot del body completo
        await page.screenshot(path=OUT_PATH, full_page=True, omit_background=False)
        await browser.close()
    print(f"OK: {OUT_PATH}")

asyncio.run(main())
