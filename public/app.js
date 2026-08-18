(function () {
  "use strict";

  var ICONS = {
    drink: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10l-1 9H8L7 3zm3 11h4v7h-4z"/></svg>',
    food: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h2v8H4V4zm3 0h1.5v5.5A2.5 2.5 0 0 1 6 12v8H4v-8a2.5 2.5 0 0 1-1.5-2.5V4H4zm8.5 0c2.5 0 4.5 2 4.5 6.5V20h-2v-9.5c0-2.3-1-4.5-2.5-4.5S13 8.2 13 10.5V20h-2V10.5C11 6 13 4 15.5 4z"/></svg>',
    beer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h9v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6zm9 2h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-3V8zM7 3h5v2H7V3z"/></svg>',
    wine: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l-1.2 8.2A4.8 4.8 0 0 1 12 16a4.8 4.8 0 0 1-2.8-4.8L8 3zm3 13h2v5h3v2H8v-2h3v-5z"/></svg>',
    soft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l1 4H7l1-4zm-.5 6h9l-1 12h-7l-1-12z"/></svg>',
    coffee: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8zm11 2h2a2 2 0 0 1 0 4h-2v-4zM7 4h8v2H7V4z"/></svg>',
    cocktail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-7 8v6h3v2H8v-2h3v-6L4 5zm4.2 2 3.8 4.3L15.8 7H8.2z"/></svg>',
    shot: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v3l-1 2v9H9V9L8 7V4zm2 2v1.2L11 9v7h2V9l1-1.8V6h-4z"/></svg>',
    special: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 9.5 9H3l5.3 3.8L6.2 19 12 14.8 17.8 19l-2.1-6.2L21 9h-6.5L12 3z"/></svg>',
    breakfast: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7a7 7 0 0 1 14 0v2H5V7zm-1 4h16v2H4v-2zm2 4h12v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2z"/></svg>',
    wrap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12a3 3 0 0 1 0 6H9a1 1 0 0 0 0 2h9v2H9a3 3 0 0 1 0-6h9a1 1 0 0 0 0-2H6V6z"/></svg>',
    salad: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4c3 0 6 2.5 6 6H6c0-3.5 3-6 6-6zm-8 8h16l-1.5 7H5.5L4 12z"/></svg>',
    fries: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h2v5H8V3zm3 1h2v4h-2V4zm3-1h2v5h-2V3zM6 9h12l-1.5 12h-9L6 9z"/></svg>',
    burger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0H6zm-1 2h14v3H5v-3zm0 5h14v3a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3z"/></svg>',
    pasta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v2H4V8zm2 4h12l-1 9H7l-1-9zm5-8h2v4h-2V4z"/></svg>',
    pizza: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 21h18L12 3zm0 5.5 5.8 11H6.2L12 8.5zM11 13h2v2h-2v-2z"/></svg>',
    sandwich: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v3H4V7zm0 5h16v2H4v-2zm0 4h16v3H4v-3z"/></svg>',
    spirits: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 5h-4L9 3zm1 7h4v9a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-9z"/></svg>',
    raki: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M8.5 2h7v16.8A2.2 2.2 0 0 1 13.3 21h-2.6A2.2 2.2 0 0 1 8.5 18.8V2zm2.2 2.2h2.6v7.4h-2.6V4.2z"/></svg>',
    rocks: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M4 7h16v10.8A2.2 2.2 0 0 1 17.8 20H6.2A2.2 2.2 0 0 1 4 17.8V7zm2.2 2.2h11.6v4.8H6.2V9.2z"/></svg>',
    highball: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M6.4 2h11.2v16.8A2.2 2.2 0 0 1 15.4 21H8.6A2.2 2.2 0 0 1 6.4 18.8V2zm2.2 2.2h6.8v7.4H8.6V4.2z"/></svg>'
  };

  var state = {
    data: null,
    path: []
  };

  function iconMarkup(name) {
    return ICONS[name] || ICONS.food;
  }

  function formatPrice(price, currency) {
    if (price === undefined || price === null || price === "") return "";
    var value = Number(price).toFixed(2).replace(/\.00$/, "");
    return value + " " + (currency || "₺");
  }

  function parseHash() {
    var hash = window.location.hash.replace(/^#/, "");
    if (!hash) return [];
    return hash.split("/").filter(Boolean);
  }

  function setHash(ids) {
    var next = ids.length ? "#" + ids.join("/") : "";
    if ((window.location.hash || "") === next) {
      state.path = ids;
      render();
      return;
    }
    if (!ids.length) {
      history.pushState(null, "", window.location.pathname + window.location.search);
      state.path = [];
      render();
      return;
    }
    window.location.hash = ids.join("/");
  }

  function findNode(ids) {
    var nodes = (state.data && state.data.menu) || [];
    var current = { children: nodes, name: (state.data.business && state.data.business.name) || "Menü" };
    var trail = [current];

    for (var i = 0; i < ids.length; i += 1) {
      var match = (current.children || []).find(function (child) {
        return child.id === ids[i];
      });
      if (!match) break;
      current = match;
      trail.push(current);
    }

    return { node: current, trail: trail };
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

  function cardMeta(node) {
    if (node.children && node.children.length) {
      return node.children.length + " kategori";
    }
    if (node.products && node.products.length) {
      return node.products.length + " ürün";
    }
    return "";
  }

  function createCardEl(node, ids) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "menu-card";
    if (node.lang) card.lang = node.lang;

    var thumb = document.createElement("span");
    thumb.className = "menu-card-thumb";
    thumb.innerHTML = iconMarkup(node.icon);
    card.appendChild(thumb);

    var copy = document.createElement("span");
    copy.className = "menu-card-copy";

    var label = document.createElement("span");
    label.className = "menu-card-label";
    label.textContent = node.name;
    copy.appendChild(label);

    var metaText = cardMeta(node);
    if (metaText) {
      var meta = document.createElement("span");
      meta.className = "menu-card-meta";
      meta.textContent = metaText;
      copy.appendChild(meta);
    }

    card.appendChild(copy);

    card.addEventListener("click", function () {
      setHash(ids.concat(node.id));
    });

    return card;
  }

  function renderCards(nodes, ids) {
    var grid = document.createElement("div");
    grid.className = "menu-card-grid";
    (nodes || []).forEach(function (node) {
      grid.appendChild(createCardEl(node, ids));
    });
    return grid;
  }

  function renderProducts(node, currency) {
    var wrap = document.createElement("section");
    wrap.className = "category";

    if (node.note) {
      var note = document.createElement("p");
      note.className = "category-note";
      note.textContent = node.note;
      wrap.appendChild(note);
    }

    var list = document.createElement("div");
    list.className = "item-list";
    (node.products || []).forEach(function (item) {
      list.appendChild(createItemEl(item, currency));
    });
    wrap.appendChild(list);
    return wrap;
  }

  function renderNav(trail) {
    var navEl = document.getElementById("step-nav");
    navEl.innerHTML = "";

    if (trail.length <= 1) {
      navEl.hidden = true;
      return;
    }

    navEl.hidden = false;

    var inner = document.createElement("div");
    inner.className = "step-nav-inner";

    var back = document.createElement("button");
    back.type = "button";
    back.className = "step-back";
    back.setAttribute("aria-label", "Geri");
    back.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg><span>Geri</span>';
    back.addEventListener("click", function () {
      setHash(state.path.slice(0, -1));
    });
    inner.appendChild(back);

    var title = document.createElement("h2");
    title.className = "step-title";
    var current = trail[trail.length - 1];
    title.textContent = current.name || "";
    if (current.lang) title.lang = current.lang;
    inner.appendChild(title);

    navEl.appendChild(inner);
  }

  function syncedPath(trail) {
    return trail.slice(1).map(function (node) {
      return node.id;
    }).filter(Boolean);
  }

  function render() {
    var business = state.data.business || {};
    var currency = business.currency;
    var resolved = findNode(state.path);
    var node = resolved.node;
    var contentEl = document.getElementById("menu-content");
    var validPath = syncedPath(resolved.trail);

    if (validPath.join("/") !== state.path.join("/")) {
      state.path = validPath;
      history.replaceState(
        null,
        "",
        window.location.pathname +
          window.location.search +
          (validPath.length ? "#" + validPath.join("/") : "")
      );
    }

    renderNav(resolved.trail);
    contentEl.innerHTML = "";

    if (node.children && node.children.length) {
      contentEl.appendChild(renderCards(node.children, state.path));
      return;
    }

    if (node.products && node.products.length) {
      contentEl.appendChild(renderProducts(node, currency));
      return;
    }

    contentEl.innerHTML = '<p class="empty">Bu bölümde henüz ürün yok.</p>';
  }

  function applyBusiness(business) {
    var nameEl = document.getElementById("business-name");
    var taglineEl = document.getElementById("business-tagline");
    nameEl.textContent = business.name || "Menü";
    nameEl.classList.remove("is-loading");
    taglineEl.textContent = business.tagline || "";
    if (business.lang) nameEl.lang = business.lang;
    else nameEl.removeAttribute("lang");
  }

  function renderError() {
    document.getElementById("menu-content").innerHTML =
      '<p class="error">Menü yüklenemedi. Lütfen daha sonra tekrar deneyin.</p>';
  }

  function resolveMenuUrl() {
    var path = window.location.pathname;
    if (path.charAt(path.length - 1) !== "/") path += "/";
    return path + "menu.json";
  }

  function start(data) {
    state.data = data;
    applyBusiness(data.business || {});
    state.path = parseHash();
    render();
  }

  function applyPathFromLocation() {
    if (!state.data) return;
    var next = parseHash();
    if (next.join("/") === state.path.join("/")) return;
    state.path = next;
    render();
  }

  window.addEventListener("hashchange", applyPathFromLocation);
  window.addEventListener("popstate", applyPathFromLocation);

  fetch(resolveMenuUrl(), { cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("menu.json alınamadı: " + response.status);
      return response.json();
    })
    .then(start)
    .catch(function (err) {
      console.error(err);
      renderError();
    });
})();
