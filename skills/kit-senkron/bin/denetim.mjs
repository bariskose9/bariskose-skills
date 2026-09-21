#!/usr/bin/env node
/**
 * DENETİM — commit öncesi mekanik kontrol.
 *
 * ⛔ NEDEN VAR: "yazdıktan sonra denetle" kuralı hatırlamaya dayanıyordu ve
 *    bağlam dolduğunda ilk düşen şey oldu (aynı oturumda iki kez çiğnendi).
 *    Hatırlanması gereken şey, ÇALIŞTIRILAN komuta çevrildi.
 *
 * ⚠️ 2026-09-06 denetiminde üç kontrolün İKİSİNİN hiç çalışmadığı ölçüldü:
 *    bölüm atfı kontrolü var olmayan bir dosya adı arıyordu, PDF kontrolü
 *    var olmayan bir klasör yapısı arıyordu. "✓ temiz" çıktısı hiçbir şey
 *    kanıtlamıyordu. Üçü de bu depoda fiilen çalışacak biçimde yeniden yazıldı.
 *
 * Kullanım: node denetim.mjs [klasör]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, basename, dirname, relative } from "node:path";
import { execSync } from "node:child_process";

const kok = process.argv[2] || process.cwd();
const bulgular = [];

/**
 * Taranmayan klasörler.
 * ⚠️ `calisma-dokumanlari/` BURADA DEĞİL — ve bu bilinçli. Ajan o klasörü
 * OKUMAZ (bağlamı şişirir, kural taşımaz) ama betik onu DENETLER: kite bir
 * kural eklendiğinde çalışma notları bayat kalırsa kimse fark etmez.
 * "Okunmaz" ile "denetlenmez" ayrı şeylerdir.
 */
const ATLA = new Set(["node_modules", ".git"]);

function dosyalar(d, liste = []) {
  for (const ad of readdirSync(d)) {
    if (ATLA.has(ad) || ad.startsWith(".next")) continue;
    const p = join(d, ad);
    const st = statSync(p);
    if (st.isDirectory()) dosyalar(p, liste);
    else liste.push(p);
  }
  return liste;
}

const tumu = dosyalar(kok);
const hepsi = tumu.filter((p) => [".md", ".txt"].includes(extname(p)));
const adlar = new Set(hepsi.map((p) => basename(p)));

/**
 * ⭐ İLERİYE DÖNÜK REFERANSLAR — yanlış alarm üretmesin.
 * Bu dosyalar kurulumdan (/yeni-proje) SONRA oluşacak. Belgelerin onlara
 * atıf yapması doğrudur; "yok" demek yanlış alarm olur.
 *
 * ⛔ Standart dosyaları (00-…, 11-… gibi) BU LİSTEDE DEĞİL: onlar kitle
 * birlikte gelir, kurulumdan sonra da projede durur. Muaf tutulurlarsa
 * yanlış yazılmış bir standart adı hiç yakalanmaz.
 */
const gelecek = /^(CLAUDE|REPO-YAPISI|README|CHANGELOG|PRD|roadmap|data-model|veri-modeli|altyapi-durumu|integrations|ogrendiklerim|yeni-oturuma-ver|teknoloji-ve-plan|fake-data-guide|vscode-eklentileri|kurumdan-ogrenilecekler|OKUBENI|ADR-\d+.*)\.md$/;

