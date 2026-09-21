---
name: kit-senkron
description: Bir projede öğrenilen mühendislik kurallarını kite geri yazar ve kitteki iyileştirmeleri projeye getirir. Projenin docs/standards/ klasörünü proje-kiti plugin'indeki kopyayla karşılaştırır, farkları Türkçe listeler ve hangilerinin kalıcı kural olacağını sorar. "Bu kuralı kite ekle", "standartları senkronla" veya "/kit-senkron" denince kullan.
---

# Kit Senkronu

Bir projede öğrenilen ders **o projenin** `docs/standards/` klasöründe kalır.
Kitteki kopya eski kalır ve **bir sonraki proje o dersi almadan başlar** — yani
aynı hataya yeniden düşülür.

Bu skill iki yönlü çalışır: projeden kite, kitten projeye.

**Dil:** Kullanıcıyla Türkçe konuş, farkları Türkçe anlat. Kullanıcı kod
okuyamıyor olabilir — "şu satır değişmiş" deme, **kuralın kendisinin ne
söylediğini** anlat.

## Adım 1 — İki tarafı bul

⛔ **KURULU PLUGIN ÖNBELLEĞİNE KARŞI KARŞILAŞTIRMA YAPMA.**
`~/.claude/plugins/cache/...` altındaki kopya, kullanıcı `/plugin update`
çalıştırana kadar **eski kalır**. 2026-08-11'de kullanıcının kurulu sürümü
1.2.0 iken kit 1.5.0'daydı: o önbelleğe karşı karşılaştırma yapılsaydı, kitte
ZATEN VAR OLAN kurallar "projede fazla" görünür ve kötü ihtimalle proje geriye
çekilirdi.

**Doğru kaynak — bu sırayla:**

```bash
# 1) Kitin KAYNAK deposu (varsa) — tek doğru referans
ls ~/baris_projects/bariskose-skills/skills/yeni-proje/dosyalar/docs/standards 2>/dev/null

# 2) Yoksa GitHub'dan taze klonla
git clone --depth 1 https://github.com/bariskose9/bariskose-skills /tmp/kit-ref

# 3) Projedeki kopya
ls docs/standards
```

**Kaynak depoyu kullanıyorsan önce bak, sonra sor:** `git -C <kaynak> fetch -q &&
git -C <kaynak> status -sb | head -1`. `[behind N]` görüyorsan **sor**: *"kaynak
klon N commit geride — çekeyim mi?"* Evet → `git -C <kaynak> pull --ff-only`.
Başka bir makinede yazılmış kurallar kaçırılmasın; `--ff-only` yerel değişikliği
ezmez, çakışma varsa durur ve söyler.

### ⛔ Aynı makinede başka bir oturum kiti düzenliyor olabilir — TEK ANLIK GÖRÜNTÜ

`status -sb` yalnızca **uzakla** (GitHub) farkı gösterir. Aynı makinede açık
başka bir Claude oturumu kit klonunu o sırada düzenliyorsa iki şey `[behind]`
olarak görünmez: klondaki **commit edilmemiş** dosyalar ve senkron sürerken
klona **atılan yeni commit**. Yaşanan: 2026-09-20'de bir proje `00-stack.md`'yi
3.15.1'den, kalan dosyaları 3.15.2'den aldı — senkron yarıdayken klonda commit
atılmıştı. Buna **karışık anlık görüntü** (mixed snapshot) denir: hangi kural
hangi sürümden, belli değil; projedeki sürüm damgası yalan söyler.

Kural — üç adım:

1. **Başlamadan kirli mi bak:** `git -C <kaynak> status --porcelain` boş
   değilse **dur ve sor**: *"klonda commit edilmemiş değişiklik var — başka bir
   oturum kiti düzenliyor olabilir; bitmesini mi bekleyelim?"* Kirli klondan
   kopyalama; yarım cümle kural olur.
2. **Anlık görüntüyü mühürle:** `git -C <kaynak> rev-parse --short HEAD` ve
   `plugin.json` sürümünü not et. Senkron boyunca **yalnızca bu** commit'ten
   çalışılır; rapora ve devir dosyasına "kit 3.x.y @ <hash>" diye bu yazılır.
3. **Kopyalamadan hemen önce yeniden ölç** (Adım 4): aynı `rev-parse` komutu.
   Hash değiştiyse klon ilerlemiştir → Adım 2'ye dön, karşılaştırmayı yeni
   anlık görüntüden baştan yap. "Yarısı eski yarısı yeni" kopya OLMAZ.

