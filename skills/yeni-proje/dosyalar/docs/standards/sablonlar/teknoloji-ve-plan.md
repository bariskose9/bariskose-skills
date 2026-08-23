# <Proje Adı> — Teknoloji ve Plan

> Bu belge iki soruyu birden cevaplar: **neyi neden kullanıyoruz** ve **hangi
> sırayla yapacağız.** Her bölüm kendi içinde yeterlidir; bir konuyu okurken
> başa dönmek gerekmez.
>
> Yalnızca *"ne yapılacak"* aranıyorsa doğrudan **BÖLÜM G**'ye gidilebilir.

---

## Giriş — kararlar neye göre verildi

<Üç ölçüt yazılır. Örnek: piyasada yaygın ve aktif bakımda olması ·
gerçek üretim pratiği olması · devralınabilir olması. Her ölçütün altına
somut bir örnek konur, soyut bırakılmaz.>

### Kararların dört kutusu

Her karar anlatılırken hangi kutuda olduğu söylenir:

| Kutu | Anlamı |
|---|---|
| **1** | İstenmişti, zaten doğrusuydu |
| **2** | İstenmişti, eşleniğini kullandım |
| **3** | İstenmemişti, gerçek hayat gerektirdi |
| **4** | İstenmişti, yapmadım — şunu tercih ettim |

⛔ 4. kutudaki her madde **ölçüyle** desteklenir (indirme sayısı, son yayın
tarihi, sürüm kısıtı). *"Bence daha iyi"* yazılmaz.

---

# BÖLÜM 0 — Sistem nasıl çalışıyor

<Zemin. Sonraki her teknoloji bu resmin bir yerinde duruyor.>

- İstemci ve sunucu ayrımı, neden istemciye güvenilmez
- Bir isteğin uçtan uca yolculuğu (adım adım)
- Hangi teknoloji bu yolculuğun hangi adımında çalışıyor — tablo
- Sık karıştırılan terim çiftleri
- **Tek cümlelik özet:** sistemin tamamını anlatan bir paragraf

---

# BÖLÜM A — Hızlı eşleme tablosu

| İstenen / gereken | Kullanılan | Tek cümlelik gerekçe |
|---|---|---|

<Ayrıca: istenmediği hâlde eklenenler ve neden eklendikleri.>

---

# BÖLÜM B — Sistemin yapması istenen şeyler

<Her talep tek tek. Her biri için:>

**İstenen:** …
**Kullanılan teknoloji:** …
**Bu teknolojiler nedir:** <günlük dille>
**Bu projede hangi sorunu çözüyor:** <somut örnek>
**Neden böyle seçildi:** …

---

# BÖLÜM C — Teknoloji kartları

<Kullanılan HER teknoloji için aynı şablon. "Küçük paket, geçiveririm" yok.>

**Nedir** · **Ne işe yarar** · **Bu projede nerede** · **Neden tercih edildi** ·
**Alternatifi neden değil** · **Karşılığı neydi**

⛔ Kod görülmeden anlaşılmayacak her kartta 5–15 satırlık örnek bulunur.
Örnekler satır satır Türkçe yorumlanır (`02-coding-standards.md`).

---

# BÖLÜM E — Kavramlar, prensipler, desenler

<Kurulan paketler değil, verilen kararlar. Her kavram ÜÇ adımda:>

1. **Gerçek hayattan karşılığı** — çarpıcı benzetme
2. **Yazılımdaki tanımı** — sektör terimiyle
3. **BU projede tam olarak nerede** — hangi ekran, hangi tablo, hangi sorun

⛔ Üçüncü adım atlanamaz. *"Katmanlar ayrılır"* hiçbir şey öğretmez;
*"ORM değişse yalnızca altyapı katmanı etkilenir"* öğretir.

**E.0 olarak temel kelimeler yazılır:** sınıf, nesne, metot, arayüz, katman,
bağımlılık. Bunlar bilinmeden geri kalanı ezber olur.

**Son bölüm — değerlendirilip seçilmeyen alternatifler.** *"Şunu düşündün mü?"*
sorusu mutlaka gelir; cevabı ölçümle hazır olmalı.

---

# BÖLÜM F — Bir isteğin uçtan uca hayatı

<Parçaları birleştiren anlatım: kullanıcı bir şey yaptığı andan sonuç
görünene kadar hangi katman devreye giriyor, hangi kural nerede çalışıyor.>

Sonuna tablo: her adımın hangi karara dayandığı ve o kararın hangi bölümde
anlatıldığı.

⭐ Sunumda en çok işe yarayan bölüm budur: mimariyi **anlatmadan göstermek**.

---

# BÖLÜM G — Yapım planı

## Bu plan nasıl kuruldu

<Dört kural yazılır — `16-yeni-proje-kurulumu.md` → "Yapım planı nasıl sıralanır".
Bağımlılık zinciri şema olarak, evreler tablo olarak verilir.>

## Adımlar

<Her adım `roadmap.md` biçiminde: kutucuk, amaç, teknoloji, nereye,
neye bağlanıyor, bitti sayılır, ayrıntısı nerede.>

⛔ Kutucuk işaretlenmeden oturum kapatılmaz (`15-oturum-devri.md`).

---

# KAPANIŞ

- Bilinen teknik borçlar — **sorulmadan söylenir**
- Tek cümlelik özet
- Hangi yeteneğin nerede karşılandığı tablosu
