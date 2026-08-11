(function () {
  "use strict";

  function createBusinessCard(biz) {
    var card = document.createElement("a");
    card.className = "business-card";
    card.href = "/" + biz.slug + "/";

    var qrImg = document.createElement("img");
    qrImg.src = "/assets/" + biz.slug + "-qr.png";
    qrImg.alt = biz.name + " menüsüne giden QR kod";
    qrImg.loading = "lazy";
    card.appendChild(qrImg);

    var nameEl = document.createElement("h2");
    nameEl.textContent = biz.name;
    card.appendChild(nameEl);

    if (biz.tagline) {
      var taglineEl = document.createElement("p");
      taglineEl.textContent = biz.tagline;
      card.appendChild(taglineEl);
    }

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
