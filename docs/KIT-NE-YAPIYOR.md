# `proje-kiti` — Kit Ne Yapıyor

**Sürüm:** 1.92.0 · **Tarih:** 2026-09-06
**Depo:** github.com/bariskose9/bariskose-skills

Bu belge, kitin **kurulumdan canlıya çıkışa kadar** ne yaptığını anlatır.
Terimlerin İngilizcesi yanlarında parantez içinde verilmiştir.

---

## 1. Kit nedir, ne değildir

**Kit nedir:** boş bir klasörde `/yeni-proje` yazıldığında, soruları
cevaplayarak kurulmuş · test edilmiş · canlıya çıkmış bir proje elde etmeni
sağlayan bir **Claude Code eklentisi** (plugin).

**Kit ne değildir:** özellik yazan bir araç değildir. Kurulumu bitirir ve yol
haritasını (roadmap) çıkarır. Sonrasında proje adım adım ilerler ve **her
adımda plan sunulup onay beklenir.**

Vaat *"tek promptla uygulama"* değil, **"tek promptla doğru kurulmuş proje ve
net yol haritası"**.

### Dört komut

| Komut | Ne yapar |
|---|---|
| `/yeni-proje` | Sıfırdan proje kurar, canlıya çıkarır |
| `/kit-senkron` | Projede öğrenilen kuralı kite geri yazar |
| `/video-analiz` | YouTube videosundan eksik best practice çıkarır |
| `/pdf-uret` | Markdown belgeyi karanlık temalı PDF'e çevirir |

---

## 2. Dış bağımlılıklar — ne kullanıyor, ne için

Kit her şeyi kendi yapmaz; iki dış parçayı **çağırır**.

### Addy Osmani'nin `agent-skills` paketi

25 skill içeren, İngilizce, süreç odaklı bir kütüphane. Kit **onunu** çağırır:

| Skill | Kitin hangi adımında | Ne yapıyor |
|---|---|---|
| `interview-me` | Adım 3 (PRD görüşmesi) | Tek tek soru sorarak asıl isteneni çıkarır. Varsayım yapmadan, %95 netlik oluşana kadar sorar |
| `frontend-ui-engineering` | Arayüz kodu yazılırken | Bileşen kurgusu, durum yönetimi (state management) ve **"Avoid the AI Aesthetic"** bölümü — yapay zekânın tipik görsel varsayılanlarını (mor gradient, aşırı yuvarlak köşe, tek tip kart ızgarası) reddeder |
| `test-driven-development` | Özellik geliştirilirken | Önce başarısız test, sonra kod (RED → GREEN → REFACTOR) |
| `security-and-hardening` | Güvenlik denetiminde | Girdi doğrulama, oturum yönetimi, üçüncü parti entegrasyon riskleri |
| `code-review-and-quality` | Birleştirme (merge) öncesi | Doğruluk, okunabilirlik, mimari, güvenlik, performans — beş eksenli inceleme |
| `source-driven-development` | Kütüphane kullanılırken | Resmi dokümandan doğrulama — ezberden eski kalıp yazmayı engeller |
| `browser-testing-with-devtools` | Doğrulamada | Chrome DevTools ile gerçek tarayıcıda kontrol |
| `debugging-and-error-recovery` | Bir şey bozulduğunda | Yeniden üret → yerini bul → düzelt → koruma testi yaz |
| `incremental-implementation` | Özellik geliştirilirken | İnce dikey dilim; her dilim ayrı doğrulanır |
| `doubt-driven-development` | Yüksek riskli kararda | Kararı taze bağlamla çapraz sorgular (kamu hizmeti, geri alınamaz işlem) |

⚠️ **Çakışma olursa kitin kendi standardı üstündür.** Sebebi: kitin kuralları
Türkçe ve bu stack'in token sistemine bağlı.

⛔ **Addy'nin paketinde SEO ile ilgili hiçbir şey yoktur** (ölçüldü: `seo`,
`sitemap`, `canonical`, `schema.org` → sıfır sonuç). SEO tamamen kite aittir.

### `chrome-devtools` MCP

