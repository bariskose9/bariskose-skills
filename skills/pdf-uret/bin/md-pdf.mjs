#!/usr/bin/env node
/**
 * Markdown → PDF (varsayılan KARANLIK tema, telefonda okumak için).
 *
 * Kullanım:  node md-pdf.mjs <girdi.md> [cikti.pdf] [--acik]
 *
 * ⛔ NEDEN KENDİ ARACIMIZ VAR: Üçüncü taraf PDF araçlarına bağımlı kalmamak
 *    için. Yalnızca Node (kit zaten şart koşuyor) ve Chrome (chrome-devtools
 *    eklentisi zaten şart koşuyor) kullanılıyor.
 *
 * ⛔ ÖĞRENİLEN İKİ TUZAK — bunlar olmadan çalışmaz:
 *    1) Chrome yazdırırken arka plan renklerini VARSAYILAN OLARAK ATAR.
 *       `-webkit-print-color-adjust: exact !important` olmadan karanlık tema
 *       beyaz basılır. Her seçiciye ayrı ayrı verilmeli, sadece body'ye değil.
 *    2) `--headless=new` şart. Eski `--headless` bazı sürümlerde CSS'i
 *       tam uygulamıyor.
 */
import { spawnSync, execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename, resolve } from "node:path";

const log = (m) => process.stderr.write(m + "\n");
const WIN = process.platform === "win32";

// ── Chrome'u bul ────────────────────────────────────────────────────────────
function chromeBul() {
  const adaylar = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser",
  ].filter(Boolean);
  for (const a of adaylar) if (existsSync(a)) return a;
  for (const c of ["google-chrome", "chromium", "chrome"]) {
    try { return execSync(`${WIN ? "where" : "which"} ${c}`, { encoding: "utf8" }).trim().split("\n")[0]; }
    catch { /* yok */ }
  }
  return null;
}

// ── Markdown → HTML ─────────────────────────────────────────────────────────
/**
 * ⛔ TUZAK — BORU HATTI (pipe) BÜYÜK DOSYADA SESSİZCE KIRPAR.
 *    `marked`e stdin ile beslenirse çıktı belli bir boyuttan sonra KESİLİR ve
 *    hata VERMEZ: 270.000 karakterlik markdown 61.000 karakter HTML üretti,
 *    kelime ortasında bitti. PDF "başarıyla" oluştu ama içeriğin %80'i yoktu.
 *    Bu hata bir kez yaşandı ve ancak sayfa sayısı beklenenin çok altında
 *    kalınca fark edildi.
 * ✅ ÇÖZÜM: stdin/stdout yerine `-i dosya -o dosya` kullan. Dosya üzerinden
 *    geçince kırpma olmuyor (aynı belge 360.730 karakter, tam).
 */
function markdownCevir(mdYolu, klasor) {
  const htmlYolu = join(klasor, "govde.html");
  const r = spawnSync("npx", ["-y", "marked", "--gfm", "-i", mdYolu, "-o", htmlYolu], {
    encoding: "utf8", shell: WIN, timeout: 180000,
  });
  if (!existsSync(htmlYolu)) {
    log("⛔ markdown çevrilemedi. `npx -y marked` çalışmadı.");
    log("   Kontrol: node --version · internet erişimi (ilk çalışmada indirir)");
    log((r.stderr || "").split("\n").slice(-3).join("\n"));
    process.exit(1);
  }
  const html = readFileSync(htmlYolu, "utf8");

  // ⚠️ KIRPMA DENETİMİ — sessiz veri kaybına karşı son savunma
  const mdBoyut = readFileSync(mdYolu, "utf8").length;
  if (html.length < mdBoyut * 0.5) {
    log(`⛔ ÇEVİRİ EKSİK: ${mdBoyut} karakter markdown → ${html.length} karakter HTML.`);
    log("   HTML normalde markdown'dan BÜYÜK olur. Bu kırpma demektir, PDF üretilmedi.");
    process.exit(1);
  }
  return html;
}

// ── Başlıklardan içindekiler üret ───────────────────────────────────────────
function icindekiler(html) {
  const bulunan = [...html.matchAll(/<h([12])[^>]*>(.*?)<\/h\1>/gs)];
  if (bulunan.length < 4) return { html, toc: "" };
  let sayac = 0, yeni = html;
  const satirlar = [];
  for (const m of bulunan) {
    const id = "b" + ++sayac;
    const metin = m[2].replace(/<[^>]+>/g, "").trim();
    yeni = yeni.replace(m[0], `<h${m[1]} id="${id}">${m[2]}</h${m[1]}>`);
    satirlar.push(`<li class="d${m[1]}"><a href="#${id}">${metin}</a></li>`);
  }
  return { html: yeni, toc: `<nav class="toc"><h2>İçindekiler</h2><ul>${satirlar.join("")}</ul></nav>` };
}

