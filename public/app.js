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
    if (price === undefined || price === null || price === "") return "";
    var value = Number(price).toFixed(2).replace(/\.00$/, "");
    return value + " " + (currency || "TL");
  }

  function createItemEl(item, currency) {
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

    itemEl.appendChild(infoEl);

    var priceText = formatPrice(item.price, currency);
    if (priceText) {
      var priceEl = document.createElement("span");
      priceEl.className = "item-price";
      priceEl.textContent = priceText;
      itemEl.appendChild(priceEl);
    }

    return itemEl;
  }

  function createItemsListEl(items, currency) {
    var listEl = document.createElement("div");
    listEl.className = "item-list";
    (items || []).forEach(function (item) {
      listEl.appendChild(createItemEl(item, currency));
    });
    return listEl;
  }

  function renderDailySpecials(specials) {
    if (!specials || !specials.items || !specials.items.length) return null;

    var box = document.createElement("section");
    box.className = "specials";

    var heading = document.createElement("h2");
    heading.textContent = "⭐ " + (specials.title || "Günün Spesiyalleri");
    box.appendChild(heading);

    var list = document.createElement("ul");
    specials.items.forEach(function (name) {
      var li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
    box.appendChild(list);

    return box;
  }

  function renderMenu(data) {
    var businessNameEl = document.getElementById("business-name");
    var taglineEl = document.getElementById("business-tagline");
    var navEl = document.getElementById("category-nav");
    var contentEl = document.getElementById("menu-content");

    var business = data.business || {};
    var currency = business.currency;
    businessNameEl.textContent = business.name || "Menü";
    taglineEl.textContent = business.tagline || "";
    // CSS'te text-transform: uppercase, sayfanın lang="tr" olması yüzünden
    // küçük "i"yi Türkçe kuralına göre noktalı "İ"ye çevirir. İşletme adı
    // yabancı bir kelime/isimse (örn. "Natural Life"), menu.json'da
    // business.lang: "en" belirtilerek bu davranış o eleman için devre dışı
    // bırakılabilir ve "i" doğru şekilde noktasız büyür.
    if (business.lang) {
      businessNameEl.lang = business.lang;
    } else {
      businessNameEl.removeAttribute("lang");
    }

    navEl.innerHTML = "";
    contentEl.innerHTML = "";

    var specialsEl = renderDailySpecials(data.dailySpecials);
    if (specialsEl) {
      contentEl.appendChild(specialsEl);
    }

    var categories = data.categories || [];

    categories.forEach(function (category) {
      var id = slugify(category.name);
      var label = (category.icon ? category.icon + " " : "") + category.name;

      var navLink = document.createElement("a");
      navLink.href = "#" + id;
      navLink.textContent = label;
      navEl.appendChild(navLink);

      var section = document.createElement("section");
      section.className = "category";
      section.id = id;

      var heading = document.createElement("h2");
      heading.textContent = label;
      section.appendChild(heading);

      if (category.note) {
        var categoryNote = document.createElement("p");
        categoryNote.className = "category-note";
        categoryNote.textContent = category.note;
        section.appendChild(categoryNote);
      }

      if (category.groups && category.groups.length) {
        category.groups.forEach(function (group) {
          var groupHeading = document.createElement("h3");
          groupHeading.textContent = group.name;
          // Aynı İ/I düzeltmesi grup başlıkları için de geçerli (örn.
          // "International", "Special" gibi yabancı grup adları).
          if (group.lang) {
            groupHeading.lang = group.lang;
          }
          section.appendChild(groupHeading);

          if (group.note) {
            var groupNote = document.createElement("p");
            groupNote.className = "category-note";
            groupNote.textContent = group.note;
            section.appendChild(groupNote);
          }

          section.appendChild(createItemsListEl(group.items, currency));
        });
      } else {
        section.appendChild(createItemsListEl(category.items, currency));
      }

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
