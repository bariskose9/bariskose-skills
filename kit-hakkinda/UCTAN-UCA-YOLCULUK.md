# Uçtan Uca Yolculuk — bir proje nasıl yazılır, nasıl çalışır

**Sürüm:** 3.14.0 · **Tarih:** 2026-09-20

> Bu belge kitin **sırasını** anlatır: hangi karar hangisinden önce, hangi kod
> hangisinden sonra, uygulama ayağa kalkarken ve bir istek gelirken parçalar
> hangi sırayla devreye girer. Kuralların kendisi `docs/standards/` altında;
> burada tekrarlanmaz, işaret edilir. Teknolojilerin tek tek ne olduğu
> `KIT-REHBER.md` Bölüm 3'te; sekiz kurulum adımı Bölüm 4'te. Bu belge o ikisinin
> arasındaki boşluğu doldurur: **bağlantılar ve sıra**.
>
> Okuyucu işe yeni başlamış bir junior sayılır: her terim ilk geçtiği yerde
> açılır (`11-agent-workflow.md` → *"HER KAVRAM ÖĞRETİLİR"*).

---

## 1. Dört kurgu — hangi projede hangisi, kurumda ne olur

Kurgu (topology): arayüz, API, iş kuralı, kuyruk ve veritabanının kaç ayrı
programa bölündüğü. Karar ağacı ve her kurgunun araç tablosu `00-stack.md` →
*"DÖRT KURGU"*. Burada yalnızca **bir kuruma (belediyeye) oturtulmuş** örnekleri:

| Kurgu | Ne | Belediye örneği | Modülleri |
|---|---|---|---|
| **[A] Yalnızca arayüz** | Veri ve API kurumda; biz ekranı yazıyoruz | **Borç sorgulama ekranı** — emlak/su borcu kurumun mevcut MIS API'sinden | TCKN ile sorgu · borç listesi · ödeme sayfasına yönlendirme · BFF (anahtar tarayıcıya inmez) |
| **[B] Next tek başına** | Arayüz + API + veri tek program; tüketen yalnızca kendi arayüzü; arka plan işi yok | **Kurum web sitesi + içerik paneli** — haberler, duyurular, birimler, sayfalar | Ziyaretçi sitesi · yönetici paneli (2FA) · içerik tabloları · görsel yükleme · tanım tabloları |
| **[C] Next + NestJS (+ worker)** | Arayüz ayrı, API ayrı; başkası da tüketir ve/veya kendiliğinden iş var — ⭐ **kurum varsayılanı** | **Sosyal yardım başvuru sistemi** | Vatandaş portalı (başvuru, belge yükleme, durum takibi) · memur paneli (inceleme, atama, onay/ret) · KPS kimlik sorgusu (simüle → gerçek) · SMS OTP ve bildirim · gece raporu (cron) · e-Belediye'ye REST · mobil uygulama aynı API |
| **[D] Yalnızca API** | Arayüzü başkası yazıyor | **Randevu API'si** — mobil ekip arayüzü yapıyor | `/api/v1/appointments` · OpenAPI belgesi · sözleşme testi · Postman koleksiyonu |

Bu belgedeki senaryolar (Bölüm 5) **[C]** üstünden anlatılır — en çok parçayı
o barındırır; diğerleri onun alt kümesidir.

---

## 2. Yazım sırası — önce ne, neden, geç kalınırsa ne olur

Sıra `SKILL.md`'nin sekiz adımıyla hizalıdır. Her satırda **neden o sırada**
ve **geç kalınırsa ne olur** yazar — bir şeyi yapmak için geç kalınıp
diğerine geçilmesin diye.

### Adım 0–1 — Mod ve ilk sorular (kod yok)

| Sıra | Ne | Neden şimdi | Geç kalınırsa |
|---|---|---|---|
| 1 | **Proje modu**: kendi projem / işyeri (`SKILL.md` → Adım 1a) | Kod dili, PK tipi, migration aracı, deploy yolu, dosya deposu — hepsi moda bağlı | Yarıda mod değişirse veri katmanı yeniden kurulur |
| 2 | **Kurum standartları var mı** — belge istenir (`kurumdan-ogrenilecekler.md` 1.3) | Veri modeli o belgeye göre kurulur | Migration'lar yeniden yazılır |
| 3 | **PostgreSQL mi Oracle mı** (4.1) | ORM seçimi buna bağlı; Prisma Oracle'ı desteklemez | Stack baştan |
| 4 | **Kod nereye, teslim tarihi** (1.1, 1.2) | Kapsam ve CI dosyası | Küçük — sonradan remote eklenir |

