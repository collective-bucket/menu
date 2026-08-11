# QR Menü — 1. Etap (Statik Demo)

Kamera ile okutulunca doğrudan bir menü sayfası açan, tamamen statik ve
ücretsiz bir QR menü demosu. Bu etapta veritabanı, backend veya yönetim
paneli yoktur; her işletmenin menüsü kendi `menu.json` dosyasında sabittir.

Bu repo, **collectivebucket.com** altında yayınlanacak demo uygulamalarından
biridir ve `menu.collectivebucket.com` adresinde çalışacak şekilde
yapılandırılmıştır. Aşağıdaki "Domain, GitHub ve CI/CD Kurulumu" bölümü, bu
markanın diğer repoları (auth, blog, board...) için de şablon olarak
kullanılabilir.

Site, **birden çok işletmeyi** aynı anda barındırır (multi-tenant, DB'siz):
kök adres (`/`) her işletmeye QR koduyla ulaşılabilen bir "hub" sayfasıdır,
her işletmenin kendi menüsü `/<işletme-slug>/` altında yaşar. Bkz. "Yeni bir
işletme/menü ekleme" bölümü.

## İçerik

- `public/index.html`, `public/hub.js` — kök **hub sayfası**: kısa bir
  açıklama ve `businesses.json`'dan okunan işletmelerin QR kodu + kartlarını
  gösterir.
- `public/businesses.json` — hub sayfasında listelenen işletmelerin listesi
  (`slug`, `name`, `tagline`). Yeni işletme eklerken buraya bir kayıt eklenir.
- `public/styles.css`, `public/app.js` — tüm işletme menü sayfaları arasında
  **paylaşılan** stil ve mantık. `app.js`, ilgili klasördeki `menu.json`'u
  okuyup sayfayı oluşturur.
- `public/ya-basta/`, `public/natural-life/` — her işletmenin kendi klasörü:
  `index.html` (menü sayfası), `menu.json` (kategoriler, ürünler, fiyatlar),
  `qr.html` ("Bizi Tarayın" sayfası). Sırasıyla `menu.collectivebucket.com/ya-basta/`
  ve `.../natural-life/` adreslerinde yayınlanır. Bkz. "Yeni bir işletme/menü
  ekleme" bölümü.
- `scripts/generate-qr.js` — verilen bir URL (ve isteğe bağlı çıktı adı) için
  `public/assets/<ad>.png` ve `.svg` üretir.
- `firebase.json`, `.firebaserc` — Firebase Hosting yapılandırması
  (`collective-bucket-apps` projesi, `menu` target'ı, `cb-menu` site'ı).
- `.github/workflows/` — main'e push'ta otomatik deploy ve PR'larda otomatik
  preview linki üreten GitHub Actions workflow'ları.

## Ön Koşullar

- Node.js (v18+ önerilir) ve npm.
- `admin@collectivebucket.com` Google hesabı (Firebase/Google Cloud için).
- `admin@collectivebucket.com` ile açılan GitHub hesabı.
- [Firebase Console](https://console.firebase.google.com/) üzerinde
  **Spark (ücretsiz) plan**. Spark plan kredi kartı istemez ve bu demo için
  gereken tüm limitleri (10 GB depolama, günlük 360 MB trafik) fazlasıyla
  karşılar.

## Kurulum

```bash
npm install
```

`firebase-tools` ve `qrcode` paketleri proje içine (devDependency olarak)
kurulur; global kurulum gerekmez, `npx` üzerinden çalıştırılır.

---

## Domain, GitHub ve CI/CD Kurulumu (collectivebucket.com)

collectivebucket.com altında büyüyecek bir uygulama ailesi (menu, auth, blog,
board...) planlandığı için mimari şu şekilde kurulur:

- **Tek bir Firebase projesi**: `collective-bucket-apps` — tüm demo
  uygulamaları bu proje altında, ayrı "Hosting site"ler olarak barınır. Bu,
  her repo için ayrı proje açmaktan (kota riski, dağınık konsol yönetimi)
  daha sürdürülebilirdir.
- **Her repo kendi site'ına sahiptir**: bu repo için site adı `cb-menu`,
  target adı `menu`. Gelecekteki repolar için örnek: `cb-auth` / `auth`,
  `cb-blog` / `blog`, `cb-board` / `board`.
- **Her site kendi subdomain'ine bağlanır**: `cb-menu` → `menu.collectivebucket.com`.
- **GitHub Organization**: tüm demo repoları **`collective-bucket`** adlı
  GitHub Organization'da yaşar. Bu organizasyonun sahibi, `admin@collectivebucket.com`
  ile ilişkili **`collective-bucket-admin`** adlı ayrı bir kişisel hesaptır
  (organizasyonla aynı isimde çakışma olmasın diye kişisel hesap bilinçli
  olarak farklı adlandırıldı; günlük kullanımda görünür olan tek isim
  organizasyon adıdır).

### 1. Firebase projesini oluşturma

```bash
npx firebase login
# admin@collectivebucket.com hesabıyla giriş yapın

npx firebase projects:create collective-bucket-apps --display-name "Collective Bucket Apps"
```

> Proje zaten mevcutsa (`npx firebase projects:list` ile kontrol edin) bu
> adımı atlayıp doğrudan 2. adıma geçebilirsiniz. **Önemli:** Firebase proje
> ID'leri Google Cloud tarafından bazen istediğiniz isimden farklı üretilir
> (örn. `collectivebucket-apps` yerine `collective-bucket-apps`). Gerçek
> proje ID'sini `npx firebase projects:list` ile teyit edip bu repodaki
> `.firebaserc` ve `.github/workflows/*.yml` dosyalarındaki proje ID'sinin bu
> değerle **birebir aynı** olduğundan emin olun — aksi halde
> `hosting:sites:create` gibi komutlar "The caller does not have
> permission" (403) hatası verir (GCP, var olmayan bir proje ID'si için de
> aynı 403 hatasını döner).

### 2. Bu repo için Hosting site + target oluşturma

```bash
npx firebase use collective-bucket-apps
npx firebase hosting:sites:create cb-menu
npx firebase target:apply hosting menu cb-menu
```

Son komut `.firebaserc` dosyasını günceller/teyit eder; bu depodaki
`.firebaserc` zaten bu değerlerle hazır haldedir.

### 3. İlk deploy

```bash
npm run deploy
```

Bu, `firebase deploy --only hosting:menu` çalıştırır ve size geçici bir
`https://cb-menu.web.app` URL'i verir. Custom domain bağlanana kadar test
için bu URL'i kullanabilirsiniz.

### 4. Custom domain bağlama: menu.collectivebucket.com

1. [Firebase Console](https://console.firebase.google.com/) → proje
   `collective-bucket-apps` → **Hosting** → `cb-menu` site'ı → **Add custom
   domain** → `menu.collectivebucket.com` girin.
2. Firebase, sahiplik doğrulaması için bir **TXT kaydı**, ardından
   yönlendirme için genelde iki **A kaydı** verir. Bu kayıtları
   collectivebucket.com'un DNS yönetim panelinde ekleyin:
   - Google Workspace ile birlikte "Google domaini otomatik ayarlasın"
     seçildiyse: `admin.google.com` → **Hesap** → **Alanlar** →
     **Alanları Yönet** → ilgili domain → DNS kayıtları.
   - Alan adı Google Domains üzerinden alınmışsa (2023'te Squarespace'e
     taşındı): `domains.squarespace.com` üzerinden DNS ayarları.
   - Farklı bir sağlayıcı kullanılıyorsa (Cloudflare, GoDaddy vb.) o
     panelden ekleyin.
3. Firebase Console'da **Verify** ile doğrulayın. DNS yayılımı dakikalar
   içinde olabileceği gibi birkaç saati de bulabilir. Doğrulama sonrası SSL
   sertifikası Firebase tarafından otomatik sağlanır.
4. Doğrulama tamamlandığında `https://menu.collectivebucket.com` işletmelerin
   listelendiği hub sayfasını gösterir; her işletmenin menüsü kendi alt
   yolundadır (örn. `https://menu.collectivebucket.com/ya-basta/`).

> İleride `collectivebucket.com` kök alan adını, projenin varsayılan
> (default) Hosting site'ında **tüm repolardaki** demoları (menu, auth,
> blog...) listeleyen ayrı bir üst düzey "hub" sayfasına ayırabilirsiniz —
> bu repodaki hub sayfası yalnızca bu sitedeki (menü) işletmeleri listeler,
> o üst düzey site farklı bir kavramdır ve bu repo onu kullanmaz.

### 5. GitHub Organization ve repo

Bu adım tamamlandı: `admin@collectivebucket.com` hesabıyla bir GitHub
Organization oluşturuldu (Free plan) ve bu repo oraya transfer edildi.
Organizasyon başlangıçta `collective-bucket-org` adındaydı; kişisel hesapla
(o zamanki adıyla `collective-bucket`) isim benzerliği kafa karıştırdığı için
kişisel hesap `collective-bucket-admin` olarak yeniden adlandırılıp
organizasyon **`collective-bucket`** ismine taşındı. Güncel repo adresi:
`github.com/collective-bucket/menu`.

Bu makinede push işlemleri, kişisel git kimliğinizden (`git-ertugrul-yildirim`)
bağımsız, sadece bu org için geçerli bir SSH kimliğiyle yapılıyor
(`~/.ssh/id_ed25519_collectivebucket` + `~/.ssh/config`'teki
`github-collective-bucket` host alias'ı). Yerel remote:
```bash
git remote set-url origin git@github-collective-bucket:collective-bucket/menu.git
git push -u origin main
```

> Gelecekte açılacak yeni repolar (auth, blog, board...) da doğrudan
> `collective-bucket` organizasyonu altında oluşturulmalı; aynı SSH alias'ı
> (`git@github-collective-bucket:collective-bucket/<repo>.git`) kullanılabilir.

### 6. CI/CD secret'ı

Bu repoda `.github/workflows/firebase-hosting-merge.yml` (main'e push'ta
canlıya deploy) ve `firebase-hosting-pull-request.yml` (her PR'da preview
linki) hazır. Çalışmaları için tek bir secret gerekir: `FIREBASE_TOKEN`.

> **Not:** Standart Firebase GitHub Action'ı bir servis hesabı JSON key'i
> bekler, ancak Google Cloud organizasyon politikası
> (`iam.disableServiceAccountKeyCreation`) bu projede servis hesabı key'i
> oluşturmayı engelliyor (Google'ın önerdiği güvenlik varsayılanı). Bu
> nedenle workflow'lar, servis hesabı yerine bir **Firebase CI token'ı**
> (`firebase login:ci` ile üretilen, kullanıcı hesabına bağlı bir OAuth
> refresh token'ı) ile doğrudan `firebase-tools deploy` çalıştıracak şekilde
> kuruldu. Bu yöntem org policy'den etkilenmez ve hemen çalışır.

Token'ı üretip secret olarak eklemek için (tarayıcı onayı gerektirir, bu
adım terminalinizde yapılmalı):

```bash
npx firebase-tools login:ci
# çıktıdaki 1//... ile başlayan token'ı kopyalayın

gh secret set FIREBASE_TOKEN --repo collective-bucket/menu --body "BURAYA_TOKENI_YAPISTIRIN"
```

Doğrulama (token değerini göstermez, sadece secret'ın var olduğunu teyit eder):

```bash
gh secret list --repo collective-bucket/menu
```

Bundan sonra `main`'e her push otomatik olarak
`https://menu.collectivebucket.com`'a deploy olur, her Pull Request için
ayrı bir preview linki üretilip PR'a yorum olarak eklenir.

> İleride org policy'yi gevşetip servis hesabı key'ine veya daha güvenli bir
> alternatif olan Workload Identity Federation'a geçmek isterseniz, bu
> `FIREBASE_TOKEN` yöntemi yerine `FirebaseExtended/action-hosting-deploy`
> action'ına dönülebilir — mimari değişmez, sadece kimlik doğrulama adımı
> değişir.

### 7. Yeni bir işletme/menü ekleme (multi-tenant, DB'siz)

Bu site tek bir işletmeye değil, aynı `cb-menu` sitesine bağlı **birden çok
işletmeye** hizmet verir — hâlâ veritabanı veya yönetim paneli olmadan. Kök
adres (`/`) tüm işletmeleri kısa bir açıklama ve QR kodlarıyla listeleyen bir
**hub sayfasıdır**; her işletmenin menüsü kendi klasöründe (slug) yaşar ve
`app.js` / `styles.css` kodunu paylaşır. Örnek: `public/ya-basta/` ve
`public/natural-life/` klasörleri sırasıyla `menu.collectivebucket.com/ya-basta/`
ve `.../natural-life/` adreslerinde yayınlanır.

Yeni bir işletme eklemek için:

1. `public/<slug>/menu.json` — o işletmenin `business` bilgisi ve
   `categories` verisiyle oluşturulur (mevcut bir işletmenin `menu.json`'u ile
   aynı şema).
2. `public/<slug>/index.html` — mevcut bir işletmenin `index.html`'inin
   kopyası; `<head>` içinde `<base href="/<slug>/" />` bulunmalı, `styles.css`
   / `app.js` referansları **kök-mutlak** (`/styles.css`, `/app.js`) olmalı.
   `<base>` etiketi olmadan `app.js`'in göreli `fetch("menu.json")` isteği,
   Firebase Hosting'in `trailingSlash: false` ayarı yüzünden (`/slug/` →
   `/slug` yönlendirmesi) yanlışlıkla hub sayfasının bulunduğu köke gidebilir;
   bu yüzden bu etiket **zorunludur**.
3. `public/<slug>/qr.html` — mevcut bir işletmenin `qr.html`'inin aynı
   `<base>` düzeltmesiyle kopyası (opsiyonel ama tutarlılık için önerilir).
4. Kendi QR kodunu üretin:
   ```bash
   npm run generate-qr -- https://menu.collectivebucket.com/<slug>/ <slug>-qr
   ```
   Bu, `public/assets/<slug>-qr.png` ve `.svg` dosyalarını üretir; hub
   sayfası bu dosya adını otomatik olarak kullanır (adım 5'e bkz.).
5. `public/businesses.json`'a `{ "slug": "...", "name": "...", "tagline": "..." }`
   kaydını ekleyin — hub sayfası (`index.html` + `hub.js`) bu dosyayı okuyup
   kart + QR kodunu otomatik olarak listeler, hub HTML'ini elle değiştirmeye
   gerek yoktur.
6. `npm run deploy` — aynı site/target üzerinden tüm işletmeler tek seferde
   yayınlanır, ekstra Firebase site/subdomain/DNS adımı gerekmez.

> Bu yaklaşım, işletme sayısı arttıkça (yönetim paneli olmadan) sürdürmesi
> zorlaşır — her yeni işletme elle bir klasör + JSON + `businesses.json`
> kaydı gerektirir. 2. etapta (yönetici paneli) bu, bir veritabanı ve dinamik
> `slug` routing'e evrilecek.

### 8. Gelecek repolar için şablon (auth, blog, board...)

Bu, farklı bir **uygulama** (Natural Life gibi ikinci bir işletme değil, auth/
blog/board gibi tamamen ayrı bir demo) eklemek için geçerlidir — her biri
kendi Firebase site'ına ve subdomain'ine sahiptir. Aynı adımları
tekrarlayın, sadece isimleri değiştirin:

```bash
npx firebase hosting:sites:create cb-auth
npx firebase target:apply hosting auth cb-auth
```

`firebase.json`'da `"target": "auth"`, `.firebaserc`'te `auth → cb-auth`
eşlemesi, Firebase Console'da `auth.collectivebucket.com` custom domain'i ve
`collective-bucket/auth` GitHub reposu + aynı `FIREBASE_TOKEN` değeri
(token tüm repolar arasında paylaşılabilir, her repoya ayrıca
`gh secret set FIREBASE_TOKEN --repo collective-bucket/<repo> --body "..."`
ile eklenmesi gerekir).

---

## Yayınlama (Deploy)

```bash
npm run deploy
```

Bu komut `public/` klasörünü `cb-menu` Hosting site'ına yükler:

```
https://cb-menu.web.app
https://menu.collectivebucket.com   (custom domain bağlandıktan sonra)
```

## QR Kod Üretme

Her işletmenin kendi QR kodu vardır ve doğrudan o işletmenin menü adresini
hedefler (custom domain bağlandıktan sonra tercihen `menu.collectivebucket.com`
kullanın):

```bash
npm run generate-qr -- https://menu.collectivebucket.com/ya-basta/ ya-basta-qr
npm run generate-qr -- https://menu.collectivebucket.com/natural-life/ natural-life-qr
```

Bu komutlar `public/assets/<slug>-qr.png` ve `.svg` dosyalarını üretir; hub
sayfası (`/`) bu dosyaları `businesses.json`'daki `slug` alanına göre otomatik
gösterir. QR görselleri menüye dahil olduğu için tekrar deploy edin:

```bash
npm run deploy
```

## Test Etme

1. `https://menu.collectivebucket.com/` (hub sayfası) bir bilgisayar/tablet
   ekranında açın — burada tüm işletmelerin QR kodları listelenir (ya da tek
   bir işletmenin `qr.html` sayfasını, örn. `.../ya-basta/qr.html`, ayrıca
   yazdırabilirsiniz).
2. Telefonunuzun kamerasıyla ilgili QR kodu okutun.
3. Kamera, `https://menu.collectivebucket.com/<slug>/` adresini açmalı ve o
   işletmenin menüsü görünmelidir.

## Menü İçeriğini Değiştirme

İlgili işletmenin `public/<slug>/menu.json` dosyasını düzenleyip yeniden
`npm run deploy` çalıştırmanız yeterlidir — build adımı yoktur (ya da sadece
`main`'e push edin, CI/CD otomatik deploy eder). Bu dosyanın şeması, ileride
eklenecek yönetim paneli (2. Etap) tarafından üretilecek çıktıyla uyumlu
olacak şekilde tasarlanmıştır.

## Maliyet

Bu etapta hiçbir ücretli servis kullanılmaz:

- **Firebase Hosting (Spark plan)**: ücretsiz, kredi kartı gerekmez. Birden
  fazla Hosting site'ı aynı Spark plan proje limitleri içinde ücretsizdir.
- **GitHub Organization (Free plan)**: ücretsiz, public/private repo
  limitleri demo için yeterlidir.
- **Custom domain (menu.collectivebucket.com)**: zaten sahip olunan
  collectivebucket.com alan adına bağlı bir subdomain olduğu için ek maliyet
  yoktur.
- Backend, veritabanı veya üçüncü parti API çağrısı yoktur.

## Kapsam Dışı (Sonraki Etaplar)

- Yönetici girişi, işletme/menü tanımlama ve QR üretim paneli → 2. Etap.
- İşletmelere özel tema/logo/renk seçenekleri → 3. Etap.
- Mobil uygulama → 4. Etap.
