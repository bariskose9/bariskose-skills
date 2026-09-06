# İçindekiler — bu kitte ne var, hangisi kimin işi

> **Bu belgeyi sen okuyorsun, ajan değil.** Ajanın okuduğu dosyalar
> `CLAUDE.md` ve `docs/standards/`; burası senin haritan. Bir şeyi nerede
> arayacağını, hangi adımda ne yapacağını ve ne zaman devreye gireceğini
> anlatır.
>
> ⛔ **Bayat kalmaz:** `denetim.mjs` her commit öncesi bu listeyi kontrol eder.
> Kite yeni bir dosya eklenip buraya yazılmazsa **commit durur.**

---

## Kit tek cümlede

Boş bir klasörde `/yeni-proje` yazarsın; soruları cevaplarsın; kurulmuş, test
edilmiş, yol haritası çıkarılmış ve canlıya çıkmış bir proje elde edersin.
Vaat *"tek promptla uygulama"* değil — **"tek promptla doğru kurulmuş proje ve
net yol haritası"**.

## Dört komut

| Komut | Ne yapar | Ne zaman kullanırsın |
|---|---|---|
| `/yeni-proje` | Sıfırdan proje kurar, sekiz adım | Yeni bir işe başlarken |
| `/kit-senkron` | Projede öğrenilen kuralı kite geri yazar | *"Bunu her projede yapmalıyız"* dediğinde |
| `/video-analiz` | YouTube videosundan kitte eksik pratiği çıkarır | İyi bir teknik video izlediğinde |
| `/pdf-uret` | Markdown'ı karanlık temalı PDF yapar | Telefonda okumak istediğinde |

---

## Hangi dosyayı kim okur

Kitin tamamı bu ayrım üzerine kurulu. Karıştırırsan ya ajana gereksiz bağlam
yüklersin ya da senin bilmen gereken bir şeyi hiç görmezsin.

| Dosya | Sen | Ajan | Ne işe yarar |
|---|:--:|:--:|---|
| `ICINDEKILER.md` (bu dosya) | ✅ | ⛔ | Harita |
| `README.md` | ✅ | ⛔ | Kurulum ve tanıtım |
| `KURULUM.md` | ✅ | ⚠️ | Sesli bildirim kurulumu, gerekçeleriyle |
| `CLAUDE.md` (kökte) | ⚠️ | ✅ | Bu **depoda** çalışan ajanın kuralları |
| `docs/DEVIR.md` | ✅ | ✅ | Kesinleşmiş kararlar — yeniden tartışılmaz |
| `docs/ogrendiklerim.md` | ✅ | ✅ | Senin seviye defterin; anlatım düzeyi buradan |
| `calisma-dokumanlari/` | ✅ | ⛔ | Senin çalışma notların — ajan okumaz, bağlamı şişirir |

---

## Depo haritası

### `skills/` — kitin kendisi

| Yol | Ne |
|---|---|
| `yeni-proje/SKILL.md` | **Kurulum akışı** — sekiz adım. Ajan bunu izler |
| `yeni-proje/dosyalar/` | Projeye kopyalanan her şey ↓ |
| `kit-senkron/SKILL.md` | İki yönlü kural senkronu |
| `kit-senkron/bin/denetim.mjs` | ⛔ **Commit öncesi zorunlu kontrol** — kırık atıf, bayat PDF, eksik içindekiler |
| `video-analiz/SKILL.md` | Video → kural dönüşümü |
| `video-analiz/bin/yt-transkript.mjs` | Transkript alıcı |
| `pdf-uret/SKILL.md` | PDF üretimi |
| `pdf-uret/bin/md-pdf.mjs` | Node + Chrome ile PDF |

### `skills/yeni-proje/dosyalar/` — projeye kopyalananlar

| Dosya | Kim okur | Ne |
|---|:--:|---|
| `CLAUDE.md` | Ajan | **Çalışma protokolü ve sekiz zorunlu kapı.** §0'ı kurulum doldurur |
| `CALISMA-KILAVUZU.md` | **Sen** | Projeyi nasıl yürüteceğin — terimler, oturum ritmi, dosya açıklamaları |
| `REPO-YAPISI.md` | İkisi | Hangi iş hangi klasörde — kurulumdan sonra doldurulur |
| `.vscode/extensions.json` | — | VS Code eklenti önerileri |
| `.claude/settings.json` | — | Salt okunur komutlar için hazır izin listesi |

### `docs/standards/` — 19 kural dosyası, ajanın bağlayıcı kaynağı

