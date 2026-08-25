---
name: video-analiz
description: YouTube videosunu transkriptinden analiz eder ve kitte eksik olan best practice'leri bulur. Videodaki iddiaları docs/standards/ ile karşılaştırır, üç kutuya ayırır (zaten var / eklenmeli / eklenmemeli), rakamları npm ile ölçer ve kullanıcıya onaylatır. "Şu videoyu incele", "bu videodan kite ne eklenmeli", "/video-analiz <url>" denince kullan.
---

# Video Analizi — kitte ne eksik

Kullanıcı bir YouTube linki verip *"incele, işimize yarayacak bir şey var mı"*
dediğinde bu akış çalışır.

**Aranan şey:** sürdürülebilir **web + mobil full-stack** uygulama için
mimari ve mühendislik pratikleri — ve özellikle **kitin hiç dosyası olmayan
bir alan**.

**Dil:** Kullanıcıyla Türkçe konuş.

---

## ⛔ ÖNCE SINIRI SÖYLE

**Video izlenemez, ses duyulamaz. Okunabilen tek şey altyazı metnidir.**

Bunun somut sonucu: videonun değeri **ekrandaki kodda veya diyagramda** ise ve
anlatılmıyorsa **kaçırılır**. Bunu kullanıcıya analiz başında söyle, sonunda
değil.

⛔ Altyazı yoksa analiz **yapılamaz**. Videonun konusunu başlıktan tahmin edip
uydurma — *"bu videoda altyazı yok, analiz edemiyorum"* de ve dur.

---

## Adım 1 — Transkripti al

```bash
node "$CLAUDE_PLUGIN_ROOT/skills/video-analiz/bin/yt-transkript.mjs" "<url>" [dil]
```

Dil varsayılanı `tr,en`. Araç başlık, kanal, süre, **yayın tarihi** ve metni
verir.

### ⛔ ÇALIŞMAZSA: İLK ÇARE GÜNCELLEMEKTİR, BAŞKA ARAÇ ARAMAK DEĞİL

Araç bunu **kendisi** yapar: başarısız olursa `yt-dlp`'yi günceller ve bir kez
daha dener. Ama neden böyle olduğunu bilmen gerekiyor:

**YouTube transkript erişimini düzenli olarak kırar.** 2026-08 ölçümü —
kurulum gerektirmeyen iki yol da **ölü**:

| Yol | Sonuç |
|---|---|
| `youtube.com/api/timedtext` (curl) | **0 bayt** |
| Aynısı sayfanın kendi bağlamından, çerezli `fetch` | HTTP 200 ama **0 bayt** |
| Oynatıcının transkript paneli (Chrome DevTools ile DOM) | Düğme bulunuyor, panel **boş** |

`yt-dlp` çalışıyor çünkü YouTube'un JS doğrulamalarını çözüyor — ve **tam bu
yüzden sürekli bakımda.** Bozulması beklenen bir durumdur, arıza değil.

⛔ **Araç bozulduğunda yapılmayacaklar:** başka bir kütüphane aramak · web
kazıma denemek · "transkript alınamıyor" deyip pes etmek.
✅ **Yapılacak:** güncelle, tekrar dene. Araç bunu otomatik yapıyor; elle
gerekirse:

```bash
yt-dlp -U                      # tek dosya kurulumu
brew upgrade yt-dlp            # macOS
winget upgrade yt-dlp.yt-dlp   # Windows
pip3 install -U yt-dlp         # her yerde
```

Güncellemeden **sonra da** çalışmıyorsa YouTube yeni bir engel koymuştur.
O zaman kullanıcıya söyle ve videoyu ondan **özet olarak anlatmasını iste** —
uydurma.

### Kurulum

Araç `yt-dlp` yoksa **kendisi kurar** (macOS `brew`, Windows `winget`/`pip`,
Linux `pip3`). Kurulum başarısız olursa elle kurulacak komutu yazar.

---

## Adım 2 — ⭐ Bozuk terimleri bağlamdan düzelt

**Otomatik altyazı teknik terimleri duyduğu gibi yazar.** Bu beklenen bir
durumdur ve düzeltmek **senin işin** — betiğin değil, çünkü olası bozulmalar
önceden sayılamaz.

Sık görülenler:

| Altyazıda | Aslında | Nasıl anlaşılır |
|---|---|---|
| *"zod / sod / zaad"* | **Zod** | Yanında "schema", "validation" geçiyor |
| *"nest chest / next js"* | **NestJS** / **Next.js** | "decorator, module, DI" → Nest; "app router, SSR" → Next |
| *"prism a / prisma"* | **Prisma** | Yanında "ORM", "migration", "schema" |
| *"tan stack / tanstack"* | **TanStack Query** | "cache, invalidate, refetch" |
| *"sequel / my sequel / post gres"* | **SQL / MySQL / PostgreSQL** | Bağlamdan |
| *"cubernetes / doctor"* | **Kubernetes** / **Docker** | "container, image, pod" |
| *"react native / expo" karışması* | Bağlama bak | "bare workflow, EAS" → Expo |

**Kural:**

✅ **Düzelt** — bağlamdan **tek bir makul karşılık** çıkıyorsa. *"Şema
doğrulaması için zaad kullanıyorum"* → **Zod**, tereddüt yok.

⛔ **Uydurma** — birden fazla makul karşılık varsa veya iddianın anlamı
belirsizse. Kullanıcıya söyle: *"Şu cümlede geçen X terimini çözemedim, videonun
şu dakikasında ne diyor?"*

