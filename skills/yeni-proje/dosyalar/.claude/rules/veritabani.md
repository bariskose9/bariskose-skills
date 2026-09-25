---
paths:
  - "prisma/**"
  - "**/*.prisma"
  - "**/*repository*.ts"
  - "database/**"
  - "**/migrations/**"
---
# Veritabanı dosyalarında — şema, migration, veri

`docs/standards/04-database.md` bağlayıcıdır; kural adları aşağıda.

- Adlandırma köprüsü `@map` / `@@map` — **ilk migration'dan önce**; kurum
  modunda kod da tablo da Türkçe (`04-database.md` → *"İsimlendirme"*).
- PK: kendi projede UUIDv7, kurumda `BIGINT GENERATED ALWAYS AS IDENTITY`
  (Prisma `BIGSERIAL` üretir → migration SQL'i elle düzeltilir); dışa açılan
  kayıtta `public_id` (`04-database.md` → *"BİRİNCİL ANAHTAR"*).
- Sabit değer kümesi iki soruyla (`04-database.md` → *"SABİT DEĞER KÜMESİ"*):
  iş biriminin yönettiği liste her modda tanım tablosu; kodun listesi kurumda
  tanım tablosu (`code` kolonu) + `as const` + eşleşme testi, kendi projede
  Prisma `enum`.
- Prisma 7: bağlantı adresi `prisma.config.ts`'te (şemada `url` → P1012),
  üretici `prisma-client` + `output`, çalışma anında `@prisma/adapter-pg`;
  `migrate dev` istemciyi üretmez → ardından `prisma generate`
  (`04-database.md` → *"Prisma 7 düzeni"*).
- Migration aracı moda göre: kendi projede Prisma Migrate; kurumda Prisma
  Client + `V__`/`R__`/`U__` SQL + koşucu, CI'da `migrate diff --exit-code`
  (`04-database.md` → *"MIGRATION ARACI"*). Migration istek hattında **hiç** yer almaz.
- Şema elle değiştirilmez; veri silen migration ayrı PR + onay; geriye uyumlu
  adımlar (önce ekle, sonra düşür). Prisma Migrate dosyayı tek işlemde koşmaz:
  yarım kalan migration'da (P3009) önce veritabanının hâline bakılır.
- Audit: before-image JSONB, INSERT-only, **tek noktadan otomatik** (Prisma
  extension / interceptor), aynı transaction; elle `audit.write()` yasak
  (`04-database.md` → *"Denetim kaydı"*).
- Kişisel veri: `*_encrypted BYTEA` + aranacaksa `*_hash` (tuzlu HMAC, unique);
  şifreli kolonda `LIKE` yok (`14-privacy-and-compliance.md` → *"Kişisel veriyi şifreli saklamak"*).
- Soft delete varsayılan değil; tablo tablo karar, filtre tek noktadan.
- Yabancı anahtar ve unique index veritabanında zorlanır; `onDelete` her
  ilişkide açık (Prisma varsayılanı isteğe bağlıda `SET NULL`); FK kolonuna
  `@@index` elle; zaman kolonu `@db.Timestamptz(3)`; para `Decimal`; N+1 yasak;
  transaction kısa, içinde dış çağrı yok.
- Seed idempotent ve açıkça sahte; Prisma Studio üretime bağlanmaz.
- Metin arama gerçek veriyle ölçülür; `unaccent` gibi eklenti kurumda sorulur.
