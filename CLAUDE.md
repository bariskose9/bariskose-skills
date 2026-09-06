# Bu depo — `proje-kiti` plugin'inin kaynağı

Burası bir Claude Code plugin'inin **kaynak deposudur**, bir uygulama değil.
Üretilen şey `skills/` altındaki dört skill ve onların taşıdığı 19 mühendislik
standardıdır.

## ⛔ Çalışmaya başlamadan önce

**`docs/DEVIR.md` oku.** Kesinleşmiş kararlar, gerekçeleri ve **yeniden
tartışılmayacak** konular orada. Reddedilmiş yaygın tavsiyelerin tablosu da var
— yazılı olarak reddedilmiş bir şeyi yeniden önermek, aynı tartışmayı baştan
açmak demektir.

`docs/ogrendiklerim.md` → **Seviye defteri**: kullanıcıya hangi konuyu ne
düzeyde anlatacağın oradan okunur, senin izleniminden değil.

## Klasörler

| Yer | Ne | Ajan okur mu |
|---|---|---|
| `skills/yeni-proje/SKILL.md` | Kurulum akışı — sekiz adım | ✅ |
| `skills/yeni-proje/dosyalar/CLAUDE.md` | Projelere kopyalanan ajan kuralları | ✅ |
| `skills/yeni-proje/dosyalar/docs/standards/` | **19 standart — kuralın kaynağı** | ✅ |
| `docs/` | Devir belgesi + seviye defteri | ✅ |
| `ICINDEKILER.md` | **Kullanıcının haritası** — kit ne yapar, hangi dosya kimin işi | ⚠️ Yalnızca güncellemek için |
| `calisma-dokumanlari/` | Kullanıcının çalışma notları ve uçtan uca örnek proje | ⚠️ **Kendiliğinden okuma** — istenince oku |

## ⛔ Commit öncesi zorunlu

```bash
node skills/kit-senkron/bin/denetim.mjs .
```

Dört şeyi yakalar: kırık dosya referansı · **kırık bölüm atfı** (`<dosya>.md` →
*"Başlık"* denen başlık hedefte var mı) · bayat PDF · **haritada görünmeyen
dosya**. **Çıktısını oku** — çalıştırıp kırpmak, atlamakla aynı şeydir.

⛔ **Kural değiştirdiysen kullanıcı rehberlerini de gözden geçir:**
`docs/KIT-REHBER.md` (terim terim anlatım) ve `docs/KIT-NE-YAPIYOR.md` (döngü ve
kapılar). İkisi de **depoya girer** — plugin'i kuran kişi kitin nasıl işlediğini
oradan öğrenir. Sürüm damgaları `plugin.json` ile aynı MAJOR.MINOR olmalı;
denetim betiği bunu zorlar.

⚠️ **Damgayı güncellemek belgeyi okumak demektir.** Sayıyı körlemesine artırmak
kuralı değil, görüntüsünü korur.

### ⚠️ `calisma-dokumanlari/` — yasak değil, VARSAYILAN değil

Bu klasörü **kendiliğinden okuma**: kural taşımaz ve bağlamı şişirir. Ama
kullanıcı *"bunu teknoloji planıma ekle"*, *"şu notu güncelle"* dediğinde
**elbette okunur** — istenen dosya, istenen kadar.

| Durum | Davranış |
|---|---|
| Oturum açılışı, genel çalışma | ⛔ Açma |
| Kullanıcı o belgeden söz etti veya işaret etti | ✅ **Oku** |
| Kite kural yazarken *"bu nereden geldi"* gerekiyor | ✅ Oku, ama **yalnızca ilgili bölümü** |
| Denetim betiği | ✅ Her zaman tarar — *"okunmaz"* ile *"denetlenmez"* ayrı şeylerdir |

⛔ **Kite yeni bir dosya eklediysen `ICINDEKILER.md`'ye satır ekle.** O belge
kullanıcının haritasıdır ve ajan onu okumaz — ama **güncellemek ajanın işidir.**
Denetim betiği bunu zorlar: haritada görünmeyen dosya commit'i durdurur.

*Gerekçe:* harita elle güncellenmeye bırakılırsa ilk eklemede bayatlar ve kimse
fark etmez. Kullanıcı olmayan bir dosyayı arar, olan bir dosyayı hiç bilmez.

Sonra: `.claude-plugin/plugin.json` içindeki sürümü artır (yama `1.0.1`,
yeni kural `1.1.0`), commit, push.

## ⛔ Yayınlama kuralı

Depo **herkese açıktır.** Push edilen: `skills/` · `ICINDEKILER.md` ·
`README.md` · `KURULUM.md` · `CLAUDE.md`.

⚠️ **`docs/` klasörü `.gitignore` ile KAPALIDIR** — yalnızca iki dosya açıktır:
`docs/DEVIR.md` ve `docs/ogrendiklerim.md`. Geri kalan üretilen belgeler
(rehberler, PDF'ler, oturum notları) diskte kalır; yayınlanacaksa **önce
kullanıcıya sorulur.**
