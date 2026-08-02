# Kurulum — yeni bilgisayarda ne yapılır

> Bu dosya **depoya girmeyen**, makineye özel ayarları kayıt altına alır.
> `~/.claude/settings.json` git'te tutulmaz; bilgisayar sıfırlanırsa buradan
> yeniden kurulur.

---

## 1. Eklentileri kur

```
claude plugin marketplace add bariskose9/bariskose-skills
claude plugin install proje-kiti@bariskose-skills
```

Ayrıca kullanılan diğer kaynaklar:

| Marketplace | Kaynak | İçindekiler |
|---|---|---|
| `addy-agent-skills` | `https://github.com/addyosmani/agent-skills.git` | `code-reviewer`, `test-engineer`, `security-auditor`, `web-performance-auditor` |
| `chrome-devtools-plugins` | `ChromeDevTools/chrome-devtools-mcp` | Tarayıcıda fiilen tıklayarak test |
| `bariskose-skills` | `bariskose9/bariskose-skills` | `/yeni-proje`, `/kit-senkron` |

---

## 2. Sesli bildirim (macOS)

**Sorun:** Ekrana bakmadan çalışırken Claude'un ne zaman beklediği anlaşılmıyor.

**Çözüm:** `~/.claude/settings.json` içine iki hook. Ses **ve** Türkçe konuşma:

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Funk.aiff; say -v Yelda 'Sorum var' 2>/dev/null || true",
            "async": true
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff; say -v Yelda 'Senin sıran' 2>/dev/null || true",
            "async": true
          }
        ]
      }
    ]
  }
}
```

| Hook | Ne zaman çalar | Duyduğun |
|---|---|---|
| `Notification` | Claude izin istiyor veya soru soruyor | Davul sesi + **"Sorum var"** |
| `Stop` | Claude cevabını bitirdi | Cam sesi + **"Senin sıran"** |

Komutlarda `;` kullanılıyor, `&&` değil: önce uyarı sesi **tamamen çalar**,
sonra konuşma başlar. `afplay` bloklayıcı olduğu için sıra kendiliğinden doğru.

### Neden proje ayarına değil, global ayara

Hook'lar **birden fazla ayar dosyasında tanımlıysa hepsi birden çalışır**.
Hem `~/.claude/settings.json` hem proje içindeki `.claude/settings.json`
dosyasına konursa ses **iki kez** çalar. Bu yüzden yalnızca global ayarda durur —
zaten oradan tüm projelerde geçerli.

### Doğrulama

```
# Türkçe ses kurulu mu (Yelda görünmeli)
say -v '?' | grep tr_TR

# Sesler çalışıyor mu
afplay /System/Library/Sounds/Funk.aiff; say -v Yelda 'Sorum var'

# JSON geçerli mi ve hook'lar yerinde mi
jq -e '.hooks | to_entries[] | "\(.key): \(.value[0].hooks[0].command)"' ~/.claude/settings.json
```

**Ses gelmiyorsa önce çıkış aygıtına bak.** Sanal ses aygıtı (eqMac, Bitgapp vb.)
seçiliyken `afplay` sessiz kalabiliyor — menü çubuğundan çıkışı gerçek
hoparlöre al.

**Ayar yazıldı ama hook çalışmıyorsa** Claude Code oturumunu kapatıp aç; ayar
dosyası oturum başında okunuyor. (VSCode eklentisinde `/hooks` menüsü yok.)

---

## 3. Ortam gereksinimleri

| Araç | Durum | Not |
|---|---|---|
| `gh` | PATH'te olmalı, giriş yapılmış | PR açma, CI okuma |
| `vercel` | PATH'te olmayabilir → `npx vercel` | Ortam değişkeni, yeniden dağıtım |
| `neonctl` | PATH'te olmayabilir → `npx neonctl` | `--org-id` gerekiyor |
| `psql` | Kurulu olmayabilir | Uzak sorgu için `npx tsx` + Prisma betiği |
| `docker` | Kurulu olmalı | Local Postgres, imaj derleme |
| `caffeinate` | macOS'te hazır | Uzun oturumda bilgisayar uyumasın diye |

---

## 4. Model ve davranış ayarları

`~/.claude/settings.json` içinde tutulan diğer tercihler:

```json
{
  "model": "opus",
  "effortLevel": "high",
  "theme": "dark"
}
```