// ── Tema ────────────────────────────────────────────────────────────────────
const tema = (karanlik) => {
  const z = karanlik
    ? { bg:"#16181d", yazi:"#e4e6eb", kalin:"#ffffff", b1:"#7cc4ff", b2:"#9ad0ff", b3:"#b8dcff",
        kod:"#1c1f27", kodYazi:"#d7dae0", satirIci:"#232733", satirIciYazi:"#ffd479",
        cizgi:"#3a3f4b", basSatir:"#232733", ciftSatir:"#1c1f27", alinti:"#1c1f27",
        alintiKenar:"#4a90d9", soluk:"#8a92a3" }
    : { bg:"#ffffff", yazi:"#1a1a1a", kalin:"#000000", b1:"#0b4f8a", b2:"#11629f", b3:"#1a6fae",
        kod:"#f6f8fa", kodYazi:"#24292f", satirIci:"#eef1f4", satirIciYazi:"#8a5200",
        cizgi:"#d0d7de", basSatir:"#eef1f4", ciftSatir:"#f6f8fa", alinti:"#f6f8fa",
        alintiKenar:"#4a90d9", soluk:"#57606a" };
  return `
/* ⛔ EN KRİTİK KURAL: Chrome yazdırırken arka planları ATAR.
   Bu iki satır olmadan karanlık tema BEYAZ basılır. */
*, *::before, *::after {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
/* ⛔ @page kenar boşluğu SIFIR olmalı. Chrome o boşluğu sayfanın kendi
   arka planıyla (beyaz) boyar, gövdenin arka planıyla değil — karanlık
   temada sayfanın dört yanında beyaz çerçeve kalır ve loş ortamda göz
   alır. Boşluk body'nin padding'i olarak verilir; böylece koyu zemin
   kağıdın kenarına kadar gider. */
@page { size: A4; margin: 0; }
html, body { background: ${z.bg} !important; color: ${z.yazi}; }
body {
  font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 10.5pt; line-height: 1.65; margin: 0;
  padding: 18mm 16mm;
}
h1,h2,h3,h4 { color: ${z.b3}; line-height: 1.3; margin: 1.4em 0 .5em; }
h1 { color: ${z.b1}; font-size: 19pt; border-bottom: 2px solid ${z.cizgi}; padding-bottom: .25em; }
h2 { color: ${z.b2}; font-size: 15pt; border-bottom: 1px solid ${z.cizgi}; padding-bottom: .2em; }
h3 { font-size: 12.5pt; }
h1, h2 { break-before: auto; }
h1,h2,h3,h4 { break-after: avoid; }
strong,b { color: ${z.kalin}; }
a { color: ${z.b1}; text-decoration: none; }
code, kbd { background: ${z.satirIci}; color: ${z.satirIciYazi};
  padding: .1em .35em; border-radius: 3px; font-size: .9em;
  font-family: "SF Mono", Consolas, "Liberation Mono", monospace; }
pre { background: ${z.kod}; border: 1px solid ${z.cizgi}; border-radius: 6px;
  padding: .8em 1em; overflow-x: auto; break-inside: avoid; }
pre code { background: transparent; color: ${z.kodYazi}; padding: 0; font-size: 8.6pt; }
table { border-collapse: collapse; width: 100%; margin: 1em 0;
  break-inside: avoid; font-size: 9.5pt; }
th { background: ${z.basSatir}; color: ${z.kalin}; text-align: left; }
th, td { border: 1px solid ${z.cizgi}; padding: .45em .6em; vertical-align: top; }
tr:nth-child(even) td { background: ${z.ciftSatir}; }
blockquote { background: ${z.alinti}; border-left: 4px solid ${z.alintiKenar};
  margin: 1em 0; padding: .6em 1em; break-inside: avoid; }
blockquote > :first-child { margin-top: 0; }
blockquote > :last-child { margin-bottom: 0; }
hr { border: 0; border-top: 1px solid ${z.cizgi}; margin: 2em 0; }
ul, ol { padding-left: 1.4em; }
li { margin: .25em 0; }
img { max-width: 100%; }
.toc { background: ${z.kod}; border: 1px solid ${z.cizgi}; border-radius: 6px;
  padding: 1em 1.4em; margin-bottom: 2em; break-after: page; }
.toc h2 { margin-top: 0; border: 0; }
.toc ul { list-style: none; padding-left: 0; }
.toc li.d2 { padding-left: 1.4em; font-size: .95em; color: ${z.soluk}; }
.toc a { color: ${z.yazi}; }
`;
};

// ── Ana akış ────────────────────────────────────────────────────────────────
const girdi = process.argv[2];
if (!girdi) { log("Kullanım: node md-pdf.mjs <girdi.md> [cikti.pdf] [--acik]"); process.exit(2); }
const karanlik = !process.argv.includes("--acik");
const cikti = resolve(process.argv[3] && !process.argv[3].startsWith("--")
  ? process.argv[3] : girdi.replace(/\.md$/i, ".pdf"));

const chrome = chromeBul();
if (!chrome) {
  log("⛔ Chrome bulunamadı. PDF üretmek için Chrome veya Chromium gerekiyor.");
  log("   CHROME_PATH ortam değişkeniyle yolu verebilirsin.");
  log("   macOS: brew install --cask google-chrome");
  log("   Windows: winget install Google.Chrome");
  process.exit(1);
}

const klasor = mkdtempSync(join(tmpdir(), "mdpdf-"));
try {
  const govde = markdownCevir(resolve(girdi), klasor);
  const { html: govde2, toc } = icindekiler(govde);

  const belge = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<title>${basename(girdi, ".md")}</title><style>${tema(karanlik)}</style></head>
<body>${toc}${govde2}</body></html>`;

  const htmlYol = join(klasor, "belge.html");
  writeFileSync(htmlYol, belge, "utf8");
  const r = spawnSync(chrome, [
    "--headless=new",              // ⛔ eski --headless CSS'i tam uygulamıyor
    "--disable-gpu", "--no-sandbox",
    "--no-pdf-header-footer",
    `--print-to-pdf=${cikti}`,
    "file://" + htmlYol,
  ], { encoding: "utf8", timeout: 180000 });

  if (!existsSync(cikti)) {
    log("⛔ PDF üretilemedi.");
    log((r.stderr || "").split("\n").slice(-5).join("\n"));
    process.exit(1);
  }
  console.log(cikti);
} finally {
  rmSync(klasor, { recursive: true, force: true });
}
