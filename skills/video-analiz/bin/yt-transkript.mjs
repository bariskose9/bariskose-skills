#!/usr/bin/env node
/**
 * YouTube transkript alıcı — kendini onarır.
 *
 * Kullanım:  node yt-transkript.mjs <url> [dil]     (dil varsayılan: tr,en)
 *
 * ⛔ NEDEN BU ARAÇ VAR: Videoyu izleyemeyiz, sesi duyamayız. Analiz
 * edilebilecek tek şey altyazı metnidir.
 *
 * ⛔ NEDEN yt-dlp: 2026-08 ölçümü — kurulumsuz iki yol da ÖLÜ:
 *    · youtube.com/api/timedtext  → 0 bayt (sayfanın kendi bağlamından bile)
 *    · Oynatıcının transkript paneli → düğme var, panel boş
 *    yt-dlp çalışıyor çünkü YouTube'un JS doğrulamalarını çözüyor ve tam bu
 *    yüzden sürekli bakımda. Bozulursa çözüm GÜNCELLEMEKTİR, başka araç
 *    aramak değil.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const WIN = process.platform === "win32";
const MAC = process.platform === "darwin";
const AYRAC = "|||";
const log = (m) => process.stderr.write(m + "\n");

const calistir = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { encoding: "utf8", shell: WIN, ...opts });

const varMi = (cmd) => calistir(WIN ? "where" : "which", [cmd]).status === 0;

// ── yt-dlp yoksa kur ────────────────────────────────────────────────────────
function kur() {
  log("⚙️  yt-dlp kurulu değil, kuruluyor…");
  const yollar = MAC
    ? [["brew", ["install", "yt-dlp"]]]
    : WIN
    ? [
        ["winget", ["install", "--silent", "--accept-source-agreements",
                    "--accept-package-agreements", "yt-dlp.yt-dlp"]],
        ["pip", ["install", "-U", "yt-dlp"]],
        ["python", ["-m", "pip", "install", "-U", "yt-dlp"]],
      ]
    : [
        ["pip3", ["install", "-U", "yt-dlp"]],
        ["python3", ["-m", "pip", "install", "-U", "yt-dlp"]],
      ];

  for (const [cmd, args] of yollar) {
    if (!varMi(cmd)) continue;
    log(`   → ${cmd} ${args.join(" ")}`);
    if (calistir(cmd, args, { stdio: "inherit" }).status === 0 && varMi("yt-dlp")) return true;
  }
  return false;
}

// ── yt-dlp'yi güncelle (bozulduğunda İLK çare) ──────────────────────────────
function guncelle() {
  log("⚙️  yt-dlp güncelleniyor (YouTube büyük ihtimalle bir şey değiştirdi)…");

  // 1) Kendi güncelleyicisi — tek dosya kurulumlarda çalışır
  const kendi = calistir("yt-dlp", ["-U"]);
  const cikti = (kendi.stdout || "") + (kendi.stderr || "");
  if (kendi.status === 0 && !/not supported|Unable to update|package manager/i.test(cikti)) {
    log("   ✓ yt-dlp kendini güncelledi");
    return true;
  }

  // 2) Paket yöneticisiyle
  const nerede = calistir(WIN ? "where" : "which", ["yt-dlp"]).stdout || "";
  const adaylar = [];
  if (/homebrew|Cellar|\/usr\/local/i.test(nerede)) adaylar.push(["brew", ["upgrade", "yt-dlp"]]);
  if (WIN) adaylar.push(["winget", ["upgrade", "--silent", "yt-dlp.yt-dlp"]]);
  adaylar.push(
    ["pip3", ["install", "-U", "yt-dlp"]],
    ["pip", ["install", "-U", "yt-dlp"]],
    [WIN ? "python" : "python3", ["-m", "pip", "install", "-U", "yt-dlp"]],
  );

  for (const [cmd, args] of adaylar) {
    if (!varMi(cmd)) continue;
    log(`   → ${cmd} ${args.join(" ")}`);
    if (calistir(cmd, args, { stdio: "inherit" }).status === 0) {
      log("   ✓ güncellendi");
      return true;
    }
  }
  log("   ✗ güncellenemedi");
  return false;
}

// ── Transkripti indir ───────────────────────────────────────────────────────
function indir(url, diller, klasor) {
  const sablon = ["title", "uploader", "duration_string", "upload_date"]
    .map((a) => `%(${a})s`).join(AYRAC);

  const r = calistir("yt-dlp", [
    "--skip-download",
    "--write-subs", "--write-auto-subs",
    "--sub-langs", diller,
    "--sub-format", "json3/vtt",
    // ⛔ TUZAK: --print tek başına --simulate moduna sokar ve altyazı YAZILMAZ.
    //    Bu hata bir kez yaşandı; --no-simulate şart.
    "--no-simulate",
    "--print", sablon,
    "-o", join(klasor, "%(id)s.%(ext)s"),
    "--no-warnings",
    url,
  ]);

  const dosyalar = (() => { try { return readdirSync(klasor); } catch { return []; } })();
  const altyazi = dosyalar.find((f) => f.endsWith(".json3")) ||
                  dosyalar.find((f) => f.endsWith(".vtt"));
  return { r, altyazi: altyazi ? join(klasor, altyazi) : null, ad: altyazi || "" };
}

// ── Altyazı dosyasını düz metne çevir ───────────────────────────────────────
function metneCevir(dosya) {
  const ham = readFileSync(dosya, "utf8");
  const parcalar = [];

  if (dosya.endsWith(".json3")) {
    for (const ev of JSON.parse(ham).events || [])
      for (const s of ev.segs || []) parcalar.push(s.utf8 || "");
  } else {
    for (const satir of ham.split("\n")) {
      if (satir.includes("-->") || /^\d+$/.test(satir.trim()) ||
          satir.startsWith("WEBVTT") || !satir.trim()) continue;
      parcalar.push(satir.replace(/<[^>]+>/g, "") + " ");
    }
  }

  let metin = parcalar.join("").replace(/\s+/g, " ").trim();
  // Otomatik altyazıda sık görülen ardışık tekrarları tekille
  metin = metin.replace(/\b(\w+(?: \w+){0,3})( \1\b)+/g, "$1");
  // Cümle sonlarında kır — okunabilir olsun
  metin = metin.replace(/(?<=[.!?…]) (?=[A-ZÇĞİÖŞÜ])/g, "\n\n");
  return metin;
}

// ── Ana akış ────────────────────────────────────────────────────────────────
const url = process.argv[2];
const diller = process.argv[3] || "tr,en";
if (!url) {
  log("Kullanım: node yt-transkript.mjs <youtube-url> [dil]");
  process.exit(2);
}

if (!varMi("yt-dlp") && !kur()) {
  log("⛔ yt-dlp kurulamadı. Elle kur:");
  log(MAC ? "   brew install yt-dlp"
      : WIN ? "   winget install yt-dlp.yt-dlp   (veya: pip install -U yt-dlp)"
            : "   pip3 install -U yt-dlp");
  process.exit(1);
}

const klasor = mkdtempSync(join(tmpdir(), "yt-"));
try {
  let { r, altyazi, ad } = indir(url, diller, klasor);

  // ⭐ KENDİNİ ONARMA: başarısızsa GÜNCELLE ve bir kez tekrar dene
  if (!altyazi) {
    log("⚠️  Transkript alınamadı — bu genelde yt-dlp'nin eskimesinden olur.");
    if (guncelle()) ({ r, altyazi, ad } = indir(url, diller, klasor));
  }

  if (!altyazi) {
    const hata = ((r.stderr || "") + (r.stdout || "")).trim().split("\n").slice(-4).join("\n");
    log("\n⛔ Transkript ALINAMADI. İki olasılık var:");
    log("   1) Videoda hiç altyazı yok  → analiz YAPILAMAZ, uydurma yapma.");
    log("   2) yt-dlp güncellendiği hâlde çözemedi → YouTube yeni bir engel koymuş.");
    log(`      Kontrol:  yt-dlp --list-subs "${url}"`);
    if (hata) log("\n   yt-dlp çıktısı:\n   " + hata.replace(/\n/g, "\n   "));
    process.exit(1);
  }

  const satir = (r.stdout || "").trim().split("\n").pop() || "";
  const [baslik, kanal, sure, tarih] = satir.split(AYRAC);
  const t = (tarih || "").length === 8
    ? `${tarih.slice(6, 8)}.${tarih.slice(4, 6)}.${tarih.slice(0, 4)}`
    : (tarih || "?");
  const metin = metneCevir(altyazi);

  console.log(`# ${baslik || "(başlık yok)"}\n`);
  console.log(`> **Kanal:** ${kanal || "?"} · **Süre:** ${sure || "?"} · **Yayın tarihi:** ${t}`);
  console.log(`> **Kaynak:** ${url}`);
  console.log(`> **Altyazı dosyası:** ${ad}\n`);
  console.log(`⚠️ **Yayın tarihi ${t}** — iddiaları BUGÜNKÜ ölçümle doğrula, videoya güvenme.`);
  console.log(`⚠️ **Otomatik altyazıysa teknik terimler BOZUK gelir** — bağlamdan düzelt,`);
  console.log(`   düzeltemediğini uydurma. Kural: SKILL.md → "Bozuk terimleri düzeltme".\n`);
  console.log("---\n");
  console.log(metin);
  console.log(`\n---\n\n*${metin.length} karakter · ~${metin.split(/\s+/).length} kelime*`);
} finally {
  rmSync(klasor, { recursive: true, force: true });
}