| # | Dosya | Neyi karara bağlar |
|---|---|---|
| 00 | `00-stack.md` | Hangi teknoloji, hangi sürüm, **karar nereye yazılır**, simüle servisler |
| 01 | `01-architecture.md` | Katmanlar, bir isteğin tam yolu, klasör yapısı, isimlendirme |
| 02 | `02-coding-standards.md` | TypeScript, hata yönetimi, **yorum kuralları** (kod İngilizce, yorum Türkçe) |
| 03 | `03-api-guidelines.md` | REST sözleşmesi, sürümleme, sayfalama, OpenAPI |
| 04 | `04-database.md` | Şema, migration, index, soft delete, arama |
| 05 | `05-auth-security.md` | Oturum, jeton ömürleri, OWASP, sır yönetimi, ödeme |
| 06 | `06-testing.md` | Test piramidi, **beş gözle doğrulama**, kararsız testler |
| 07 | `07-ui-design-system.md` | Tasarım yönü, token'lar, erişilebilirlik, performans bütçesi |
| 08 | `08-git-workflow.md` | Dal, commit, PR, git kimliği |
| 09 | `09-ci-cd-deploy.md` | CI hattı, kapılar, tedarik zinciri güvenliği, Renovate |
| 10 | `10-definition-of-done.md` | ⛔ **"Bitti" ne demek** — kapı listesi |
| 11 | `11-agent-workflow.md` | Ajanın davranışı: kalite çıtası, öğretme, çelişki taraması |
| 12 | `12-operations-and-scaling.md` | Log, izleme, bölge eşleşmesi, ani yük, SLO |
| 13 | `13-environments.md` | local / preview / production, port, dosya adı tuzağı |
| 14 | `14-privacy-and-compliance.md` | KVKK, hesap silme, rıza, denetim kaydı |
| 15 | `15-oturum-devri.md` | **Oturum kapanırken ne yazılır** — hafızasızlığın panzehiri |
| 16 | `16-yeni-proje-kurulumu.md` | Kurulum listesi, plan sıralaması, depo hijyeni |
| 17 | `17-mobile.md` | Expo, jeton saklama, mağaza süreci |
| 18 | `18-seo.md` | Render stratejisi, URL, site haritası, indekslenme |

### `docs/standards/sablonlar/` — projede doldurulacak belgeler

| Şablon | Zorunlu mu | Ne |
|---|---|---|
| `OKUBENI.md` | — | Klasörün kendi indeksi |
| `PRD.md` | ✅ | Ne yapılacak, ne yapılmayacak, açık sorular |
| `roadmap.md` | ✅ | Adımlar, bağımlılık sırasıyla + teknik borç |
| `altyapi-durumu.md` | ✅ | **Dış dünyanın durumu** — hangi hesap açık, hangi anahtar nerede |
| `CHANGELOG.md` | ✅ | Ne yayınlandı |
| `sonraki-adim-prompt.md` | ✅ | Yeni oturuma verilecek tek metin |
| `teknoloji-ve-plan.md` | ✅ | **Projenin öğretici belgesi** — neyi neden kullanıyoruz |
| `ogrendiklerim.md` | ✅ | Seviye defterin + *"Artık biliyorum"* listesi |
| `decisions/ADR-000-sablon.md` | ✅ | Her mimari karar bunu çoğaltır |
| `vscode-eklentileri.md` | ✅ | Hangi eklenti neden önerildi |
| `data-model.md` | Veritabanı varsa | Tablolar, ilişkiler, saklama süreleri |
| `integrations.md` | Dış servis varsa | Kimle konuşuyoruz, nasıl |
| `fake-data-guide.md` | Sahte veri varsa | Gerçekçi ama sahte veri nasıl üretilir |
| `kurumdan-ogrenilecekler.md` | ⛔ Yalnızca işyeri projesinde | Kuruma sorulacak açık kalanlar |

---

## `/yeni-proje` — sekiz adım ve senin işin

⭐ **Sen yalnızca sağ sütundakileri yaparsın.** Gerisi ajanın.

| Adım | Ajan ne yapar | ⭐ Senin işin |
|---|---|---|
| **0** | Bağımlılıkları kurar, platformu tespit eder, sesli bildirim kurar | İzin ver |
| **0c** | Klasör boş değilse üç kutuya ayırır | Var olan proje varsa karar ver |
| **1** | Elde ne var envanteri, dayatılan stack var mı sorar, stack'i ölçer | Analiz dokümanını ver, soruları cevapla |
| **2** | Kural dosyalarını ve şablonları yerleştirir | — |
| **3** | **PRD görüşmesi** — tek tek soru sorar | ⛔ **En kritik adım.** İş kurallarını yalnızca sen bilirsin |
| **4** | Yol haritası + ilk ADR'ler, sonra beş gözle denetler | Yol haritasını onayla |
| **5** | İskeleti kurar, çalışan ekranı **gösterir** | Ekrana bak — hesap açmadan önce |
| **6a** | Kendi projen: canlıya çıkarır | Hesap aç, ödeme yap, DNS ayarla |
| **6b** | İşyeri projesi: teslim paketi hazırlar | DevOps'a ver |
| **7** | Son kontrol listesi | Eksikleri söyle |

