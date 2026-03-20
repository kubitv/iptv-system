const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("IPTV PRO AKTİF 🚀");
});

app.get("/m3u", async (req, res) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();

    const streams = new Set();

    page.on("response", (response) => {
      try {
        const url = response.url();
        if (url.includes(".m3u8")) {
          streams.add(url);
        }
      } catch {}
    });

    await page.goto("https://boru-pc-tv.vercel.app/", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // biraz bekle
    await new Promise(r => setTimeout(r, 7000));

    let m3u = "#EXTM3U\n";

    let i = 1;
    streams.forEach((s) => {
      m3u += `#EXTINF:-1 group-title="Canlı",Kanal ${i}\n`;
      m3u += s + "\n";
      i++;
    });

    await browser.close();

    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(m3u);

  } catch (err) {
    if (browser) await browser.close();
    res.status(500).send("HATA: " + err.toString());
  }
});

app.listen(PORT, () => {
  console.log("Server çalışıyor: " + PORT);
});
