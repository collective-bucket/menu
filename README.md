# QR Menü — 1. Etap (Statik Demo)

Kamera ile okutulunca doğrudan bir menü sayfası açan, tamamen statik ve
ücretsiz bir QR menü demosu. Bu etapta veritabanı, backend veya yönetim
paneli yoktur; içerik `public/menu.json` dosyasında sabittir.

Bu repo, **collectivebucket.com** altında yayınlanacak demo uygulamalarından
biridir ve `menu.collectivebucket.com` adresinde çalışacak şekilde
yapılandırılmıştır. Aşağıdaki "Domain, GitHub ve CI/CD Kurulumu" bölümü, bu
markanın diğer repoları (auth, blog, board...) için de şablon olarak
kullanılabilir.

## İçerik

- `public/index.html`, `public/styles.css`, `public/app.js` — mobil öncelikli
  menü sayfası. `app.js`, `menu.json`'u okuyup sayfayı oluşturur.
- `public/menu.json` — örnek/mock menü verisi (kategoriler, ürünler, fiyatlar).
- `public/qr.html` — demo sırasında gösterilebilecek "Bizi Tarayın" sayfası,
  üretilen QR görselini gösterir.
- `scripts/generate-qr.js` — verilen bir URL için `public/assets/qr.png` ve
  `qr.svg` üretir.
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
- **GitHub Organization**: `admin@collectivebucket.com` hesabı, kişisel
  hesap (`collective-bucket`) üzerinde değil, **`collective-bucket-org`**
  adlı GitHub Organization'da; tüm demo repoları bu org altında yaşar.

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
4. Doğrulama tamamlandığında `https://menu.collectivebucket.com` menüyü
   göstermeye başlar.

> İleride `collectivebucket.com` kök alan adını, projenin varsayılan
> (default) Hosting site'ında tüm demoları listeleyen bir "hub" sayfasına
> ayırabilirsiniz — bu repo o site'ı kullanmaz, boş ve ücretsiz kalır.

### 5. GitHub Organization ve repo

Bu adım tamamlandı: `admin@collectivebucket.com` hesabıyla **`collective-bucket-org`**
adında bir GitHub Organization oluşturuldu (Free plan) ve bu repo oraya
transfer edildi. Yeni repo adresi: `github.com/collective-bucket-org/menu`.

Yerel remote'u güncelleyin:
```bash
git remote set-url origin https://github.com/collective-bucket-org/menu.git
git push -u origin main
```

> Gelecekte açılacak yeni repolar (auth, blog, board...) da doğrudan
> `collective-bucket-org` altında oluşturulmalı, ayrıca transfer adımı
> gerekmez.

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

gh secret set FIREBASE_TOKEN --repo collective-bucket-org/menu --body "BURAYA_TOKENI_YAPISTIRIN"
```

Doğrulama (token değerini göstermez, sadece secret'ın var olduğunu teyit eder):

```bash
gh secret list --repo collective-bucket-org/menu
```

Bundan sonra `main`'e her push otomatik olarak
`https://menu.collectivebucket.com`'a deploy olur, her Pull Request için
ayrı bir preview linki üretilip PR'a yorum olarak eklenir.

> İleride org policy'yi gevşetip servis hesabı key'ine veya daha güvenli bir
> alternatif olan Workload Identity Federation'a geçmek isterseniz, bu
> `FIREBASE_TOKEN` yöntemi yerine `FirebaseExtended/action-hosting-deploy`
> action'ına dönülebilir — mimari değişmez, sadece kimlik doğrulama adımı
> değişir.

### 7. Gelecek repolar için şablon (auth, blog, board...)

Her yeni demo repo için aynı adımları tekrarlayın, sadece isimleri
değiştirin:

```bash
npx firebase hosting:sites:create cb-auth
npx firebase target:apply hosting auth cb-auth
```

`firebase.json`'da `"target": "auth"`, `.firebaserc`'te `auth → cb-auth`
eşlemesi, Firebase Console'da `auth.collectivebucket.com` custom domain'i ve
`collective-bucket-org/auth` GitHub reposu + aynı `FIREBASE_TOKEN` değeri
(token tüm repolar arasında paylaşılabilir, her repoya ayrıca
`gh secret set FIREBASE_TOKEN --repo collective-bucket-org/<repo> --body "..."`
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

Deploy sonrası gerçek URL ile (custom domain bağlandıktan sonra tercihen
`menu.collectivebucket.com` kullanın):

```bash
npm run generate-qr -- https://menu.collectivebucket.com
```

Bu komut `public/assets/qr.png` ve `public/assets/qr.svg` dosyalarını
üretir. QR görseli menüye dahil olduğu için tekrar deploy edin:

```bash
npm run deploy
```

Artık `https://menu.collectivebucket.com/qr.html` adresinde "Bizi Tarayın"
sayfası, QR kodu ile birlikte görüntülenebilir.

## Test Etme

1. `https://menu.collectivebucket.com/qr.html` sayfasını bir bilgisayar/tablet
   ekranında açın (ya da QR görselini yazdırın).
2. Telefonunuzun kamerasıyla QR kodu okutun.
3. Kamera, `https://menu.collectivebucket.com/index.html` adresini açmalı ve
   menü görünmelidir.

## Menü İçeriğini Değiştirme

`public/menu.json` dosyasını düzenleyip yeniden `npm run deploy` çalıştırmanız
yeterlidir — build adımı yoktur (ya da sadece `main`'e push edin, CI/CD
otomatik deploy eder). Bu dosyanın şeması, ileride eklenecek yönetim paneli
(2. Etap) tarafından üretilecek çıktıyla uyumlu olacak şekilde
tasarlanmıştır.

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