### Sürüm tutarlılığı kontrolü (atlanmaz)

Kurulu önbellek ile kaynak deponun sürümünü karşılaştır:

```bash
grep '"version"' ~/baris_projects/bariskose-skills/.claude-plugin/plugin.json
find ~/.claude/plugins/cache -name plugin.json -path '*proje-kiti*' -exec grep '"version"' {} \;
```

Kurulu sürüm **geride ise dur ve SOR:** *"kurulu X, kaynak Y — plugin'i
güncelleyeyim mi?"* Evet → `claude plugin marketplace update bariskose-skills`
ve `claude plugin update proje-kiti@bariskose-skills` komutlarını sen koştur;
yeniden başlatma gerektiğini söyle. Karşılaştırma zaten kaynak depoya karşı
yapılır; güncelleme `/yeni-proje` için gerekir. Sessizce devam etme.

Proje bir kit projesi değilse (`docs/standards/` yoksa) dur ve söyle.

**Projenin kopyası hangi sürümde:** `cat docs/standards/KIT-SURUM` →
`3.18.1 @ 8cd038d` (kit sürümü @ mühür). Dosya yoksa 3.21.0 öncesi kurulumdur;
bu senkronun sonunda yazılır (Adım 5). Açılış kancası her oturumda bu damgayı
güncel kitle karşılaştırır — "proje kopyası geride" uyarısı buradan gelir.

## Adım 2 — Karşılaştır

### ⛔ ÖNCE SINIRI ÇİZ — neyin karşılaştırılacağı, neyin ASLA karşılaştırılmayacağı

⚠️ **Bu sınır yanlış çizilirse bir projenin içeriği kite sızar** ve sonraki
proje başkasının PRD'siyle, başkasının yol haritasıyla başlar.

⭐ **Üç ayrı bölge var ve sınır klasör adından okunur** — istisna yok:

| Klasör | Kime ait | Kite döner mi |
|---|---|:--:|
| `docs/standards/**` | **Kite** — her projede aynı kural | ✅ Evet |
| `docs/kullanici/**` | **Kullanıcıya** — neyi bildiği | ✅ Evet, **birleştirerek** |
| `TARTISILMIS-KARARLAR.md` (kökte) | **Kite** — kesinleşmiş kararlar | ✅ Evet |
| `docs/project/**` | **Bu projeye** — PRD, roadmap, ADR, veri modeli, altyapı | ⛔ **Asla** |
| `docs/standards/KIT-SURUM` | **Damga** — karşılaştırılmaz, Adım 5'te yazılır | ⛔ Karşılaştırma dışı |

⛔ Ayrıca hiçbir koşulda dönmeyenler: `CLAUDE.md` §0 bloğu (proje adı, stack,
deploy) · `00-stack.md` içindeki **Stack tablosu** (fiilen kurulu sürümler) ·
kod, `.env`, `package.json`.

⭐ **`docs/kullanici/` neden ayrı bir klasör:** içindekiler projenin durumunu
değil **kullanıcının neyi bildiğini** tutar. Kullanıcı projeler arasında
değişmez, proje değişir. Aynı klasörde dursalardı sınır bir *"istisna"* olurdu
ve istisnalar unutulur — klasör adı ise unutulmaz.

⛔ **Defterlerde "hangisi doğru" diye SORULMAZ.** Birleşim alınır:

| Durum | Ne olur |
|---|---|
| Satır projede var, kitte yok | ✅ Kite **eklenir** |
| Satır kitte var, projede yok | ✅ Projeye **eklenir** |
| İkisinde de var | Tekrar edilmez |
| Seviye çakışıyor | ⭐ **Yüksek olan** kalır |
| Satır bir tarafta silinmiş | ⛔ **Silinmez** — yalnızca kullanıcı *"bunu sil"* derse çıkar |

---

Sınır çizildikten sonra: `docs/standards/` altındaki tüm dosyaları karşılaştır.
`00-stack.md` dahil — ama **bölüm bazında.**

### `00-stack.md` — istisna DOSYA değil BÖLÜM seviyesindedir

⚠️ **Eski kural "bu dosya hiç senkronlanmaz" idi ve ders kaybettiriyordu.**
2026-08-11'de ölçüldü: dosyanın yedi bölümünden yalnızca **biri** gerçekten
projeye özeldi; buna rağmen tamamı senkron dışıydı, yani genel bölümlere
yazılan bir ders karşı tarafa hiç geçmiyordu.

