// NE      : Hangi kural dosyasının ne zaman ve neden yüklendiğini, hangi standardın fiilen
//           okunduğunu satır satır kaydeder (JSONL). Ölçüm kancası — karar vermez, engellemez.
// NEREDEN : Claude Code → InstructionsLoaded (CLAUDE.md / .claude/rules yüklenince) ve
//           PostToolUse(Read|Bash) (bir dosya okununca; Bash'te cat/sed/grep ile okuma da sayılır)
//           → stdin JSON → bu betik → ~/.claude/proje-kiti/log/<proje>.jsonl
// NEDEN   : "Hangi kural fiilen okunuyor" sorusu tahminle cevaplanıyordu. Rules dönüşümünden
//           sonra çekirdek her oturum, alan kuralları dosya açılınca gelmeli; işaretçiyle
//           gönderilen standartlar açılıyor mu — kanıtı bu log (TARTISILMIS-KARARLAR → Tur C).
// KAYNAK  : Log kullanıcı klasörüne yazılır, projeye değil — commit'e karışmasın. Yalnızca
//           docs/standards/ ve .claude/rules altındaki okumalar kaydedilir; kişisel dosya yolu tutulmaz.
// DİKKAT  : Hata olursa sessizce çıkar (exit 0) — ölçüm aracı oturumu bozamaz.
import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

let girdi = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (girdi += d));
process.stdin.on("end", () => {
  try {
    const m = JSON.parse(girdi || "{}");
    const cwd = m.cwd || process.cwd();
    const proje = basename(cwd) || "bilinmeyen";
    const klasor = join(homedir(), ".claude", "proje-kiti", "log");
    mkdirSync(klasor, { recursive: true });
    const satir = { t: new Date().toISOString(), oturum: (m.session_id || "").slice(0, 8), olay: m.hook_event_name };
    if (m.hook_event_name === "InstructionsLoaded") {
      satir.dosya = m.file_path?.replace(cwd + "/", "");
      satir.neden = m.load_reason;
      if (m.globs) satir.desen = m.globs;
      if (m.trigger_file_path) satir.tetikleyen = m.trigger_file_path.replace(cwd + "/", "");
    } else if (m.hook_event_name === "PostToolUse" && m.tool_name === "Read") {
      const yol = m.tool_input?.file_path || "";
      if (!/docs\/standards\/|\.claude\/rules\//.test(yol)) process.exit(0); // yalnızca kural okumaları
      satir.olay = "StandartOkundu";
      satir.dosya = yol.replace(cwd + "/", "");
    } else if (m.hook_event_name === "PostToolUse" && m.tool_name === "Bash") {
      // Ajan "auto" modda dosyayı Read yerine cat/sed/grep ile okur; o okumalar Read kancasına
      // görünmez. Komutta geçen standart/kural yollarını ayıkla, okuma fiili varsa kaydet.
      const komut = m.tool_input?.command || "";
      if (!/\b(cat|sed|head|tail|grep|awk|less|more|rg|bat|diff)\b/.test(komut)) process.exit(0);
      const yollar = [...new Set(komut.match(/(?:docs\/standards|\.claude\/rules)\/[\w./-]+\.md/g) || [])];
      if (!yollar.length) process.exit(0);
      for (const y of yollar)
        appendFileSync(join(klasor, `${proje}.jsonl`), JSON.stringify({ ...satir, olay: "StandartOkundu", dosya: y, arac: "bash" }) + "\n");
      process.exit(0);
    } else process.exit(0);
    appendFileSync(join(klasor, `${proje}.jsonl`), JSON.stringify(satir) + "\n");
  } catch {
    /* ölçüm aracı oturumu bozmaz */
  }
  process.exit(0);
});
