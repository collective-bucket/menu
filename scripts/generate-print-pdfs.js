#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");
var PDFDocument = require("pdfkit");
var SVGtoPDF = require("svg-to-pdfkit");

var rootDir = path.join(__dirname, "..");
var publicDir = path.join(rootDir, "public");
var assetsDir = path.join(publicDir, "assets");
var businessesPath = path.join(publicDir, "businesses.json");
var logoPath = path.join(assetsDir, "collective-bucket-logo.png");

var page = {
  width: 595.28,
  height: 841.89,
  padding: 52
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Gerekli dosya bulunamadı: " + filePath);
  }
}

function qrSvgPath(slug) {
  return path.join(assetsDir, slug + "-qr.svg");
}

function qrPdfPath(slug) {
  return path.join(assetsDir, slug + "-qr.pdf");
}

function drawCenteredQr(doc, svgMarkup) {
  var qrSize = 374;
  var framePadding = 26;
  var frameSize = qrSize + framePadding * 2;
  var frameX = (page.width - frameSize) / 2;
  var frameY = 150;
  var qrX = frameX + framePadding;
  var qrY = frameY + framePadding;

  doc
    .roundedRect(frameX, frameY, frameSize, frameSize, 14)
    .lineWidth(1)
    .strokeColor("#dfe5e1")
    .stroke();

  SVGtoPDF(doc, svgMarkup, qrX, qrY, {
    width: qrSize,
    height: qrSize,
    preserveAspectRatio: "xMidYMid meet"
  });
}

function drawCaption(doc, businessName) {
  var y = page.height - 96;
  var leftX = page.padding;
  var rightWidth = 190;
  var rightX = page.width - page.padding - rightWidth;

  doc
    .moveTo(page.padding, y - 22)
    .lineTo(page.width - page.padding, y - 22)
    .lineWidth(1)
    .strokeColor("#dfe5e1")
    .stroke();

  doc
    .fillColor("#191c1a")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(businessName + " - Menü", leftX, y, {
      width: page.width - (page.padding * 2) - rightWidth - 16,
      align: "left"
    });

  doc.image(logoPath, rightX, y + 1, { width: 14, height: 14 });
  doc
    .fillColor("#565c59")
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Collective Bucket", rightX + 22, y, {
      width: rightWidth - 22,
      align: "left"
    });
}

function generateBusinessPdf(biz) {
  var svgPath = qrSvgPath(biz.slug);
  var pdfPath = qrPdfPath(biz.slug);
  var svgMarkup = fs.readFileSync(svgPath, "utf8");

  var doc = new PDFDocument({
    autoFirstPage: false,
    size: [page.width, page.height],
    margin: 0,
    info: {
      Title: biz.name + " Menü QR",
      Author: "Collective Bucket"
    }
  });

  doc.addPage();
  doc.rect(0, 0, page.width, page.height).fill("#ffffff");
  drawCenteredQr(doc, svgMarkup);
  drawCaption(doc, biz.name);

  return new Promise(function (resolve, reject) {
    var stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.end();
    stream.on("finish", function () {
      console.log("PDF üretildi: " + pdfPath);
      resolve();
    });
    stream.on("error", reject);
  });
}

async function main() {
  ensureFile(businessesPath);
  ensureFile(logoPath);

  var data = readJson(businessesPath);
  var businesses = data.businesses || [];

  businesses.forEach(function (biz) {
    ensureFile(qrSvgPath(biz.slug));
  });

  for (var i = 0; i < businesses.length; i += 1) {
    await generateBusinessPdf(businesses[i]);
  }
}

main().catch(function (error) {
  console.error("PDF üretimi başarısız:", error.message || error);
  process.exit(1);
});