| Kural | Bölüm |
|---|---|
| ⛔ **Asla senkronlanmaz** | `## Stack` tablosu — fiilen kurulu sürümler ve "henüz kurulu değil" gibi projeye ait durum. Kite taşınırsa sonraki proje yanlış bilgiyle başlar |
| ✅ **Senkronlanır** | **Diğer tüm bölümler**, `## Sürüm sütunu nasıl doldurulur` dahil — o talimat tabloyu kim bakıyorsa ona lazımdır ve tablo projede de var |

### Karışık bölümler — SENKRON SINIRI

Bazı bölümler kendi içinde karışıktır: genel kurallar + projeye özel maddeler
(örn. `## Kullanılmayacaklar`). Bunlarda sınır bir işaretleyici yorumdur:

```
<!-- ⛔ SENKRON SINIRI -->
```

**Senkron bu satırda durur:** üstü ortaktır ve eşitlenir, altı projeye aittir
ve dokunulmaz.

⛔ **Sınır satırı silinmişse ONAR, yok sayma.** Silindiğinde o bölümün tamamı
senkron dışı kalır — kite yazılan yeni bir genel kural o projeye hiç ulaşmaz.
2026-08-11'de tam olarak bu olmuştu: proje sınırı silip yerine kendi maddesini
yazmıştı.

### Projeye özel anlatı bölümleri

Bir bölüm kitteki **genel** kuralın "bu projede ne yapıldı" hâline dönüşmüşse
(örn. kitte `## Kimlik doğrulama — bilinen tuzak`, projede
`## Auth.js v5 uyarısı — adım 4b-2'de şu karar verildi`) bu **doğru bir
ayrışmadır**, hata değil. Genel kural kitte kalır, uygulanmış hâli projede.
Kullanıcıya sor: uygulanmış anlatının içinde **genelleştirilebilir** yeni bir
bulgu var mı? Varsa yalnızca o bulgu kite taşınır.

### ⭐ Seviye defteri de senkronlanır — ama BİRLEŞTİRİLEREK

`calisilacak-konular.md` kitle birlikte gelir ve her projede aynıdır. Standart
dosyalarından **farklı** biçimde senkronlanır:

| | Standart dosyaları | `calisilacak-konular.md` |
|---|---|---|
| Yön | İki yönlü, fark fark sorulur | İki yönlü, ama **birleşim** |
| Çakışma | Kullanıcıya sorulur | ⛔ Sorulmaz — **ikisinde olan her satır kalır** |
| Silme | Karar gerektirir | ⛔ **Hiçbir satır silinmez** |
| Seviye çakışırsa | — | **Yüksek olan** kalır |

⛔ **Bu dosyada "hangisi doğru" diye sorulmaz.** İki taraftaki satırların
birleşimi alınır; aynı satır ikinci kez eklenmez. Bir madde yalnızca kullanıcı
*"bunu sil"* dediğinde çıkar.

⚠️ **Depo herkese açık:** deftere şifre, anahtar, kurum içi bilgi veya müşteri
adı yazılmaz. Bilgi yazılır, veri yazılmaz (aşağıdaki *"Ayırt edici test"*).

## Adım 3 — Farkları sınıflandır ve sor

Her farkı üç kutudan birine koy ve kullanıcıya **tek tek** sor:

| Kutu | Ne demek | Ne yapılır |
|---|---|---|
| **Kalıcı kural** | Her projede geçerli bir mühendislik dersi | Kite yazılır |
| **Projeye özel** | Yalnızca bu projenin işine ait | Projede kalır, kite gitmez |
| **Kitten gelen yenilik** | Kit ilerlemiş, proje geride | Projeye getirilir |

Her fark için şunu sor: *"bu kural başka bir projede de doğru olur mu?"*
Cevap "hayır" veya "duruma göre" ise **kite gitmez.**

⛔ Bir kural projeye özel hale geliyorsa o kural **yanlış yazılmıştır.**
Kuralı düzelt, projeye göre dallandırma.

## Adım 4 — Uygula

**Kite yazılacaklar için:**

