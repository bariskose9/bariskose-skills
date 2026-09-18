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
 * DİKKAT:    Ne olursa olsun exit 0 — kanca oturum açılışını bozmaz. Metin kısa tutulur, her oturumda yüklenir.
 *            Hooks.json'da ${CLAUDE_PLUGIN_ROOT} bu dosyanın yolunu verir; ortam değişkeni olarak da gelir.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
Kit projesindeysen projenin CLAUDE.md'si ve docs/standards/ zaten yüklüdür; bu not onların yerine geçmez.`;

  process.stdout.write(message + "\n");
} catch (err) {
  // Kanca hiçbir koşulda oturumu kırmaz; sorunu tek satırla söyler.
  process.stdout.write(`proje-kiti: oturum kancası çalışamadı (${err?.message ?? err}). Beceriler yine kullanılabilir.\n`);
}
process.exit(0);