### Adım 3 — PRD (kod yok, ama en pahalı kararlar burada)

| Sıra | Ne | Neden şimdi | Geç kalınırsa |
|---|---|---|---|
| 5 | **Kullanıcılar ve süreç** — kim, ne yapar, hangi durumlar var | Veri modeli ve durum makinesi buradan çıkar | Tablolar yeniden tasarlanır |
| 6 | **API'yi başkası tüketecek mi · kendiliğinden iş var mı** (6.2, 6.3) | Kurguyu belirler ([B] mi [C] mi) | [B]'den [C]'ye geçiş, katman temizse dosya taşımak; değilse yeniden yazmak |
| 7 | **Kişisel veri listesi ve arama alanı** (6.4) | Şifreli kolonda kısmi arama yok — ekran tasarımı buna bağlı | "TCKN ile bul" ekranı yazılamaz |
| 8 | **Hedef tarayıcı tabanı** (6.1) | `browserslist` ve CSS düşürme zinciri baştan | Stil katmanı yeniden |
| 9 | **Çok dillilik** (6.5) | URL yapısı, sözlük, çeviri tabloları baştan | Sonradan eklenemez |
| 10 | **Tasarım yönü ADR** — yazı ailesi, palet, karakter, referans (`07-ui-design-system.md`) | Tek satır arayüz kodundan önce | "Yapay zekâ işi" görünümü; her ekran yeniden boyanır |

### Adım 3b — Stack kararı

| Sıra | Ne | Neden şimdi | Geç kalınırsa |
|---|---|---|---|
| 11 | **Kurgu** [A]/[B]/[C]/[D] — ADR | Bundan sonraki her dosya yeri buna göre | — |
| 12 | **API biçimi** REST (+GraphQL?) (`00-stack.md`) | Sözleşme paketi ve belge üretimi | Sonradan eklenebilir, ikisi yan yana çalışır |
| 13 | **Kuyruk** var mı, hangisi (BullMQ/Redis · Inngest) | E-posta/SMS/PDF varsa **baştan** — servis katmanı "işi kuyruğa at" satırıyla yazılır | Servis katmanı yeniden yazılır |
| 14 | **Oturum stratejisi** — çerez + JWT (mobil varsa Bearer) (`05-auth-security.md`, `17-mobile.md`) | İlk korumalı uçtan önce | Kimlik doğrulama baştan |
| 15 | **Anlık veri** kanalı gerekiyorsa (`00-stack.md` → *"Anlık veri"*) | Sunucusuzda WebSocket yok — kurguyu etkiler | Kanal değişimi altyapı değişimi |

### Adım 4 — Kurulum (iskelet; henüz özellik yok)

Bu adımın kuralı: **her yatay katman, onu kullanacak ilk özellikten önce
kurulur** — özellik yazarken "bir de logger ekleyeyim" olmaz.

| Sıra | Ne | Neden bu sırada |
|---|---|---|
| 16 | Repo, `pnpm`/`npm` (kurum hattına göre), TypeScript strict, ESLint + Prettier (`eslint-config-prettier`) | Her dosya bu kapıdan geçer |
| 17 | `ci:verify` betiği + `.github/workflows/ci.yml` + `.gitlab-ci.yml` + **husky** kancaları (`09-ci-cd-deploy.md`) | İlk commit'ten önce kapı var olsun; kurumda hat bizim testi koşturmayabilir |
| 18 | **Docker + Compose** (Postgres, Redis) · `Dockerfile` çok aşamalı · `.env.example` | Local ortam gerçek ortamın provası |
| 19 | `src/config/env.ts` — **Zod ile ortam değişkeni doğrulama** | Eksik değişken açılışta net hata versin, gece 3'te değil |
| 20 | **Logger** (pino JSON) + istek kimliği (correlation id, `nestjs-cls`) + kişisel veri süzgeci (`12-operations-and-scaling.md`) | İlk istekten itibaren her satır izlenebilir |
| 21 | **Hata biçimi** — tek `ErrorResponse` şeması, exception filter (`03-api-guidelines.md`) | İlk uç bu biçimle döner |
| 22 | **Adaptörler**: `FileStorage` (`s3`/`local`/`db`), `Mailer` (`resend`/`smtp`/`fake`), simüle dış servisler (KPS, SMS) | İlk yükleme/e-posta özelliği bunlara konuşur; gerçeğe geçiş tek satır |
| 23 | **Kimlik iskeleti**: argon2, JWT + `tokenVersion`, Guard'lar, rate limit, `login_events` tablosu | İlk korumalı uçtan önce |
| 24 | **Audit mekanizması** — Prisma extension / interceptor, `audit_logs` tablosu, aynı transaction (`04-database.md`) | ⛔ **İlk yazma ucundan önce.** Sonradan eklenirse ilk kayıtlar denetimsiz |
| 25 | **Kuyruk iskeleti** — BullMQ bağlantısı, worker süreci, dead-letter uyarısı | İlk SMS/e-posta özelliğinden önce |
| 26 | `/api/health` (DB + Redis) · Sentry/GlitchTip · `proxy.ts` | DevOps duman testi buna bakar |

