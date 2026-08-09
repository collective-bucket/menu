#!/usr/bin/env node
"use strict";

/**
 * Verilen bir URL için QR kod üretir (PNG + SVG).
 * Kullanım:
 *   node scripts/generate-qr.js https://<proje-id>.web.app
 *   veya
 *   npm run generate-qr -- https://<proje-id>.web.app
 */

const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const url = process.argv[2];

if (!url) {
  console.error("Kullanım: node scripts/generate-qr.js <menu-url>");
  console.error("Örnek:   node scripts/generate-qr.js https://ornek-proje.web.app");
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "public", "assets");
const pngPath = path.join(outDir, "qr.png");
const svgPath = path.join(outDir, "qr.svg");

fs.mkdirSync(outDir, { recursive: true });

const options = {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 512,
  color: {
    dark: "#2b2320",
    light: "#ffffffff"
  }
};

Promise.all([
  QRCode.toFile(pngPath, url, options),
  QRCode.toFile(svgPath, url, { ...options, type: "svg" })
])
  .then(() => {
    console.log("QR kod üretildi:");
    console.log("  - " + pngPath);
    console.log("  - " + svgPath);
    console.log("Hedef URL: " + url);
    console.log("\nKontrol için public/qr.html sayfasını açabilirsiniz.");
  })
  .catch((err) => {
    console.error("QR kod üretilirken hata oluştu:", err);
    process.exit(1);
  });
