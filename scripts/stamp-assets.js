#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");

var version = (
  process.env.GITHUB_SHA ||
  process.env.ASSET_VERSION ||
  Date.now().toString(36)
).slice(0, 12);

var publicDir = path.join(__dirname, "..", "public");
var files = ["index.html", "print.html"];

files.forEach(function (file) {
  var filePath = path.join(publicDir, file);
  var html = fs.readFileSync(filePath, "utf8");
  // Stamp local asset references (src/href ending in .js, .css, .svg, etc.)
  var next = html
    .replace(/((?:src|href)=["'])([^"']*\/assets\/[^"'?\s]+)\?v=[^"'&\s]*/g, "$1$2?v=" + version)
    .replace(/((?:src|href)=["'])([^"']*\/assets\/[^"'?\s]+)(?=["'])/g, "$1$2?v=" + version)
    .replace(/(https:\/\/collectivebucket\.com\/assets\/shell\.(?:css|js))\?v=[^"'&\s]*/g, "$1?v=" + version)
    .replace(/(https:\/\/collectivebucket\.com\/assets\/shell\.(?:css|js))(?=["'])/g, "$1?v=" + version)
    .replace(/(["'])(app\.js|hub\.js|print\.js|styles\.css|theme\.css|print\.css)\?v=[^"'&\s]*/g, "$1$2?v=" + version)
    .replace(/(["'])(app\.js|hub\.js|print\.js|styles\.css|theme\.css|print\.css)(?=["'])/g, "$1$2?v=" + version);
  fs.writeFileSync(filePath, next);
  console.log("stamped " + file + " -> v=" + version);
});
