import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.goto('file:///D:/IQ-Admin/_editor_harness.html');
await new Promise(r => setTimeout(r, 500));

console.log('AFTER MOUNT:', JSON.stringify(await page.evaluate(() => window.getState()), null, 2));

await page.evaluate(() => window.runUpload());
await new Promise(r => setTimeout(r, 1500));

const state = await page.evaluate(() => window.getState());
console.log('AFTER UPLOAD:', JSON.stringify(state, null, 2));

// Check if the image actually loaded (naturalWidth > 0) in the live DOM
const imgInfo = await page.evaluate(() => {
    const img = document.querySelector('.ql-editor img');
    return img ? { src: img.getAttribute('src'), naturalWidth: img.naturalWidth, complete: img.complete } : null;
});
console.log('LIVE IMG:', JSON.stringify(imgInfo));

await browser.close();
