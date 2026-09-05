# bariskose-skills

> 🧭 **Bu depo üzerinde çalışacaksan önce [`docs/DEVIR.md`](docs/DEVIR.md) oku** —
> nerede kalındığı, kesinleşmiş kararlar ve yeniden tartışılmayacak konular orada.

Barış Köse'nin Claude Code kiti. Yeni bir projeye başlarken iskeleti kurmak
kullanıcının işi olmasın diye var.

Kullanıcı yalnızca **analiz dokümanını** verir ve sorulara cevap verir; kurulum,
mühendislik standartları, yol haritası ve canlıya çıkış ajanın işidir.

## Kurulum

Claude Code içinde:

```
/plugin marketplace add bariskose9/bariskose-skills
/plugin install proje-kiti@bariskose-skills
```

Kurulumdan sonra **Claude'u yeniden başlat**. Plugin `/plugin` ekranında
**Marketplaces → `bariskose-skills`** ve **Plugins → `proje-kiti@bariskose-skills`**
olarak görünür.

Bir kez kurulunca **bütün projelerinde** çalışır — her projeye ayrıca kurmak
gerekmez.

## Kullanım

### `/yeni-proje`

Boş bir klasör aç, orada Claude Code'u başlat ve şunu yaz:

```
/yeni-proje
```

Sırasıyla şunlar olur:

1. Eksik bağımlılıklar (aşağıda) **sorularak** kurulur — kurulu olana dokunulmaz
2. Proje tipi sorulur: web · mobil (Expo) · ikisi
3. Stack sorulur — varsayılan dışında bir şey istiyorsan söylersin
4. Mühendislik standartları (`docs/standards/00–18`) projeye yerleştirilir
5. Analiz dokümanın istenir, eksikler **tek tek** sorularak `PRD.md` çıkarılır
6. Yol haritası, ilk mimari karar (ADR) ve altyapı durumu dosyası yazılır
7. İskelet kurulur, GitHub deposu açılır, hosting + veritabanı + CI bağlanır
8. **Canlı adres ve çalışan `/api/health`** ile biter

**Sınır:** bu komut özellikleri yazmaz. Doğru kurulmuş bir proje ve net bir yol
haritası bırakır; sonrasında her roadmap adımı plan sunulup onay alınarak ilerler.

### `/kit-senkron`

Bir projede yeni bir mühendislik kuralı öğrendiğinde çalıştır. Projenin
`docs/standards/` klasörünü kittekiyle karşılaştırır, farkları Türkçe listeler ve
*"bunlardan hangileri kalıcı kural olsun?"* diye sorar. Seçtiklerini kite yazar.

Bu olmadan kit ilk günkü halinde donar: sen öğrendikçe projelerin iyileşir ama
**yeni projelerin geriden başlar**.

### `/video-analiz <youtube-url>`

Bir YouTube videosunu **transkriptinden** analiz eder ve kitte eksik olanı bulur.

```
/video-analiz https://www.youtube.com/watch?v=...
```

Videodaki iddiaları kural cümlesine çevirir, `docs/standards/` ile karşılaştırır
ve üç kutuya ayırır: **zaten var** · **eklenmeli** · **eklenmemeli (gerekçesiyle)**.
Ayrıca kitin **hiç dosyası olmayan bir alan** çıkıyor mu diye kapsam haritası
çıkarır. Rakamlar `npm` ile ölçülür; kite yazmadan önce sana sorulur.

**Sınır:** video izlenmez, ses duyulmaz — yalnızca altyazı okunur. Videonun
değeri ekrandaki kodda/diyagramda ise ve anlatılmıyorsa kaçırılır. Altyazısı
olmayan videoda analiz **yapılmaz**.

`yt-dlp` yoksa kendisi kurar; YouTube erişimi kırdığında **kendini güncelleyip**
tekrar dener.

### `/pdf-uret <dosya.md>`

Markdown belgesini **karanlık temalı PDF**'e çevirir — telefonda okumak için.

```
/pdf-uret docs/project/teknoloji-ve-plan.md
```

Yalnızca **Node** ve **Chrome** kullanır; üçüncü taraf PDF aracı gerektirmez.
Yazdıracaksan `--acik` ile aydınlık sürüm üretilir.

⛔ Üretilen PDF **doğrulanmadan teslim edilmez**: dosya oluştu mu · içerik tam
mı (sayfa sayısı ölçülür) · karanlık gerçekten uygulandı mı. Sessiz içerik
kırpılması yaşandığı için bu üç kontrol zorunlu.

## Bağımlılıklar

`/yeni-proje` şunlara dayanır ve eksikse **izin isteyerek** kurar:

| Plugin | Ne için |
|---|---|
| [`agent-skills`](https://github.com/addyosmani/agent-skills) | Görüşme, güvenlik denetimi, kod incelemesi, test disiplini |
| [`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Ekranları tarayıcıda fiilen tıklayarak doğrulama |

Zaten kurulu olanlara dokunulmaz.

## İçindekiler

```
skills/
├── yeni-proje/
│   ├── SKILL.md
│   └── dosyalar/              ← kitin kendisi
│       ├── CLAUDE.md          ← çalışma protokolü (§0 projede doldurulur)
│       ├── REPO-YAPISI.md
│       └── docs/standards/
│           ├── 00–17          ← mühendislik kuralları (projeden bağımsız)
│           └── sablonlar/     ← doldurulacak proje dokümanları
├── kit-senkron/
│   └── SKILL.md
├── video-analiz/
│   ├── SKILL.md
│   └── bin/yt-transkript.mjs  ← kendini onaran transkript alıcı
└── pdf-uret/
    ├── SKILL.md
    └── bin/md-pdf.mjs         ← markdown → karanlık PDF
```

`docs/standards/` **projeye göre değişmez.** Bir kural projeye özel hale
geliyorsa o kural yanlış yazılmıştır — kural düzeltilir, dallandırılmaz.

## Güncelleme

Güncelleme **çekmelidir**, kendiliğinden inmez:

```
/plugin marketplace update
/plugin update proje-kiti
```

Sonra Claude'u yeniden başlat.

## Dil

Kit ve tüm dokümanlar **Türkçe**. Kod, commit mesajı, değişken ve tablo adları
**İngilizce**.

## Katkı kuralı

⛔ Bu depo **herkese açıktır.** Kite hiçbir gizli bilgi yazılmaz — anahtar,
şifre, kurum içi adres, gerçek veri. Kural ve gerekçesi:
`skills/kit-senkron/SKILL.md` → *"Kit deposu herkese açıktır"*.

## Lisans

MIT
