# 00 — Teknoloji Stack'i

Bu dosya "neyi kullanıyoruz, neyi kullanmıyoruz" sorusunun tek cevabıdır.
Burada olmayan bir kütüphane projeye eklenmeden önce **onay alınır** ve ADR yazılır.

## Stack — başlangıç noktası, dondurulmuş liste DEĞİL

⛔ **Bu tablo bir örnektir ve her projede yeniden ölçülür.** Aşağıdaki
*"STACK KURULURKEN HER TEKNOLOJİNİN GÜNCEL ALTERNATİFİ TARANIR"* bölümü
kurulumda fiilen çalıştırılır: ajan her satırı ölçer, itirazı veya daha iyi bir
alternatifi varsa **gerekçesiyle sunar**, kararı **geliştirici** verir.

- Kabul edilen değişiklik → projede ADR + `teknoloji-ve-plan.md`
- Her projede geçerliyse → `/kit-senkron` ile bu dosyaya geri yazılır
- Reddedilen → ADR'ye *"değerlendirildi, seçilmedi"* (aynı soru bir daha
  araştırılmasın)

⛔ Ajan **tek başına** stack değiştirmez; bulguyu sunar, onayı bekler.

Sürüm sütunu **fiilen kurulu** olanı gösterir; `package.json` ile birebir aynıdır.

| Katman | Seçim | Sürüm | Not |
|---|---|---|---|
| Framework | Next.js (App Router) | 16 | Pages Router kullanılmaz |
| Dil | TypeScript (strict) | 6 | JavaScript dosyası eklenmez · TS 7 henüz kullanılamıyor, aşağıya bak |
| Stil | Tailwind CSS | 4 | v4 CSS-first: `tailwind.config.ts` yok, token'lar `src/app/globals.css` içinde |
| UI bileşen | shadcn/ui (Radix tabanlı) | CLI 4 | Bileşen repoya kopyalanır, paket olarak bağlanmaz |
| Backend | Next.js Route Handlers — **veya** ayrı NestJS API | — | Karar kuralı aşağıda ("Backend kurgusu"). Çıplak Express kurulmaz |
| ORM | Prisma | 7 | Ham SQL sadece performans gerekçesiyle, ADR ile |
| Veritabanı | PostgreSQL | 18 | Local Docker imajı Neon'daki yama sürümüyle eşitlenir |
| Auth | Auth.js (NextAuth v5) | 5 (beta) | Web: httpOnly cookie · Mobil: Bearer JWT · aşağıya bak |
| Şifre özetleme | `argon2` (argon2id) | 0.45.1 | Parametreler `src/config/constants.ts` içinde · ADR-011 |
| Bot koruması | Cloudflare Turnstile | — | Giriş gerektirmeyen formlarda zorunlu · ADR ile kabul edildi |
| Validasyon | Zod | 4 | Her API girişinde zorunlu |
| Form | React Hook Form + Zod resolver | 7.83 / 5.5 | |
| Sunucu durumu | TanStack Query | 5 | Henüz kurulu değil — ilk gerçek liste ekranında eklenir |
| İstemci durumu | Zustand (sadece gerekiyorsa) | 5 | Redux kullanılmaz |
| Tarih | date-fns (+ `tr` yerel ayarı) | 4.4.0 | `moment.js` kullanılmaz |
| Unit test | Vitest + Testing Library | 4 | |
| E2E test | Playwright | 1.62 | Masaüstü + 375px mobil viewport |
| Erişilebilirlik denetimi | `@axe-core/playwright` | — | CI'da kritik ihlal = kırmızı |
| Performans denetimi | Lighthouse CI + `size-limit` | — | Performans bütçesi kapısı (`07-ui-design-system.md`) |
| Hata takibi | Sentry (`@sentry/nextjs`) | — | Ücretsiz katman |
| Hız sınırı | Ayrı paket yok — Postgres sayaç tablosu | — | Sunucusuzda bellek sayacı çalışmaz · ADR ile kabul edildi |
| Lint/Format | ESLint + Prettier | 9 / 3 | ESLint 10 kullanılamıyor, aşağıya bak |
| CI | GitHub Actions | — | |
| Hosting | Vercel | — | |
| Dosya depolama | Vercel Blob | — | Repoya dosya yüklenmez |
| Konteyner | Docker + Docker Compose | — | Sadece local geliştirme ve öğrenme amaçlı |
| Mobil | Expo (React Native) | — | Aynı REST API'yi tüketir |

