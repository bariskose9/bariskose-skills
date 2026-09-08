# Bu depo — `proje-kiti` plugin'inin kaynağı

Burası bir Claude Code plugin'inin **kaynak deposudur**, bir uygulama değil.
Üretilen şey `skills/` altındaki dört skill ve onların taşıdığı 19 mühendislik
standardıdır.

## ⭐ SEN KİMSİN — burada da aynı kişisin

⛔ **Rol, karakter ve anlatım kuralları bu depoda da geçerlidir.** Onlar
projeye giden dosyada yazılı ve **buraya kopyalanmaz** — aynı gerekçe iki
yerde yaşarsa biri bayatlar (`docs/standards/11-agent-workflow.md` →
*"AYNI BİLGİ İKİ YERDE YAZILMAZ"*).

Kural yazmaya başlamadan önce `skills/yeni-proje/dosyalar/CLAUDE.md` içinden
şu dört bölümü oku:

| Bölüm | Ne söyler |
|---|---|
| *"⭐ ROL — bu kitte kim olduğun"* | Hangi rollerin kıdemlisisin, hangi kararı kim verir |
| *"⭐ KARAKTER — bu rolün huyu"* | Öğretmek gönüllüdür; terim kullanılır ve açıklanır |
| *"⛔ EKSİKSİZLİK, KISALIĞA FEDA EDİLMEZ"* | Ne kadar açıklanır, sınır nerede |
| *"4. Bana Karşı Davranış"* | Kanıtsız "bitti" denmez, emin değilsen söylenir |

⚠️ **Fark yalnızca İŞTE, kişide değil.** Orada bir ürün kuruyorsun, burada o
ürünü kuracak kuralları yazıyorsun. Nasıl davrandığın iki yerde de aynı.

## ⛔ Çalışmaya başlamadan önce

**`docs/TARTISILMIS-KARARLAR.md` oku.** Kesinleşmiş kararlar, gerekçeleri ve **yeniden
tartışılmayacak** konular orada. Reddedilmiş yaygın tavsiyelerin tablosu da var
— yazılı olarak reddedilmiş bir şeyi yeniden önermek, aynı tartışmayı baştan
açmak demektir.

`skills/yeni-proje/dosyalar/docs/standards/sablonlar/ogrendiklerim.md` →
**Seviye defteri**: kullanıcıya hangi konuyu ne düzeyde anlatacağın oradan
okunur, senin izleniminden değil.

⭐ **Tek defter var ve kitle birlikte her projeye gider.** Kit deposunda da,
projelerde de aynı dosya okunur; öğrenilen `/kit-senkron` ile buraya döner.

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

⛔ **Kite yeni bir dosya eklediysen `ICINDEKILER.md`'ye satır ekle.** Denetim
betiği bunu zorlar: haritada görünmeyen dosya commit'i durdurur.

### ⛔ TAZELEME KULLANICININ İŞİ DEĞİL — commit kapısıdır

⛔ **Kullanıcıdan *"şunu da güncelle"* demesi BEKLENMEZ.** Bir kuralı değiştiren
oturum, o kuralı anlatan **her belgeyi aynı oturumda** günceller. Ayrıntılı
yayılma tablosu: `docs/standards/11-agent-workflow.md` → *"YAYILMA TABLOSU"*.

| Değiştirdiysen | Güncellenecekler |
|---|---|
| `docs/standards/` içinde bir kural | Diğer standartlar · `dosyalar/CLAUDE.md` · `CALISMA-KILAVUZU.md` · `ICINDEKILER.md` · `docs/KIT-REHBER.md` · `docs/KIT-NE-YAPIYOR.md` |
| `SKILL.md` akışında bir adım | `ICINDEKILER.md` + `CALISMA-KILAVUZU.md` adım tabloları · iki rehber |
| Yeni dosya ekledin | `ICINDEKILER.md` — denetim zorlar |
| Minor sürüm artırdın | İki rehberin `**Sürüm:**` damgası — denetim zorlar |

⭐ **Betik neyi zorlayabiliyorsa onu zorlar** (harita · damga · kırık atıf);
*"anlatım hâlâ doğru mu"* sorusunu **ölçemez** — o senin işin. Kapı bu yüzden
hem mekanik hem insani.

*Gerekçe:* harita ve rehberler elle güncellenmeye bırakılırsa ilk değişiklikte
bayatlar ve kimse fark etmez. Kullanıcı olmayan bir dosyayı arar, olan bir
dosyayı hiç bilmez — ve **yanlış bir rehber, rehbersizlikten kötüdür.**

Sonra: `.claude-plugin/plugin.json` içindeki sürümü artır (yama `1.0.1`,
yeni kural `1.1.0`), commit, push.

## ⛔ Yayınlama kuralı

Depo **herkese açıktır.** Push edilen: `skills/` · `ICINDEKILER.md` ·
`README.md` · `KURULUM.md` · `CLAUDE.md`.

⚠️ **`docs/` klasörü `.gitignore` ile KAPALIDIR** — yalnızca iki dosya açıktır:
`docs/TARTISILMIS-KARARLAR.md`. Geri kalan üretilen belgeler
(rehberler, PDF'ler, oturum notları) diskte kalır; yayınlanacaksa **önce
kullanıcıya sorulur.**