/** Başlık ve atıf metnini karşılaştırılabilir hâle getirir. */
const norm = (s) =>
  s
    .replace(/[*_`"'“”„«»]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLocaleLowerCase("tr")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Atıfta anılan BÖLÜM adını sınırlı biçimde çıkarır.
 * Sıra: tırnak → vurgu → §N → çıplak metin (ilk sınırlayıcıya kadar).
 * ⚠️ Sınırlamazsan satırın kalanını yutar ve her atıf "kırık" görünür.
 */
function bolumAdi(kuyruk) {
  let m = kuyruk.match(/^\s*\*{0,2}[“"«]([^”"»\n]{2,80})[”"»]/u);
  if (m) return m[1];
  m = kuyruk.match(/^\s*(\*{1,2})([^*\n]{2,80})\1/u);
  if (m) return m[2];
  m = kuyruk.match(/^\s*(§\s*\d+[a-zçğıöşü]*)/u);
  if (m) return m[1];
  m = kuyruk.match(/^\s*([^\n,;:|)(*'’]{2,60}?)(?=\s*[,;:|)(*'’]|\s+—|\s+–|$)/mu);
  return m ? m[1] : null;
}

/** basename → [{ yol, basliklar }] — aynı adı taşıyan her dosya. */
const basliklar = new Map();
for (const p of hepsi) {
  const h = [];
  for (const m of readFileSync(p, "utf8").matchAll(/^#{1,6}\s+(.+)$/gm)) h.push(norm(m[1]));
  const b = basename(p);
  if (!basliklar.has(b)) basliklar.set(b, []);
  basliklar.get(b).push({ yol: relative(kok, p), basliklar: h });
}

/** Bir yolun üst düzey alanı: "skills", "docs", "calisma-dokumanlari"… */
const alan = (y) => (y.includes("/") ? y.split("/")[0] : ".");

/**
 * ⭐ Atıf hedefini YAKINLIĞA göre çöz.
 * Aynı adı taşıyan birden çok dosya olabilir (şablon `PRD.md` ile bir projenin
 * kendi `PRD.md`'si gibi). Yanlış eşleşme uydurma bulgu üretir:
 *   1) Aynı klasör → en güçlü aday
 *   2) Üst klasörlere doğru en yakın olan
 *   3) Aynı ÜST DÜZEY ALAN içindekiler
 * ⛔ Hiçbiri yoksa kontrol ATLANIR — başka bir alandaki aynı adlı dosyaya
 *    karşı denetlemek, ilgisiz iki belgeyi karşılaştırmak olur.
 */
function hedefiCoz(kaynakYol, hedefAd) {
  const adaylar = basliklar.get(hedefAd);
  if (!adaylar) return null;
  const kaynakDizin = dirname(kaynakYol);
  const ayni = adaylar.filter((a) => dirname(a.yol) === kaynakDizin);
  if (ayni.length) return ayni;
  let dizin = kaynakDizin;
  while (dizin && dizin !== "." && dizin !== "/") {
    const altta = adaylar.filter((a) => a.yol.startsWith(dizin + "/"));
    if (altta.length) return altta;
    dizin = dirname(dizin);
  }
  const ayniAlan = adaylar.filter((a) => alan(a.yol) === alan(kaynakYol));
  return ayniAlan.length ? ayniAlan : null;
}

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

  // 2) KIRIK BÖLÜM ATFI — `dosya.md` → "Başlık" deniyor ama o başlık hedefte yok
  //    Kural: 11-agent-workflow.md → "Aynı bilgi iki yerde yazılmaz"
  //    (*"Sadece dosya adı vermek yetmez; hangi başlık olduğu yazılır"*)
  for (const m of metin.matchAll(/`([\w./-]+\.md)`(?:['’][a-zçğıöşü]+)?\s*(?:→|->)/gu)) {
    const hedef = basename(m[1]);
    let ham = bolumAdi(metin.slice(m.index + m[0].length));
    if (!ham) continue;
    // ⭐ Türkçe çekim ekini kes: "E.9'a yeni alt bölüm" → "E.9".
    //    Kesilmezse ek, başlık adının parçası sanılır ve uydurma bulgu çıkar.
    const ek = ham.match(/^(§\s*\d+|BÖLÜM\s+[0-9A-ZÇĞİÖŞÜ]+|[A-ZÇĞİÖŞÜ]\.\d{1,2})['’]/u);
    if (ek) ham = ek[1];
    const bol = norm(ham);
    if (bol.length < 3) continue;
    const gruplar = hedefiCoz(relative(kok, p), hedef);
    if (!gruplar) continue;   // hedef yok ya da başka alanda → karşılaştırılmaz
    const sayi = ham.match(/^§\s*(\d+)/);
    // ⭐ "BÖLÜM E" / "E.4" biçimi: numaralı bölüm atfı — başlığın BAŞINDA aranır.
    //    teknoloji-ve-plan.md gibi numaralı belgelerde kod yorumları buraya atıf
    //    yapar; eski betiğin korumaya çalıştığı şey buydu (yanlış dosya adıyla).
    const bolum = /^(bölüm [0-9a-zçğıöşü]|[a-zçğıöşü] \d{1,2})$/u.test(bol);
    const bulundu = gruplar.some(({ basliklar: hs }) =>
      hs.some((h) =>
        sayi
          ? h.startsWith(`${sayi[1]} `) || h.startsWith(`${sayi[1]}.`)
          : bolum
            ? h.startsWith(`${bol} `) || h === bol
            : h.includes(bol) || bol.includes(h),
      ),
    );
    if (!bulundu) bulgular.push(["KIRIK BÖLÜM", yerel, `${hedef} → "${ham.trim()}" başlığı yok`]);
  }
}

// 3) BAYAT TÜRETİLMİŞ DOSYA — aynı adı taşıyan .md'den eski .pdf
//    ⚠️ Eski sürüm yalnızca _devir/md + _devir/pdf yapısına bakıyordu; bu depoda
//    o klasörler yok ve kontrol hiç çalışmıyordu. Artık türetilmiş dosya
//    NEREDE olursa olsun eşleştirilir.
const pdfler = new Map();
for (const p of tumu) if (extname(p) === ".pdf") pdfler.set(basename(p, ".pdf"), p);
for (const p of hepsi) {
  if (extname(p) !== ".md") continue;
  const pdf = pdfler.get(basename(p, ".md"));
  if (!pdf) continue;
  if (statSync(p).mtimeMs > statSync(pdf).mtimeMs + 1000)
    bulgular.push(["BAYAT PDF", relative(kok, pdf) || basename(pdf), "md daha yeni — yeniden üret"]);
}

// 4) İÇİNDEKİLER BAYAT MI — kite eklenen her dosya haritada görünür mü
//    ⭐ Bu kontrol yalnızca KİT DEPOSUNDA çalışır (ICINDEKILER.md varsa).
//    Kullanıcı projelerinde böyle bir dosya yok, kontrol sessizce atlanır.
//    ⛔ Gerekçe: harita, yeni dosya eklendiğinde elle güncellenmeye bırakılırsa
//    ilk eklemede bayatlar ve kimse fark etmez. Hatırlamaya dayalı kural düşer.
const haritaYolu = join(kok, "ICINDEKILER.md");
if (existsSync(haritaYolu)) {
  const harita = readFileSync(haritaYolu, "utf8");
  // ⭐ Yalnızca DEPOYA GİREN dosyalar aranır. Yerel yazışma ve üretilen
  //    belgeler (.gitignore'daki) haritada olmak zorunda değildir.
  let izlenen = null;
  try {
    izlenen = new Set(
      execSync("git ls-files", { cwd: kok, encoding: "utf8" }).split("\n").filter(Boolean),
    );
  } catch {
    /* git yoksa dosya sistemine düşülür */
  }
  for (const dosyaYolu of tumu) {
    const bagil = relative(kok, dosyaYolu);
    if (izlenen && !izlenen.has(bagil)) continue;
    if (!/\.(md|mjs)$/.test(bagil)) continue;
    const ad = basename(bagil);
    if (ad === "ICINDEKILER.md") continue;
    if (!harita.includes(ad))
      bulgular.push(["İÇİNDEKİLER", ad, "ICINDEKILER.md'de yok — haritaya satır ekle"]);
  }
}

// 5) BAYAT SÜRÜM DAMGASI — belgede yazan sürüm plugin.json ile aynı mı
//    ⛔ Kullanıcı rehberleri "Sürüm: X.Y.Z" taşır. Kit değişip damga kalırsa
//    okuyan, elindeki belgenin güncel olduğunu SANIR — en pahalı bayatlık türü.
//    ⚠️ Sayıyı güncellemek belgeyi okumak demektir; damgayı körlemesine
//    artırmak kuralı değil, görüntüsünü korur.
const pluginYolu = join(kok, ".claude-plugin", "plugin.json");
if (existsSync(pluginYolu)) {
  const gercek = JSON.parse(readFileSync(pluginYolu, "utf8")).version;
  // ⭐ Yalnızca MAJOR.MINOR karşılaştırılır, yama sürümü değil.
  //    Gerekçe: yama = düzeltme, rehberi yeniden okutmaz. Minor = YENİ KURAL,
  //    rehber gözden geçirilmeli. Her yamada damga zorlamak, kontrolü
  //    körlemesine basılan bir mühre çevirirdi.
  const dal = (v) => v.split(".").slice(0, 2).join(".");
  // ⭐ KIT-SURUM damgası TAM sürümle eşleşir (yama dahil): onu belge değil KANCA okur;
  //    geride kalırsa her yeni proje "kopyan geride" uyarısıyla doğar.
  const damga = join(kok, "skills", "yeni-proje", "dosyalar", "docs", "standards", "KIT-SURUM");
  if (existsSync(damga) && readFileSync(damga, "utf8").trim() !== gercek)
    bulgular.push(["BAYAT SÜRÜM", "KIT-SURUM", `${readFileSync(damga, "utf8").trim()} yazıyor, kit ${gercek} — damgayı plugin.json ile eşitle`]);
  for (const p of hepsi) {
    const m = readFileSync(p, "utf8").match(/^\*\*Sürüm:\*\*\s*([0-9]+\.[0-9]+\.[0-9]+)/m);
    if (m && dal(m[1]) !== dal(gercek))
      bulgular.push(["BAYAT SÜRÜM", basename(p), `${m[1]} yazıyor, kit ${gercek} — belgeyi GÖZDEN GEÇİR, sonra damgayı güncelle`]);
  }
}

// 6) ŞABLON HEDEFİ — şablonun KENDİ beyanı ile onu anan tablolar tutuyor mu
//    ⛔ NEDEN VAR: 2026-09-09'da "defterler `docs/kullanici/` altına gider"
//    kararı alındı ama yalnızca İKİ tabloya işlendi; `SKILL.md` Adım 2'ye,
//    `OKUBENI.md` girişine ve `16`'nın iki özet cümlesine işlenmedi. Sapma
//    2026-09-11'deki ilk gerçek kurulumda ortaya çıktı: iki defter yanlış
//    klasöre açıldı, sonra taşındı. Hiçbir kontrol bunu ölçmüyordu.
//
//    ⭐ ÇÖZÜM İKİ PARÇALI: (a) her şablon kendi hedefini başındaki
//    `ŞABLON —` satırında BEYAN EDER, (b) o beyan tek doğru kaynaktır ve
//    şablonu anan her tablo satırı ona uymak zorundadır. Beyan yoksa yanlış
//    listeye itiraz eden hiçbir şey olmaz — kök sebep tam olarak buydu.
//
//    ⚠️ SINIR: serbest metindeki iddia ölçülemez (liste maddesi satırlara
//    yayılır, hedef başka satırda durur). Bu yüzden hedef bilgisi TABLOYA
//    taşındı; tablo satırı tek satırdır ve makine okuyabilir.
const sablonDizin = tumu
  .map((x) => dirname(relative(kok, x)))
  .find((d) => d.endsWith("/sablonlar") || d.endsWith("/sablonlar/decisions"));
if (sablonDizin) {
  const kokDizin = sablonDizin.replace(/\/decisions$/, "");
  const sablonlar = hepsi.filter((x) => relative(kok, x).startsWith(kokDizin + "/"));
  /** şablon adı → beyan ettiği klasör ("docs/project" | "docs/kullanici") */
  const beyan = new Map();
  for (const x of sablonlar) {
    const ad = basename(x);
    if (ad === "OKUBENI.md") continue;              // klasörün indeksi, projeye gitmez
    const satir = readFileSync(x, "utf8").match(/^\s*(?:<!--\s*)?ŞABLON\s*—.*$/mu);
    const klasor = satir && satir[0].match(/`?(docs\/(?:project|kullanici))\//u);
    if (!klasor) {
      bulgular.push(["ŞABLON BEYANI", ad, "başında `ŞABLON — <hedef>` satırı yok — hedefi hiçbir yerden doğrulanamaz"]);
      continue;
    }
    beyan.set(ad, klasor[1]);
  }

  // Beyanı, şablonu anan HER tablo satırıyla karşılaştır.
  for (const x of hepsi) {
    for (const satir of readFileSync(x, "utf8").split("\n")) {
      if (!satir.trimStart().startsWith("|")) continue;          // yalnızca tablo satırı
      const klasorler = new Set(
        [...satir.matchAll(/docs\/(project|kullanici)\//gu)].map((m) => `docs/${m[1]}`),
      );
      if (!klasorler.size) continue;                             // hedef iddiası yok
      for (const [ad, dogru] of beyan) {
        if (!satir.includes("`" + ad + "`") && !satir.includes("/" + ad + "`")) continue;
        if (!klasorler.has(dogru))
          bulgular.push([
            "ŞABLON HEDEFİ",
            basename(x),
            `${ad} → satırda ${[...klasorler].join(" + ")} yazıyor, şablonun kendi beyanı ${dogru}`,
          ]);
      }
    }
  }
}


// 7) BENZER CÜMLE — aynı kural iki dosyada başka kelimelerle yazılmış mı
//    ⛔ Gerekçe: birebir kopya nadiren olur; tehlike, aynı kuralın iki yerde
//    farklı cümleyle durmasıdır — biri güncellenir, diğeri bayatlar (2026-09-14:
//    "en az biri" üç dosyada üç ayrı cümleydi; 2026-09-18: iki anlatım bölümü
//    yan yana). Kural: aynı bilgi bir yerde durur, diğeri ona işaret eder.
//    Ölçüm: 90–400 karakterlik cümleler, 4-kelimelik dizi (shingle) kesişimi
//    ≥ %75 ve farklı dosya → bulgu. Tablo satırı, kod bloğu ve yorum dışarıda.
//    Kapsam: standartlar, çekirdek/tetikleyiciler, SKILL, şablon, kit-hakkinda.
//    calisma-dokumanlari ve defterler dışarıda (kişisel not, tekrar doğaldır).
{
  const kapsam = hepsi.filter((p) => {
    const y = relative(kok, p);
    if (/calisma-dokumanlari|sablonlar\/(calisilacak|ogrendigim)|README|KURULUM|LICENSE|TARTISILMIS/.test(y)) return false;
    return /docs\/standards|\.claude\/rules|yeni-proje\/SKILL|PROJEYE-CLAUDE|kit-hakkinda|CALISMA-KILAVUZU|ICINDEKILER|kit-senkron\/SKILL/.test(y);
  });
  const cumleler = [];
  for (const p of kapsam) {
    let t = readFileSync(p, "utf8").replace(/```[\s\S]*?```/g, " ").replace(/<!--[\s\S]*?-->/g, " ");
    t = t.split("\n").filter((l) => !l.trim().startsWith("|")).join(" ");
    t = t.replace(/[*_`>#|]/g, " ").replace(/\s+/g, " ");
    for (const c of t.split(/(?<=[.!?])\s+/)) {
      const s = c.trim();
      if (s.length < 90 || s.length > 400) continue;
      const w = (s.toLocaleLowerCase("tr").match(/[\p{L}\p{N}]+/gu) || []);
      const sh = new Set();
      for (let i = 0; i + 4 <= w.length; i++) sh.add(w.slice(i, i + 4).join(" "));
      if (sh.size >= 6) cumleler.push({ p: relative(kok, p), s, sh });
    }
  }
  const idx = new Map();
  cumleler.forEach((c, i) => c.sh.forEach((g) => { if (!idx.has(g)) idx.set(g, []); idx.get(g).push(i); }));
  const ciftler = new Map();
  for (const ids of idx.values()) {
    if (ids.length > 40) continue;
    const u = [...new Set(ids)].sort((a, b) => a - b);
    for (let a = 0; a < u.length; a++) for (let b = a + 1; b < u.length; b++) {
      if (cumleler[u[a]].p === cumleler[u[b]].p) continue;
      const k = u[a] + ":" + u[b]; ciftler.set(k, (ciftler.get(k) || 0) + 1);
    }
  }
  const raporlanan = new Set();
  for (const [k, ortak] of ciftler) {
    const [a, b] = k.split(":").map(Number);
    const oran = ortak / Math.min(cumleler[a].sh.size, cumleler[b].sh.size);
    if (oran < 0.75) continue;
    const anahtar = [cumleler[a].p, cumleler[b].p].sort().join(" ⇄ ");
    if (raporlanan.has(anahtar + cumleler[a].s.slice(0, 40))) continue;
    raporlanan.add(anahtar + cumleler[a].s.slice(0, 40));
    bulgular.push(["BENZER CÜMLE", anahtar, `%${Math.round(oran * 100)} — "${cumleler[a].s.slice(0, 90)}…" — biri kalır, diğeri işaret eder`]);
  }
}

// ── Rapor ───────────────────────────────────────────────────────────────────
if (!bulgular.length) {
  // ⛔ Mesaj, FİİLEN koşan kontrolleri sayar. Kontrol eklenip bu satır
  //    güncellenmezse çıktı yaptığından azını söyler ve okuyan yanlış güvenir.
  console.log(
    "✓ Denetim temiz — yedi kontrol geçti: kırık referans · kırık bölüm atfı ·\n" +
      "  bayat PDF · haritada görünmeyen dosya · bayat sürüm damgası ·\n" +
      "  şablon hedefi (beyan ↔ tablolar) · benzer cümle (aynı kural iki yerde).",
  );
  process.exit(0);
}
console.log(`⚠️ ${bulgular.length} bulgu:\n`);
const genislik = Math.max(...bulgular.map((b) => b[0].length));
for (const [tur, dosya, aciklama] of bulgular)
  console.log(`  ${tur.padEnd(genislik)}  ${dosya}  →  ${aciklama}`);
console.log("\n⛔ Commit'ten önce bunlar giderilir veya gerekçesi söylenir.");
process.exit(1);