## Sürüm tavanları — neden en yenisi değil

Bunlar tercih değil, **kısıt**. Kısıt kalkınca yükseltilir.

| Paket | Kullanılan | En yenisi | Neden yükseltilmedi |
|---|---|---|---|
| TypeScript | 6 | 7 | `typescript-eslint` TS 7'yi desteklemiyor (peer aralığı `<6.1.0`). TS 7'ye çıkmak lint kapısını tamamen devre dışı bırakırdı |
| ESLint | 9 | 10 | `eslint-config-next`'in içindeki `eslint-plugin-import` ve `eslint-plugin-jsx-a11y` en fazla ESLint 9 kabul ediyor |
| Node.js | 24 | 26 | 24 Active LTS; 26 henüz LTS değil (`00-stack.md` "Node.js LTS" kuralı) |

## Kimlik doğrulama — bilinen tuzak

`next-auth` (Auth.js) v5 hâlâ **beta** yayınlanıyor (`5.0.0-beta.*`); `latest`
etiketi v4'te. Daha önemlisi, **kaynak koddan doğrulanmış** bir sınır var
(`@auth/core` → `assert.ts`):

> `"Signing in with credentials only supported if JWT strategy is enabled"`

Yani **şifreyle giriş, veritabanı oturumu stratejisiyle çalışmıyor.** Oturumun
anında iptal edilebilir olması gerekiyorsa (çıkış ve şifre değişimi tüm
oturumları gerçekten düşürsün — `05-auth-security.md`) şifre girişi **elle**
yazılır; Auth.js yalnızca OAuth sağlayıcıları için kullanılır. Bu karar her
projede ADR ile kayda geçer.

## Backend kurgusu — Next tek başına mı, Next + NestJS mi

**Varsayılan: Next.js tek başına** (arayüz + Route Handler API, tek deploy
hedefi). Ayrı backend, ikinci bir deploy · CORS · kimlik doğrulamanın iki
tarafta kurgulanması · tiplerin elle paylaşılması · yerel geliştirmede dört
süreç demektir. Bu bedel **karşılığı varsa** ödenir.

⛔ **Soruları sormadan önce NEDEN sorulduğunu söyle:**

> *"Dört soru soracağım. Amacım şunu belirlemek: her şeyi tek bir programda mı
> yazacağız (Next.js), yoksa arayüzü ve API'yi ayrı iki programa mı böleceğiz
> (Next.js + NestJS). Ayırmanın bedeli var — iki deploy, ek ayar, iki yerde
> kimlik doğrulama — bu yüzden karşılığı olmadan ayırmıyoruz."*

**Sorularda geçen terimler:**

| Terim | Ne demek |
|---|---|
| **İstemci / tüketici** | API'den veri çeken program (web arayüzü, mobil uygulama, başka kurumun sistemi) |
| **Zamanlanmış görev** | Kimse ekranı açmasa da belirli saatlerde kendiliğinden çalışan iş |
| **Webhook** | Dış bir sistemin sana istek atması (ödeme sağlayıcısının "ödeme tamamlandı" bildirimi gibi) |
| **DI yaşam döngüsü** | Bir nesnenin bellekte ne kadar yaşayacağı: uygulama boyunca tek kopya mı, her istekte yeni mi |
| **Sunucusuz platform** | Vercel gibi, sürekli açık bir sunucu yerine istek geldikçe çalışan ortamlar |

