# Devir — `bariskose-skills` kit geliştirme

> **Yeni bir oturum bu dosyayı ilk okur.** Nerede kaldığımızı, hangi kararların
> verildiğini ve hangilerinin **yeniden tartışılmayacağını** anlatır.

**Son güncelleme:** 2026-09-05 · **Kit sürümü:** 1.80.0

---

## Durum

Kit **canlı ve aktif geliştiriliyor**. Marketplace `bariskose-skills`, plugin
`proje-kiti`, dört skill: `/yeni-proje` · `/kit-senkron` · `/video-analiz` ·
`/pdf-uret`.

⛔ **`~/baris_projects/bariskose-skills-DEVIR.md` BAYATTIR.** *"Tek dosya
yazılmadı, GitHub deposu yok"* diyor; ikisi de yanlış. O dosyaya güvenme,
`git log`'a ve bu belgeye bak.

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

*Gerekçe:* dördü açıkken ~99 skill açıklaması her oturuma yükleniyor ve model
120 seçenek arasından 30 seçenek arasından seçtiğinden **daha kötü** seçiyor.
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

### `docs/` kapalı, seviye defteri açık

`.gitignore` `docs/`'u kapatır, `!docs/ogrendiklerim.md` ile defteri açar.

*Gerekçe:* `DONUTLER-2026-09-04.md` içinde kullanıcının iş yeriyle ilgili bir
alıntı var; depo **public** olduğu için orada durmamalı. Seviye defteri ise her
oturumda görünmeli.

⛔ **Belge üretildiğinde depoya push edilmez.** Kit push edilir; belgeler diskte
kalır. Yayınlanacaksa **önce sorulur.** (2026-09-04'te bu hata yapıldı; kişisel
notlar public depoya gitti, geri alındı ama git geçmişinde kaldı — kullanıcı
geçmişin temizlenmesine gerek olmadığını söyledi.)

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

⚠️ **Kurulu kopya ile depo ayrı şeylerdir.** Depoda 1.80.0 olması, çalışan
oturumun 1.80.0'ı yüklediği anlamına gelmez.

---

## Anlatım düzeni — kullanıcıya nasıl yazılır

`docs/ogrendiklerim.md` → **Seviye defteri** okunur; anlatım düzeyi oradan
ayarlanır, ajanın izleniminden değil.

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
- [ ] `11-agent-workflow.md` **805+ satır** ve kitin en büyük dosyası (ikinci
      büyüğün iki katı). Büyümeye devam ederse bölünmesi önerilecek
