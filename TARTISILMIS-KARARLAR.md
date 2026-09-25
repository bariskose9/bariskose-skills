# Tartışılmış kararlar — `bariskose-skills` kit geliştirme

> **Bu depoda açılan yeni bir oturum bu dosyayı ilk okur.** Hangi kararların
> verildiğini, gerekçelerini ve hangilerinin **yeniden tartışılmayacağını**
> anlatır; sonunda nerede kalındığı yazar.
>
> ⚠️ Bu, `15-oturum-devri-kurallari.md` ile karıştırılmamalı: **o kural**, devrin nasıl
> yapılacağını söyler ve her projeye kopyalanır. **Bu dosya sonuç** — kitin
> kendi kararları.

**Kit sürümü:** `grep -m1 version .claude-plugin/plugin.json`
⛔ Sürümü buraya elle yazma — iki yerde yaşayan sayı ayrışır.

---

## Durum

Kit **canlı ve aktif geliştiriliyor**. Marketplace `bariskose-skills`, plugin
`proje-kiti`, dört skill: `/yeni-proje` · `/kit-senkron` · `/video-analiz` ·
`/pdf-uret`.

Durumu öğrenmenin doğru yolu:

```bash
git log --oneline -15
grep -m1 version .claude-plugin/plugin.json
node skills/kit-senkron/bin/denetim.mjs .      # commit öncesi zorunlu
```

---

## ⛔ KESİNLEŞMİŞ KARARLAR — yeniden tartışılmaz

Aşağıdakiler tartışıldı ve karara bağlandı. Yeni bir oturum bunları genel
bilgisinden hareketle yeniden önerirse, aynı tartışma baştan yapılır.

### Yalnızca iki skill paketi açık tutulur

**Açık:** `proje-kiti` (otorite) + `agent-skills@addy-agent-skills` (referans
kütüphane) + `chrome-devtools` MCP.

**Kapalı:** gstack ve superpowers — `~/claude-yedek/20260901/` altına taşındı.
Geri alma ve kalıcı silme komutları o klasördeki geri-alma notunda yazılı
(depo dışıdır, bu depoda aranmaz).

*Gerekçe:* dördü açıkken ~99 skill açıklaması her oturuma yükleniyor; model
120 seçenek arasından, 30 seçenek arasından seçtiğinden **daha kötü** seçiyor.
Ayrıca superpowers'ın *"Do not pause to check in with your human partner"*
kuralı, `CLAUDE.md` kapı 2 (*"plan sun, onayımı bekle"*) ile **doğrudan
çelişiyor.**

⛔ **Üçüncü bir paket kurulmaz.** Yeni bir best practice duyulursa
`/video-analiz` veya `/kit-senkron` ile **kurala** çevrilir.

### Kural forklanır, araç forklanmaz

| Ne | Nerede durur | Güncelleme |
|---|---|---|
| Kural, karar, kapı | **Kitte**, Türkçe | Forklanır — **ve bu doğrudur** |
| Referans bilgi ("nasıl yazılır") | addy'de kalır, kit **çağırır** | Upstream güncel kalır |
| Çalışan araç (script, daemon) | Kopyalanmaz | İlgisiz |

*Gerekçe:* denetleyemediğin kural senin standardın değil, **bağımlılığındır.**
gstack ve superpowers'ın katkıları bu ilkeye göre alındı — dosyaları değil,
fikirleri.

### addy'nin 15 skill'i neden çağrılmıyor

Çağrılan 10 tanesi `SKILL.md` Adım 0'da listeli. Çağrılmayanların çoğunun
**kitte kendi Türkçe karşılığı var**; ikisini birden çağırmak çelişki üretir
(`git-workflow-and-versioning` ↔ `08-git-workflow.md`, `ci-cd-and-automation`
↔ `09-ci-cd-deploy.md`, `api-and-interface-design` ↔ `03-api-guidelines.md`,
`spec-driven-development` ↔ PRD akışı, `planning-and-task-breakdown` ↔ roadmap
denetimi…).

⚠️ **Çakışmada kitin kendi standardı üstündür.**

**2026-09-05'te 15'i tek tek denetlendi.** Sonuç:

| Skill | Durum |
|---|---|
| `constraint-driven-development` | ⛔ **GERÇEK BOŞLUKTU** — "kalite çıtası sessizce düşürülmez" kuralı kite alındı. Skill yine de çağrılmıyor; kural artık kitte |
| `code-simplification` | ⚠️ Kısmi — kitte boyut sınırları var (300/50 satır), sadeleştirme turu yok. İzlenecek |
| `deprecation-and-migration` | ⚠️ Karşılığı yok ama **şimdi gerekmiyor** — kit yeni proje kuruyor, eski sistem emekliye ayırmıyor. Eski sistem taşıma işi çıkarsa yeniden bakılır |
| `observability-and-instrumentation` | ✅ Kitin `12-operations` bölümü bu ölçekte **daha iyi** (Sentry'ye özgü, KVKK süzgeci, "gözlem katmanı uygulamayı düşüremez" kuralı). RED metrik/kardinalite yok ama o ölçekte değiliz |
| Diğer 11 | ✅ Kitte doğrudan karşılığı var |

### `docs/` kapalı, seviye defteri açık

`.gitignore` `docs/`'u kapatır; seviye defteri, devir belgesi ve iki kullanıcı
rehberi `!` ile açılır.

*Gerekçe:* `docs/` altında **üretilen** belgeler durur ve bunlar iş yerine,
müşteriye veya kişisel duruma ait alıntı taşıyabilir. Depo **public** olduğu
için varsayılan **kapalıdır**; bir belge yayınlanacaksa tek tek açılır. Seviye
defteri ve rehberler her oturumda görünmeli, o yüzden açık.

⛔ **Belge üretildiğinde depoya push edilmez.** Kit push edilir; belgeler diskte
kalır. Yayınlanacaksa **önce sorulur.**

### ⭐ Seviye defteri TEK'tir ve kitle birlikte gelir *(2026-09-08)*

**Önceki karar tersine çevrildi.** Defter "kişisel durum" sayılıp kite
yazılmıyordu; her projenin ayrı defteri oluyor, yalnızca *"Artık biliyorum"*
listesi kurulumda bir kez kopyalanıyordu.

*Sorun:* B projesinde öğrenilen A projesine **hiç ulaşmıyordu**; üç projede
dört ayrı defter oluyor ve hangisinin güncel olduğu bilinmiyordu.

**Yeni karar:** tek defter, kitte durur, her projeye gelir, her projede aynıdır.
Projede büyür, `/kit-senkron` ile kite döner, sonraki proje **zaten öğrenilmiş**
alır.

⛔ **Kurulumda üzerine yazılmaz, BİRLEŞTİRİLİR** — var olan satır ikinci kez
eklenmez, hiçbir satır silinmez. Bir madde yalnızca kullanıcı *"bunu sil"*
dediğinde çıkar. Seviye çakışırsa yüksek olan kalır.

⚠️ **Bedeli bilinerek kabul edildi:** depo public olduğu için defterin tamamı
— seviye tabloları, tekrar eden hatalar, sormayı unuttuğu sorular dahil —
herkese açık. Kullanıcıya bilgi/durum ayrımı sunuldu, **tamamının yayınlanması**
seçildi. Deftere yine de şifre, anahtar, kurum içi bilgi ve müşteri adı yazılmaz.

### Reddedilen yaygın tavsiyeler

| Tavsiye | Neden reddedildi |
|---|---|
| *"Küçük projede API ve iş mantığı aynı dosyada olabilir"* | Birleştirmenin sebebi geliştiricinin yazma süresiydi; ajan yazınca maliyet **sıfır**. `01-architecture.md`'de yazılı |
| *"Edge'e taşı, hızlanır"* | Edge kodu kullanıcıya yaklaştırır, **veritabanına değil**. Doğru kural bölge eşleşmesi. `12-operations-and-scaling.md` |
| *"SEO için addy'nin paketi yeterli"* | Addy'de **SEO ile ilgili tek satır yok** (ölçüldü). SEO tamamen kite ait: `18-seo.md` |
| TestSprite gibi dış QA aracı | Tek kişilik ekipte gerekmez; chrome-devtools MCP + TDD + axe + Lighthouse zaten var. `06-testing.md` |

---

## Çalışma düzeni

1. Değişikliği yaz
2. `node skills/kit-senkron/bin/denetim.mjs .` — kırık referans yakalar, **atlanmaz**
3. `.claude-plugin/plugin.json` içindeki sürümü artır (yama: `1.0.1`, yeni kural: `1.1.0`)
4. Commit + push
5. `claude plugin marketplace update bariskose-skills` → `claude plugin update proje-kiti@bariskose-skills`
6. Kullanıcıya **Reload Window** gerektiğini söyle — oturum plugin'i açılışta bir kez yükler

⚠️ **Kurulu kopya ile depo ayrı şeylerdir.** Deponun sürümü ile çalışan
oturumun yüklediği sürüm aynı olmak zorunda değildir; ikisi ayrı ayrı ölçülür.

---

## Anlatım düzeni — kullanıcıya nasıl yazılır

`skills/yeni-proje/dosyalar/docs/standards/sablonlar/calisilacak-konular.md` →
**Seviye defteri** okunur; anlatım düzeyi oradan ayarlanır, ajanın
izleniminden değil.

Şu an **seviye 3** (açıklamasız kullanılır): ajanın çıktısını denetleme · kite
kural yazma · prompt yazma · bağlam yönetimi.
Geri kalanı 1–2 arası — terimler açılarak yazılır.

Biçim kuralları `CLAUDE.md`'de: terim **eğik çizgiyle ve eş anlamlılarıyla**
yazılır (*katman / layer / tier*), yalnızca ilk geçişte. Okuyucu profili: işi
yazılım olmayabilen, kararı veren ama kodu yazmayan biri — **rapor dili değil,
anlatır gibi.**

---

## 2026-09-09 oturumunda yapılanlar

| Ne | Sonuç |
|---|---|
| Payload şablonunun adı | `PROJEYE-CLAUDE-MD-OLUSTURMAK-ICIN-SABLON.md`; Adım 2 kopyalarken `CLAUDE.md` yapıyor, Adım 7 doğruluyor |
| `CLAUDE.md` başına yönlendirme tablosu | *"Hangi soru → hangi dosya"* — 19 standart + `docs/project/` |
| Anlatım kuralı | *"Kod okuyamayan biri için de anlaşılır"* + ⭐ **"açıklama yeterli mi?"** sorusu |
| İki defter | `calisilacak-konular.md` + `ogrendigim-konular.md` (yeni) |
| Defterlerin yeri | ⭐ `docs/kullanici/` — üçüncü bölge, istisna kaldırıldı |
| Kurulu sürüm kontrolü | `/yeni-proje` Adım 0'a eklendi — hiç yoktu |
| Oturum sonu | *"Bir an değil"* — her şey olduğu anda yazılır |
| İki makine senkronu | Push edilmeyen defter öteki makinede yok |
| `docs/` → `kit-hakkinda/` | İki ayrı "docs" karışıyordu |
| `TARTISILMIS-KARARLAR.md` | Köke alındı — rehber değil, karar kaydı |
| *"Öğrenince sil"* | Kaldırıldı → **taşınır**, silinmez |

Sürüm: `1.85.0` → `3.1.0`. Kurulu kopya da güncellendi.

---

## Sırada ne var

- [x] ~~⭐ **Kit hâlâ hiç kullanılmadı.**~~ — **kullanıldı (2026-09-11).**
      `/yeni-proje` ilk kez fiilen çalıştırıldı. Sonuç aşağıda:
      *"İlk gerçek kullanım — 2026-09-11"*.

- [x] ~~⭐ **Kullanıcı yarın devam edecek.**~~ — devam edildi (2026-09-13/14 turları); bayat madde kapatıldı (2026-09-17).
- [ ] ⭐ **Mobil standardı (`17-mobile.md`) iskelet** — deep link, push, çevrimdışı,
      zorunlu güncelleme, mağaza reddi, izin akışı, biyometri, Maestro yok. İlk
      gerçek mobil projede yaşanarak genişletilecek; tahminle yazılmayacak
      (dosyanın başındaki uyarı, 2026-09-14).
- [ ] ⭐ **3.11.0 hiç uçtan uca koşmadı.** Sonraki adım yeni kural değil, kitle bir
      projeyi baştan sona bitirmek. O turdan öğrenilecekler (2026-09-17'de
      yazıldı): (1) kuralların **birbiriyle çelişip çelişmediği** — kağıtta
      tutarlı görünen 19 dosya aynı özellikte yan yana gelince çatışabilir;
      (2) ajanın **hangi adımları atladığı** — DoD ve beş göz kağıtta var,
      fiilen uygulanıyor mu; (3) anlatım kuralının **sohbette** tutup tutmadığı;
      (4) hangi kural dosyalarının **fiilen okunduğu** — bölünme kararı buna
      göre; (5) kurum sorularının sırasının **doğru zamanda** gelip gelmediği;
      (6) "beş göz" listesinin fazla mı eksik mi olduğu (aşağıdaki madde).
- [x] ~~Kullanıcı `KIT-REHBER.md` ve `KIT-NE-YAPIYOR.md`'yi okuyup dönüş yapacak~~ — okundu (2026-09-17); dönüş: özet belgeler 3.10.0'da bugünkü kurallara çekildi.
- [ ] Özellikle **`06-testing.md` → beş gözle doğrulama** listesi kalibre
      edilecek: fazla mı, eksik mi — ancak kullanan söyleyebilir
- [ ] **Dört dosya bölünme eşiğinde** (2026-09-17 ölçümü): `CALISMA-KILAVUZU.md`
      1205 · `11-agent-workflow.md` 1139 · `SKILL.md` 1075 · `00-stack.md` 912.
      ⭐ **Karar (2026-09-17): bölünme ilk uçtan uca projeden SONRA.** Gerekçe:
      o tur hangi bölümlerin fiilen okunduğunu gösterecek; şimdi bölmek tahminle
      bölmektir ve her bölünme işaretçi/yayılma işi doğurur. Ölçüm: `wc -l`
- [x] ~~⚠️ **Kit hiç kullanılmadı.**~~ — yukarıdaki maddenin tekrarıydı,
      birlikte kapandı (2026-09-11).

### 📦 Kapatılan kararlar — arşiv


- [x] ~~Payload dosyasının adı~~ — **yapıldı (2026-09-09).**
      Eski ad: `dosyalar/CLAUDE.md` · yeni ad:
      `PROJEYE-CLAUDE-MD-OLUSTURMAK-ICIN-SABLON.md`.
      Kullanıcı `.md`'yi ad ortasında istemişti; çift uzantı bazı araçları ve
      denetim betiğinin dosya-adı desenini yanıltacağı için `-MD-` yazıldı.
      Adım 2 kopyalarken adı `CLAUDE.md` yapıyor, Adım 7 kontrol listesi
      `ls <proje>/CLAUDE.md` ile doğruluyor — sessiz kırılma kapatıldı.

- [x] ~~`CLAUDE.md` başına yönlendirme tablosu~~ — **yapıldı (2026-09-09).**
      *"Hangi soru → hangi dosya"* tablosu dosyanın başına kondu: 19 standart
      artı `docs/project/` belgeleri. Çakışma sırası da yazılı.
- [x] ~~`~/.claude/CLAUDE.md`~~ — **gerekmiyor (2026-09-09).** Kullanıcı kiti
      her yerde kullanıyor; kit projeleri zaten kendi `CLAUDE.md`'siyle geliyor.
      Boş kalması bilinçli.

### ⚠️ Bilinen ve kabul edilmiş açık

- [ ] **Denetim betiğine "çift kural" kontrolü** — aynı anahtar kelimeleri taşıyan iki `###` başlığı
      (ör. "dört adım" iki bölümde) uyarı versin. 2026-09-14'te iki anlatım bölümü yan yana yazıldı,
      betik yakalamadı; 2026-09-18'de elle birleştirildi.
- [x] ~~**Kanca değişince iki makinede doğrula**~~ — **kapatıldı (2026-09-20):** Windows'ta 3.12.1 iş bilgisayarında, Mac'te 3.12.1 `backend-ogrenme` klasöründe yeni oturumda "proje-kiti 3.12.1 yüklü" mesajı doğrulandı (Node v25.6.0, kanca `session-start.mjs`). Not: mesajdaki "CLAUDE.md yoksa" ayrımı kit projesi olmayan ama CLAUDE.md'si olan depoyu ayırt edemiyor — zararsız, projenin CLAUDE.md'si üstün. — Windows + Mac, yeni oturumda açılış
      mesajı geldi mi. 3.12.0 yalnızca Mac'te denenmişti; 3.12.1 Windows'ta
      `node hooks/session-start.mjs` ile test edildi, Mac'te yeni oturumla doğrulanacak.
      Denetim betiği bunu ölçemez.
- [ ] **`calisma-dokumanlari/` depoda açık.** On dosya public; altısında kurum
      adı ve ödev metni geçiyor. Kullanıcıya bildirildi, *"şimdilik kalsın"*
      dedi. Kapatılmak istenirse `.gitignore` + takipten çıkarma yeterli;
      **git geçmişini temizlemek ayrı bir iştir.**

---

## ⭐ İlk gerçek kullanım — 2026-09-11

⛔ **Kit bugün ilk kez fiilen çalıştırıldı.** `/yeni-proje`, boş bir klasörde
(`~/baris_projects/deneme-proje`) Adım 0'dan Adım 2'nin sonuna kadar koşturuldu.
Kurulum yarıda bırakıldı — amaç proje kurmak değil, **kiti sınamaktı.**

### Bulgu 1 — `docs/kullanici/` yayılma eksiği · **DÜZELTİLDİ**

**Belirti:** kurulum iki defteri (`calisilacak-konular.md`,
`ogrendigim-konular.md`) `docs/project/` altına açtı, sonra `docs/kullanici/`
altına taşımak zorunda kaldı. Aynı iş iki kez yapıldı.

**Kök sebep:** 2026-09-09'da alınan *"defterlerin yeri `docs/kullanici/`"*
kararı **eksik yayıldı.** Karar `16` ve `OKUBENI` tablolarına işlendi;
`SKILL.md` Adım 2'ye ve iki özet metne işlenmedi. Yani bu deponun kendi
*"YAYILMA TABLOSU"* kuralı çiğnenmişti — `CLAUDE.md` → *"TAZELEME KULLANICININ
İŞİ DEĞİL"*.

**Ölçüm:** düzeltmeden önce `docs/kullanici` ifadesi `SKILL.md` içinde
**0 kez** geçiyordu; şimdi 5 kez.

**Düzeltilen dört yer:**

| Dosya | Neydi | Ne oldu |
|---|---|---|
| `skills/yeni-proje/SKILL.md` Adım 2 md. 4 | Tüm şablonlar `docs/project/` diye listeleniyordu | **İki hedefli tablo** — defterler ayrı satırda |
| `skills/yeni-proje/SKILL.md` Adım 2 md. 6 | Defter tam yolu olmadan anılıyordu | Tam yol + *"`docs/project/` altına açılmaz"* uyarısı |
| `…/sablonlar/OKUBENI.md` girişi | *"İçindeki dosyalar `docs/project/` altına açılır"* — **kendi tablosuyla çelişiyordu** | İki hedef olduğu yazıldı, tabloya yönlendirildi |
| `…/16-yeni-proje-kurulumu.md` özet tablosu (sat. 160) | `sablonlar/** → docs/project/` — **kendi detay tablosuyla çelişiyordu** | *"İKİYE AYRILIR"* + detay tablosuna atıf |
| `…/16-yeni-proje-kurulumu.md` kurulum sırası (sat. 211) | *"hedef projede `docs/project/` altına açılır"* | İki hedef yazıldı + `ŞABLON —` beyanına atıf |
| `kit-hakkinda/KIT-REHBER.md` → *"projene YERLEŞEN dosyalar"* | `docs/kullanici/` **hiç sayılmıyordu** — kullanıcı kendi defterlerinin nereye geldiğini bilmiyordu | Satır eklendi, `docs/project/` ile farkı yazıldı |

### ⛔ KÖK SEBEBİN KÖKÜ — beş şablon hedefini BEYAN ETMİYORDU

⚠️ İlk düzeltme *"çakışmada `OKUBENI.md` üstündür"* demekti. **Bu yetersizdi** —
kullanıcı itiraz etti ve haklıydı: *"çakışma nerelerde varsa onları bulup
düzeltmek lazım."* Yetkili ilan etmek, çakışmanın **kalmasına izin vermektir.**

Tarayınca asıl sebep çıktı: şablonların **dokuzu** kendi başında *"ben şuraya
kopyalanırım"* diye yazıyordu; **beşi yazmıyordu** — `calisilacak-konular.md`,
`ogrendigim-konular.md`, `roadmap.md`, `teknoloji-ve-plan.md`,
`vscode-eklentileri.md`.

⭐ **Beyan olmayınca yanlış listeye itiraz eden hiçbir şey yok, ölçebilecek bir
şey de yok.** İki defter kendi içinde `docs/kullanici/` deseydi sapma ilk
günde görünürdü.

### ✅ KALICI ÇÖZÜM — hatırlamak yerine ÖLÇMEK

1. **Her şablon kendi hedefini beyan eder** — başında `ŞABLON — <hedef>`
   satırı. Beş eksik olana eklendi; artık on dördünde de var.
2. **`denetim.mjs`'e altıncı kontrol eklendi: `ŞABLON HEDEFİ`.** Beyanı olmayan
   şablonu ve beyanla çelişen her **tablo satırını** yakalar.

⛔ **Kontrol koşturularak sınandı, "temiz" çıktısına güvenilmedi.** Depo geçici
bir kopyaya alındı, iki hata kasten geri konuldu (bir tablo satırı eski yanlış
hedefe çevrildi, bir şablonun beyanı silindi); **ikisi de yakalandı.**

*Gerekçe:* betiğin kendi başlığındaki uyarı — 2026-09-06'da üç kontrolün
ikisinin hiç çalışmadığı, yine de *"✓ temiz"* yazdığı ölçülmüştü.

⚠️ **Ölçülemeyen sınır, bilerek kabul edildi:** serbest metindeki hedef iddiası
kontrol edilemiyor — liste maddesi satırlara yayılır, hedef başka satırda
kalır (bugünkü hatanın biçimi tam buydu). Bu yüzden hedef bilgisi **tabloya
taşındı**; tablo satırı tek satırdır ve makine okuyabilir. Serbest metinde
yeniden yazılırsa kontrol yine kör kalır.

**Sürüm:** `3.5.0` → `3.6.0` (yama değil **minor**: yeni bir commit kapısı).

## ⭐ Belediye standartları turu — 2026-09-13 / 14

Kuruma ait iki belge okundu (veritabanı geliştirme standardı; daha önce
canlıya çıkmış bir kurum projesinin teknik özeti) ve kit **kurum modu** için
sekiz çatışma üzerinden gözden geçirildi. Kural: kurumun yazdığı yerde kurum,
sustuğu her yerde kitin en kapsamlı varsayılanı; **emsal ≠ dayatma**.
Kararlar standart dosyalarına yazıldı, burada yalnızca dizin:

| # | Karar | Nerede |
|---|---|---|
| 0 | Anlatım: her kavram dört adımla, junior'a öğretir gibi; dört adım şablon değil kontrol listesi; robot dili yasak | `11-agent-workflow.md` → *"HER KAVRAM ÖĞRETİLİR"* · CLAUDE.md şablonu → *"ANLATIM ÖLÇÜTÜ"* |
| 0 | Kod dili proje moduna göre (kurum DB standardı Türkçeyse kod da Türkçe); dosya başı özet yorumu her dosyada | `02-coding-standards.md` |
| 0 | Dört kurgu (yalnızca arayüz / Next / Next+Nest / yalnızca API) — her biri neden, hangi araçlar, isteğin hattı; 4. soru tetikleyici değil; kurum varsayılanı Next+NestJS | `00-stack.md` → *"DÖRT KURGU"* |
| 1 | İsimlendirme: kurum standardı `@map` ile; kurum modunda iki taraf Türkçe | `04-database.md` → *"İsimlendirme"* |
| 2 | PK: kendi projede UUIDv7, kurumda `BIGINT IDENTITY` (`BIGSERIAL` düzeltmesi, `public_id`) | `04-database.md` → *"BİRİNCİL ANAHTAR"* |
| 3 | Sabit değer kümesi iki soruyla: iş biriminin yönettiği liste her modda tanım tablosu; kodun listesi kurumda tanım tablosu (`code`) + `as const` + senkron testi, kendi projede enum — **3.24.0'da inceltildi** (önceki: "enum yok, her iki modda") | `04-database.md` → *"SABİT DEĞER KÜMESİ"* |
| 4 | Migration: kendi projede Prisma Migrate, kurumda Prisma Client + Flyway biçimi SQL + koşucu; CI'da `migrate diff --exit-code` | `04-database.md` → *"MIGRATION ARACI"* |
| 5 | Audit: before-image JSONB, INSERT-only, tek noktadan otomatik, aynı transaction | `04-database.md` → *"Denetim kaydı"* |
| 6 | KVKK: `*_encrypted BYTEA` (AES-256-GCM, anahtar sürümü) + `*_hash` (tuzlu HMAC) | `14-privacy-and-compliance.md` |
| 7 | CI hattı merkezî `include` ise: yerel `verify` işi / `pre-push` kancası; husky + lint-staged her modda | `09-ci-cd-deploy.md` |
| 8 | Dosya depolama: `FileStorage` adaptörü, S3-uyumlu varsayılan, `public/` yasak, sekiz yükleme kuralı | `05-auth-security.md` → *"Dosya yükleme ve depolama"* |
| — | Zod: hazır kural → regex → refine; ReDoS ve `\p{L}` | `03-api-guidelines.md` |
| — | Server Action / Route Handler görev bölüşümü; `proxy.ts` | `01-architecture.md` |
| — | Yol C: test + canlı iki sunucu, `main` → test, etiket → canlı | `13-environments.md` |
| — | Kuruma sorulacak 23 soru, aşama haritasıyla | `sablonlar/kurumdan-ogrenilecekler.md` |

⛔ Kite proje/kurum adı yazılmadı; belgelerden yalnızca **genel** kural alındı.

### Ek — 2026-09-14, ikinci tur (başka bir AI ile yapılan tartışmadan)

| Karar | Nerede |
|---|---|
| Supabase/Firebase (BaaS) kitte yok — üç gerekçe, meşru istisna ADR ile | `00-stack.md` → *"Kullanılmayacaklar"* |
| NoSQL: modül modül "kararı veren soru" | aynı yer, MongoDB maddesi |
| Etki alanı: "en az biri" → **hepsi** fiilen kontrol edilir; 5+ yer risk sinyali | `06-testing.md` · `10-definition-of-done.md` |
| Hata takibi ne yakalar; GlitchTip kurum modu; Sentry bulutu kurumda kullanılmaz | `12-operations-and-scaling.md` |
| Aşırı mühendislik kapısı: üç soru; `code-simplification` her özellik sonunda | `11-agent-workflow.md` · `SKILL.md` |
| Session caching: `tokenVersion` için Redis (kurum), aksi DB | `05-auth-security.md` |

### Ek — 2026-09-14, üçüncü tur (kapsam taraması)

| Karar | Ev |
|---|---|
| Önbellek ve tazelik: etiketle, yazarken geçersiz kıl; `force-dynamic` her rotaya yazılmaz | `01-architecture.md` → *"Önbellek ve tazelik"* |
| Anlık veri: odak dönüşü → polling → SSE → WebSocket; sunucusuzda WebSocket yok | `00-stack.md` → *"Anlık veri"* |
| E-posta: `Mailer` adaptörü, react-email şablon, kuyruktan, düz metin sürümü | `00-stack.md` → *"E-posta"* |
| Çok dillilik: `next-intl`, çeviri tablosu, makine çevirisi kurumda yok; PRD sorusu 6.5 | `02-coding-standards.md` → *"Çok dillilik"* |
| Zaman dilimi: `TIMESTAMPTZ` UTC · `DATE` saatsiz gün · hesap İstanbul'da · `TZ=UTC` | `02-coding-standards.md` → *"Zaman dilimi"* |
| Yazma durumları (pending/başarılı/başarısız) ve iyimser UI kararı | `07-ui-design-system.md` → *"Yazma sırasında da durum vardır"* |

### Ek — 2026-09-14, dördüncü tur (uçtan uca yolculuk belgesinden çıkan boşluklar)

| Karar | Ev |
|---|---|
| Kuyruğa commit'ten sonra; kayıp kabul edilemezse transactional outbox; worker idempotent | `00-stack.md` → *"Kuyruğa ne zaman atılır"* |
| İş alanı durum makinesi: `as const` durumlar + geçiş tablosu + tek kapı `transition()` + olay tablosu | `01-architecture.md` → *"Durum makinesi"* |
| İdempotency anahtarı tekrar edilemez her yazmaya; istemci yeniden deneme politikası | `03-api-guidelines.md` → *"İdempotency"* |
| Açılış sırası: düş / degraded / devam tablosu; graceful shutdown | `12-operations-and-scaling.md` → *"Açılış sırası"* |
| `kit-hakkinda/UCTAN-UCA-YOLCULUK.md` — sıra ve akış belgesi; özet belgeler bugünkü kurallara çekildi | ICINDEKILER, CLAUDE.md yayılma tablosu |


### Ek — 2026-09-18 (3.12.0): birleştirme ve oturum kancası

| Karar | Ev |
|---|---|
| `11-agent-workflow.md`'de iki çakışan anlatım bölümü ("DÖRT adımda açılır" + "HER KAVRAM ÖĞRETİLİR") **tek bölüme** indirildi; işaretçiler tek başlığa | `11-agent-workflow.md` → *"HER KAVRAM ÖĞRETİLİR"* |
| **SessionStart kancası**: plugin açıkken her oturumda, klasör ne olursa olsun, anlatım ölçütünün özeti + kuralın tam yolu + kitin becerileri enjekte edilir. Kuralın kopyası değil, işaretçi | `hooks/hooks.json` · `hooks/session-start.sh` |
| Denetim betiği **çift kuralı yakalayamıyor** (yalnızca kırık atıf arıyor) — aynı konuyu iki başlıkta yazan bölümleri bulan bir kontrol fikri | *"Sırada ne var"*a eklendi |


### Ek — 2026-09-18 (3.12.1): oturum kancası Node'a taşındı

| Karar | Ev |
|---|---|
| **Kanca bash + jq yerine Node** (`hooks/session-start.mjs`), hooks.json **exec biçimi** (`command: node`, `args`) — kabuk yok. Neden: 3.12.0 kancası `jq` istiyordu; jq ne Windows'ta ne macOS'ta hazır gelir, yalnızca tesadüfen kurulu olduğu Mac'te çalıştı; Windows iş makinesinde her oturum "jq bulunamadı" düştü, kural gelmedi. Claude Code, SessionStart için **düz metin stdout'u bağlama ekler** (belgeli); `{priority, message}` JSON'u tanımlı bir biçim değildi. Node zaten kitin ön koşulu | `hooks/hooks.json` · `hooks/session-start.mjs` |
| **Kural: kanca ve betikler kitin ön koşulu dışında araç istemez** (Node + Git). Yeni bağımlılık = README *"Ön koşullar"* tablosuna satır + iki OS'ta deneme | `README.md` → *"Ön koşullar"* |
| ~~Bilinen açık: kanca iki makinede doğrulanmalı~~ — 3.12.1 Windows + Mac'te doğrulandı (2026-09-20). Denetim betiği bunu ölçemez | *"Sırada ne var"* |

### Ek — 2026-09-20: öğrenme deposundan gelen yedi bulgu (kaynak: özel `backend-ogrenme` deposu, `_notlar` klasöründeki "kite taşınacaklar" listesi — bu depoda yok)

| # | Bulgu | Sonuç |
|---|---|---|
| 1 | `.gitattributes` yok | ✅ 3.12.2 — `* text=auto eol=lf`, betikler LF |
| 2 | `08` rebase anlatmıyor | ✅ 3.12.2 — *"İki makine, bir dal — merge mi, rebase mi"* |
| 3 | Düz SQL öğretilmiyor | ✅ 3.12.2 — kural değil, defter satırı ("SQL okuma") + `04`'e tek cümle |
| 4 | Eski projeyi yeniden yazma senaryosu yok | ✅ 3.13.0 — envanter 7b + `11` → *"ESKİ PROJEYİ YENİDEN YAZMA"* + soru 6.6; ayrı skill bilinçli olarak yok |
| 5 | "Teslim paketi" adlandırılmış mı | ✅ 3.12.2 — 6b'de vardı; `13` ve `kurumdan` işaret eder; DevOps sınaması cümlesi; sağlık ucu `/api/health` ile tutarlı |
| 6 | .NET cümlesi | ✅ 3.12.2 — `11` adım 2: karşılık tek cümle, kit yalnızca JS ailesi |
| 7 | Standartlar `.claude/rules/`'a | ⏳ **Deney yapıldı (2.1.265, `claude -p`):** rules + `@import` çalışıyor · `paths` çalışıyor (eşleşen dosya okununca yükleniyor) · ⛔ **`@import`, `paths`'li dosyanın içinde de açılışta genişletiliyor — kapsamı deliyor.** Bu yüzden "ince rules + import" tasarımı geçersiz. Yeni tasarım: çekirdek (`paths`'siz, ~120 satır) + tetikleyici (`paths`'li, 10–15 satır: "şu standardı oku" + kural adları özeti) + `docs/standards/` tek kaynak. Şablon 691 → ~100. `InstructionsLoaded` hook ile yüklenenler loglanır. **Ayrı tur** |

- [x] ~~⭐ **Tur C — rules dönüşümü**~~ — **yapıldı, 3.14.0 (2026-09-20).** Sonuç aşağıda *"Tur C — rules dönüşümü"*: `SKILL.md` Adım 2, `16-yeni-proje-kurulumu`, şablon `CLAUDE.md`, `.claude/rules/` üretimi, `InstructionsLoaded` kancası, önce/sonra `/context` ölçümü. Deney klasörü: scratchpad (kalıcı değil); yeniden üretmek 5 dakika.


### Tur C — rules dönüşümü (2026-09-20, 3.14.0)

| Ne | Sonuç |
|---|---|
| Şablon `CLAUDE.md` | 691 → 50 satır: §0 proje değişkenleri + "kurallar nerede" tablosu |
| `.claude/rules/00-cekirdek.md` (133 satır, `paths` yok) | Rol tek paragraf · anlatım ölçütü · hangi soru → hangi dosya · kaynak hiyerarşisi · beceriler · sekiz kapı · kullanıcıya karşı · commit protokolü · asla yapma · oturum hijyeni |
| 8 tetikleyici (`kod` · `veritabani` · `api` · `guvenlik` · `arayuz` · `test` · `yayin` · `mobil`, 10–25 satır, `paths`'li) | "Şu standardı oku" + kural adları; içlerinde `@import` yok |
| Taşınanlar | Rol A–F, terim zenginliği/biçimi, "ansiklopedi değil" → `11`; commit önerisi raporu → `10`; "kit nerede" → `kit-senkron` |
| Yayılma | `SKILL.md` Adım 2 ve Adım 7 listesi · `16` tablo · `ICINDEKILER` · `KIT-REHBER` · `11` atıfları · kanca mesajı |
| Denetim betiği | 7. kontrol **benzer cümle** (4-kelime dizi kesişimi ≥ %75, farklı dosya); ilk koşuda 9 + 1 bulgu, hepsi işaretçiye çevrildi. Kural: betik **tek başına** koşturulur, boru hattı çıkış kodunu yutar |
| Ölçüm kancası `hooks/kural-log.mjs` | `InstructionsLoaded` + `PostToolUse(Read)` → `~/.claude/proje-kiti/log/<proje>.jsonl`; gerçek oturumda doğrulandı: çekirdek `session_start`, `veritabani.md` ← `prisma/schema.prisma`, `api.md` + `kod.md` ← `route.ts`, `arayuz.md` ← `C.tsx` |
| Ölçüm | Oturum açılış yükü 46.952 → 34.333 token (−%27), aynı soru |
| Bulunan ek çelişki | `02`'de iki başlık bloğu biçimi vardı (13 Eyl'de yazdığım ikinci biçim) — kanonik halkalara birleştirildi, `NEDEN` ve `DİKKAT` halkaları eklendi |
| Politika | `11` → *"Bağlam yönetimi"*: ne yüklenir ne zaman · yeni oturum sinyalleri · model/pencere politikası tarih damgalı, üç ayda bir gözden geçirilir |

⚠️ **Açık:** benim-belediyem ve backend-ogrenme eski yapıda (691 satırlık `CLAUDE.md`, `.claude/rules` yok). Kit projesi olmayan `backend-ogrenme` kendi `CLAUDE.md`'siyle kalır; benim-belediyem'e geçiş, oraya dönüldüğünde `/kit-senkron` ile.

### Ek — 2026-09-20 (3.15.0): kit güncellemesi "fark ettiği an sorar, onayla kendisi çeker"

Kullanıcı kararı: kurulu plugin ya da kaynak klon geride kaldığında ajan **söylemekle
kalmaz, sorar** ("güncelleyeyim mi?") ve evet derse komutları kendisi koşturur; yeniden
başlatma gerektiğini söyler. Üç yerde: oturum kancası (her açılışta GitHub'la karşılaştırır,
3 sn zaman aşımı, ağ yoksa sessiz) · `/yeni-proje` başı · `/kit-senkron` başı (plugin + kaynak
klon `[behind N]`). Ayrıca çekirdek kapı 4, test ve tarayıcı doğrulama becerilerini adıyla
sayar (3.14.1).

### Ek — 2026-09-20 (3.16.0): senkronda TEK ANLIK GÖRÜNTÜ + Tur C'den kalan bayat atıflar

Kaynak: benim-belediyem oturumunun *Kite taşınacaklar* maddesi. Aynı makinede iki
Claude oturumu açıkken (biri kiti yazıyor, biri kiti projeye senkronluyor) proje
**karışık anlık görüntü** aldı: `00-stack.md` 3.15.1'den, kalan dosyalar 3.15.2'den.
Sebep: `status -sb` yalnızca uzakla farkı gösterir; klondaki commit edilmemiş
değişikliği ve senkron sürerken atılan yerel commit'i göstermez. Kural `kit-senkron`
Adım 1 → *"TEK ANLIK GÖRÜNTÜ"*: başlamadan `status --porcelain` boş mu · `rev-parse
HEAD` ile mühürle · kopyalamadan önce yeniden ölç, hash değiştiyse baştan. Adım 4
işaret eder. Yeni kural olduğu için MINOR (Adım 4 kuralı: yama 1.0.**1**, yeni kural
1.**1**.0 — 3.15.3'teki `save-exact` kuralı da aslında MINOR olmalıydı).

Ayrıca Tur C'de şablon `CLAUDE.md` 50 satıra inince eski bölüm numaraları öksüz
kaldı; denetim `§N` biçimini denetlemediği için görünmedi. On bir atıf `00-cekirdek.md`
başlıklarına çevrildi: §6.3 → *"Git ve commit"* (`08`, `15`×2, `kit-senkron`,
`KIT-NE-YAPIYOR`) · §3 → *"Zorunlu kapılar"* (`16`, `PRD`, `SKILL`) · §1 → *"Hangi soru
→ hangi dosya"* (`15`, `16`) · §2 → *"Beceriler"* (`11`). Artık ok biçiminde
oldukları için denetim bundan sonra kırılırsa yakalar.

### Ek — 2026-09-21 (3.17.0): "kod ertelenir, kural ertelenmez" + alan tamlığı taraması

Kaynak: benim-belediyem oturumu. Kullanıcı "kesirli kuruş birike birike kim öder"
diye sordu; cevap kitte yoktu (02:507 ve 04:406 yalnızca "float değil" diyordu), o an
türetildi. Teşhis: kit alan kurallarını yalnızca bir projenin **fiilen çarptığı** yerde
taşıyordu. İlke `11` → *"Kod ertelenir, kural ertelenmez"*: YAGNI kodu erteler, kuralı
değil; ayırt edici soru "gerçek bir belediye uygulamasında bu alan var mı"; ölçülmemiş
kural **iddia notu** taşır (kısa satır, denetimin 90 karakter eşiğinin altında —
dosyalar arası tekrar bulgusu üretmez).

Tek seferlik tarama — sekiz aday, kitte ölçüldü:

| Alan | Kitte | Sonuç |
|---|---|---|
| Para | yalnızca "float değil" | **YOK** → `02` → *"Para"*: tam sayı kuruş, sınırda dönüşüm, birimli alan adı, `describe` ile belgeye, kuruş × adet, tek yuvarlama sonda, en büyük kalan (Σparça === toplam), test; `04` işaret eder |
| Zaman | `02` → *"Zaman dilimi"* (UTC/İstanbul, DATE, gün sonu, IANA, cron) | **eksik** → yarı açık aralık + çakışma ifadesi + `EXCLUDE gist`; "bir ay sonra" (31 Ocak) |
| PII/KVKK | `14` + `05` + `04`: maskeleme, log yok, silme/taşınabilirlik, saklama tablosu, periyodik imha | var, yeterli |
| Dosya | `05` sekiz kural + `public/` tuzağı | **eksik** → kural 6'ya indirme başlıkları (`attachment` + `nosniff`, HTML/SVG XSS) |
| E-posta/SMS | `00` → *"E-posta"*: Mailer, fake sürücü, kuyruk/retry/dead letter, PII yok, SPF/DKIM | **eksik** → "gönderdim ≠ ulaştı": teslim olayları, sert/yumuşak bounce, OTP "kod gelmedi" yolu |
| Eşzamanlılık | `03` idempotency (+yarış), `07` çift tıklama, `04` unique+transaction, `version` | **eksik** → `04` → *"Eşzamanlılık"*: koşullu yazma, etkilenen satır sayısı, 200/409 testi |
| Ölçek | `03` sayfalama tavanı, `04` index + N+1 | var, yeterli |
| Türkçe/i18n | `02` localeCompare/İ-ı, `04` collation + LIKE kaçırma | var, yeterli |

Ajanın mesajı 3.15.3'ü güncel sanıyordu (3.16.0 çıkmıştı, "Kite taşınacaklar" maddesi
3.16.0'da alınmıştı); klon çekilmeden gelen bulgu, senkron kuralının (TEK ANLIK
GÖRÜNTÜ) neden gerektiğinin bir örneği daha.

### Ek — 2026-09-21 (3.18.0): saat yazarken dilim — ajan mesajında ve platform cron'unda

Kaynak: benim-belediyem 3.17.0 senkron raporu. Ajan "UTC 00:31" yazdı, kullanıcı
saatte 03:31 gördü. Ölçüm: `02` → *"Zaman dilimi"* yalnızca **uygulama ekranı** için
"dilim belli" diyordu; ajanın kendi mesajı/devir dosyası için kural yoktu. Ayrıca `02`,
"cron İstanbul saatiyle tanımlanır, bkz. `12` → Planlı görevler" diye işaret ediyordu
ama `12`'de o içerik **yoktu** (boş işaretçi). İki ekleme: çekirdek *"Kullanıcıya karşı"*
tek madde (TSİ; UTC gerekiyorsa ikisi birden; `date -u`) · `12` → *"Planlı görevler"*
saat dilimi tuzağı (platform cron'u UTC, TR karşılığı yorum; kendi zamanlayıcıda `tz`).
Aynı raporda: TEK ANLIK GÖRÜNTÜ kuralı ilk kez uygulandı, çalıştı; öneri yok.

### Ek — 2026-09-21 (3.18.1): ölçüm kancası Bash okumalarını da görür

benim-belediyem'in 3.17.0 senkron oturumu log'a **hiçbir şey** yazmadı (dosya hâlâ 20 Eyl
16:40'taki 3 satır). İki olası sebep: (1) oturum yeniden başlatılmadı — açılış olayı yok;
(2) ajan "auto" modda dosyaları `Read` yerine `cat`/`sed`/`grep` ile okuyor, `PostToolUse(Read)`
kancası bunu görmüyor. (2) kesin bir ölçüm boşluğu: kanca `Read|Bash` oldu; Bash komutunda
okuma fiili (`cat sed head tail grep awk less more rg bat diff`) + `docs/standards/…md` ya da
`.claude/rules/…md` yolu varsa `StandartOkundu` + `arac: "bash"` yazılır; `cp` sayılmaz.
Sahte olayla test edildi. (1) kullanıcı yeni oturum açınca log'dan doğrulanacak.

### Ek — 2026-09-21 (3.19.0): yanıt şemasında para `integer`; iç içe `Date` gövdede açık çevirmen, spread yok

Kaynak: benim-belediyem 107c (yanıt sözleşmesi, ticaret uçları). İki ölçüm, `03` →
*"Yanıt gövdesi de belgelenir"* bölümüne iki kural: **(1)** `z.number()` ile `z.int()`
derlemede aynı tip; fark yalnızca belgede — `"type": "number"` *"ondalık olabilir"*
demek, belgeden tip üreten bir istemci kuruşu lira sanabilir. Para alanı `z.int()`,
tek paylaşılan şema, CI kapısı adı `Kurus` ile biten her alanı `integer` diye ölçer ve
**sıfır alan bulursa da kırmızı** (mutasyonla kanıtlandı: `z.number()` yazılınca alan
adıyla yakalandı). **(2)** İç içe gövde `Date` taşıyınca `ZodType<T>` derleme kapısı
`Date`≠`string` diye kırıldı; şemayı gevşetmek yerine açık çevirmen, alanlar tek tek.
Çevirmende `...spread` yasak: çalışma anı kontrolü fazladan alanı bilerek reddetmiyor
(alan eklemek kırıcı değil), spread iç bir alanı belgeye yazılmadan API'ye sızdırır —
sızıntı deneyi testi (spread'e dönünce kırmızı, ölçüldü).
Defter: aynı projenin 2026-09-20 ve 21 tarihli altı satırı kit kopyasına birleştirildi.
⚠️ 2026-09-20'deki beş satır 3.16.0–3.18.1 senkronlarında **kitten projeye gelirken
projeden kite gitmemişti** — senkron fiilen tek yönlü kalmış. Adım 2'deki
"defter karşılaştırması" bu yüzden atlanmaz; kanıt `diff` çıktısıdır.

### Ek — 2026-09-21 (3.20.0): oturum sonu KURAL RAPORU kuralı — ilk gerçek ölçümle

Tur C'nin açık ucu kapandı. İlk gerçek ölçüm (benim-belediyem, 107c, oturum b56cd330):
açılışta `CLAUDE.md` + `00-cekirdek.md` · `kod.md` ← `src/features/cart/schemas/cart-summary.schema.ts`
· `test.md` ← `tests/unit/cart-summary-response.test.ts` · **fiilen okunan standart: hiç** →
rapor "⚠️ İşaretçiye gidilmedi: 01/02 ve 06 açılmadı" dedi. Kanca `Read` ve Bash (`cat`/`sed`)
okumalarını başsız (`claude -p`) oturumda ayrıca doğrulandı — uyarı gerçek. Kural `15` →
*"KURAL RAPORU"*: devir dosyasından önce rapor koşturulur, çıktısı DURUM'a yapıştırılır;
uyarı varsa oturum kapanmaz — standart açılır, yazılan kod ona karşı yeniden okunur.
Tarama listesine 4b. "CLAUDE.md kapı N" biçimindeki üç bayat atıf da çekirdeğe çevrildi.

"Sırada ne var" 3.11.0 maddesinin (4) numaralı sorusu — *hangi kural dosyaları fiilen
okunuyor* — artık tahmin değil kayıt; bölünme kararı bu log'larla verilecek.

### Ek — 2026-09-21 (3.21.0): `KIT-SURUM` damgası — "proje kopyası geride" artık görünür

Kullanıcı sorusu: *"Mac'te kaç projeyle çalışırsam çalışayım hepsi son değişiklikleri
görüyor mu?"* Cevap: hayır — üç katman var (kaynak depo → kurulu plugin → proje kopyası)
ve hiçbiri diğerine kendiliğinden yansımaz; kanca yalnızca 2. katmanı (plugin geride)
söylüyordu, 3. katmanı (projenin `docs/standards/` kopyası geride) kimse söylemiyordu.
Çözüm: `docs/standards/KIT-SURUM` tek satır damga (`3.21.0 @ <mühür>`); `/yeni-proje`
kopyayla getirir, `/kit-senkron` Adım 5'te mühürle yazar (TEK ANLIK GÖRÜNTÜ'nün hash'i);
açılış kancası cwd'de damgayı okur, güncel kitten gerideyse "senkron edeyim mi?" diye sordurur,
damga yoksa bir kez "eski kurulum" der. Denetim: damga `plugin.json` ile TAM eşleşmeli.
Kanca dört durumda sınandı (geride · güncel · damga yok · kit projesi değil).
Sonuç: kullanıcı hiçbir projeye "kit güncellendi" demez; her proje kendi açılışında sorar.

### Ek — 2026-09-21 (3.22.0): E.13 Express/Fastify — savunmanın eksik halkası ve arama motoru yanlışları

Öğrenme çalışmasında bir arama motoru AI cevabı E.13 ile karşılaştırıldı. Kitin darboğaz
ölçümü doğruydu ama savunma eksikti: Fastify'ın hız dışındaki iki artısı (kapsüllü eklenti,
yerleşik JSON Schema doğrulama) **Nest'in altında zaten karşılanıyor** (modül +
`ZodValidationPipe`) — adaptör değişince değişmez, yani Nest'te etkisiz. Ters koşul da somut
değildi: kazandıran "mikroservis" değil, **handler'ın DB'siz olması** ya da APM'de HTTP payının
%20'yi geçmesi. Eklenenler: tek satırlık adaptör kodu; ters koşul tablosu; ajanın ve arama
motorunun tekrar üreteceği dört iddia ("TS → Fastify", "AJV ile 2 kat JSON", "sunucusuz →
Fastify", "mikroservis → Fastify") ve doğruları; `autocannon` ile DB'siz/DB'li uç ölçme
egzersizi; tarih damgalı npm sayıları (express 101M / fastify 9.6M, adaptörler 7.4M / 1.3M);
Express 5 (Eylül 2024) notu — "Express bakımsız" cümlesi bayat. `00-stack.md` gerekçe hücresi
aynı iki cümleyle güncellendi. Kural: E.13'teki her "seçilmeyen alternatif" için **"artısı bizim
katmanda zaten var mı"** sorusu savunmaya eklenir; ölçümler tarih damgasıyla yazılır.


### Ek — 2026-09-24 (3.22.1): Kartlardaki Türkçe adlı kod örnekleri İngilizceye çevrildi

Öğrenme çalışmasının H1/H2 turunda kartlardan parça kopyalanırken fark edildi: kitin kendi
kuralı (`02-coding-standards.md` → *"Kitin kendi örnekleri her zaman İngilizcedir"* — ajan
kuralı değil örneği taklit eder) ile üç bölümdeki örnekler çelişiyordu: C.9 `isEmri.slaBitis`
ve `function ata`, E.0 `const isEmri`, BÖLÜM F 1. adım `talepOlusturSemasi` / `baslik` /
`aciklama` / `lokasyonId` / `oncelik` ve `talepOlustur(@Body() gövde: TalepOlusturDto)` (Türkçe
karakterli tanımlayıcı), 8. adım `sonuc` / `girdi` / `durum`, G.2 `durumDegistirSemasi` ve
`isEmri.version`. Hepsi İngilizce ada çevrildi (`workOrder`, `createWorkOrderSchema`,
`title/description/locationId/priority`, `create(@Body() body: CreateWorkOrderDto)`,
`result/input/status`, `changeStatusSchema`); Türkçe karşılık kitin *"TÜRKÇE KARŞILIK YORUMDA,
PARANTEZ İÇİNDE"* kuralıyla yorumda bırakıldı. `proje-teknoloji-ve-plan.md`'deki aynı bloklar
(bayt bayt aynı bölümler) birlikte güncellendi. Kural değişmedi, örnekler kurala uyduruldu →
yama sürümü.

### Ek — 2026-09-24 (3.23.0): Model ve efort adıma göre — "hatayı kim yakalar" ölçütü

Kullanıcı sordu: *"belediye projelerini hangi modelle yaptırırdın, kiti hangisiyle;
max hiç gerekli değil mi?"* Karar: tek model yok, adıma göre. Ölçüt: adımın hatasını
test ya da betik yakalıyorsa ucuz model (`xhigh`), yalnızca insan yakalayacaksa ya da
hata geç dönecekse en güçlü model (`max`). Plan, güvenlik tasarımı, kit kuralı, merge
öncesi inceleme, tasarım yönü kararı → en güçlü + `max`; dilim geliştirme, bileşen,
test → bir alt kademe + `xhigh`; mekanik iş → `high`. Tablo tek yerde,
`11-agent-workflow.md` → "MODEL VE EFORT"; rehberler, kılavuz ve `SKILL.md` Adım 3/5
işaret eder; çekirdek kural (`00-cekirdek.md`) davranışı her oturumda taşır: adım
sınırında tek satır öneri, devir promptunda "SONRAKİ ADIM İÇİN MODEL / EFORT" satırı
(`15-oturum-devri`). Kayda giren iki olgu: model değişimi hafızayı silmez (düşünce
blokları taşınmaz, önbellek yenilenir — kullanıcı bunu "ajan unutur" sanmıştı);
Opus 5.5'in API efort varsayılanı `medium`, adil karşılaştırma için elle `xhigh`.
Fiyatlar tarih damgalı; yeni model çıkınca tablo güncellenir. ⚠️ Tablo akıl yürütme,
ölçüm değil — ilk gerçek karşılaştırma buraya yazılacak.

### Ek — 2026-09-25 (3.23.1): Seviye defteri birleştirildi — onaylı düşürme kite de yansır

`backend-ogrenme` defteri kit şablonuyla birleştirildi (K24 akışı, kullanıcı "yaz" dedi):
14 konu satırı eklendi (SDLC, gereksinim okuma, OOP, modül düzeni, eski projeyi
devralmak, API biçimi, ağ, HTTP, TS dil, derleyici hatası, TS tip sistemi, veri yapıları,
tarih/para/metin, Node/npm), üç satıra kanıt notu, kelime defterine sekiz satır (CRLF/LF,
veri mi davranış mı, kabul ölçütü, varlık/değer nesnesi, tasarım iki anlam, model dört
anlam, servis üç anlam, alan modeli). "Katmanlı mimari" satırı 1 → 0: kullanıcı "servis =
API + mantık" deyince düşürme önerildi ve onaylandı. Birleştirme kuralındaki *"seviye
çakışırsa yüksek kalır"* bayat kopyaya karşı bir korumadır; **tarihli ve kullanıcı onaylı
bir düşürme kite aynen geçer**, yoksa defter "her projede aynı" olmaktan çıkar. "Sürüm
kontrolü (Git)" satırı kitteki (kurum adı geçmeyen) hâliyle kaldı — defter herkese açık.

### Ek — 2026-09-25 (3.24.0): Öğrenme deposundan dokuz bulgu — sabit değer kümesi moda göre, Prisma 7 düzeni, kart örnekleri ölçümle düzeltildi

Kaynak: özel `backend-ogrenme` deposunun H3–H4 turları; her iddia gerçek Nest 12.1,
PostgreSQL 18.4 ve Prisma 7.10 üzerinde ölçüldü. Kullanıcı "önerilerini kabul ediyorum,
yap" dedi (K24 akışı).

1. **Sabit değer kümesi (#3 inceltildi).** "Enum yok, her iki modda" yerine iki soru:
   *liste kimin* · *yapıyı kim değiştiriyor*. İş biriminin yönettiği liste her modda tanım
   tablosu; kodun listesi kurumda tanım tablosu + `code` + `as const` + eşleşme testi,
   kendi projede Prisma `enum` (tek kaynak — 04'ün "kaç kaynak" ölçütü; Prisma'nın TS
   karşılığı `as const` nesnesi, 02 ile çelişmez). Yayılma sırasında İş Emri PRD ⭐15
   bulundu ("ekranı olmayan tablo gereksiz yapı") → üçüncü satır: ekransız iş listesi
   kendi projede enum. Kodun listesini taşıyan tabloda `code` kolonu yoktu (eşleşme testi
   değişebilen `name`'e dayanamaz) — eklendi. Veri modeli ⭐V2, §1.5, §2.3 kuralın
   kendi-proje moduna bağlandı; 01'in durum makinesi satırı moda göre.
2. **Prisma 7 düzeni** — 04'e yeni alt bölüm: adres `prisma.config.ts`'te (şemada `url` →
   P1012), `prisma-client` + `output` (yoksa generate durur), `@prisma/adapter-pg`;
   `migrate dev` istemciyi üretmez → `prisma generate` (04'ün "tiplerini yeniler" cümlesi
   yanlıştı; 13 ve 01 akışlarına, C.3'e adım); `migrate diff --from-url` kalktı →
   `--from-config-datasource --to-schema`, `--exit-code` 0 / 2 / 1. C.3 şema örneği
   güncellendi.
3. **Varsayılanlar açık yazılır:** `onDelete` her ilişkide (Prisma varsayılanı isteğe
   bağlıda `SET NULL`); FK kolonuna index Prisma koymuyor (silme 22 ms → 0,5 ms);
   `@db.Timestamptz(3)` (`DateTime` varsayılanı saat dilimsiz — dışarıdan bakan sorgu 3
   saat kayıyor).
4. **Yarım migration:** Prisma Migrate dosyayı tek işlemde koşmuyor (`applied_steps_count`
   0 yanıltıcı) → 04 handikap satırı + P3009 akışı; kurum koşucusuna dördüncü görev: her
   dosya `BEGIN … COMMIT`, `CREATE INDEX CONCURRENTLY` ayrı dosyada.
5. **Kısmi index** 7.10'da önizleme (`partialIndexes`; `where: raw(…)` doğru SQL üretti);
   elle yazılanı `migrate diff` yok sayıyor. Veri modeli V7 ve §4 kutusu.
6. **PG 18 skip scan:** "birleşik index'in ikinci kolonu tek başına çalışmaz" artık kesin
   değil (50 değerli ilk kolonda "Index Searches: 51"); ilke değişmedi — E.9 ve §4 kutusu.
7. **Kart örnekleri kararla çelişiyordu:** E.2 "O" önceliği sınıfa taşıyordu → türe göre
   dallanma + "öncelik farkı veridir"; E.4 kodu sabit 4 saat ve "1 saat kala" diyordu →
   `BreakdownPolicy` = `SLA_RULES` × `ASSET_MULTIPLIER` + takvim, başlangıç `slaStartAt`
   (§6 karar 1), `satisfies` ile süresi unutulan öncelik derlenmez, `calculate` async;
   örnek `tsc --strict` ile derlendi. E.0 ve §4 tablosundaki sınıf adları (Türkçe adlar
   3.22.1'den kaçmıştı) aynı üçlüye çekildi. E.13 N+1: `include` 1 değil **2** sorgu,
   `relationJoins` ile 1, `Promise.all` + `findUnique` birleşiyor; alan adları veri modeline
   uyduruldu (`assigneeId`, `firstName`/`lastName`); 04 → Performans'taki "tek sorguda" da.
8. **Captive dependency (01 + C.1):** "singleton ilk istekteki hâliyle dondurur" Nest'te
   yanlış — kapsam yukarı yayılıyor; asıl bedel worker'da `get()` hatası ve `resolve()` ile
   `undefined` kullanıcı. C.1'de `TRANSIENT` "her çağrıda yeni" değil, "her isteyene yeni".
9. **Repository (01 + E.13):** reddedilen genel `IRepository<T>`, istenen modül başına adlı
   sorgu dosyası — iki yere bağlayan paragraf, E.13 savunma cümlesi buna göre.
   **dependency-cruiser 18.4** Node `^22 || ^24 || >=26` (Node 25'te açılmıyor) → C.8 notu.

Kural: kitin örnekleri kitin kendi kararlarıyla aynı sayıları ve adları kullanır — örnek
karar tablosundan sapınca ajan örneği kopyalar, kararı değil. ⚠️ Windows'ta denetim temiz
depoda bile 12 "kırık bölüm" bulgusu veriyor: `relative()` ters bölü döndürüyor, alan
karşılaştırması (`/` arıyor) bozuluyor ve alanlar arası atıflar da denetleniyor. Bu sürüm
yolları `/`'ya çeviren bir kopyayla da doğrulandı (temiz); betiğin düzeltmesi kullanıcı
onayını bekliyor. Model notu: bu sürüm Opus 5.5 + max ile yazıldı (MODEL VE EFORT tablosu
kit kuralı için Fable + max önerir) — tablonun "ilk gerçek karşılaştırma" satırı için veri
noktası.

### Ek — 2026-09-25 (3.24.1): JOIN türleri ve N+1'in bilinen kılıkları kartlara — kullanıcının getirdiği örnek ölçülerek

Kullanıcı bir yapay zekâ cevabında N+1'in okul örneğini (öğrenci + veli telefonu, LEFT ↔
INNER JOIN) buldu ve *"kitteki gerekli yerlere de"* dedi. Örnek gerçek PostgreSQL 18.4 ve
Prisma 7.10 üzerinde kuruldu: C.5'e **"JOIN türleri — hangi satırlar gelir"** (dört türün
aynı veride tablosu, CROSS ve self join, satır çoğalması + `EXISTS`, Prisma'nın her niyet
için ürettiği SQL); E.13'e **"N+1'i doğuran bilinen senaryolar"** (sekiz kılık, dördü
ölçüldü: ikinci seviye ilişki 32 → 3, satır başına sayım 6 → 1, döngüde yazma 6 → 1,
tembel yükleme Prisma'da derleme hatası TS2551). Cevaptaki yanlışlar ölçümle çürütüldü:
INNER JOIN boş kolonu değil **eşleşmeyen satırı** eler; INNER "daha hızlı" değildir (aynı
plan; sayımda LEFT, *join removal* ile iki kat hızlı); `include` "tek sorgu" değildir. Yaygın bir
inanç da ölçüldü: *"CROSS JOIN, `ON` unutulunca olur"* PostgreSQL'de doğru değil (`ON`'suz
`JOIN` sözdizimi hatası; kazara çarpım virgüllü yazımda ya da yanlış takma adlı `ON`'da). Yeni
ölçüm: `relationJoins` önizleme bayrağı açılınca bütün `include`'ların varsayılanı tek sorgu
olur — E.13 ve 04 → Performans buna göre; 04'ün N+1 maddesine kılıklar ve çareleri eklendi.
C.3'teki "`04-database.md`'ye bak" cümlesi yerine iki kod parçası (`prisma.config.ts` ve
bağdaştırıcı) kartın içine alındı. **Kullanıcı kararı (25 Eyl):** `calisma-dokumanlari/`
kullanıcının okuma dosyasıdır — kart kendi başına okunur, başka dosyaya göndermez; "aynı
bilgi iki yerde yazılmaz" kuralı bu dosyalar için şimdilik askıda (*"çoklayabilirsin,
kuralı boşver şimdilik"*). Yama sürümü: kural değişmedi, anlatım ve ölçüm eklendi.
