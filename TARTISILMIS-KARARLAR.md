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
| 3 | Enum yok; tanım tablosu (+ mantık taşıyan kümede `as const` liste + senkron testi) | `04-database.md` → *"SABİT DEĞER KÜMESİ"* |
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
