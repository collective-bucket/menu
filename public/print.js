(function () {
  "use strict";

  function qrSources(slug) {
    return [
      "/assets/" + slug + "-qr.svg",
      "/assets/" + slug + "-qr.png"
    ];
  }

  function createImageWithFallback(biz) {
    var img = document.createElement("img");
    var sources = qrSources(biz.slug);
    var index = 0;

    img.className = "qr-image";
    img.alt = biz.name + " menüsüne giden QR kod";
    img.src = sources[index];

    img.addEventListener("error", function handleError() {
      index += 1;
      if (index < sources.length) {
        img.src = sources[index];
        return;
      }

      var fallback = document.createElement("div");
      fallback.className = "qr-missing";
      fallback.textContent =
        biz.name + " için QR görseli bulunamadı. Baskıdan önce /assets/" +
        biz.slug + "-qr.svg veya .png dosyasını ekleyin.";
      img.replaceWith(fallback);
    });

    return img;
  }

  function createPrintPage(biz, template) {
    var fragment = template.content.cloneNode(true);
    var page = fragment.querySelector(".print-page");
    var stage = fragment.querySelector(".qr-stage");
    var left = fragment.querySelector(".caption-left");

    page.dataset.slug = biz.slug;
    stage.replaceChildren(createImageWithFallback(biz));
    left.textContent = biz.name + " - Menü";
    return fragment;
  }

  function renderBusinesses(data) {
    var list = document.getElementById("print-list");
    var template = document.getElementById("print-card-template");
    var businesses = (data && data.businesses) || [];

    list.innerHTML = "";

    if (!businesses.length) {
      list.innerHTML = '<article class="print-state"><p>Yazdırılacak işletme bulunamadı.</p></article>';
      return;
    }

    businesses.forEach(function (biz) {
      list.appendChild(createPrintPage(biz, template));
    });
  }

  function renderError(message) {
    var list = document.getElementById("print-list");
    list.innerHTML =
      '<article class="print-state"><p>' +
      message +
      "</p></article>";
  }

  fetch("/businesses.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("businesses.json alınamadı: " + response.status);
      }
      return response.json();
    })
    .then(renderBusinesses)
    .catch(function (error) {
      console.error(error);
      renderError("İşletme listesi yüklenemedi. Lütfen daha sonra tekrar deneyin.");
    });
})();