Tarayıcıyı fiilen sürer: sayfayı açar, tıklar, ekran görüntüsü alır, konsol ve
ağ hatalarını okur. Kitin *"kod okuyup çalışması lazım demek yeterli değil,
kanıt getir"* kuralı ancak bununla geçilebilir.

### Kullanılmayanlar

**gstack** ve **superpowers** kurulu **değildir**. Katkıları kural olarak kite
alındı, paketleri yedeğe kaldırıldı. Sebep: dördü açıkken ~99 skill açıklaması
her oturuma yüklenir (seçim gürültüsü), ve superpowers'ın *"insana sorma,
devam et"* kuralı kitin *"plan sun, onayımı bekle"* kapısıyla çelişir.

---

## 3. Akış — `/yeni-proje` sekiz adımda ne yapar

### Adım 0 — Bağımlılıklar
Addy'nin paketi ve chrome-devtools MCP kurulu mu bakar, **yalnızca eksik olanı**
kurar. ⛔ Bu adım hiçbir skill'i çalıştırmaz, sadece kurar.

### Adım 1 — Kimin için, elde ne var, dayatılan ne var
⛔ **Bu adım teknoloji kararı VERMEZ**, yalnızca kısıtları toplar:
- **Bu proje kimin için?** `kendi projem` / `kurum projesi` — sonraki her şeyi
  bu belirler
- Web mi, mobil (Expo) mi, ikisi mi (mobil son adımdır ama **ilk gün** sorulur)
- ⭐ **Elimizde ne hazır** — sekiz senaryo: veritabanı bizde mi, tablolar hazır
  mı, API var mı, kimlik kurumdan mı geliyor, eski sistemle entegrasyon var mı
- Kurum bir teknoloji **dayatıyor mu** — dayatma kitin varsayılanını yener
- Klasör boşsa devam eder; doluysa **ne olduğuna bakar** ve gerekirse durup sorar

### Adım 2 — Kit dosyalarını yerleştir
19 standart (`docs/standards/00–18`), `CLAUDE.md` (ajan kuralları),
`CALISMA-KILAVUZU.md` (kullanıcı kılavuzu), VS Code eklenti önerileri.

### Adım 3 — PRD (en kritik adım)
`interview-me` ile **tek tek** soru. Netleşmeden geçilmez:
kim kullanacak · hangi problem · **kapsam dışı ne** · roller · iş kuralları ·
hata durumları · **aynı anda kaç kişi ve ne zaman** · arka planda iş var mı.

⭐ **Değer sorusu:** her özellik için *"yapılmalı mı"* sorulur —
*"Bu ekran hangi problemi çözüyor? Olmasaydı kullanıcı ne yapardı?"*
Kurum projesinde ayrıca kıymetli: analiz birimi çoğu zaman **çözümü** yazar,
**problemi** değil.

Ayrıca sorulur: **aynı anda kaç kişi ve ne zaman** (ani yük planı buna bağlı) ·
**arka planda çalışacak iş var mı** (e-posta, PDF, görsel işleme → kuyruk baştan
kurulur; yoksa kurulmaz).

**Görüşmenin sonunda** tasarım yönü ve SEO kapsamı sorulur (ürün önce,
görünüm sonra).

### Adım 3b — Stack kararı
⭐ **Teknoloji şimdi seçilir, PRD bittikten sonra.** Backend kurgusu (4 soru),
API biçimi (4 soru), iş kuyruğu ve ani yük önlemleri burada karara bağlanır.

*Gerekçe:* o sorular aslında **ürün sorusudur** — *"API'yi başkası tüketecek mi",
"kendiliğinden çalışan iş var mı"*. Cevapları PRD'de çıkar. Önce sorulursa
kullanıcı tahmin ederek cevaplar ve mimari yanlış temele oturur.

Sonra stack listesi **ölçülür** (`npm view` + haftalık indirme), kitin
varsayılanından sapıldıysa **ADR yazılır** ve `CLAUDE.md` §0 tamamlanır.

### Adım 4 — Yol haritası ve ilk kararlar
Adımlar bağımlılık sırasına göre. ADR'ler (Architecture Decision Record —
mimari karar kaydı) yazılır.

**Kapanışta roadmap altı gözle denetlenir:** ürün · risk · geri alınabilirlik ·
**dış bağımlılık** · mühendislik · kullanım.

