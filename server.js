const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/", (req, res) => {
  res.send("IPTV SYSTEM AKTİF");
});

app.get("/m3u", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://boru-pc-tv.vercel.app/", {
      waitUntil: "networkidle2"
    });

    // TÜM m3u8 linkleri yakala
    const streams = await page.evaluate(() => {
      const links = [];

      document.querySelectorAll("video").forEach(v => {
        if (v.src) links.push(v.src);
      });

      return links;
    });

    let m3u = "#EXTM3U\n";

    streams.forEach((s, i) => {
      m3u += `#EXTINF:-1, Kanal ${i+1}\n`;
      m3u += s + "\n";
    });

    await browser.close();

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.send(m3u);

  } catch (err) {
    res.send("HATA: " + err.toString());
  }
});

app.listen(3000, () => {
  console.log("Server çalışıyor");
});