---
name: yeni-proje
description: Yeni bir projeyi sıfırdan kurar — mühendislik standartlarını yerleştirir, analiz dokümanından soru sorarak PRD çıkarır, yol haritası ve ilk mimari kararı yazar, iskeleti kurar ve projeyi canlıya çıkarır. Boş bir klasörde "/yeni-proje" denince veya kullanıcı yeni bir projeye başlamak istediğini söylediğinde kullan. Türkçe çalışır.
---

# Yeni Proje Kurulumu

Kullanıcı yeni bir projeye başlıyor. Amacın: kurulumun **kullanıcının işi
olmaktan çıkması**. Kullanıcı yalnızca analiz dokümanını verir ve sorulara
cevap verir; geri kalanını sen yaparsın.

**Dil:** Kullanıcıyla **Türkçe** konuş. Kod, commit mesajı, değişken ve tablo
adları **İngilizce**.

**Kullanıcı kodu okuyup anlayamıyor olabilir.** Her adımdan sonra ne yaptığını
kod göstermeden, Türkçe, en fazla 5 maddede anlat. Sadece "ne" değil **"neden"**
de söyle. Emin olmadığın yerde "emin değilim" de — uydurma.

## Kit dosyaları nerede

Bu skill'in yanındaki `dosyalar/` klasöründe. Yerini şöyle bul:

```bash
ls "$CLAUDE_PLUGIN_ROOT/skills/yeni-proje/dosyalar" 2>/dev/null \
  || find ~/.claude/plugins -type d -path '*yeni-proje/dosyalar' 2>/dev/null | head -1
```

İçinde: `CLAUDE.md` · `REPO-YAPISI.md` · `docs/standards/00–17` + `sablonlar/`.

---

## Adım 0 — Bağımlılıklar

Bu kit iki dış parçaya dayanır:

| Parça | Ne için |
|---|---|
| `agent-skills@addy-agent-skills` | `interview-me`, `security-and-hardening`, `code-review-and-quality`, `test-driven-development` |
| `chrome-devtools-mcp@chrome-devtools-plugins` | Ekranları tarayıcıda **fiilen tıklayarak** doğrulama |

1. Kurulu olanları gör: `claude plugin list`
2. **Yalnızca eksik olanı** kullanıcıya bildir ve **izin iste**. Zaten kurulu
   olana dokunma — kullanıcının makinesinde başka sürüm/ayar olabilir.
3. İzin verilirse kur:
   ```bash
   claude plugin marketplace add addyosmani/agent-skills
   claude plugin install agent-skills@addy-agent-skills
   claude plugin marketplace add ChromeDevTools/chrome-devtools-mcp
   claude plugin install chrome-devtools-mcp@chrome-devtools-plugins
   ```
4. Kurulum sonrası bunların **aynı oturumda görünmeyebileceğini** söyle;
   görünmüyorsa kullanıcıdan Claude'u yeniden başlatmasını iste ve
   `/yeni-proje` ile devam edileceğini belirt.
5. Kullanıcı istemezse **kurma**. O parçaya bağlı adımlarda ne kaybedildiğini
   (örn. tarayıcı doğrulaması yapılamaz) açıkça söyle ve devam et.

**Sormadan kurma.** Kullanıcının makinesine izinsiz paket eklemek bu kitin
kendi kuralının ihlalidir.

## Adım 1 — Proje tipi ve stack

Tek tek sor, varsayım yapma:

1. **Proje tipi:** web · mobil (Expo) · ikisi (ortak API)
2. **Stack:** varsayılan aşağıdaki; kullanıcı farklı bir şey söylerse (başka
   sunucu, başka veritabanı, başka hosting) **onu kullan**, tartışma
3. **Proje adı** ve **hedef kullanıcı kitlesi** (bir cümle)

**Varsayılan stack:** Next.js App Router + TypeScript (strict) + Tailwind +
shadcn/ui + Prisma + PostgreSQL + Zod · Vercel + Neon + GitHub Actions ·
mobil varsa Expo, aynı REST API.

Mobil seçilirse `05-auth-security.md` ve `17-mobile.md` birlikte okunur:
oturum kararı **baştan** hem çerezi hem jetonu kapsayacak şekilde alınır.
Sonradan eklemek kimlik doğrulamayı baştan yazdırır.

## Adım 2 — Kit dosyalarını yerleştir

1. `dosyalar/` içeriğini projeye kopyala: `CLAUDE.md`, `REPO-YAPISI.md`,
   `docs/standards/**`
2. `CLAUDE.md` §0 bloğunu Adım 1'deki cevaplarla **doldur**
3. `docs/standards/sablonlar/` içindeki şablonları `docs/project/` altına aç:
   `PRD.md` · `roadmap.md` · `altyapi-durumu.md` · `CHANGELOG.md` ·
   `sonraki-adim-prompt.md` · `decisions/ADR-000-sablon.md` ·
   (veritabanı varsa) `data-model.md` · (dış servis varsa) `integrations.md` ·
   (sahte veri gerekiyorsa) `fake-data-guide.md`