### Adım 5 — Veri modeli ve ilk migration

| Sıra | Ne | Neden bu sırada | Geç kalınırsa |
|---|---|---|---|
| 27 | **İsimlendirme kararı** ve `@map`/`@@map` (`04-database.md`) | ⛔ İlk migration'dan **önce** | Kolon yeniden adlandırma migration'ı + veri taşıma |
| 28 | **PK tipi** (UUIDv7 / `BIGINT IDENTITY`), **tanım tabloları** (enum yok), ortak kolonlar | Aynı sebep | Aynı |
| 29 | **Kişisel veri kolonları**: `*_encrypted BYTEA` + `*_hash` (`14-privacy-and-compliance.md`) | Şifreleme sonradan eklenirse mevcut veri açıkta kalmış olur | Toplu yeniden şifreleme + hukuki risk |
| 30 | **Migration aracı** (Prisma Migrate / kurum biçimi + koşucu) ve ilk migration | Şemanın kaynağı belirlenir | İki defter |
| 31 | **Seed** — açıkça sahte veri, idempotent | Ekran yazarken veri olsun | — |
| 32 | **ER diyagramı** üretimi + `data-model.md` | Veri modeli görülmeden API tasarlanmaz | — |

### Adım 6 — Özellikler, ince dikey dilimlerle

Her özellik **aynı sırayla** yazılır; sıra, bağımlılığın yönüdür — alt katman
üst katmandan önce, test koddan önce:

```
 1. Sözleşme     packages/contracts  (Zod şeması + tip)      ← ekran ve API aynı şemayı okur
 2. Test         önce KIRMIZI test   (`06-testing.md` → önce-test)
 3. Repository   prisma.x.…          ← if yok, sadece sorgu
 4. Servis       iş kuralı, durum geçişi, transaction, "işi kuyruğa at"
 5. API          Controller (Guard → Pipe → …) / Route Handler / Server Action
 6. Worker       kuyruğa atılan işin işleyicisi (varsa) — AYNI servisi çağırır
 7. Önbellek     okuma etiketlenir, yazma sonrası etiket düşürülür
 8. Arayüz       sunucu bileşeni + form (RHF + aynı Zod) + dört okuma / üç yazma durumu
 9. Doğrulama    beş göz · etki alanı (HEPSİ) · tarayıcı doğrulaması · DoD
10. Yorum/ders   dosya başı özeti, satır yorumları, seviye defteri
```

⛔ **Arayüzden başlanmaz.** Ekran, altında sözleşme ve servis yokken yazılırsa
iş kuralı ekrana sızar; sonra NestJS'e taşınamaz.

### Adım 7 — Teslim

Kendi proje: 6a (canlıya çıkar). Kurum: 6b (teslim paketi — `13-environments.md`
→ *"Yol C"*). İkisinde de **dört dış kanıt** (`10-definition-of-done.md`):
yük testi sayısı, pentest, hukuk onayı, gerçek kullanıcı — hazırlık bizde,
sonuç dışarıdan; gelmediyse risk olarak yazılı.

### ⛔ "Şundan önce yapılmazsa geri dönüşü pahalı" — kısa liste

| Bu | Şundan önce | Yoksa |
|---|---|---|
| `@map` ve PK kararı | İlk migration | Yeniden adlandırma migration'ı |
| Audit mekanizması | İlk yazma ucu | Denetimsiz kayıtlar |
| Şifreli kolon + hash | İlk kişisel veri kaydı | Toplu yeniden şifreleme |
| Oturum stratejisi (mobil dahil) | İlk korumalı uç | Kimlik doğrulama baştan |
| Kuyruk iskeleti | İlk SMS/e-posta/PDF | Servis katmanı yeniden |
| `FileStorage` adaptörü | İlk dosya yükleme | `public/` tuzağı, taşınamaz dosyalar |
| Tasarım yönü ADR | İlk arayüz kodu | Her ekran yeniden boyanır |
| Çok dillilik kararı | İlk arayüz metni | Sonradan eklenemez |
| Hedef tarayıcı | İlk CSS | Menü eski cihazda görünmez |
| DevOps sınırı üç sorusu + DB hesapları | `Dockerfile` ve ilk migration | Kap açılmaz ya da izin hatası |
| `ci:verify` + kancalar | İlk commit | Kırık kod depoya girer |

