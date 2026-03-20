const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("ÇALIŞIYOR 🚀");
});

app.get("/m3u", (req, res) => {
  res.send("#EXTM3U\n#EXTINF:-1,Test\nhttps://test.com/stream.m3u8");
});

app.listen(PORT, () => {
  console.log("Server çalışıyor: " + PORT);
});
