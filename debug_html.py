import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Page error: {err}"))

        await page.goto("http://localhost:8000/index.html")
        await page.wait_for_timeout(1000)
        content = await page.content()
        print("Body innerHTML sample:")
        print(content[:1500])
        await browser.close()

asyncio.run(run())
