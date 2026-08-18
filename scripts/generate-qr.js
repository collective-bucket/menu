#!/usr/bin/env node
"use strict";

/**
 * Verilen bir URL için QR kod üretir (PNG + SVG).
 * Kullanım:
 *   node scripts/generate-qr.js <menu-url> [çıktı-adı]
 *   veya
 *   npm run generate-qr -- <menu-url> [çıktı-adı]
 *
 * [çıktı-adı] verilmezse "qr" kullanılır (public/assets/qr.png|svg).
 * Birden fazla işletme/menü varsa her biri için farklı bir isim verin,
 * örn: npm run generate-qr -- https://menu.collectivebucket.com/natural-life/ natural-life-qr
 */

const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

const url = process.argv[2];
const outName = process.argv[3] || "qr";

if (!url) {
  console.error("Kullanım: node scripts/generate-qr.js <menu-url> [çıktı-adı]");
  console.error("Örnek:   node scripts/generate-qr.js https://ornek-proje.web.app");
  console.error("Örnek:   node scripts/generate-qr.js https://ornek-proje.web.app/natural-life/ natural-life-qr");
  process.exit(1);
}

const outDir = path.join(__dirname, "..", "public", "assets");
const pngPath = path.join(outDir, outName + ".png");
const svgPath = path.join(outDir, outName + ".svg");

fs.mkdirSync(outDir, { recursive: true });

const options = {
  errorCorrectionLevel: "M",
  margin: 2,
  // Baskıya uygun yüksek çözünürlük (indirilen QR kodun keskin görünmesi için).
  // Ekranda küçük gösterilse de indirme linki bu dosyaya işaret eder.
  width: 1200,
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
  })
  .catch((err) => {
    console.error("QR kod üretilirken hata oluştu:", err);
    process.exit(1);
  });
