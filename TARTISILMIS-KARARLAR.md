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

## Sırada ne var

- [ ] Kullanıcı `KIT-REHBER.md` ve `KIT-NE-YAPIYOR.md`'yi okuyup dönüş yapacak
- [ ] Özellikle **`06-testing.md` → beş gözle doğrulama** listesi kalibre
      edilecek: fazla mı, eksik mi — ancak kullanan söyleyebilir
- [ ] İki dosya bölünme eşiğine yaklaşıyor: `CALISMA-KILAVUZU.md` (1161 satır)
      ve `11-agent-workflow.md` (970). Büyümeye devam ederlerse bölünmeleri
      önerilecek. Ölçüm: `wc -l`

### ⏳ Konuşuldu, karar verilmedi — yeni oturum bunları açabilir

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

- [ ] **`calisma-dokumanlari/` depoda açık.** On dosya public; altısında kurum
      adı ve ödev metni geçiyor. Kullanıcıya bildirildi, *"şimdilik kalsın"*
      dedi. Kapatılmak istenirse `.gitignore` + takipten çıkarma yeterli;
      **git geçmişini temizlemek ayrı bir iştir.**
