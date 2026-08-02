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

**Çözüm:** `~/.claude/settings.json` içine iki hook. Ses **ve** Türkçe konuşma.

**Platforma göre farklı komut gerekiyor** — aşağıda ikisi de var. Kullandığın
işletim sisteminin bloğunu al, ikisini birden ekleme.

### macOS

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

### Windows

Hook'a `"shell": "powershell"` eklenir; komut bash değil PowerShell'de çalışır.

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "shell": "powershell",
            "async": true,
            "command": "[console]::beep(880,250); $v=New-Object -ComObject SAPI.SpVoice; $t=@($v.GetVoices() | Where-Object { $_.GetAttribute('Language') -eq '41f' })[0]; if ($t) { $v.Voice = $t }; $v.Speak('Sorum var') | Out-Null"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "shell": "powershell",
            "async": true,
            "command": "[console]::beep(1320,200); $v=New-Object -ComObject SAPI.SpVoice; $t=@($v.GetVoices() | Where-Object { $_.GetAttribute('Language') -eq '41f' })[0]; if ($t) { $v.Voice = $t }; $v.Speak('Senin sıran') | Out-Null"
          }
        ]
      }
    ]
  }
}
```

**Neden `SAPI.SpVoice` (COM) ve `[console]::beep`:** `System.Speech.Synthesis`
ve `System.Media.SystemSounds` sınıfları Windows PowerShell 5.1'de hazır ama
PowerShell 7'de ayrı paket (`System.Speech`, `System.Windows.Extensions`)
istiyor. COM nesnesi ve `beep` her iki sürümde de ek kurulum olmadan çalışır.

**Türkçe ses:** `41f` Türkçe'nin dil kodudur (LCID `0x41F`). Sistemde Türkçe
ses (Microsoft Tolga) kuruluysa seçilir; **kurulu değilse varsayılan sesle
okunur** — anlaşılır ama İngilizce aksanlı. Türkçe ses eklemek için:
*Ayarlar → Saat ve Dil → Konuşma → Ses ekle → Türkçe*.

| Hook | Ne zaman çalar | Duyduğun |
|---|---|---|
| `Notification` | Claude izin istiyor veya soru soruyor | Uyarı sesi + **"Sorum var"** |
| `Stop` | Claude cevabını bitirdi | Bitiş sesi + **"Senin sıran"** |

Komutlarda `;` kullanılıyor, `&&` değil: önce uyarı sesi **tamamen çalar**,
sonra konuşma başlar. `afplay` ve `[console]::beep` bloklayıcı olduğu için
sıra kendiliğinden doğru.

⚠️ **Windows bloğu bu depoda FİİLEN TEST EDİLMEDİ** — geliştirme makinesi
macOS ve orada PowerShell yok. Komutlar Microsoft'un güncel API dokümanına
bakılarak yazıldı ama Windows'ta ilk kullanan kişi aşağıdaki doğrulama
komutunu çalıştırıp sonucu bu dosyaya işlemeli.

### Neden proje ayarına değil, global ayara

Hook'lar **birden fazla ayar dosyasında tanımlıysa hepsi birden çalışır**.
Hem `~/.claude/settings.json` hem proje içindeki `.claude/settings.json`
dosyasına konursa ses **iki kez** çalar. Bu yüzden yalnızca global ayarda durur —
zaten oradan tüm projelerde geçerli.

### Doğrulama — macOS

```bash
# Türkçe ses kurulu mu (Yelda görünmeli)
say -v '?' | grep tr_TR

# Sesler çalışıyor mu
afplay /System/Library/Sounds/Funk.aiff; say -v Yelda 'Sorum var'

# JSON geçerli mi ve hook'lar yerinde mi
jq -e '.hooks | to_entries[] | "\(.key): \(.value[0].hooks[0].command)"' ~/.claude/settings.json
```

### Doğrulama — Windows (PowerShell)

```powershell
# Kurulu sesleri ve dillerini listele — Türkçe için Language '41f' aranıyor
$v = New-Object -ComObject SAPI.SpVoice
$v.GetVoices() | ForEach-Object { "$($_.GetDescription())  ->  $($_.GetAttribute('Language'))" }

# Ses + konuşma çalışıyor mu
[console]::beep(880,250)
$t = @($v.GetVoices() | Where-Object { $_.GetAttribute('Language') -eq '41f' })[0]
if ($t) { $v.Voice = $t } else { "Turkce ses YOK - varsayilan sesle okunacak" }
$v.Speak('Sorum var') | Out-Null

# JSON gecerli mi ve hook'lar yerinde mi
Get-Content "$env:USERPROFILE\.claude\settings.json" | ConvertFrom-Json | Select-Object -ExpandProperty hooks
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