4. **`docs/standards/` içini değiştirme.** Tek istisna `00-stack.md` sürüm
   tablosu — o da Adım 5'te fiilen kurulanla eşitlenir.

## Adım 3 — PRD (en kritik adım)

Kullanıcının analiz dokümanını iste. **Her zaman eksiktir.**

- `interview-me` skill'ini kullan. **Tek tek** sor, birden fazla soruyu aynı
  anda yığma. Cevap belirsizse netleşene kadar üzerine git.
- En az şunlar netleşmeden geçme: kim kullanacak · hangi problemi çözüyor ·
  **kapsam dışı ne** · roller ve her rolün yapamadığı · her modülün iş kuralları
  (sayı vererek) · hata durumunda ne olacağı
- Cevapları `docs/project/PRD.md` şablonuna yaz.
- **"§9 Açık sorular" bölümü boşalmadan kod yazma.** Cevabını bilmediğin şeyi
  kendin doldurma — yanlış varsayım en pahalı hatadır.

## Adım 4 — Yol haritası ve ilk kararlar

1. `roadmap.md`: adımlar **bağımlılık sırasına** göre. İlk üç adım hemen her
   projede aynıdır — repo+iskelet, hosting+veritabanı+CI+sağlık ucu, veri
   modeli+tohumlama. Mobil varsa **son adım** olarak yer alır.
2. `decisions/ADR-001-*.md`: genellikle "neden bu stack / neden tek repo".
   `ADR-000-sablon.md` biçimini kullan.
3. `altyapi-durumu.md`: **boş bile olsa şimdi aç.** İlk hesap açıldığı anda
   yazılmaya başlar; sonradan hatırlamak işe yaramaz.
4. `sonraki-adim-prompt.md`: şu notla oluştur —
   *"Henüz doldurulmadı. İlk roadmap adımı bitince `15-oturum-devri.md`
   protokolüne göre baştan yazılacak."*

## Adım 5 — İskeleti kur

1. Framework'ü kur, TypeScript strict, lint + format yapılandır
2. `git init`, `.gitignore`, `.env.example` (⛔ `.env` **asla** commit edilmez)
3. `00-stack.md` sürüm tablosunu **fiilen kurulanla eşitle**. En yenisi
   kullanılmıyorsa **nedenini yaz**
4. `REPO-YAPISI.md`'yi gerçek klasör yapısına göre doldur
5. İlk commit — `08-git-workflow.md` biçimiyle

## Adım 6 — Canlıya çıkar

1. GitHub deposu aç (`gh`), dalı push et
2. Hosting + veritabanı bağla. **Hesap gerektiren her adımda kullanıcıya ne
   yapacağını adım adım söyle ve bekle** — onun yerine hesap açamazsın
3. CI kur: `lint → typecheck → test → build`
4. `GET /api/health` (uygulama + veritabanı) ekle ve canlıda çalıştığını göster
5. **Yapılan her dış işlemi anında `altyapi-durumu.md`'ye yaz** — hangi hesap,
   panelde ne seçildi, hangi değişken hangi ortamda. ⛔ Anahtar **değeri** yazılmaz
6. Duman testi: anasayfa açılıyor mu, `/api/health` yeşil mi

## Adım 7 — Son kontrol

Bitirmeden önce kendine sor ve **eksik varsa kullanıcıya sor**:

- [ ] `CLAUDE.md` §0 dolu mu
- [ ] PRD'de açık soru kaldı mı
- [ ] Her şablon dolduruldu mu (boş şablon bırakmak hiç açmamaktan kötüdür)
- [ ] `altyapi-durumu.md` bu oturumda yapılan **her** dış işlemi içeriyor mu
- [ ] `00-stack.md` sürümleri `package.json` ile birebir aynı mı
- [ ] Canlı adres ve `/api/health` çalışıyor mu
- [ ] `.env` commit edilmemiş, `.env.example` commit edilmiş mi
- [ ] `sonraki-adim-prompt.md` bir sonraki adımı tarif ediyor mu

Sonra kullanıcıya **Türkçe, en fazla 5 maddede** özet ver: ne kuruldu, canlı
adres, sıradaki roadmap adımı, senden beklenen (varsa hesap/ayar).

---

## Sınırlar — kullanıcıya açıkça söyle

- **Bu skill özellikleri yazmaz.** Kurulumu bitirir ve yol haritasını çıkarır.
  Sonrasında roadmap adım adım ilerler ve **her adımda plan sunulup onay
  beklenir** (`CLAUDE.md` §3 kapıları). Vaat "tek promptla uygulama" değil,
  **"tek promptla doğru kurulmuş proje ve net yol haritası"**.
- Kurulum bittikten sonra artık bu skill değil, projedeki `CLAUDE.md` ve
  `docs/standards/` geçerlidir.
- Bir kural ile kullanıcının isteği çakışırsa **dur ve sor**. Kendi başına karar verme.
- Bir şeyi bozduğunu fark edersen saklama, hemen söyle.