**Sorular. Hepsi "hayır" ise Next tek başına; en az biri "evet" ise
Next (arayüz) + NestJS (API + worker):**

1. API'yi kendi web arayüzünden **başkası** tüketecek mi? (mobil uygulama,
   başka bir sistem)
2. Kullanıcı istek atmasa da **kendiliğinden** çalışması gereken iş var mı?
   (gece çalışan tarama, zamanlanmış hatırlatma, webhook karşılama)
3. Katmanlı mimari, **DI yaşam döngüsü** ve çok modüllü bir yapı gerekiyor mu?
4. Kod kurumun **kendi sunucusunda** mı çalışacak? (sunucusuz platform yok)

**Gerekçe:** Next Route Handler ile API yazılabilir ama üç şeyi veremez —
sürekli çalışan arka plan süreci, DI konteyneri ve yaşam döngüleri, zorlanan
katman sınırları. Bunlara ihtiyaç yoksa ikinci sunucu saf maliyettir.

⛔ **"Ayrı backend" kararı ADR'siz alınmaz.** Hangi koşulun sağlandığı yazılır.

Ayrı backend seçildiyse:

| Konu | Seçim | Gerekçe |
|---|---|---|
| Çatı | **NestJS** (çıplak Express değil) | Nest zaten Express'in üstünde çalışır; ayrıca modül, DI, Guard, Interceptor, Pipe, Filter getirir. Çıplak Express yalnızca 5–10 uçlu tek amaçlı serviste |
| HTTP adaptörü | **Express** (Nest varsayılanı) | İstek süresinin ~%95'i veritabanında geçer; HTTP katmanını hızlandırmak toplamda ölçülemez. Emek index'lere harcanır. *(Fastify adaptörü tek satırla değişir — ama ölçmeden geçilmez)* |
| API biçimi | **REST** (varsayılan) | Karar kuralı aşağıda — "API biçimi" |
| Sürümleme | `/api/v1/...` baştan | Kural `03-api-guidelines.md` → "Sözleşme ömrü"nde. Mobil varsa zorunlu |
| Monorepo aracı | pnpm workspaces + **Turborepo** | Yapı `01-architecture.md`'de. Nx daha güçlü ama kendi eklenti dünyasını getirir — bu boyutta gereksiz |
| Tip paylaşımı | `packages/contracts` | Zod şeması tek yerde; API alanı değişince frontend **derlenmez**, hata çalışma anına kalmaz |
| İş kuyruğu | BullMQ + Redis | Node'un fiili standardı; gecikmeli + tekrarlayan iş, retry, yatay ölçekleme |
| Log | `nestjs-pino` | JSON üretir; kurumsal toplama sistemleri düz metin toplayamaz (`12-operations-and-scaling.md`) |
| İstek bağlamı | `nestjs-cls` | Aktif kullanıcı ve correlation ID'yi katmanlara parametre geçmeden taşır; statik erişim yasağının karşılığı |

## API biçimi — REST tek başına mı, yanına GraphQL de mi

⚠️ **Bu bir "birini seç" sorusu değil.** REST ile GraphQL aynı sistemde yan yana
çalışabilir; ikisi de yalnızca **giriş kapısıdır**, arkalarındaki iş kuralları
ortaktır. Bugün REST yazmak, yarın GraphQL eklemeyi engellemez — yeter ki iş
kuralları HTTP'den bağımsız tutulsun (`01-architecture.md`).

**Varsayılan REST'tir.** GraphQL, aşağıdaki sorular cevaplanmadan eklenmez.

### Kullanıcıya sorulacak dört soru

⛔ **Soruları sormadan önce NEDEN sorulduğunu söyle.** Kullanıcı, cevabının
hangi karara dönüşeceğini bilmeden cevap veremez. Şu cümleyle aç:

