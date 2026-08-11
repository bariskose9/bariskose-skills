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

**Kaynak depoyu kullanıyorsan önce güncelle:** `git -C <kaynak> pull --ff-only`
— başka bir makinede/oturumda yazılmış kurallar kaçırılmasın.

### Sürüm tutarlılığı kontrolü (atlanmaz)

Kurulu önbellek ile kaynak deponun sürümünü karşılaştır:

```bash
grep '"version"' ~/baris_projects/bariskose-skills/.claude-plugin/plugin.json
find ~/.claude/plugins/cache -name plugin.json -path '*proje-kiti*' -exec grep '"version"' {} \;
```

Kurulu sürüm **geride ise dur ve kullanıcıya söyle:** karşılaştırma kaynak
depoya karşı yapılacak, ama kullanıcı `/yeni-proje` çalıştırmadan önce
plugin'i güncellemeli. Sessizce devam etme.

Proje bir kit projesi değilse (`docs/standards/` yoksa) dur ve söyle.

## Adım 2 — Karşılaştır

`00-stack.md` **hariç** tüm dosyaları karşılaştır.

`00-stack.md` senkronlanmaz: sürüm tablosu her projede fiilen kurulana göre
farklıdır, kite taşınırsa yanlış sürüm bilgisi yayılır. **Ama** o dosyadaki
"bilinen tuzak" ve "kullanılmayacaklar" bölümleri projeden bağımsız olabilir —
bunları ayrıca sor.

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

**Projeye getirilecekler için:** dosyayı güncelle, değişikliği Türkçe özetle,
projenin kendi commit protokolüne uy (`CLAUDE.md` §6.3 — onaysız commit yok).

## Adım 5 — Kayda geç

- Kit tarafında: `CHANGELOG.md` varsa hangi kuralın neden değiştiğini yaz
- Proje tarafında: kural değişikliği bir mimari kararsa `docs/project/decisions/`
  altına ADR yaz

## Sınırlar

- **Sessizce senkronlama yok.** Her fark kullanıcıya sorulur; "küçük değişiklik"
  diye atlanmaz.
- Gizli anahtar, ortam değişkeni değeri veya kişisel veri **hiçbir yönde**
  taşınmaz. Kit herkese açık bir depodur.
- `docs/project/` **asla** senkronlanmaz — o klasör tamamen projeye özeldir.
