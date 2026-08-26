---
name: pdf-uret
description: Markdown belgesini karanlık temalı PDF'e çevirir — telefonda okumak için. Yalnızca Node ve Chrome kullanır, üçüncü taraf araç gerektirmez. "Bunu PDF yap", "PDF üret", "karanlık PDF", "/pdf-uret <dosya>" denince kullan.
---

# PDF Üretimi — karanlık tema, telefonda okumak için

Kullanıcı bir belgeyi telefonunda okumak istediğinde bu akış çalışır.

**Varsayılan KARANLIK.** Sebebi: belgeler telefonda ve çoğu zaman loş ortamda
okunuyor. Aydınlık sürüm yalnızca **yazdırma** için üretilir.

---

## Kullanım

```bash
node "$CLAUDE_PLUGIN_ROOT/skills/pdf-uret/bin/md-pdf.mjs" <girdi.md> [cikti.pdf] [--acik]
```

| Bayrak | Etki |
|---|---|
| *(yok)* | ⭐ **Karanlık** tema — varsayılan |
| `--acik` | Aydınlık tema — **yalnızca yazdırılacaksa** |

Çıktı yolu verilmezse girdinin yanına aynı adla `.pdf` yazılır.

⛔ **Karanlık PDF yazdırılmaz** — sayfayı simsiyah basar, kartuşu bitirir.
Kullanıcı *"yazdıracağım"* derse `--acik` kullan ve bunu söyle.

---

## ⛔ ÇALIŞMAZSA — sırayla bunlara bak

Bu araç üç şeye dayanıyor: **Node** · **Chrome** · **`npx marked`**. Hata
mesajları hangisinin bozulduğunu söylüyor.

### 1. "Chrome bulunamadı"

Araç şu yolları sırayla deniyor: `CHROME_PATH` değişkeni → macOS uygulama
klasörü → Windows Program Files → Linux `/usr/bin` → `which/where`.

| Platform | Kurulum |
|---|---|
| macOS | `brew install --cask google-chrome` |
| Windows | `winget install Google.Chrome` |
| Linux | Dağıtımın paket yöneticisi |

Chrome başka yerdeyse: `CHROME_PATH=/tam/yol node md-pdf.mjs ...`

⭐ Chrome zaten kitin bağımlılığı — `chrome-devtools-mcp` eklentisi de onu
kullanıyor. Ayrı bir gereksinim değil.

### 2. "markdown çevrilemedi"

`npx -y marked` çalışmıyor demektir. İlk çalıştırmada paketi **indirir**;
internet erişimi gerekiyor. Sonraki çalıştırmalarda önbellekten gelir.

⚠️ Kapalı kurum ağında npm registry engelliyse bu adım çalışmaz. O durumda
kullanıcıya söyle — sessizce başka yol arama.

### 3. ⛔ "ÇEVİRİ EKSİK" — en sinsi hata

**Bu denetim bilerek kondu ve gerçek bir hatadan doğdu.**

`marked`e markdown **boru hattıyla (pipe)** beslenirse çıktı belli bir boyuttan
sonra **sessizce kesilir ve hata vermez**:

| Ölçüm (2026-08-26) | Sonuç |
|---|---|
| Boru hattıyla | 270.000 karakter → **61.514 karakter**, kelime ortasında bitti |
| Dosya üzerinden (`-i`/`-o`) | 292.043 karakter → **360.730 karakter**, tam |

PDF *"başarıyla"* oluşuyordu ama içeriğin **%80'i yoktu** — ancak sayfa sayısı
beklenenin çok altında kalınca fark edildi (27 sayfa, olması gereken ~155).

⛔ **Bu yüzden araç stdin/stdout KULLANMAZ**, dosya üzerinden geçirir. Ayrıca
HTML çıktısı markdown'ın yarısından küçükse **PDF üretmeden durur** — HTML
normalde markdown'dan **büyük** olur.

### 4. PDF üretildi ama beyaz çıktı

⛔ **Chrome yazdırırken arka plan renklerini varsayılan olarak ATAR.**

Çözüm CSS'te zaten var ama bozulursa buraya bak:

```css
*, *::before, *::after {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

⚠️ Yalnızca `body`'ye vermek **yetmez** — her seçiciye gerekiyor. Tablo
satırları, kod blokları ve alıntılar ayrı ayrı boyanıyor.

⚠️ `--headless=new` şart. Eski `--headless` bazı Chrome sürümlerinde CSS'i tam
uygulamıyor.

### 5. Sayfa sayısı beklenenden çok az

Üretim bittikten sonra **doğrula**, varsayma:

```bash
python3 -c "
import re; d=open('cikti.pdf','rb').read()
print('sayfa:', len(re.findall(rb'/Type\s*/Page[^s]', d)))"
```

Kaba oran: **~1.800 karakter markdown ≈ 1 sayfa**. Çok altındaysa içerik
kaybı vardır.

### Karanlık gerçekten uygulandı mı — ölçerek kontrol

```bash
python3 -c "
import re, zlib
d = open('cikti.pdf','rb').read(); bulundu = False
for m in re.finditer(rb'stream\r?\n(.*?)endstream', d, re.S):
    try: s = zlib.decompress(m.group(1))
    except Exception: continue
    if b'.0863 .0941 .1137' in s: bulundu = True; break
print('karanlık:', 'VAR' if bulundu else 'YOK')"
```

`.0863 .0941 .1137` = `#16181D`, karanlık temanın zemin rengi.

---

## ⛔ ÜRETİLEN PDF DOĞRULANMADAN TESLİM EDİLMEZ

Kullanıcıya *"PDF hazır"* demeden önce **üçü de** kontrol edilir:

| # | Kontrol | Nasıl |
|---|---|---|
| 1 | Dosya oluştu mu | Boyut sıfırdan büyük |
| 2 | İçerik tam mı | Sayfa sayısı ≈ karakter/1800 |
| 3 | Karanlık mı | Yukarıdaki renk kontrolü |

⚠️ *"Komut hata vermedi"* yeterli değil — kırpma hatası tam olarak böyle
gözden kaçtı.

---

## Toplu üretim

Birden çok belge için, çıktıları ayrı klasöre koy ve adları **birebir aynı**
tut — yalnızca uzantı değişsin:

```
belgeler/
├── md/   KURULUM.md · YENI-OTURUM.md · ...
└── pdf/  KURULUM.pdf · YENI-OTURUM.pdf · ...
```

⭐ Aynı adlar, kullanıcının hangi PDF'in hangi belge olduğunu aramasını
engeller.

⚠️ **Kaynak değişince PDF de yenilenir.** Ayna klasörde bayat PDF bırakmak,
hiç PDF olmamasından kötüdür — kullanıcı güncel sanır.

---

## Ne zaman PDF üretilir

| Durum | PDF |
|---|---|
| Kullanıcı telefonda okuyacak | ✅ Karanlık |
| Kullanıcı yazdıracak | ✅ `--acik` |
| Belge yalnızca ajan için | ⛔ Gerekmez — markdown yeterli |
| Belge her gün değişiyor | ⛔ İş bitince bir kez üret |

⛔ **Her markdown dosyası için PDF üretilmez.** Kullanıcının okuyacağı
belgeler için üretilir; ajanın okuyacağı dosyalar markdown kalır.