---

## 3. Çalışma sırası — uygulama ayağa kalkarken (boot)

Kod yazım sırası bir şey, uygulamanın **açılış sırası** başka bir şey; ikisi
karıştırılır. Konteyner başladığında olanlar, sırayla ve her adımın "patlarsa
ne olur"uyla:

```
docker start
 └─ docker-entrypoint.sh
     ├─ 1. Ortam değişkenleri Zod ile doğrulanır       ✗ eksik değişken → kap DÜŞER (sessiz yanlış yerine görünür hata)
     ├─ 2. (kurum, DB_MIGRATE_ON_START=true) migrate.mjs → advisory lock → V__ uygula   ✗ → kap düşer
     ├─ 3. NestJS bootstrap: DI konteyneri modülleri kurar (singleton servisler bir kez)
     ├─ 4. Prisma bağlantı havuzu açılır (max = DBA'nin verdiği sayı)  ✗ → 5 sn sonra hata, kap düşer
     ├─ 5. Redis bağlantısı (kuyruk + tokenVersion önbelleği)         ✗ → kuyruk devre dışı, uyarı; uygulama açılır mı? → ADR: SMS zorunluysa düşer
     ├─ 6. Worker süreci (ayrı konteyner) kuyruğu dinlemeye başlar; repeatable (cron) işler kaydedilir
     ├─ 7. HTTP dinleme başlar; /api/health → { db: ok, redis: ok } → DevOps "hazır" der
     └─ 8. Ters vekil (Nginx) trafiği yeni kaba yönlendirir; eski kap SIGTERM alır → açık istekleri bitirir → kapanır
```

