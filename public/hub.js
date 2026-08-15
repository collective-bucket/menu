(function () {
  "use strict";

  function createBusinessCard(biz) {
    // Kart bir <div>'dir; içinde menüye giden bir link ve QR indirme linki
    // ayrı ayrı yaşar (bir <a> içinde başka bir <a> geçersiz HTML olurdu).
    var card = document.createElement("div");
    card.className = "business-card";

    var link = document.createElement("a");
    link.className = "business-card-link";
    link.href = "/" + biz.slug + "/";

    var qrImg = document.createElement("img");
    qrImg.src = "/assets/" + biz.slug + "-qr.png";
    qrImg.alt = biz.name + " menüsüne giden QR kod";
    qrImg.loading = "lazy";
    link.appendChild(qrImg);

    var nameEl = document.createElement("h2");
    nameEl.textContent = biz.name;
    link.appendChild(nameEl);

    if (biz.tagline) {
      var taglineEl = document.createElement("p");
      taglineEl.textContent = biz.tagline;
      link.appendChild(taglineEl);
    }

    card.appendChild(link);

    var downloadLink = document.createElement("a");
    downloadLink.className = "qr-download";
    downloadLink.href = "/assets/" + biz.slug + "-qr.png";
    downloadLink.download = biz.slug + "-qr.png";
    downloadLink.textContent = "QR kodu indir ↓";
    card.appendChild(downloadLink);

    return card;
  }

  function renderBusinesses(data) {
    var listEl = document.getElementById("business-list");
    listEl.innerHTML = "";
    (data.businesses || []).forEach(function (biz) {
      listEl.appendChild(createBusinessCard(biz));
    });
  }

  function renderError() {
    var listEl = document.getElementById("business-list");
    listEl.innerHTML = '<p class="error">İşletme listesi yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>';
  }

  fetch("businesses.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("businesses.json alınamadı: " + response.status);
      }
      return response.json();
    })
    .then(renderBusinesses)
    .catch(function (err) {
      console.error(err);
      renderError();
    });
})();
