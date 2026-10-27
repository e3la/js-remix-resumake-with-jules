import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_selector(".editor-sidebar")

        # Capture initial accordion state (Basics open)
        await page.screenshot(path="/home/jules/verification/accordion_initial.png")

        # Click Work accordion header
        await page.click("#section-work .accordion-header")
        await page.wait_for_selector("#work-items-container")

        # Capture expanded Work section state
        await page.screenshot(path="/home/jules/verification/accordion_work_open.png")

        # Test Print / Page Setup button (standalone print window)
        async with page.expect_popup() as popup_info:
            await page.click("#btn-print-view")
        print_page = await popup_info.value
        await print_page.wait_for_selector(".standalone-wrapper")
        await print_page.screenshot(path="/home/jules/verification/standalone_print_view.png")

        print("Verification completed successfully!")
        await browser.close()

asyncio.run(run())