⚠️ **Sayı ve sürüm numaralarına ASLA güvenme.** Otomatik altyazı sayıları en
çok bozduğu yerdir (*"on sekiz"* → 18 mi 80 mi). Bir rakam analizin dayanağı
olacaksa **Adım 5'te ölç**, videodaki sayıyı kullanma.

---

## Adım 3 — İddiaları çıkar

Transkripti oku ve **madde madde** çıkar: video ne öneriyor, neyi yasaklıyor,
hangi gerekçeyi veriyor.

Her iddiayı **kural cümlesine** çevir — kite giren şey kuraldır:

| Videodaki cümle | Kural hâli |
|---|---|
| *"Ben her yerde Zod kullanıyorum"* | Şema tek yerde tanımlanır; istemci ve sunucu **aynı** şemayı kullanır |
| *"Bunu bir monorepo'da tutun"* | Paylaşılan tipler tek pakette yaşar, kopyalanmaz |

⛔ **Araç adı kite yazılmaz, kural yazılır.** Gerekçesi `00-stack.md`'de:
kit araç seçmez, kural koyar — böylece stack değiştiğinde kit bozulmaz.
Araç adı olsa olsa **örnek** olarak parantez içinde geçer.

---

## Adım 4 — Kitle karşılaştır

`docs/standards/` klasörünün tamamını tara. Her iddiayı **üç kutudan** birine at:

| Kutu | Anlamı | Ne yazılır |
|---|---|---|
| ✅ **Zaten var** | Kit bunu zaten söylüyor | Hangi dosya, hangi başlık — kullanıcı görsün |
| ➕ **Eksik, eklenmeli** | Kitte yok ve ölçütleri geçiyor | Hangi dosyaya, neden oraya |
| ⛔ **Eksik ama eklenMEmeli** | Kitte yok ama ölçüte takılıyor | **Neden** eklenmediği — niş mi, bakımsız mı, kitle çelişiyor mu |

⭐ **Üçüncü kutu en değerli olanıdır.** Kitin kendi kuralı: *"piyasada yaygın ve
aktif bakımdaki best practice kazanır"* (`00-stack.md`). Videodaki kişi zarif
ama niş bir şey öneriyorsa **eklenmez** — ve neden eklenmediği yazılır ki aynı
soru bir daha araştırılmasın.

⚠️ **Videonun yayın tarihine bak.** Araç bunu çıktının başında veriyor. 2023'te
doğru olan 2026'da bayat olabilir. Eski bir videonun "best practice"i, bugünkü
ölçümle çelişiyorsa **bugünkü ölçüm kazanır.**

### ⭐ Kapsam haritası — kitin hiç dosyası olmayan alan var mı

İddia karşılaştırmasından **ayrı** bir iş: videonun konu başlıklarını çıkar ve
kitin 17 standart dosyasının başlıklarıyla yan yana koy.

Aranan şey: **kitte hiç karşılığı olmayan bir alan.** Örnek türler —
erişilebilirlik · performans bütçesi · olay günlüğü tasarımı · özellik bayrakları ·
çok dillilik · göç stratejisi · maliyet yönetimi · olağanüstü durum kurtarma.

Böyle bir alan çıkarsa bunu **ayrıca ve öne çıkararak** raporla: tek bir kural
eksikliği değil, **yeni bir standart dosyası** gerekiyor olabilir.

---

## Adım 5 — ⛔ ÖLÇMEDEN YAZMA

`00-stack.md` kuralı burada da geçerli: **ölçüm tarihi olmadan rakam yazılmaz.**

Videoda geçen her araç, kütüphane veya rakam için:

```bash
npm view <paket> version time.modified
curl -s https://api.npmjs.org/downloads/point/last-week/<paket>
```

| Bulgu | Sonuç |
|---|---|
| Yaygın + aktif bakımda | Kural yazılabilir |
| Son yayını **18 aydan eski** | ⚠️ Kullanıcıya bildir, kite yazma |
| Niş (yaygın alternatifinin çok altında) | ⛔ Yazma — gerekçesini raporla |

⭐ Rakam yazarken tarihi de yaz: **"7.9M/hafta (2026-08 ölçümü)"**. Tarihsiz
rakam sonraki okuyucuya güncel olduğunu **yanlış** söyler.

---

## Adım 6 — Kullanıcıya sun, onay al

⛔ **Ajan tek başına kite yazmaz.** Bulguları tablo hâlinde sun:

```
✅ Zaten var (N madde)      → hangi dosyada
➕ Eklenmeli (N madde)      → hangi dosyaya, neden, ölçümüyle
⛔ Eklenmemeli (N madde)    → neden
⭐ Kitte hiç olmayan alan   → varsa, ayrı başlık altında
```

Sonra sor: *"Hangilerini kite yazayım?"*

⚠️ Hiçbir şey çıkmadıysa **onu da söyle.** *"Bu videoda kitte olmayan bir şey
yok"* geçerli ve değerli bir sonuçtur — zorlama madde üretme.

---

## Adım 7 — Kite yaz

Onaylananlar için `/kit-senkron` akışını kullan: kural ilgili
`docs/standards/*.md` dosyasına yazılır, `plugin.json` sürümü yükselir,
değişiklik özetlenir ve **push öncesi kullanıcıya sorulur**.

⛔ **Kaynağı belirt.** Kite giren her kuralın yanına videonun adı, kanalı ve
yayın tarihi yazılır — gelecekte *"bu kural nereden geldi"* sorusu cevapsız
kalmasın.

⛔ **Gizli bilgi kuralı geçerli:** kit deposu herkese açık. Videodan gelse bile
kuruma veya kişiye dair hiçbir şey yazılmaz.