### Adım 5 — İskeleti kur
Framework, TypeScript strict, lint + format, git, `.env.example`.

⭐ **Sonra çalışan şey gösterilir** — `pnpm dev` açılır, ekran görüntüsü
alınır, `prisma studio` ile tablolar gösterilir. ⛔ Kullanıcı ilk çalışan şeyi
görmeden hiçbir hesap açmaz, hiçbir ödeme yapmaz. Dosya listesi kanıt değildir.

### Adım 6 — Yayın (Adım 1'deki cevaba göre ikiye ayrılır)
- **6a Kendi projem:** GitHub + hosting + veritabanı + CI + sağlık ucu
  (health endpoint) + **bölge eşleşmesi** + arama motoruna tanıtma
- **6b Kurum projesi:** deploy edilmez, DevOps'un çalıştıracağı **teslim paketi**
  üretilir (Dockerfile, docker-compose, `.env.example`, README) ve **kendi
  makinende doğrulanır**

### Adım 7 — Son kontrol
Yirmi iki maddelik liste: şablonlar dolduruldu mu, tasarım ADR'si yazıldı mı,
ekran görüntüsü alınıp **bakıldı** mı, SEO kuruldu mu, bölgeler eşleşti mi.

---

## 3b. Kurulumdan sonra — her özellikte ne oluyor

Kurulum bitince kit devreye girmeye devam eder. Her özellik bittiğinde:

### Beş gözle doğrulama (`06-testing.md`)

Testlerin yeşil olması "bitti" demek değil. Sırayla beş göz:

| # | Göz | Kim bakar |
|---|---|---|
| 1 | **Backend** — mutlu yol, hata yolları, yetkisiz erişim, sınır değerler, eşzamanlılık | Ajan kanıt sunar |
| 2 | **Veri** — kayıt gerçekten yazıldı mı, `prisma studio` ile bakılır | **Kullanıcı görür** |
| 3 | **Frontend** — 375/768/1440px, açık+koyu tema, konsol hatası, dört ekran durumu | Ekran görüntüleri |
| 4 | **Tasarım / UX** — tasarım ADR'sine uygun mu, AI slop var mı | ⭐ **Kullanıcının katmanı** |
| 5 | **Güvenlik + işletme** — yetki, girdi doğrulama, N+1 sorgu, performans bütçesi | Ajan kanıt sunar |

### Etki alanı
Her özellikte üç soru **yazılı** cevaplanır: hangi başka ekranlar · hangi başka
API uçları · hangi eski kayıtlar etkilendi. ⛔ *"Sadece şu dosyaya dokundum"*
cevap değildir; etkilenenlerden en az biri fiilen açılır.

### Öğretme zorunluluğu
Ajan ne kontrol ettiğini **ve neden o kontrolü yaptığını** anlatır. ⛔ *"Test
geçti"* tek başına rapor değildir — neyin test edildiği söylenmezse neyin test
**edilmediği** bilinemez. Yeni terimler `ogrendiklerim.md`'ye eklenir.

### Dış QA aracı (TestSprite vb.)
Tek kişilik ekipte **gerekmez** — chrome-devtools MCP, TDD, axe ve Lighthouse
zaten var; ek araç ek bakımdır. Bağımsız QA yükümlülüğü veya ekip büyümesi
varsa ADR ile değerlendirilir.

## 4. On dokuz standart