Next.js tarafı ([B] ve [C]'nin arayüzü): `next start` → `proxy.ts` Edge'de
yüklenir (yalnızca çerez/JWT okur, veritabanı yok) → sayfalar istek geldikçe
üretilir; statik olanlar derlemede üretilmiştir.

⭐ **Kural:** açılışta patlaması gereken şey açılışta patlar (env, migration,
DB); patlamaması gereken şey (Redis geçici yok) **loglanır ve devam eder** —
hangisinin hangisi olduğu ADR'de yazar.

---

## 4. Bir isteğin hattı — parçalar, rolleri, ve sık karıştırılanlar

Durak durak hat `01-architecture.md` → *"BİR İSTEĞİN TAM YOLU"* ve `00-stack.md`
→ *"DÖRT KURGU"*. Burada senin listelediğin parçaların **rolü** ve birbirine
karışan ikililer:

| Parça | Rolü tek cümleyle | Karıştırılan | Fark |
|---|---|---|---|
| **Zod** | Gelen verinin **şekli** doğru mu — çalışma anında | Prisma'nın tipleri | Prisma tipi derleme anında **kodu** denetler; Zod çalışma anında **veriyi** |
| **Guard** (NestJS) | Bu istek içeri girebilir mi — kimlik, rol | Pipe | Guard **kim**, Pipe **ne** — Guard önce çalışır |
| **Pipe** | Gövdeyi Zod'dan geçirip DTO'ya çevirir | Servis | Pipe iş kuralı bilmez |
| **Controller / Route Handler / Server Action** | HTTP'yi servise çevirir, sonucu HTTP'ye | Servis | ⛔ İş kuralı yazılmaz |
| **Servis** | İş kuralı, durum geçişi, transaction sınırı, "kuyruğa at" | Repository | Servis **karar** verir, repository **sorgu** atar |
| **Repository** | Prisma'ya ne isteneceğini söyler | ORM | Repository senin dosyan, ORM kütüphane |
| **Prisma (ORM)** | Nesne ↔ tablo çevirisi, tip üretimi; **Migrate** parçası şema değişikliği (kurumda kapalı) | Migration koşucusu | Client çalışma zamanı, Migrate geliştirme zamanı |
| **Transaction** | "Ya hepsi ya hiçbiri" — birden çok yazma tek birim | İstek | Transaction **sunucuda** başlar ve biter; istemcinin bağlantısıyla ilgisi yok (Bölüm 5, Senaryo 2) |
| **BullMQ + Redis** | "Sonra yap" listesi; Redis RAM'de tutar, worker sırayla alır | Cron | Aşağıda |
| **Cron (repeatable job)** | Zamana bağlı: her gece 03:00 | Olay işi (job) | Cron **takvim** tetikler, job **olay** tetikler (başvuru geldi → SMS) |
| **Önbellek** | Aynı soruya yeniden hesaplamadan cevap | Redis | Aşağıda |
| **Audit log** | Veri değişikliğinin **önceki hâliyle** kaydı — tabloda, yıllarca | Uygulama logu | `12-operations-and-scaling.md` → *"İki tür kayıt karıştırılmaz"* |
| **Giriş logu** (`login_events`) | Başarılı/başarısız giriş, sebep, IP, çıkış | Audit | Giriş bir **veri değişikliği değil**, güvenlik olayıdır; ayrı tablo |
| **Uygulama logu** (pino JSON) | "İstek 45 ms sürdü, 500 döndü, istek kimliği X" | Audit | stdout'a gider, döner, silinir; kişisel veri süzülür |

### Önbellek — bizde neler var, neler yok

| Katman | Nerede | Ne için | Kim geçersiz kılar |
|---|---|---|---|
| Next **veri önbelleği** (`unstable_cache`, `fetch` tags) | Next sunucusu | Herkese aynı, seyrek değişen veri | Yazma sonrası `revalidateTag` |
| Next **route cache** | Next sunucusu | Statik/ISR sayfalar | `revalidatePath` / süre |
| **TanStack Query** | Tarayıcı | Kullanıcının o oturumda gördüğü liste/detay | `invalidateQueries`, odak dönüşü |
| **Redis** | Ayrı süreç, RAM | Kuyruk · `tokenVersion` önbelleği (5 dk) · pub/sub (anlık veri, çok kopya) | TTL / olay |
| **CDN** | Vercel / kurumun vekili | Görsel, statik dosya | Sürümlü dosya adı |
| ⛔ **Süreç içi bellek önbelleği** (`Map`, `node-cache`) | — | **Kullanılmaz**: sunucusuzda her istek yeni süreç; iki kopyada iki ayrı önbellek — "A'da güncel, B'de bayat" | — |

Kural ve kararı veren soru `01-architecture.md` → *"Önbellek ve tazelik"*.

### Worker — iki tetikleyici, tek mekanizma

```
OLAY tetikler (job):        başvuru kaydedildi ──commit──▶ queue.add("sms", {…})  ──▶ Redis ──▶ worker
TAKVİM tetikler (cron):     her gece 03:00 (Europe/Istanbul) ──▶ queue.add repeatable ──▶ Redis ──▶ worker
```

İkisi de aynı worker'a düşer, aynı servis katmanını çağırır. Job'ın **kendi**
durumları (BullMQ): `waiting → active → completed | failed` (+ `delayed`,
`waiting-children`). ⛔ Bu, **iş alanı durum makinesi** değildir: "başvuru
beklemede → incelemede → onaylandı" senin tablonda ve servisinde yaşar;
BullMQ'nun `completed` demesi başvurunun onaylandığı anlamına gelmez. İki
farklı makine — Bölüm 5, Senaryo 4.

---

## 5. Gerçek senaryolar — Sosyal Yardım Başvuru Sistemi (kurgu [C])

Modüller: vatandaş portalı (Next) · memur paneli (Next) · API + worker (NestJS)
· PostgreSQL (kurum şeması, `svc_`/`mig_`) · Redis · KPS simülasyonu · kurum SMS
geçidi · e-Belediye REST tüketicisi · mobil (Expo, aynı API).

### Senaryo 1 — Başarılı giriş (memur paneli)

| # | Ne olur | Parça | Not |
|---|---|---|---|
| 1 | Memur giriş sayfasını açar; sayfa sunucu bileşeni, form istemci bileşeni (RHF + Zod: e-posta biçimi, şifre boş değil) | Next, Tailwind, shadcn | Tarayıcı doğrulaması **kullanıcı için**, güvenlik için değil |
| 2 | "Giriş" → Server Action `login` → NestJS `POST /api/v1/auth/login` (ince BFF; anahtar yok ama token sunucuda kalacak) | Server Action | URL tarayıcıda görünmez |
| 3 | NestJS: **rate limit** (IP + kullanıcı: 5 deneme / 15 dk) → login herkese açık uç, Guard yok → **Pipe** Zod'dan geçirir | Throttler, Pipe | Guard'dan önce hız sınırı; kimliksiz uçta bile |
| 4 | `AuthService.login`: kullanıcıyı e-postayla bul → **bulunamasa bile sahte argon2 doğrulaması** koşar (zamanlama farkı olmasın) → argon2id doğrula → 2FA açıksa OTP üret, hash'le, SMS kuyruğuna at, **oturum açma**; OTP geçiş çerezi ver | Servis, argon2, BullMQ | Kurum panelinde 2FA zorunlu |
| 5 | OTP doğrulandı → `tokenVersion` okunur → JWT imzalanır (HS256, 8 saat) → `httpOnly; Secure; SameSite=Lax` çerez | jose | Çerez tarayıcıya, token JS'e görünmez |
| 6 | **`login_events`** tablosuna satır: `{user_id, outcome: success, ip (X-Forwarded-For), user_agent, at}` | Repository | ⛔ Bu **audit değil**: veri değişmedi, güvenlik olayı oldu. ⛔ "Giriş başlatıldı" diye satır **yazılmaz** — yalnızca **sonuç** loglanır; başlangıç, uygulama logunda istek kimliğiyle zaten var |
| 7 | Uygulama logu (pino): `{reqId, route, status: 200, ms: 84}` — kişisel veri **yok** | Logger | stdout → kurum log sistemi |
| 8 | 200 → Server Action `redirect("/panel")` → App Router sayfayı yenilemeden geçer | Next | |
| 9 | Panel sunucu bileşeni `getMyQueue()` çağırır → NestJS `GET /api/v1/applications?assigned=me` → **Guard** JWT'yi doğrular, `tokenVersion`'ı Redis'ten (5 dk) kontrol eder → servis → repository → PostgreSQL | Guard, Redis | Kişiye özel liste: önbellek **yok** (`dynamic`) |

⛔ **Girişte kargo/başvuru işi tetiklenmez.** Giriş bir kimlik olayıdır;
kuyruğa iş atan şey **alan olayları**dır (başvuru geldi, memur onayladı) ya
da takvim. Girişin tetiklediği tek arka plan işi OTP SMS'idir.

### Senaryo 2 — Bağlantı kopması: "havada kalan istek" — doğru mantık

Sık yanlış anlaşılan yer burası; adım adım düzeltilmiş hâli:

| # | Ne olur | Doğru mantık |
|---|---|---|
| 1 | Memur "Giriş"e basar; istek sunucuya **ulaşır**, Zod geçer | |
| 2 | Servis transaction başlatır: `last_login_at` güncelle + `login_events` satırı yaz | İki yazma, tek birim |
| 3 | **Transaction commit olur** — PostgreSQL "tamam" der | Bu an geri dönüşü olmayan andır |
| 4 | Sunucu 200 cevabını yazar; **o sırada** kafenin hattı düşer, paket tarayıcıya ulaşmaz | |
| 5 | Tarayıcı 10 sn bekler, **zaman aşımı** (timeout); istek istemci tarafında iptal | |
| 6 | ⛔ **Sunucuda hiçbir şey geri alınmaz.** Commit olmuş bir transaction, istemci cevabı almadı diye **geri sarılamaz** — rollback yalnızca transaction **içinde** bir adım patlarsa ve **commit'ten önce** olur. Sunucu çoğu zaman istemcinin koptuğunu **bilmez bile**; handler bitmiştir | *Gerçek hayat:* bankaya havale yaptın, dekont yazıcıda sıkıştı — para gitti, dekont gelmedi; havale geri gelmez |
| 7 | Sonuç: veritabanında `last_login_at` güncel, `login_events`'te "başarılı" satır var; kullanıcı ekranda "bağlantı hatası" görüyor | İki taraf **tutarsız görünür** ama veri **doğru** |
| 8 | Kullanıcı tekrar basar → giriş **idempotent** (aynı işi iki kez yapmak zarar vermez): yeni `last_login_at`, yeni `login_events` satırı, yeni JWT. Sorun yok | |
| 9 | Aynı senaryo **para/başvuru** için: ikinci basış **ikinci başvuru** üretirdi. Bunun için **idempotency anahtarı**: istemci her göndermede aynı rastgele anahtarı yollar; sunucu "bu anahtarı gördüm, işte cevabı" der, ikinci kez yazmaz (`03-api-guidelines.md`) | Kural şu an ödeme/sipariş için; başvuru gönderimi gibi tekrar edilemez her yazmaya genellenmeli — **Bölüm 7, boşluk 3** |
| 10 | Kuyruk: OTP SMS işi 3. adımda commit'ten **sonra** `queue.add` ile atılmışsa gider; **commit'ten önce** atılmışsa ve transaction 3'te patlasaydı — kayıt yok ama SMS gitmiş olurdu (hayalet iş) | ⛔ Kuyruğa **commit'ten sonra** atılır; kural `00-stack.md` → *"Kuyruğa ne zaman atılır"* |
| 11 | BullMQ'da `cancelled` durumu **yoktur**; atılmayan iş hiçbir durumda değildir, atılıp başarısız olan `failed`'dir | |
| 12 | Arayüz: form sıfırlanmaz, girilen e-posta durur, kırmızı uyarı "Bağlantı hatası — tekrar deneyin" (`07-ui-design-system.md` → yazma durumları) | |

**Gerçek rollback ne zaman olur:** 2. adımda `login_events` yazımı patlarsa
(tablo kilitli, disk dolu) → transaction **tamamı** geri alınır, `last_login_at`
de eski değerine döner, 500 döner, uygulama logunda hata + istek kimliği,
GlitchTip'e olay. Kullanıcı tekrar dener.

### Senaryo 3 — Vatandaş başvuru oluşturur (tam hat: transaction · audit · kuyruk · önbellek)

```
Vatandaş (portal) ─form: RHF + CreateApplicationSchema─▶ Server Action ─▶ NestJS POST /api/v1/applications
  Guard: vatandaş JWT · Pipe: Zod → DTO · FileStorage: belge (boyut→imza→ad yeniden→s3)
  ApplicationService.create:
    ├─ KPS sorgusu (simüle adaptör; gerçek geçince tek satır)   ← transaction DIŞINDA (dış çağrı içeride olmaz)
    ├─ prisma.$transaction:
    │    ├─ applications INSERT  (status_id = "beklemede" tanım tablosundan)
    │    ├─ application_documents INSERT
    │    └─ audit_logs INSERT  (operation: INSERT, before_image: null)  ← extension otomatik, AYNI transaction
    ├─ COMMIT
    ├─ queue.add("sms", { to, template: "basvuru-alindi" })   ← commit'ten SONRA
    └─ 201 + { publicId }
  ◀── Server Action: revalidateTag("applications:me") → redirect(/basvurularim/<publicId>)
WORKER: sms işi → SmsService (kurum geçidi) → başarısız → 3 deneme, backoff → yine olmazsa failed + dead-letter → uyarı
```

Öğretici noktalar: dış çağrı (KPS) transaction'ın **dışında** — içeride
olsaydı KPS 4 sn beklerken tablo kilitli kalırdı · audit **elle çağrılmadı**,
mekanizma yazdı · SMS gitmese de başvuru **var**; kullanıcı ekranda görür,
SMS sonradan gelir · `revalidateTag` yalnızca o vatandaşın listesini düşürdü,
site geneli değil.

### Senaryo 4 — Memur onaylar: iş alanı durum makinesi ≠ BullMQ durumu

| Adım | Ne | Nerede |
|---|---|---|
| 1 | Memur "Onayla" → `PATCH /api/v1/applications/:id/status { to: "onaylandi" }` | Controller |
| 2 | Guard: rol `memur`, **sahiplik**: başvuru bu memura atanmış mı (IDOR) | Guard + servis |
| 3 | **Durum makinesi**: `canTransition("incelemede", "onaylandi")` — kodda `as const` liste + geçiş tablosu; `reddedildi → onaylandi` **yasak** | Servis |
| 4 | Transaction: `UPDATE applications SET status_id` + **audit before-image** (satırın eski hâli JSONB) + `application_events` satırı (kim, ne zaman, hangi geçiş) | Extension |
| 5 | Commit → `queue.add("sms", "basvuru-onaylandi")` + `queue.add("ebelediye-sync")` | BullMQ |
| 6 | Worker `ebelediye-sync`: kurumun e-Belediye REST ucuna POST — başarısızsa yeniden dener; e-Belediye 3 gün kapalıysa dead-letter + uyarı; **başvuru yine onaylı** | Worker |
| 7 | Vatandaş portalı: odak dönüşünde TanStack yeniden çeker → "Onaylandı"; anlık gerekiyorsa SSE (`00-stack.md` → *"Anlık veri"*) | Next |

BullMQ'nun `sms` işi `completed` olsa da olmasa da başvuru **onaylıdır**;
`failed` olsa bile onaylıdır — SMS'in gitmemesi iş alanı durumunu değiştirmez.
İki makine ayrı.

### Senaryo 5 — Gece 03:00 raporu (cron)

`ReportQueue.add("daily-summary", {}, { repeat: { pattern: "0 3 * * *", tz: "Europe/Istanbul" } })`
→ worker: dünün başvurularını sorgular (**İstanbul günü**: 00:00–24:00
İstanbul → UTC'ye çevrilerek) → PDF üretir → `FileStorage.put` → `Mailer` ile
müdüre gönderir (react-email şablonu) → `report_runs` tablosuna satır. Rapor
başarısızsa GlitchTip + yeniden deneme; **iki kopya** varsa repeatable iş
Redis'te tek kez kayıtlıdır, iki kez koşmaz.

### Senaryo 6 — Son başvuru günü 17:00: ani yük

Saat 16:30'da 5.000 vatandaş aynı anda. `12-operations-and-scaling.md` →
*"ANİ YÜK"*: darboğaz HTTP değil **veritabanı bağlantısı** — havuz 10 ise 11.
istek bekler. Önceden: DevOps'a kopya sayısı ve havuz artışı (4.4), herkese
aynı sayfalar önbellekte, KPS sorgusu kuyrukta (istek 202 döner, "kimlik
doğrulanıyor"), form gönderimi idempotency anahtarlı (çift basış çift başvuru
üretmez), hız sınırı kişi başına.

### Senaryo 7 — Canlıda hata: ne, nerede görünür

Vatandaş "belge yüklenemedi" diyor. Uygulama logunda istek kimliği ile
`{reqId, err: "S3 timeout"}` → GlitchTip'te aynı hata grubu, 40 kez, ilk
görülme 14:02 → `FileStorage` `s3` sürücüsü kurumun MinIO'suna ulaşamıyor →
DevOps: MinIO bakımda. Kod hatası değil, altyapı. Geri alma gerekmedi; gerekseydi
**önceki etiket** canlıya, migration geriye uyumlu olduğu için veri sorunsuz.

---

## 6. Senin örneğindeki yanlış mantıklar — düzeltilmiş

| Yazılan | Neden yanlış | Doğrusu |
|---|---|---|
| "Zod doğruladı → **audit log** 'giriş başlatıldı'" | Audit, **veri değişikliğinin** kaydıdır; giriş bir güvenlik olayı; "başlatıldı" bir sonuç değil | `login_events`'e yalnızca **sonuç** (success/fail + sebep); başlangıç uygulama logunda istek kimliğiyle |
| "Giriş başarılı → arka planda **kargo işi** tetiklenir" | Giriş alan olayı değil; kargo işi giriş yapılmasa da olmalı | Alan olayı (kargo verisi geldi) ya da cron tetikler |
| "BullMQ, Redis üzerinde bir **durum makinesi** gibi çalışır" | BullMQ job durumları teknik (waiting/active/…), iş alanı durumu (kargo yola çıktı) senin tablonda | İki makine ayrı; `completed` ≠ "yola çıktı" |
| "Bağlantı koptu → Prisma transaction **rollback** eder" | Commit olmuş transaction geri sarılmaz; sunucu istemcinin koptuğunu genelde bilmez | Rollback yalnızca commit **öncesi** hata; cevap kaybolursa veri doğru, istemci tekrar dener (idempotent / idempotency anahtarı) |
| "Kargo işi `cancelled` durumuna çekilir" | BullMQ'da `cancelled` yok | Atılmayan iş hiçbir durumda değildir; atılıp düşen `failed` |
| "İş, transaction sırasında kuyruğa alınır" | Transaction patlarsa iş gitmiş olur (hayalet SMS) | **Commit'ten sonra** `queue.add` (boşluk 1) |
| "NestJS içindeki **Zod** doğrular" (Guard'sız) | Sıra: rate limit → Guard → Pipe(Zod) → Controller | Zod Pipe'ta; kimlik ve hız sınırı ondan önce |
| "Şifre ve kayıtlar doğrulanır" | Nasıl? | argon2id doğrulama + kullanıcı yoksa sahte doğrulama (zamanlama); kurum panelinde 2FA |
| "Toast: siparişiniz yola çıktı" (girişte) | Anlık veri kanalı yok; giriş sayfası bunu bilemez | Odak dönüşü / polling / SSE — kanal ADR ile |

---

## 7. Bu belge yazılırken bulunan boşluklar — kapatıldı (3.11.0)

| # | Boşluk | Artık nerede |
|---|---|---|
| 1 | Kuyruğa ne zaman atılır — commit'ten sonra; kayıp kabul edilemezse **outbox** | `00-stack.md` → *"Kuyruğa ne zaman atılır"* |
| 2 | **İş alanı durum makinesi** — durumlar, geçiş tablosu, tek kapı, olay tablosu | `01-architecture.md` → *"Durum makinesi"* |
| 3 | **İdempotency** genelleme + istemci yeniden deneme politikası | `03-api-guidelines.md` → *"İdempotency"* |
| 4 | **Açılış sırası** — ne yokken düşer, ne yokken devam eder; kapanış | `12-operations-and-scaling.md` → *"Açılış sırası"* |
| 5 | Özet belgelerdeki bayat "en az biri" | ✅ düzeltildi |
