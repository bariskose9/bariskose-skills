#!/usr/bin/env node
/**
 * NE:        proje-kiti oturum başlangıcı kancası — plugin açıksa HER oturumda,
 *            hangi klasörde olursa olsun, ajana kitin varlığını ve anlatım ölçütünü hatırlatır.
 * AKIŞ:      Claude Code SessionStart → hooks/hooks.json → `node` bu dosyayı çalıştırır →
 *            stdout'a yazılan DÜZ METİN ajanın bağlamına eklenir (SessionStart için belgelenmiş davranış).
 * NEDEN VAR: Kit projesi olmayan bir klasörde (CLAUDE.md yok) ajan kiti bilmez; kurallar yalnızca
 *            beceri çağrılınca ya da proje kurulunca yüklenirdi. Kullanıcı "plugin açıksa hep bilmeli" dedi.
 * KARARLAR:  (1) Kuralın KOPYASI enjekte edilmez — özet + tam yol. Kural tek yerde kalır
 *            (11-agent-workflow.md → "HER KAVRAM ÖĞRETİLİR").
 *            (2) 3.12.1: bash + jq yerine Node. Neden: jq ne Windows'ta ne macOS'ta hazır gelir;
 *            3.12.0 yalnızca jq'nun tesadüfen kurulu olduğu makinede çalıştı. Node ise kitin zaten
 *            ön koşulu (denetim betiği, PDF üretici, her kit projesi). Kabuk da kullanılmaz —
 *            hooks.json exec biçimiyle (`command: node`, `args: [...]`) çağrılır; bash/PowerShell farkı,
 *            tırnak ve yol ayracı sorunu doğmaz.
 *            (3) Çıktı düz metin. `{priority, message}` JSON'u Claude Code'un tanımlı bir biçimi değildi.
 *            (4) 3.15.0: sürüm kontrolü — GitHub'daki plugin.json ile karşılaştırır (3 sn zaman aşımı),
 *            geride ise ajana "kullanıcıya sor, onaylarsa güncelle" talimatı ekler. Kullanıcı kararı:
 *            "fark ettiği an sorsun, güncellemeyi kendisi yapsın".
 * DİKKAT:    Ne olursa olsun exit 0 — kanca oturum açılışını bozmaz. Metin kısa tutulur, her oturumda yüklenir.
 *            Hooks.json'da ${CLAUDE_PLUGIN_ROOT} bu dosyanın yolunu verir; ortam değişkeni olarak da gelir.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

(async () => {
try {
  // Kitin kökü: Claude Code'un verdiği ortam değişkeni; yoksa bu dosyanın iki üst klasörü (hooks/ → kök).
  const root =
    process.env.CLAUDE_PLUGIN_ROOT || dirname(dirname(fileURLToPath(import.meta.url)));
  const std = join(root, "skills", "yeni-proje", "dosyalar", "docs", "standards");

  let version = "?";
  try {
    version = JSON.parse(readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8")).version ?? "?";
  } catch {
    /* sürüm okunamazsa "?" kalır; mesaj yine gider */
  }

  const message = `proje-kiti ${version} yüklü. Bu oturumda, klasör ne olursa olsun geçerli:

ANLATIM ÖLÇÜTÜ — kullanıcıya bir şey anlatırken işe yeni başlamış bir junior'a ders anlatır gibi:
sorunla başla · tek bir örneği baştan sona taşı · ilk geçen HER terimi geçtiği yerde aç
(ad ve TR/EN eş anlamlıları → gerçek hayat benzetmesi → yazılım dünyasındaki tanımı ve başka
teknolojideki karşılığı → bu projede nerede) · kodu satır satır Türkçe yorumla · sonunda kararı
veren soruyu bırak. Dört başlığa birer cümle yazmak, madde yığını, gerekçesiz "best practice budur"
= kural ihlali. Uzunluk sınırı yok, eksiklik sınırı var. Bir boşluğu "adı + nereye" diye listelemek
anlatım değildir. Tam kural: ${join(std, "11-agent-workflow.md")} → "HER KAVRAM ÖĞRETİLİR".

KİT NEREDE — bu klasör kit projesi değilse (CLAUDE.md yok) standartlar şurada:
${std} (00-stack … 18-seo). Yeni proje: /yeni-proje · kite kural: /kit-senkron · PDF: /pdf-uret.
Kit projesindeysen CLAUDE.md, .claude/rules/ (çekirdek her oturum, alan kuralları dosya açılınca) ve docs/standards/ zaten devrededir; bu not onların yerine geçmez.`;

  process.stdout.write(message + "\n");

  // SÜRÜM KONTROLÜ — ağ varsa GitHub'daki sürümle karşılaştır; geride ise ajana "sor ve güncelle" talimatı.
  // 3 sn zaman aşımı: ağ yoksa ya da yavaşsa sessizce geçilir, oturum bekletilmez.
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const r = await fetch(
      "https://raw.githubusercontent.com/bariskose9/bariskose-skills/main/.claude-plugin/plugin.json",
      { signal: ctrl.signal },
    );
    clearTimeout(t);
    const uzak = (await r.json()).version;
    const geride = (a, b) => {
      const A = a.split(".").map(Number), B = b.split(".").map(Number);
      for (let i = 0; i < 3; i++) if ((A[i] || 0) !== (B[i] || 0)) return (A[i] || 0) < (B[i] || 0);
      return false;
    };
    if (version !== "?" && uzak && geride(version, uzak)) {
      process.stdout.write(`
⚠️ KİT GÜNCELLEMESİ VAR — kurulu ${version}, GitHub ${uzak}. İlk fırsatta kullanıcıya SOR:
"proje-kiti ${uzak} çıkmış, güncelleyeyim mi?" Evet derse şu iki komutu SEN koştur:
  claude plugin marketplace update bariskose-skills
  claude plugin update proje-kiti@bariskose-skills
sonra söyle: yeni sürüm bu oturumda etkin olmaz, Claude yeniden başlatılmalı. /yeni-proje ya da
/kit-senkron çalıştırılacaksa güncelleme ÖNCE yapılır (15-oturum-devri-kurallari.md).
`);
    }
  } catch {
    /* ağ yok / zaman aşımı — sessizce geç */
  }
} catch (err) {
  // Kanca hiçbir koşulda oturumu kırmaz; sorunu tek satırla söyler.
  process.stdout.write(`proje-kiti: oturum kancası çalışamadı (${err?.message ?? err}). Beceriler yine kullanılabilir.\n`);
}
process.exit(0);
})();
