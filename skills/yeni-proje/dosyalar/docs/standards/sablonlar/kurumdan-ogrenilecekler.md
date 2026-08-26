# Kurumdan Öğrenilecekler

<!--
ŞABLON — YALNIZCA İŞYERİ PROJELERİNDE açılır (`docs/project/` altına).
Kendi projende bu dosyaya gerek yok: soracak bir kurum yok.
Bu yorum bloğu doldurduktan sonra silinir.

BU DOSYA NEDEN VAR
Bir kurum projesinde bazı bilgileri YALNIZCA kurum bilir. Ajan bunları
türetemez, tahmin ederse yanlış varsayım tüm katmanlara yayılır.
Bu dosya o soruları toplar ve cevapları takip eder.

⛔ BURAYA MÜHENDİSLİK SORUSU YAZILMAZ. "Cursor mı offset mi", "hangi index",
"UUID mi artan sayı mı" gibi sorular AJANA aittir
(`11-agent-workflow.md` → "Mühendislik seçimi kullanıcıya devredilmez").
Buraya yalnızca kurumun bilebileceği OLGULAR girer.

NE ZAMAN SİLİNİR
Bütün cevaplar `PRD.md` ve `altyapi-durumu.md`'ye işlendiğinde.
-->

**Son güncelleme:** <!-- TARİH -->

## Nasıl kullanılır

| Durum | Ne yap |
|---|---|
| Cevabı aldın | **Cevap** kolonunu doldur, ilgili belgeye işle |
| Cevap *"bilmiyorum"* geldi | ⚠️ **Varsayım** yaz → `PRD.md` → *Varsayımlar* |
| Soru gereksiz çıktı | Sil, ama **neden gereksizdi** yaz |

⭐ Her soruda üç şey bulunur: **neden soruyorum · cevaba göre ne değişir ·
cevap gelmezse ne yaparım.** Üçü olmadan soru karşı tarafta havada kalır.

---

# BÖLÜM 1 — Altyapı ve teslim

## 1.1 Kod nereye gönderilecek

> *"Kodu nereye göndermemi istersiniz — GitHub mı, kurumun GitLab'ı mı?
> Hesap ve adres verilecek mi?"*

| | |
|---|---|
| **Neden soruyorum** | Değişiklik önerisi (PR/MR) yalnızca bir barındırma servisinde olur; `git` tek başına üretemez |
| **Ne değişir** | Hangi CI dosyasının birincil olduğu ve teslim linkinin nereden verileceği |
| **Cevap gelmezse** | GitHub'da başlanır. ⭐ CI adımları `package.json` betiğinde olduğu için iki platform dosyası da hazır bekler; adres sonra gelirse ikinci remote eklenir |
| **Cevap** | *(doldurulacak)* |

## 1.2 Teslim tarihi ve varsa ara teslimler

> *"Son tarih nedir? Ara teslim veya demo bekleniyor mu?"*

| | |
|---|---|
| **Neden soruyorum** | Kapsam kararları buna göre verilir |
| **Ne değişir** | Süre darsa **zorunlu olmayan** maddeler kapsam dışı kalır |
| **Cevap gelmezse** | Yol haritası tam kapsamla kurulur, riskli maddeler işaretlenir |
| **Cevap** | *(doldurulacak)* |

## 1.3 Kurumun kendi standartları var mı

> *"Veri tabanı isimlendirme, kod standardı, API sözleşmesi gibi kurum içi
> yazılı kurallarınız var mı?"*

| | |
|---|---|
| **Neden soruyorum** | Varsa ve uyulmazsa teslim doğrudan kural ihlali sayılır |
| **Ne değişir** | ⚠️ **Veri modelinin tamamı** — tablo/kolon adları, birincil anahtar biçimi, tarih alanları |
| **Cevap gelmezse** | Yaygın pratik: `snake_case`, çoğul tablo adı, `id` birincil anahtar, `created_at`/`updated_at`. `PRD.md` → Varsayımlar'a yazılır |
| **Cevap** | *(doldurulacak)* |

⚠️ **Bu soruyu ilk gün sor.** Cevap sonradan gelirse tüm migration'lar
yeniden yazılır.

---

# BÖLÜM 2 — DevOps sınırı

⭐ **Üç sorunun tamamı ve "bu ne demek" açıklamaları
`CALISMA-KILAVUZU.md` → *"DevOps sınırı — işe başlamadan sorulacak üç soru"*
bölümünde.** Burada yalnızca cevaplar tutuluyor.

| # | Soru | Cevap |
|---|---|---|
| 2.1 | Migration'ı canlıda kim çalıştırıyor | *(doldurulacak)* |
| 2.2 | Gizli değerleri kim, nereye giriyor | *(doldurulacak)* |
| 2.3 | Bir sürüm bozarsa geri almayı kim yapıyor | *(doldurulacak)* |

⛔ Cevaplar `docs/project/altyapi-durumu.md`'ye de işlenir — kodda
görünmezler.

---

# BÖLÜM 3 — Kapsam soruları

<!--
Analiz dokümanında GEÇMEYEN ama "şu da olsa iyi olurdu" denebilecek maddeler.
Sorulmazsa gündeme getirilmez; sorulursa cevabın hazır olsun.
Her satırda: istenirse ne gerekir, süreye etkisi ne.
-->

| Konu | Belgede var mı | Eklenirse ne gerekir |
|---|---|---|
| <konu> | ⛔ Yok | <ek süre / ek servis / ek risk> |

⭐ Kapsam dışı bırakılan her madde `PRD.md` → *Kapsam dışı* bölümüne
**gerekçesiyle** yazılır. Yazmak zayıflık değil, kapsama hâkim olmaktır.

---

# BÖLÜM 4 — Sorulmayacaklar

<!--
Karara bağlanmış mühendislik seçimleri. Kuruma SORULMAZ; buraya yazılmasının
sebebi, ileride "bunu da soralım mı" tartışması çıkmasın diye.
Her satır kendi gerekçesine işaret eder.
-->

| Konu | Karar | Gerekçe nerede |
|---|---|---|
| <konu> | <karar> | `docs/project/decisions/ADR-*.md` |
