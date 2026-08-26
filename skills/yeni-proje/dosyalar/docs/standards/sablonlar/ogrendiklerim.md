# Öğrendiklerim

> **Bu defter kişiseldir.** Kite yazılacak kadar genel olmayan, ama unutulursa
> tekrar bedeli ödenecek notlar buraya girer.
>
> ⚠️ Kite giden şey **kural**dır ("her projede şöyle yapılır"). Buraya giren şey
> **deneyim**dir ("ben şunu atlamıştım", "şu bana zor geldi").

**Son güncelleme:** <!-- TARİH -->

---

## ⭐ SEVİYE DEFTERİ — ajan anlatım düzeyini buradan ayarlar

> **Bu bölüm ikili bir liste değil, dört seviyeli bir ölçüm.** Sebebi:
> bir konu tek seferde öğrenilmez. Kullanıcı kavramı anlamış ama içindeki
> bir kelimeyi bilmiyor olabilir; ya da anladığını sanıp kaçırmış olabilir.
>
> ⚠️ **Gerçekçi süre:** full-stack + mobil + DevOps + test + veritabanı +
> API + AI ile çalışma — hepsinin oturması **3–6 ay** sürer. Defter bu
> süreyi taşıyacak şekilde tasarlandı.

### Dört seviye

| Seviye | Ne demek | Ajan ne yapar |
|---|---|---|
| **0 — Yeni** | İlk kez geçiyor | Üç adımda **tam** aç: gerçek hayat → tanım → bu projede nerede |
| **1 — Tanıdık** | Gördü, soru sordu | Kısa hatırlatma + ilk anlatıldığı yere işaret |
| **2 — Takip ediyor** | Soru sormadan izledi | Terimi kullan, **tek cümlelik** hatırlatma |
| **3 — Sahipleniyor** | ⭐ Kendisi kullandı, sordu veya **düzeltti** | Doğrudan kullan, açıklama yok |

### ⛔ NEYİ KANIT SAYARIZ — en kritik kural

| Sinyal | Kanıt gücü |
|---|---|
| ⭐ Kullanıcı ajanı o konuda **düzeltti** | **En güçlü** — anlamadan düzeltemez |
| ⭐ Terimi **kendi cümlesinde** doğru kullandı | Güçlü |
| Kavramın **sonucunu** sordu (*"peki o zaman şu olmaz mı?"*) | Güçlü — temeli almış |
| Açıklamayı okuyup soru sormadı | ⚠️ **Zayıf** — tek başına yetmez |
| *"Tamam"* dedi | ⛔ **KANIT DEĞİL** |

⛔ **Son satır kuralın kalbi.** *"Tamam"* demek anlamak değildir; sessizlik de
öyle. Seviye yalnızca **kullanıcının ürettiği** bir şeyle yükselir — bir
düzeltme, bir kullanım, bir sonuç sorusu.

### Seviye nasıl yükselir

⛔ **Tek gözlemle yükselmez.** Bir seviye atlamak için **farklı oturumlarda,
en az iki kez** kanıt gerekir. Sebebi: aynı oturumdaki tekrar, öğrenmeyi değil
**o anki bağlamı** ölçer.

Ajan yükseltmeyi **teklif eder**, kendiliğinden yazmaz:

> *"`transaction` konusunu iki ayrı oturumda soru sormadan kullandın, birinde
> de beni düzelttin. Seviyeyi 2'den 3'e çıkarayım mı? Çıkarırsam bundan sonra
> açıklamadan geçerim."*

### ⚠️ Seviye DÜŞER de — unutmak normaldir

| Durum | Etki |
|---|---|
| Konu **8 haftadır** hiç geçmedi | Bir seviye **düşer** |
| Kullanıcı *"bunu tekrar açıkla"* dedi | ⭐ Doğrudan **0'a** iner |
| Kullanıcı o konuda yanlış bir şey söyledi | Bir seviye düşer, ajan **sessizce** düzeltir |

⛔ Seviye düşmesi başarısızlık değildir. 3–6 aylık bir öğrenmede unutma
kaçınılmazdır; defterin işi bunu **görmek**, gizlemek değil.

### ⭐ Kavram ile KELİME ayrı ölçülür

Kullanıcı bir kavramı anlamış olabilir ama anlatımda geçen bir kelimeyi
bilmiyordur. Bu **ayrı bir eksiktir** ve kavramın seviyesini düşürmez.

- Kavram seviyesi → aşağıdaki tablolarda
- Bilinmeyen tek kelimeler → **"Kelime defteri"** bölümünde

---

## Konu alanları

<!--
Her satır:  konu · seviye (0-3) · son kanıt (ne oldu) · tarih
Ajan her oturum başında bu tabloyu okur; anlatım düzeyini buna göre seçer.
Boş bırakılan alan seviye 0 sayılır.
-->