> *"Şimdi dört soru soracağım. Amacım şunu belirlemek: API'nin yalnızca REST
> olarak mı yazılacağı, yoksa yanına bir de GraphQL kapısı mı ekleneceği.
> Cevaplarına göre hangisinin daha mantıklı olduğunu birlikte göreceğiz."*

**Sorularda geçen terimler — sormadan önce açıkla:**

| Terim | Ne demek |
|---|---|
| **İstemci (client)** | API'ye istek atan program. Senin web arayüzün, mobil uygulaman, başka bir kurumun sistemi — hepsi birer istemci |
| **Tüketici (consumer)** | Aynı şey. "API'yi tüketmek" = o API'den veri almak |
| **İzleme (monitoring)** | Sistem canlıdayken neyin yavaşladığını, neyin hata verdiğini gösteren araçlar. Kurumlarda genelde DevOps ekibinin kurduğu ayrı bir sistem |
| **Önbellek (cache)** | Sık istenen verinin geçici olarak saklanması; aynı istek tekrar gelince veritabanına gitmeden cevaplanır |

**Sorular. Hepsine "hayır" ise REST tek başına yeterlidir** ve GraphQL gündeme
getirilmez:

1. **API'yi senin yazmadığın istemciler tüketecek mi?**
   Yani senin kontrol etmediğin programlar bu API'den veri çekecek mi —
   başka bir müdürlüğün sistemi, yüklenici firmanın portalı, merkezî bir devlet
   sistemi, açık veri portalı gibi.
   *(Kendi web'in ve kendi mobilin "hayır" sayılır — onları sen yazıyorsun.)*

2. **Tüketicilerin veri ihtiyaçları birbirinden belirgin farklı mı?**
   Biri kaydın 3 alanını isterken diğeri 25 alanını mı istiyor? Yoksa hepsi
   aşağı yukarı aynı bilgiyi mi kullanıyor?

3. **Tüketicileri sen güncelleyemiyor musun?**
   API'de kırıcı bir değişiklik yaptığında, o istemcilerin kodunu düzeltmek
   senin elinde mi, yoksa başka bir ekibi beklemek zorunda mısın?

4. **İzleme ve önbellek kurumun altyapısına mı bağlı?**
   Sistemi canlıda sen mi izleyeceksin, yoksa DevOps ekibinin kendi araçları mı?
   → ⚠️ Bu soruya **"evet"** cevabı GraphQL'in **aleyhinedir**, lehine değil.
   Sebebi aşağıda.

### Dördüncü sorunun ağırlığı

Kurum projelerinde sistemi canlıda **DevOps ekibi** izler. GraphQL'de tüm
istekler tek adrese (`/graphql`) gittiği için *"hangi uç yavaşladı, hangisi hata
veriyor"* sorusu izleme aracında **görünmez.** Aynı sebeple HTTP önbelleği de
devre dışı kalır.

⛔ Kurum projesinde bu iki kayıp, açık bir gerekçe olmadan kabul edilmez.

### GraphQL eklenirse

Mevcut REST kaldırılmaz; yanına ikinci bir kapı açılır ve **servis katmanına
dokunulmaz.** Karar ADR ile kayda geçer; ADR'de yukarıdaki dört sorudan
hangilerinin "evet" olduğu yazılır.

⚠️ Bedeli baştan yazılır: HTTP önbelleğinin kaybı, izlemenin körleşmesi,
yetkilendirmenin alan bazına inmesi, N+1 sorgu riski ve bunlar için gereken ek
çözümler.

### Terim notu

REST bir mimari **stildir**; onunla yazılmış sisteme **RESTful** denir.
GraphQL ise bir **sorgu dili ve şartnamedir** — "GraphQL-ful" gibi bir sıfat
yoktur, yalnızca *"GraphQL API"* denir. REST'e uyum **derecelidir**, GraphQL
şartnamesine uyum **ikilidir**.

## Kullanılmayacaklar

Her madde **neden** kullanılmadığını söyler. ⛔ Gerekçesiz yasak sonraki
oturumda delinir. Bir maddenin gerekçesi bu projede geçerli değilse **yasak da
geçerli değildir** — o zaman ADR yazılır ve karar gerekçesiyle değiştirilir;
madde sessizce çiğnenmez.

- **MongoDB** — bu kitin hedeflediği işler (başvuru, kayıt, randevu, yetki,
  ödeme) **ilişkiseldir**: yabancı anahtar, bütünlük kuralı ve çok tablolu
  transaction ister. Postgres bunları veritabanı seviyesinde zorlar; Mongo'da
  yabancı anahtar ve bildirimsel bütünlük yoktur, aynı garantiler uygulama
  koduna taşınır ve ilk eşzamanlı istekte kaybedilir (`04-database.md` →
  benzersiz index + transaction).
  ⭐ **Meşru istisna:** şeması gerçekten belirsiz, ilişkisiz ve yüksek hacimli
  veri (ham log, olay akışı, sensör kaydı). Böyle bir modül çıkarsa bu bir yasak
  değil **ADR konusudur** — Postgres `jsonb` ile karşılaştırılır, ölçülür, karar
  yazılır.
- **Redux / MobX** — durum ikiye ayrılır: sunucu durumu ve istemci durumu.
  Sunucu durumunu TanStack Query zaten önbellek, yeniden deneme ve geçersiz
  kılmayla yönetiyor; geriye kalan istemci durumu Zustand'ın birkaç satırıyla
  çözülüyor. Redux bu ikisinin üstüne yalnızca kalıp kod ekler.
- **Çıplak Express backend** — Nest zaten Express'in üstünde çalışıyor ve modül
  yapısını, bağımlılık enjeksiyonunu hazır getiriyor. Çıplak Express aynı yapıyı
  elle kurmayı gerektirir ve her projede farklı çıkar; ortak kural yazılamaz.
- **jQuery, Bootstrap, Material UI** — Tailwind + shadcn'in yanında **iki ayrı
  stil sistemi** oluşur: özgüllük (specificity) savaşları, çifte paket boyutu ve
  iki farklı token kaynağı. `07-ui-design-system.md` tek token ölçeği şart koşuyor.
- **`moment.js`** — geliştiricileri tarafından **bakım moduna alındı** ve yeni
  projeler için önerilmiyor. Ayrıca değişken (mutable) API'si var ve ağaç
  sarsmaya (tree-shaking) kapalı. Yerine `date-fns` + `tr` yerel ayarı.
- **TypeORM** — Prisma tercih edilir (4 kat yaygın, şema tek dosyada okunur,
  `synchronize` gibi veri kaybettiren bir kestirme yolu yok).

<!-- ⛔ SENKRON SINIRI — bu satır MAKİNE tarafından okunur, SİLİNMEZ.
     /kit-senkron bu satırı arar; bulamazsa bu bölümün TAMAMINI senkron dışı
     bırakır ve kite sonradan yazılan genel bir yasak bu projeye hiç ulaşmaz.
     2026-08-11'de tam olarak bu yaşandı. -->

### ⬆ Yukarısı KİTTEN gelir · ⬇ Aşağısı YALNIZCA bu proje

| | Yukarıdaki maddeler | Aşağıdaki maddeler |
|---|---|---|
| Kimin | Her projede aynı, kitten gelir | Yalnızca bu projeye ait |
| Kim değiştirir | `/kit-senkron` — **elle değiştirilmez** | Bu projede sen yazarsın |
| Kite geri gider mi | Zaten kitte | **Hayır**, projede kalır |

Aşağıya bu projede kullanılmayacak şeyleri **gerekçesiyle** yaz. Gerekçesiz
madde yazma: sonraki oturum anlamaz ve delmeye çalışır.

<!-- Örnek biçim (bu yorumu silip altına yazabilirsin):
- Docker — bu proje yalnızca Vercel'e çıkıyor, local'de de ihtiyaç olmadı
-->

## Sürüm sütunu nasıl doldurulur

Yukarıdaki tablo bir **başlangıç noktasıdır**, kanıt değildir. Kurulum bitince
sürümler `package.json` ile **birebir eşitlenir**. En yenisi kullanılmıyorsa
**neden kullanılamadığı** yazılır — yoksa sonraki oturum "unutulmuş" sanıp
yükseltmeye çalışır ve aynı duvara toslar.

## Sürüm politikası
- Node.js LTS (>=20). Sürüm `.nvmrc` ile sabitlenir.
- Bağımlılıklar `package-lock.json` ile kilitlenir; `^` ile geniş aralık bırakılmaz.
  `package.json` içinde sürümler **tam** yazılır (`16.2.12`, `^16.2.12` değil).
- Major sürüm yükseltmesi ayrı PR olur, feature PR'ına karıştırılmaz.
- Bir bağımlılıkta yamalanmış sürüm varsa ama bağımlılık ağacı eskisini çekiyorsa,
  `package.json` → `overrides` ile yükseltilir ve gerekçesi PR'da yazılır.

## ⛔ STACK KURULURKEN HER TEKNOLOJİNİN GÜNCEL ALTERNATİFİ TARANIR

Yazılım sürekli değişiyor. Bu dosyadaki tercihler **yazıldıkları gündeki**
ölçümlere dayanıyor; bugün hâlâ doğru oldukları **varsayılamaz.**

⛔ **Kurulumda (Adım 1) stack listesi hafızadan aktarılmaz.** Her satır için
ajan şunu fiilen çalıştırır:

```bash
npm view <paket> version time.modified          # hâlâ bakımda mı
curl -s https://api.npmjs.org/downloads/point/last-week/<paket>   # ne kadar yaygın
```

### Ne zaman kullanıcıya sorulur

| Bulgu | Ajan ne yapar |
|---|---|
| Seçili paket hâlâ yaygın ve bakımda | Sessizce devam eder — soru sorulmaz |
| Seçili paketin **son yayını 18 aydan eski** | ⚠️ Bildirir, alternatifi ölçer, **sorar** |
| Ölçülebilir biçimde **daha yaygın** bir alternatif çıkmış | ⚠️ İki rakamı yan yana koyar, **sorar** |
| Alternatif niş ama teknik olarak üstün | Bildirir ama **önermez** — yaygınlık kriteri kazanır |

⛔ **Ajan tek başına stack değiştirmez.** Bulgu sunulur, karar geliştiricinin.
Sebebi: projeyi o sürdürecek ve o teknolojiyi o öğrenecek.

### Karar verildikten sonra

| Karar | Nereye yazılır |
|---|---|
| Değişiklik **kabul edildi** | Projede ADR + `docs/project/teknoloji-ve-plan.md` |
| Değişiklik **her projede geçerli** | ⭐ `/kit-senkron` ile **bu dosyaya** — ölçüm tarihiyle birlikte |
| Değişiklik **reddedildi** | ADR'ye *"değerlendirildi, seçilmedi"* olarak — aynı soru bir daha araştırılmasın |

⭐ **Ölçüm tarihi olmadan rakam yazılmaz.** *"BullMQ 7.9M/hafta"* değil,
**"BullMQ 7.9M/hafta (2026-08 ölçümü)"**. Tarihsiz rakam, bir sonraki okuyucuya
güncel olduğunu **yanlış** söyler.

### ⭐ TARAMA NE ZAMAN TEKRARLANIR — katmanlı sıklık

Ölçüm tarihi yazmanın asıl işlevi budur: **eskiyeni görebilmek.**

⛔ Kurulumdaki tarama tek seferlik değildir. Ama **sabit ve sık bir takvim de
yanlıştır** — sebebi aşağıda. Üç katman var:

| Katman | Sıklık | Ne yakalar | Kim |
|---|---|---|---|
| Güvenlik ve sürüm | **Haftalık** | Yama, minor, major sürüm | 🤖 **Renovate** (otomatik PR/MR) |
| Ölçüm tazeleme | **6 ay** | Yaygınlık kayması, ölen paket | Ajan |
| **Olay tetikli** | **Anında** | Aşağıdaki dört an | Ajan |

#### ⭐ Tarihten bağımsız — HER ZAMAN taranacak dört an

Bunlar takvim beklemez; asıl değer buradadır:

| # | An | Neden |
|---|---|---|
| 1 | **`/yeni-proje` kurulumunda** | Zaten stack seçiliyor — en doğru an |
| 2 | ⭐ **Teslim / sunum / teknik inceleme öncesi** | Savunulacak her rakam güncel olmalı. Bayat bir ölçüm, incelemede tüm gerekçeyi çürütür |
| 3 | **Bir paket fiilen sorun çıkardığında** | Sorun, alternatife bakmak için yeterli sebeptir |
| 4 | **Major sürüm çıktığında** | Kırıcı değişiklik var mı, göç maliyeti ne |

#### ⛔ Neden 3 ay değil de 6 ay — gerekçe

**Renovate zaten haftalık çalışıyor** ve sürüm tarafını kapatıyor. Manuel
taramanın yakaladığı tek şey botun göremediğidir: *"paket ölüyor mu, yerine
daha yaygını çıkmış mı?"* Bu **yıllarla ölçülen** bir değişimdir — ekosistem
geçişleri (Jest→Vitest, Moment→date-fns) yıllar aldı.

⚠️ **Sık tarama kuralı öldürür.** Üç ayda bir bakılırsa cevap neredeyse her
seferinde *"değişmedi"* olur; sürekli "bir şey yok" diyen uyarı **kapatılan**
uyarıdır. Kuralın değeri yazılı olmasında değil, **uygulanmasında**.

#### Tarama nasıl yapılır

Bu dosyadaki **herhangi bir ölçüm tarihi 6 aydan eskiyse** — ya da yukarıdaki
dört andan biri geldiyse — ajan işe başlamadan önce tarar ve bulguyu bildirir:

> *"`00-stack.md`'deki ölçümler <tarih> tarihli, 3 aydan eski. Taradım:
> `<paket>` için durum değişmiş — <eski rakam> → <yeni rakam>. Diğerleri aynı.
> Değiştirelim mi?"*

**Ne aranır:**

| Kontrol | Eşik | Sonuç |
|---|---|---|
| Seçili paketin son yayını | 18 aydan eski | ⚠️ Bildir, alternatif ölç |
| Seçili paketin indirme sayısı | Belirgin düşüş | ⚠️ Bildir |
| Alternatifin indirme sayısı | Seçiliyi geçmiş | ⚠️ İkisini yan yana koy, sor |
| Ana sürüm atlamış mı | Yeni major | ⚠️ Kırıcı değişiklik var mı bak |

⛔ **Tarama sonucu otomatik uygulanmaz.** Bulgu sunulur, karar geliştiricinindir
(yukarıdaki kural). Değişmeyen satırların **tarihi yine de güncellenir** —
"baktım, aynı" bilgisi de bilgidir.

⚠️ **Tarama işi geciktirmez.** Oturumun asıl işi yapılır; tarama bulgusu
**ayrı bir başlıkta** sunulur ve kullanıcı isterse o zaman ele alınır.

---

## Yeni bağımlılık ekleme kuralı
Eklemeden önce sor ve şunu göster: ne işe yarıyor, alternatifi ne, paket boyutu,
son güncelleme tarihi, açık güvenlik uyarısı var mı. Tek fonksiyon için paket eklenmez.