| # | Dosya | Kapsam |
|---|---|---|
| 00 | Stack | Teknoloji seçimleri — **başlangıç noktası, dondurulmuş liste değil.** Her projede yeniden ölçülür · **kuyruk kararı: sunucusuzda BullMQ çalışmaz** |
| 01 | Mimari | Katman sırası: UI → API → Servis → Repository → Veritabanı. **Katman atlanmaz** |
| 02 | Kod standartları | Adlandırma, yorum, hata yönetimi, ESLint/Prettier çakışması |
| 03 | API | Sözleşme (contract), sürümleme, hata biçimi, sayfalama (pagination) |
| 04 | Veritabanı | Tablo, ilişki, index, migration (şema göçü), yumuşak silme · **veri modelini görme: Prisma Studio + ER diyagramı** |
| 05 | Kimlik/Güvenlik | Oturum, token ömürleri, **`tokenVersion` ile iptal**, yetkilendirme |
| 06 | Test | Piramit: çok unit, orta entegrasyon, az uçtan uca (E2E) · **beş gözle doğrulama, etki alanı, öğretme** |
| 07 | Arayüz/Tasarım | Token'lar, karanlık tema, responsive, **AI slop yasakları**, hareket (motion), erişilebilirlik (a11y) |
| 08 | Git | Dal (branch), commit biçimi, PR, geri alma (rollback) |
| 09 | CI/CD | Paketleme, otomatik test, Lighthouse ve axe kapıları |
| 10 | Definition of Done | "Bitti" ne demek — işaretlenmeden iş bitmez |
| 11 | Ajanla çalışma | Bağlam yönetimi, belirsizlikte davranış, **üçüncü başarısız düzeltmede dur** |
| 12 | Çalıştırma/Ölçekleme | İzleme, log, **bölge eşleşmesi**, **ani yük (spike traffic)** |
| 13 | Ortamlar | Local · preview · canlı; preview `noindex` |
| 14 | Gizlilik/KVKK | Hesap silme, veri hakları, denetim kaydı (audit log) |
| 15 | Oturum devri | Sonraki oturumun bilmesi gereken her şey dosyaya yazılır |
| 16 | Proje kurulumu | Kurulum protokolü |
| 17 | Mobil | React Native + Expo, mağaza yayını |
| 18 | SEO | Render stratejisi, URL, meta, JSON-LD, site haritası, Search Console |

---

## 5. Ajan kapıları — `CLAUDE.md`

Kitin en belirleyici parçası. Ajanın **neyi yapamayacağını** söyler:

**Sekiz kapı var**, hepsi atlanamaz:

| # | Kapı |
|---|---|
| 1 | `interview-me` ile **tek tek** soru sor, varsayım yapma |
| 2 | **Plan sun, onay bekle** — kod yazmadan önce, her zaman |
| 3 | `security-and-hardening` çalıştır — girdi, auth, ödeme, dosya, dış API |
| 4 | Test yaz, çalıştır, yeşil olduğunu göster |
| 5 | `code-review-and-quality` çalıştır — her commit öncesi |
| 6 | `10-definition-of-done.md` kapılarını geç |
| 7 | `15-oturum-devri.md` protokolünü uygula — her adım bitiminde |
| 8 | Öğrenilen kuralı **iki kopyaya da** yaz ve `diff` ile kanıtla |

⚠️ Ayrıca `CLAUDE.md` §6.3: commit öncesi **üç aşamalı doğrulama** —
otomatik testler · güvenlik denetimi · **tarayıcıda fiilen tıklayarak** kontrol.
Kod okuyup *"çalışması lazım"* demek kanıt sayılmaz.

Ve iş bölümü kuralı: ⛔ **Ajanın yapabildiği hiçbir iş kullanıcıya
yaptırılmaz.** Kullanıcının zamanı yalnızca ajanın *yapamadığı* işler için
harcanır (hesap açma, ödeme, kurumdan yetki alma).

---

## 6. Bu kit nasıl gelişiyor

Kit, gerçek projelerde yapılan hatalardan büyüyor. Döngü:

```
Projede bir hata yapılır veya daha iyi bir yol bulunur
        ↓
/kit-senkron çalıştırılır
        ↓
Fark üç kutudan birine konur:
  • Kalıcı kural      → kite yazılır
  • Projeye özel      → projede kalır
  • Kitten gelen yeni → projeye getirilir
        ↓
Sürüm artırılır, GitHub'a push edilir
        ↓
Kullanan herkes /plugin update ile çeker
```

⛔ **Bir kural projeye özel hâle geliyorsa o kural yanlış yazılmıştır.**
Kural düzeltilir, projeye göre dallandırılmaz. Framework'ü çürüten şey
dallanmadır: üç proje sonra elinde birbirinden sapmış üç kopya olur.

---

*Bu belge `proje-kiti` v1.92.0 için üretilmiştir. Kit değiştikçe güncellenir —
sürüm satırı `plugin.json` ile eşleşmezse `denetim.mjs` commit'i durdurur.*
