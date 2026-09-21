# Projeye `CLAUDE.md` oluşturmak için ŞABLON

> ⛔ **BU DOSYA BURADA ÇALIŞMAZ.** Kitin içinde dururken hiçbir şey yapmaz;
> yalnızca kopyalanacağı içeriği taşır. Adı bunu söylesin diye böyle.
>
> ⭐ **Kurulumda ne olur:** bu dosya projenin **köküne** kopyalanır, adı
> **`CLAUDE.md`** olur ve `docs/standards/` ile `.claude/rules/` de yanına
> kopyalanır (`16-yeni-proje-kurulumu.md`). Claude Code üçünü de kendisi yükler:
> `CLAUDE.md` + `.claude/rules/00-cekirdek.md` her oturumda; `.claude/rules/`
> altındaki diğerleri **yalnızca ilgili dosya türü açılınca** (`paths`).
>
> ⛔ Bu dosya **kısa** kalır (hedef < 60 satır): davranış kuralları çekirdekte,
> standartlar `docs/standards/`ta. Buraya kural yazmak, çekirdeği çoğaltmaktır.
> Projeye özel hiçbir bilgi (amaç, sayfa, iş kuralı) da buraya yazılmaz —
> onlar `docs/project/PRD.md` içindedir.

---

## 0. Proje Değişkenleri

```
PROJE ADI      : <ad>
PROJE TİPİ     : <web | mobil | web + mobil (ortak API)>
MOD            : <kendi projem | işyeri projesi (kurum: <ad>)> — SKILL.md Adım 1a
KURGU          : <[A] yalnızca arayüz | [B] Next tek başına | [C] Next + NestJS | [D] yalnızca API — 00-stack.md "DÖRT KURGU">
STACK          : <fiilen kurulan stack — detayı docs/standards/00-stack.md>
DEPLOY         : <kendi: Vercel + Neon + GitHub Actions | kurum: Yol C — GitLab, test + canlı, DevOps>
ANA DAL        : main
DİL (arayüz)   : Türkçe
DİL (kod)      : <kendi projem: İngilizce · işyeri + kurumun Türkçe DB standardı: Türkçe (Türkçe karaktersiz) — 02-coding-standards.md> · commit mesajı her modda İngilizce
PAKET YÖNETİCİSİ: <pnpm | npm — kurum hattı hangisini koşturuyorsa>
```

**Varsayılan stack** (aksini söylemezsen bu kurulur):
Next.js App Router + TypeScript (strict) + Tailwind + shadcn/ui + Prisma +
PostgreSQL + Zod · kendi projede Vercel + Neon + GitHub Actions · kurumda
Next + NestJS, kurumun Postgres'i, GitLab · mobil varsa Expo (aynı REST API).

## 1. Kurallar nerede — ve nasıl yükleniyor

| Ne | Nerede | Nasıl yüklenir |
|---|---|---|
| Davranış kuralları (rol, anlatım, kapılar, commit, asla yapma) | `.claude/rules/00-cekirdek.md` | Her oturum, kendiliğinden |
| Alan tetikleyicileri (kod · veritabanı · api · güvenlik · arayüz · test · yayın · mobil) | `.claude/rules/<alan>.md` | O tür dosya açılınca, kendiliğinden |
| Standartların tamamı (kural + gerekçe + örnek) | `docs/standards/00…18` | Tetikleyici ya da çekirdekteki tablo gönderince açılır |
| Bu projeye özel her şey | `docs/project/` (PRD, roadmap, ADR, altyapı, kurumdan öğrenilecekler) | Çekirdekteki "hangi soru → hangi dosya" tablosu |
| Kullanıcının defterleri | `docs/kullanici/` | Her oturum başında anlatım düzeyi için okunur |
| Kopyanın kit sürümü | `docs/standards/KIT-SURUM` | Açılış kancası okur; gerideyse `/kit-senkron` sorar |

⛔ Çekirdekle bu dosya çelişirse çekirdek kazanır; çelişkiyi bildir, ikisini de
düzelt (`/kit-senkron`).