1. Kit deposunu bul veya klonla: `github.com/bariskose9/bariskose-skills`
2. `skills/yeni-proje/dosyalar/docs/standards/` altındaki ilgili dosyayı güncelle
   ⭐ **Defterler de buraya girer** (`sablonlar/calisilacak-konular.md` ve
   `sablonlar/ogrendigim-konular.md`) — ama **birleştirilerek**: projedeki
   satırlardan kitte olmayanlar eklenir, var olan tekrar edilmez, hiçbir satır
   silinmez, seviye çakışırsa yüksek olan kalır
3. `plugin.json` içindeki `version` alanını artır (yama: 1.0.**1**, yeni kural: 1.**1**.0)
4. `claude plugin validate .` çalıştır
5. Değişikliği **anlat ve onay al**, sonra commit + push
6. Kullanıcıya hatırlat: güncelleme **çekmelidir**, kendiliğinden inmez —
   kullanan herkes şunu çalıştırmalı:
   ```
   /plugin marketplace update
   /plugin update proje-kiti
   ```
   ve Claude'u **yeniden başlatmalı**.

**Projeye getirilecekler için:** önce anlık görüntüyü yeniden ölç (Adım 1 →
*"TEK ANLIK GÖRÜNTÜ"*, 3. madde), sonra dosyayı güncelle, değişikliği Türkçe
özetle, projenin kendi commit protokolüne uy (`00-cekirdek.md` → *"Git ve commit"* —
onaysız commit yok).

## Adım 5 — Kayda geç

- ⭐ **Proje tarafında damgayı yaz — en son, her kopya bittikten sonra:**
  `printf '%s @ %s\n' <kit sürümü> <mühür> > docs/standards/KIT-SURUM`
  (mühür = Adım 1'deki `rev-parse` çıktısı, ör. `3.21.0 @ 1a2b3c4`). Bu damga
  olmadan açılış kancası projeyi sonsuza kadar "geride" ya da "bilinmiyor" sayar.
- Kit tarafında: `CHANGELOG.md` varsa hangi kuralın neden değiştiğini yaz
- Proje tarafında: kural değişikliği bir mimari kararsa `docs/project/decisions/`
  altına ADR yaz

## ⛔ KİT DEPOSU HERKESE AÇIKTIR — gizli hiçbir şey yazılmaz

`bariskose9/bariskose-skills` deposu **public**'tir ve öyle kalması bilinçli bir
karardır: kit hiçbir makinede kimlik doğrulaması gerektirmeden kurulabilsin diye.
Bunun bedeli şudur — **depoya yazılan her satırı herkes okuyabilir.**

⛔ Kite asla yazılmaz:

- API anahtarı, jeton, şifre, bağlantı dizesi (bir örnek veya "sahte" değer olsa bile)
- Kurum içi bilgi: sunucu adresi, iç ağ adı, kurum yapısı, personel bilgisi
- Müşteri veya proje adı üzerinden çıkarılabilecek ticari bilgi
- Gerçek veri örneği — kişisel veri içerebilir

**Bunlar nereye yazılır:** projenin kendi deposuna. Değerler `.env` dosyasına
(commit edilmez), yapılandırma bilgisi `docs/project/altyapi-durumu.md` içine,
gizli olmayan tanımlar `.env.example` içine.

### Ayırt edici test

Bir bilgiyi kite yazmadan önce sor: **"Bu satırı hiç tanımadığım biri okusa,
kullanıcının kurumu veya sistemi hakkında bir şey öğrenir mi?"**

Öğreniyorsa o bilgi **kural** değil **veri**dir; kite değil projeye gider.

⚠️ Kit yalnızca **mühendislik kuralı** taşır: "şu durumda şu yapılır, çünkü."
Kural evrenseldir ve okunması zarar vermez. Veri özeldir.

### Depoyu gizli yapmak neden çözüm değil

Depo private yapılırsa kit **her makinede kimlik doğrulaması** ister; kurulum
adımı artar ve kurumsal bir makinede kişisel hesap bağlama zorunluluğu doğar.
Asıl mesele erişim değil, **kite en baştan gizli bilgi yazılmaması**dır — private
bir depo da yanlışlıkla paylaşılabilir, çatallanabilir veya sonradan
açılabilir.

## Sınırlar

- **Sessizce senkronlama yok.** Her fark kullanıcıya sorulur; "küçük değişiklik"
  diye atlanmaz.
- Gizli anahtar, ortam değişkeni değeri veya kişisel veri **hiçbir yönde**
  taşınmaz. Kit herkese açık bir depodur.
- `docs/project/` **asla** senkronlanmaz — o klasör tamamen projeye özeldir.
