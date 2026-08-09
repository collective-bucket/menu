(function () {
  "use strict";

  function slugify(text) {
    return text
      .toLocaleLowerCase("tr-TR")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function formatPrice(price, currency) {
    var value = Number(price).toFixed(2).replace(/\.00$/, "");
    return value + " " + (currency || "TL");
  }

  function renderMenu(data) {
    var businessNameEl = document.getElementById("business-name");
    var taglineEl = document.getElementById("business-tagline");
    var navEl = document.getElementById("category-nav");
    var contentEl = document.getElementById("menu-content");

    var business = data.business || {};
    businessNameEl.textContent = business.name || "Menü";
    taglineEl.textContent = business.tagline || "";

    navEl.innerHTML = "";
    contentEl.innerHTML = "";

    var categories = data.categories || [];

    categories.forEach(function (category) {
      var id = slugify(category.name);

      var navLink = document.createElement("a");
      navLink.href = "#" + id;
      navLink.textContent = category.name;
      navEl.appendChild(navLink);

      var section = document.createElement("section");
      section.className = "category";
      section.id = id;

      var heading = document.createElement("h2");
      heading.textContent = category.name;
      section.appendChild(heading);

      (category.items || []).forEach(function (item) {
        var itemEl = document.createElement("div");
        itemEl.className = "item";

        var infoEl = document.createElement("div");
        infoEl.className = "item-info";

        var nameEl = document.createElement("h3");
        nameEl.textContent = item.name;
        infoEl.appendChild(nameEl);

        if (item.description) {
          var descEl = document.createElement("p");
          descEl.textContent = item.description;
          infoEl.appendChild(descEl);
        }

        var priceEl = document.createElement("span");
        priceEl.className = "item-price";
        priceEl.textContent = formatPrice(item.price, business.currency);

        itemEl.appendChild(infoEl);
        itemEl.appendChild(priceEl);
        section.appendChild(itemEl);
      });

      contentEl.appendChild(section);
    });
  }

  function renderError() {
    var contentEl = document.getElementById("menu-content");
    contentEl.innerHTML = '<p class="error">Menü yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>';
  }

  fetch("menu.json", { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("menu.json alınamadı: " + response.status);
      }
      return response.json();
    })
    .then(renderMenu)
    .catch(function (err) {
      console.error(err);
      renderError();
    });
})();
