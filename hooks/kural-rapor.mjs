#!/usr/bin/env node
// NE      : Kural-yükleme logunu insan okur hâle getirir: oturum oturum, ne açılışta geldi,
//           ne hangi dosyayla tetiklendi, hangi standart fiilen okundu.
// NEREDEN : ~/.claude/proje-kiti/log/<proje>.jsonl (kural-log.mjs yazar) → bu betik → stdout
// NEREYE  : Ekran; kullanıcı ya da ajan okur, sonucu kite-tasinacaklar / 15-oturum-devri kapanışına taşır.
// SONUÇ   : "Bu oturumda veritabani.md prisma/schema.prisma ile geldi; 04-database.md açıldı;
//           arayüz dosyasına dokunuldu ama arayuz.md gelmedi" gibi cümleler — tahmin değil kayıt.
// KAYNAK  : TARTISILMIS-KARARLAR.md → "Tur C — rules dönüşümü"; 11-agent-workflow.md → "Bağlam yönetimi"
// NEDEN   : JSONL'i gözle okumak mümkün değil; kural yazmadan önce bir kez ölçmek gerekiyor.
// DİKKAT  : Yalnızca okur. Kullanım: node kural-rapor.mjs [proje-adı] [--son N]  (varsayılan: cwd adı, son 1 oturum)
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const sonIdx = args.indexOf("--son");
const son = sonIdx >= 0 ? Number(args[sonIdx + 1] || 1) : 1;
const proje = args.find((a, i) => !a.startsWith("--") && (sonIdx < 0 || i !== sonIdx + 1)) || basename(process.cwd());
const dosya = join(homedir(), ".claude", "proje-kiti", "log", `${proje}.jsonl`);
if (!existsSync(dosya)) { console.log(`Log yok: ${dosya}\n(Kanca plugin ile gelir; ilk oturumdan sonra oluşur.)`); process.exit(0); }

const satirlar = readFileSync(dosya, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
const oturumlar = new Map();
for (const s of satirlar) { const k = s.oturum || "?"; if (!oturumlar.has(k)) oturumlar.set(k, []); oturumlar.get(k).push(s); }
const secilen = [...oturumlar.entries()].slice(-son);

for (const [id, ev] of secilen) {
  const t0 = ev[0].t.slice(0, 16).replace("T", " "), t1 = ev[ev.length - 1].t.slice(11, 16);
  console.log(`\n━━━ Oturum ${id} · ${t0} → ${t1} · ${ev.length} olay ━━━`);
  const acilis = ev.filter((e) => e.olay === "InstructionsLoaded" && e.neden === "session_start").map((e) => e.dosya);
  const tetik = ev.filter((e) => e.olay === "InstructionsLoaded" && e.neden === "path_glob_match");
  const diger = ev.filter((e) => e.olay === "InstructionsLoaded" && !["session_start", "path_glob_match"].includes(e.neden));
  const okunan = ev.filter((e) => e.olay === "StandartOkundu").map((e) => e.dosya + (e.arac === "bash" ? " (bash)" : ""));
  console.log(`Açılışta yüklenen (${acilis.length}): ${acilis.join(" · ") || "—"}`);
  console.log(`Tetiklenen (${tetik.length}):`);
  for (const e of tetik) console.log(`  ${e.dosya.padEnd(34)} ← ${e.tetikleyen || "?"}`);
  if (diger.length) console.log(`Diğer yüklemeler: ${diger.map((e) => `${e.dosya} (${e.neden})`).join(" · ")}`);
  const sayim = okunan.reduce((m, d) => m.set(d, (m.get(d) || 0) + 1), new Map());
  console.log(`Fiilen okunan standart (${sayim.size}): ${[...sayim].map(([d, n]) => `${d}${n > 1 ? " ×" + n : ""}`).join(" · ") || "— HİÇ"}`);
  // Tetikleyici geldi ama "şu standardı oku" dediği dosya açılmadı mı?
  const harita = { "kod.md": ["01-architecture.md", "02-coding-standards.md"], "veritabani.md": ["04-database.md"], "api.md": ["03-api-guidelines.md"], "guvenlik.md": ["05-auth-security.md", "14-privacy-and-compliance.md"], "arayuz.md": ["07-ui-design-system.md"], "test.md": ["06-testing.md"], "yayin.md": ["09-ci-cd-deploy.md", "12-operations-and-scaling.md", "13-environments.md"], "mobil.md": ["17-mobile.md"] };
  const uyari = [];
  for (const e of tetik) { const ad = basename(e.dosya); const hedef = harita[ad] || []; if (hedef.length && !hedef.some((h) => okunan.some((o) => o.endsWith(h)))) uyari.push(`${ad} geldi ama ${hedef.join("/")} açılmadı`); }
  if (uyari.length) console.log(`⚠️ İşaretçiye gidilmedi: ${uyari.join(" · ")}`);
  else if (tetik.length) console.log(`✓ Gelen her tetikleyicinin standardı en az bir kez açıldı`);
}
if (!secilen.length) console.log("Kayıtlı oturum yok.");
