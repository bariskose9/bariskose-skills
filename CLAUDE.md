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
| `calisma-dokumanlari/` | Kullanıcının çalışma notları | ⛔ **Okuma** — kural değil, bağlamı şişirir |

## ⛔ Commit öncesi zorunlu

```bash
node skills/kit-senkron/bin/denetim.mjs .
```

Kırık dosya referanslarını ve bayat PDF'leri yakalar. **Çıktısını oku** —
çalıştırıp kırpmak, atlamakla aynı şeydir.

Sonra: `.claude-plugin/plugin.json` içindeki sürümü artır (yama `1.0.1`,
yeni kural `1.1.0`), commit, push.

## ⛔ Yayınlama kuralı

Depo **herkese açıktır.** `skills/` ve `docs/` push edilir. Bunun dışında
üretilen belgeler diskte kalır; yayınlanacaksa **önce kullanıcıya sorulur.**