⚠️ **Adım 3 atlanmaz.** Analiz dokümanı her zaman eksiktir; ajan eksiği
tahminle doldurursa yanlış varsayım veri modeline, API'ye ve ekrana yayılır.

---

## Kurulumdan sonra — her özellikte dönen çevrim

Kurulum biter, `SKILL.md` devreden çıkar; artık projedeki `CLAUDE.md` ve
`docs/standards/` geçerlidir. Her modül veya özellik şu çevrimden geçer:

```
1. PLAN      → ajan planı sunar                        ⭐ SEN ONAYLARSIN
2. KOD       → ince dilim, her dilim ayrı doğrulanır
3. TEST      → önce başarısız test, sonra düzeltme
4. DOĞRULA   → üç aşama: otomatik test · güvenlik · tarayıcıda TIKLAYARAK
5. BEŞ GÖZ   → backend · veri · frontend · tasarım · güvenlik
6. ETKİ      → "başka nereyi bozdum" yazılı cevaplanır
7. RAPOR     → commit önerisi sunulur                  ⭐ SEN ONAYLARSIN
8. DEVİR     → roadmap işaretlenir, sonraki adım yazılır
```

⭐ **İki yerde durur ve seni bekler:** plan sunulduğunda ve commit önerisi
geldiğinde. Onayın bilinçli olsun diye ajan her seferinde *"şunu yaptım,
sebebi şu, yanlış olsaydı şu bozulurdu"* der.

⚠️ **4. adımdaki "tarayıcıda tıklayarak" atlanamaz.** Kod okuyup *"çalışması
lazım"* demek kanıt değildir. Ayrıntı: `06-testing.md`.

**Senin gözünle bakacağın tek katman 5. adımdaki "tasarım/UX"tir** —
*"teknik olarak çalışıyor ama kullanıcı olarak saçma"* diyebileceğin yer.

---

## Bir karar alındığında nereye yazılır

Kısa cevap: **gerekçe ADR'ye, anlatım `teknoloji-ve-plan.md`'ye.** Tam
yönlendirme tablosu `00-stack.md` → *"KARAR NEREYE YAZILIR"* içinde.

| Dosya | Ne tutar |
|---|---|
| `decisions/ADR-*.md` | Kararın **bağlayıcı kaydı**: bağlam, karar, elenen alternatifler, bedel |
| `teknoloji-ve-plan.md` | Kararın **anlatımı** — gerekçeyi kopyalamaz, ADR'ye işaret eder |
| `altyapi-durumu.md` | Dış dünya: hangi hesap açık, hangi anahtar hangi ortamda |
| `roadmap.md` | Nerede kalındı, sırada ne var, hangi borç kabul edildi |
| `ogrendiklerim.md` | Senin öğrendiklerin — ajan anlatım düzeyini buradan ayarlar |

⚠️ Bunların hepsi **projenin deposunda** durur, kitte değil. Projeyi devralan
biri depoyu klonladığında kararları da almış olur.

---

## Kiti güncelleme

```
/plugin marketplace update
/plugin update proje-kiti
```

sonra Claude'u yeniden başlat.

⛔ **Pencere yenilemek yetmez.** Yenileme diskte zaten olanı okur; güncelleme
GitHub'dan **indirir**. İndirmeden yenilersen eski sürümle çalışırsın.

⚠️ Kurulu sürüm yalnızca `/yeni-proje` veya `/kit-senkron` çalıştırmadan
**önce** önemlidir. Mevcut bir projede çalışırken eski olması hiçbir şeyi
bozmaz — o proje kendi `docs/standards/` klasörünü okur.

---

## Kite kural eklerken

1. Değişikliği yaz
2. ⛔ `node skills/kit-senkron/bin/denetim.mjs .` — **çıktıyı oku**, kırpma
3. Yeni dosya eklediysen **bu belgeye satır ekle** (denetim zaten zorlar)
4. `.claude-plugin/plugin.json` sürümünü artır — yama `1.0.1`, yeni kural `1.1.0`
5. Commit + push

⭐ Bir kuralın **mekanizması yoksa niyettir.** Yazdıktan sonra sor: *"bunu
ihlal edildiğinde ne yakalar?"* Cevap yoksa kural henüz yürürlükte değildir.
