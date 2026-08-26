#!/usr/bin/env node
/**
 * DENETİM — commit öncesi mekanik kontrol.
 *
 * ⛔ NEDEN VAR: "yazdıktan sonra denetle" kuralı hatırlamaya dayanıyordu ve
 *    bağlam dolduğunda ilk düşen şey oldu (aynı oturumda iki kez çiğnendi).
 *    Hatırlanması gereken şey, ÇALIŞTIRILAN komuta çevrildi.
 *
 * Kullanım: node denetim.mjs [klasör]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename, dirname } from "node:path";

const kok = process.argv[2] || process.cwd();
const bulgular = [];

function dosyalar(d, liste = []) {
  for (const ad of readdirSync(d)) {
    if (ad === "node_modules" || ad === ".git" || ad.startsWith(".next")) continue;
    const p = join(d, ad);
    const st = statSync(p);
    if (st.isDirectory()) dosyalar(p, liste);
    else if ([".md", ".txt"].includes(extname(ad))) liste.push(p);
  }
  return liste;
}

const hepsi = dosyalar(kok);
const adlar = new Set(hepsi.map((p) => basename(p)));

/**
 * ⭐ İLERİYE DÖNÜK REFERANSLAR — yanlış alarm üretmesin.
 * Bu dosyalar kurulumdan (/yeni-proje) SONRA oluşacak. Belgelerin onlara
 * atıf yapması doğrudur; "yok" demek yanlış alarm olur.
 */
const gelecek = /^(CLAUDE|REPO-YAPISI|README|CHANGELOG|PRD|roadmap|data-model|altyapi-durumu|integrations|ogrendiklerim|sonraki-adim-prompt|teknoloji-ve-plan|fake-data-guide|vscode-eklentileri|kurumdan-ogrenilecekler|OKUBENI|ADR-\d+.*)\.md$|^\d\d-[\w-]+\.md$/;

for (const p of hepsi) {
  const metin = readFileSync(p, "utf8");
  const yerel = basename(p);

  // 1) KIRIK REFERANS — anılan .md dosyası var mı
  for (const m of metin.matchAll(/`([\w./-]+\.md)`/g)) {
    const hedef = basename(m[1]);
    if (hedef === yerel) continue;
    if (gelecek.test(hedef)) continue;              // kurulumdan sonra oluşacak
    if (m[1].startsWith("docs/")) continue;         // proje sırasında üretilecek teslim belgesi
    if (/^(AI_USAGE|PRD-taslak)\.md$/.test(hedef)) continue;
    if (!adlar.has(hedef) && !existsSync(join(dirname(p), m[1]))) {
      bulgular.push(["KIRIK REFERANS", yerel, `${m[1]} bulunamadı`]);
    }
  }

  // 2) KIRIK BÖLÜM ATFI — "BÖLÜM X" / "E.N" anılıyor ama hedefte yok
  const hedefDosya = hepsi.find((h) => basename(h) === "proje-teknoloji-ve-plan.md");
  if (hedefDosya && p !== hedefDosya) {
    const plan = readFileSync(hedefDosya, "utf8");
    for (const m of metin.matchAll(/\*\*(BÖLÜM [0-9A-H]|[A-E]\.\d{1,2})\*\*/g)) {
      const ref = m[1];
      // ⚠️ Belge kendi bölümünden söz ediyor olabilir — o zaman kontrol etme
      if (new RegExp(`^#{1,2} ${ref.replace(".", "\\.")}`, "m").test(metin)) continue;
      const kalip = ref.startsWith("BÖLÜM")
        ? new RegExp(`^# ${ref}`, "m")
        : new RegExp(`^## ${ref.replace(".", "\\.")}[ .]`, "m");
      if (!kalip.test(plan)) bulgular.push(["KIRIK BÖLÜM", yerel, `${ref} planda yok`]);
    }
  }
}

// 3) BAYAT TÜRETİLMİŞ DOSYA — md yeni, pdf eski
const mdKlasor = join(kok, "_devir", "md");
const pdfKlasor = join(kok, "_devir", "pdf");
if (existsSync(mdKlasor) && existsSync(pdfKlasor)) {
  for (const ad of readdirSync(mdKlasor).filter((a) => a.endsWith(".md"))) {
    const pdf = join(pdfKlasor, ad.replace(/\.md$/, ".pdf"));
    if (!existsSync(pdf)) { bulgular.push(["PDF YOK", ad, "eşleşen pdf üretilmemiş"]); continue; }
    if (statSync(join(mdKlasor, ad)).mtimeMs > statSync(pdf).mtimeMs + 1000)
      bulgular.push(["BAYAT PDF", ad, "md daha yeni — yeniden üret"]);
  }
}

// ── Rapor ───────────────────────────────────────────────────────────────────
if (!bulgular.length) {
  console.log("✓ Denetim temiz — kırık referans, kırık bölüm atfı ve bayat PDF yok.");
  process.exit(0);
}
console.log(`⚠️ ${bulgular.length} bulgu:\n`);
const genislik = Math.max(...bulgular.map((b) => b[0].length));
for (const [tur, dosya, aciklama] of bulgular)
  console.log(`  ${tur.padEnd(genislik)}  ${dosya}  →  ${aciklama}`);
console.log("\n⛔ Commit'ten önce bunlar giderilir veya gerekçesi söylenir.");
process.exit(1);
