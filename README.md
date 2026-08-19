# Menu

Collective Bucket altında QR ile açılan, JSON tabanlı dijital menü demosu.

## Özellikler

- Hub sayfasında işletme listesi ve QR kodu indirme
- 3 adımlı menü akışı: üst kategori → alt kategori → ürün listesi
- Her işletme için ayrı tema (`theme.css`)
- Menü içeriği yalnızca `menu.json` ile güncellenir

## Adresler

- Canlı: `https://menu.collectivebucket.com`
- Hosting site: `cbucket-menu`
- Örnek işletmeler: `/ya-basta/`, `/natural-life/`
- Şema örneği: `public/menu-template.json`

## Yerel

```bash
npm install
npm run serve
npm run generate-qr -- https://menu.collectivebucket.com/<slug>/ <slug>-qr
```

## Veri

Statik `menu.json` ağacı (`menu[]`, `children` veya `products`). Veritabanı yok.
Yeni işletme ekleme adımları için [main/CONTRIBUTING.md](https://github.com/collective-bucket/main/blob/main/CONTRIBUTING.md).