### Mimari ve tasarım

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Katmanlı mimari · bağımlılık yönü | 0 | | |
| SOLID | 0 | | |
| Tasarım desenleri (Factory, Strategy…) | 0 | | |
| Durum makinesi | 0 | | |

### Backend

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| API sözleşmesi · sürümleme | 0 | | |
| Kimlik doğrulama · yetki | 0 | | |
| Transaction · eşzamanlılık | 0 | | |
| Arka plan işleri · kuyruk | 0 | | |
| Hata yönetimi | 0 | | |

### Frontend (UI)

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Bileşen · durum yönetimi | 0 | | |
| Sunucu / istemci bileşeni | 0 | | |
| Veri getirme · önbellek | 0 | | |
| Form · doğrulama | 0 | | |

### Veritabanı

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Modelleme · ilişkiler | 0 | | |
| Index · sorgu performansı | 0 | | |
| Migration | 0 | | |
| Sayfalama (offset / cursor) | 0 | | |

### Test

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Test piramidi | 0 | | |
| Birim · entegrasyon · uçtan uca | 0 | | |
| Koruma testi (bozup görme) | 0 | | |

### DevOps ve işletim

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Docker · konteyner | 0 | | |
| CI/CD hattı | 0 | | |
| Ortamlar · gizli değerler | 0 | | |
| İzleme · günlük · uyarı | 0 | | |

### Güvenlik ve uyum

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Yaygın açıklar (XSS, IDOR…) | 0 | | |
| KVKK · kişisel veri | 0 | | |

### Mobil

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| Mobil ile web farkı | 0 | | |
| Mağaza süreci | 0 | | |

### ⭐ AI ile çalışma

| Konu | Sv | Son kanıt | Tarih |
|---|:--:|---|---|
| İyi istem (prompt) yazma | 0 | | |
| Bağlam yönetimi · `/clear` | 0 | | |
| Ajanın çıktısını denetleme | 0 | | |
| Kite kural yazma | 0 | | |

---

## Kelime defteri

<!--
Kavramı anladığı hâlde takıldığı TEK KELİMELER. Kavram seviyesinden ayrı.
Biçim:  - `kelime` — kısa karşılığı (tarih)
-->

- <kelime> — <karşılığı>

---

## ⛔ Öğretmeyi ne zaman bırakırız

Bu defterin asıl amacı **anlatımı sonunda gereksiz kılmak.**

| Durum | Ajan ne yapar |
|---|---|
| Bir konu **seviye 3** ve son 8 haftada düşmedi | O konuda anlatım **durur** |
| Bir alanın **tamamı** seviye 3 | O alanda yalnızca **yeni** şeyler anlatılır |
| Tüm alanlar seviye 3 | ⭐ Ajan yalnızca **karar ve gerekçe** sunar, öğretmez |

⚠️ **Bu bir bitiş çizgisi değil, kayan bir eşik.** Yeni teknoloji girdikçe
yeni satırlar açılır; öğrenme bitmez, **anlatım düzeyi** değişir.

---

## Sormayı unuttuğum sorular

<!--
Görüşmede atlanan ve sonradan pahalıya patlayan sorular.
Bir sonraki projede kontrol listesi olarak kullanılır.

Örnek:
- Kaç eş zamanlı kullanıcı olacağını sormadım; sayfalama sınırını
  buna göre belirleyecektik.
-->

| Tarih | Ne sormayı unuttum | Sonucu ne oldu |
|---|---|---|

---

## Zor gelen kararlar

<!--
Anlaması veya savunması zorlanan konular. Zamanla bu liste kısalır —
kısalması öğrenmenin ölçüsüdür.

Örnek:
- Bağımlılığın tersine çevrilmesi: "arayüzü domain'de tanımlamak" fikri
  üçüncü örnekte oturdu.
-->

| Konu | Neresi zor geldi | Ne oturttu |
|---|---|---|

---

## Tekrar eden hatalar

<!--
İkinci kez yapıldığında buraya yazılır. Üçüncü kez yapılırsa artık
kişisel değildir — kite kural olarak yazılır.
-->

| Hata | Kaç kez | Kite taşındı mı |
|---|---|:---:|

---

## İşe yarayan kalıplar

<!--
Kendi bulduğun, işini kolaylaştıran yaklaşımlar. Genelleşirse kite gider.

Örnek:
- Bir bölümü okuduktan sonra kapatıp kendi cümlelerimle anlatmak;
  anlatamadığım yer okumadığım yer oluyor.
-->

| Kalıp | Neyi çözüyor |
|---|---|

---

## Kite taşınacaklar

<!--
Genelleşmiş, artık kural olabilecek maddeler. /kit-senkron ile taşınır
ve buradan silinir.
-->

- [ ] <!-- madde -->
