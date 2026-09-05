# 01 — Mimari ve Klasör Yapısı

## Katmanlar (yukarıdan aşağıya, tek yön)

```
UI (React bileşeni)
   ↓ sadece veri ister, iş kuralı bilmez
API katmanı (route handler)   → doğrulama (Zod) + auth + HTTP çevirisi
   ↓
Servis katmanı (iş mantığı)   → kurallar burada. "Aynı gün ikinci randevu alınamaz" burada
   ↓
Repository katmanı (Prisma)   → sadece veri erişimi. İş kuralı içermez
   ↓
Veritabanı
```

**Kural:** Katman atlanmaz. Bileşen içinden Prisma çağrılmaz. Route handler içine
iş mantığı yazılmaz. Servis katmanı `Request`/`Response` nesnesi tanımaz.

## ⭐ BİR İSTEĞİN TAM YOLU — kim ne yapar, ORM nerede durur

Katman listesi *hangi kutuların olduğunu* söyler; bu bölüm **bir isteğin
baştan sona nereden geçtiğini** ve her durakta kimin sorumlu olduğunu.

```
İstemci → API → Servis → Repository → ORM (Prisma) → SQL → PostgreSQL
   │        │       │          │            │
tarayıcı  ────── senin yazdığın kod ────  kütüphane   veritabanı
mobil                                     (kurulur,
                                        yazılmaz)
```

⛔ **Repository ile ORM aynı şey DEĞİLDİR.** Repository senin yazdığın bir
dosyadır (`randevu.repository.ts`); ORM onun **kullandığı** pakettir. Şemada
*"Repository (Prisma)"* biçiminde birleştirilmesi yaygın bir hatadır ve katman
sınırını görünmez kılar.

### Durak durak — randevu oluşturma örneği

| # | Durak | Ne yapar | Ne YAPMAZ |
|---|---|---|---|
| 1 | **İstemci** | `POST /api/randevular` ile gövdeyi gönderir | İş kuralı bilmez |
| 2 | **API katmanı**<br>`*.controller.ts` / `route.ts` | Zod ile gövdeyi doğrular · kimliği çözer · servisi çağırır · sonucu HTTP'ye çevirir (201/422) | ⛔ İş kuralı **yazılmaz** |
| 3 | **Servis katmanı**<br>`*.service.ts` | Kuralları uygular: çalışma saati içinde mi · aynı gün ikinci randevu var mı · slot dolu mu | ⛔ `req`/`res` **tanımaz**, HTTP kodu döndürmez |
| 4 | **Repository katmanı**<br>`*.repository.ts` | ORM'e ne isteneceğini söyler: `prisma.randevu.create({ data })` | ⛔ Tek bir `if` bile **bulunmaz** |
| 5 | **ORM (Prisma)** | Çağrıyı SQL'e, dönen satırı nesneye çevirir — **iki yönlü eşleme** | Karar vermez, kural bilmez |
| 6 | **PostgreSQL** | SQL'i çalıştırır, satırı döndürür | — |

Cevap aynı yoldan **geri tırmanır**: repository nesneyi döndürür → servis
döndürür → API onu HTTP yanıtına çevirir.

### ORM ne demek, somut olarak

**ORM / Object-Relational Mapping / nesne-ilişki eşleme** — koddaki nesneler
ile veritabanı tabloları arasında çeviri yapan kütüphane. Repository'de şunu
yazarsın:

```ts
prisma.randevu.create({ data: { doktorId: "d-42", tarih: "2026-09-10" } })
```

Prisma bunu şuna çevirir ve veritabanına o gider:

```sql
INSERT INTO "Randevu" ("doktorId","tarih") VALUES ('d-42','2026-09-10') RETURNING *;
```

Dönen satırı da geri çevirip TypeScript nesnesi olarak verir. Adındaki
*"eşleme"* bu çift yönlü çeviridir.

### ⛔ İKİ YAYGIN YANLIŞ ANLAMA

**1. "ORM gelen isteği doğrular."** Hayır. İki ayrı şey karışıyor:

| Ne doğrulanır | Ne zaman | Kim yapar |
|---|---|---|
| Gelen **isteğin** içeriği | Çalışma anında, her istekte | **Zod** |
| **Kodun** tabloyla uyumu | Derleme anında, sen yazarken | **TypeScript**, Prisma'nın ürettiği tiplerden |

Olmayan bir alana yazmaya çalışırsan proje **derlenmez** — hata kullanıcıya
değil sana çıkar. Ama bu bir çalışma anı kontrolü değil, tip sisteminin işidir.

**2. "Gerekirse migration istek sırasında çalışır."** ⛔ **Asla.** Migration /
şema göçü veritabanının **yapısını** değiştirir (tablo açmak, sütun eklemek,
index koymak) ve yukarıdaki okun üstünde **hiç yer almaz**:

| Ne zaman | Komut |
|---|---|
| Şemayı değiştirdiğinde, kendi bilgisayarında | `prisma migrate dev` |
| Yayına alırken, bir kez | `prisma migrate deploy` |

*Gerekçe:* ani yükte 20.000 isteğin her birinin veritabanı yapısını değiştirmeye
kalkması felaket olurdu. Yapı **önceden** hazırdır; istekler yalnızca veri
okur ve yazar.

## ⭐ BU KOD HANGİ KATMANA AİT — pratik test

*"Route handler'a iş mantığı yazılmaz"* kuralı, **iş mantığının ne olduğu**
bilinmeden uygulanamaz. Yazmak üzere olduğun koda şunu sor:

| Soru | Cevabı "evet" ise |
|---|---|
| İçinde **if/else, döngü veya hesap** var mı? | **Servis** |
| Bir **karar** veriyor mu — *"bu izin verilir mi"*, *"tutar ne olur"*? | **Servis** |
| İşin bir **kuralını** uyguluyor mu? | **Servis** |
| Sadece veri **okuyup yazıyor** mu (`findMany`, `create`, `update`)? | **Repository** |
| Gelen isteği **doğruluyor**, yetki bakıyor, HTTP koduna çeviriyor mu? | **API** |
| Ekranda bir şey **gösteriyor** mu? | **UI** |

### Ayırt edici cümle
Servis **"ne yapılmalı"** sorusunu cevaplar · Repository **"nereden alınır"** ·
API **"kim istedi, cevabı nasıl döneriz"** · UI **"nasıl görünür"**.

### Aynı iş, üç katmana bölünmüş

```
API           → Zod ile gövdeyi doğrula · oturumdan kullanıcıyı al
                · servisi çağır · sonucu 201 olarak dön
                (⛔ burada "aynı gün ikinci randevu" kontrolü YAPILMAZ)

Servis        → Çalışma saati içinde mi?  ← karar
                Aynı gün başka randevu var mı?  ← kural
                Yoksa hata fırlat; varsa repository'yi çağır
                (⛔ burada `res.status(400)` YAZILMAZ — servis HTTP bilmez)

Repository    → prisma.randevu.create({ data })
                (⛔ burada tek bir if bile OLMAZ)
```

⚠️ **Repository'de `if` görürsen kural sızmıştır**, servise taşı.
⚠️ **Serviste `req`/`res` görürsen HTTP sızmıştır**, API'ye taşı.
Bu iki sızıntı, katman ihlalinin en sık iki biçimidir.

### ⛔ "KÜÇÜK PROJEDE BİRLEŞTİRİLEBİLİR" — DEĞERLENDİRİLDİ, REDDEDİLDİ

Yaygın tavsiye şudur: *"prototip veya hafta sonu projesinde API ve iş mantığı
aynı dosyaya yazılabilir, hantallıktan kaçınılır."* **Bu kitte geçerli değildir.**

*Gerekçe — tavsiyenin dayanağı çökmüştür:* birleştirmenin klasik sebebi
**geliştiricinin yazma süresiydi**. Üç dosya açmak, üç kez `import` yazmak
zaman alıyordu. Kod bir ajan tarafından yazıldığında bu maliyet **sıfırdır** —
üç dosya da bir dosya da aynı sürede oluşur. Ödünleşmenin maliyet tarafı
kalktı, fayda tarafı (bakım, test edilebilirlik, **anlaşılabilirlik**) aynen
duruyor.

İkinci gerekçe: bu kitin amacı yalnızca çalışan kod değil, **sahiplenilen**
koddur (`02-coding-standards.md` → *"Kod, okuyamayan biri için de anlaşılır
olur"*). Katmanların birleştirilmesi, kodu anlaşılır kılan sınırları tam da
siler.

⛔ **"Bu proje küçük" bir istisna gerekçesi değildir.** Küçük projelerin çoğu
küçük kalmaz; kalanlarda da maliyet zaten sıfırdı.

⚠️ Gerçek bir istisna çıkarsa (ölçülmüş bir sebep, bu ikisinden birini
çürüten bir durum) ajan **önerir ve gerekçelendirir**; kullanıcı karar verir
ve karar **ADR'ye** yazılır. Sessizce birleştirilmez.

## Klasör yapısı — özellik bazlı

```
src/
├── app/
│   ├── (public)/          → login gerektirmeyen sayfalar
│   ├── (protected)/       → login zorunlu sayfalar
│   ├── api/<kaynak>/      → route handler'lar
│   ├── layout.tsx
│   └── page.tsx
├── features/<özellik>/    → HER ÖZELLİK KENDİ KLASÖRÜNDE
│   ├── components/
│   ├── services/          → iş mantığı
│   ├── repositories/      → Prisma erişimi
│   ├── schemas/           → Zod şemaları
│   └── types.ts
├── components/ui/         → paylaşılan tasarım sistemi bileşenleri
├── lib/                   → auth, db client, http, cache, utils
└── config/                → sabitler, env okuma (tek yerden)
```

## Ayrı backend varsa — monorepo yapısı

Karar kuralı `00-stack.md` → "Backend kurgusu"nda. Ayrı backend seçildiyse
**tek git deposu** kullanılır (monorepo), pnpm workspaces + Turborepo ile.

```
apps/
├─ web/       → Next.js (yalnızca arayüz — Prisma'yı GÖRMEZ)
├─ api/       → NestJS (HTTP API)
├─ worker/    → NestJS (arka plan işleri, HTTP dinlemez)
└─ mobile/    → Expo (varsa)
packages/
├─ contracts/ → Zod şemaları + türetilen tipler — web, api, mobile buradan okur
└─ domain/    → saf iş kuralları (Prisma/Nest/HTTP bilmez)
```

⚠️ **Monorepo ≠ monolit.** Monorepo *kodun nerede durduğu*, monolit *programın
nasıl çalıştığı* hakkındadır. Bunlar bağımsız eksenlerdir.

**Polyrepo (ayrı depolar) neden değil:** ortak tipler özel bir npm paketi
olarak yayınlanmak zorunda kalır; her değişiklikte sürüm yükselt–yayınla–güncelle
döngüsü gelir ve iki depo arasında **sürümler kaçınılmaz olarak ayrışır.** Tek
mantıklı olduğu durum: depoların farklı ekiplere ve farklı yayın takvimlerine
ait olması.

### ⛔ Tip ve şema TEK yerde tanımlanır

Aynı veri şeklini iki projede ayrı ayrı yazmak yasaktır. Sebep somut: API'de
bir alanın adı değişir, diğer taraf güncellenmeyi unutur, **TypeScript hata
vermez** (kendi kopyasına bakıyordur) ve hata çalışma anında ekranda `undefined`
olarak çıkar.

Kural: şema `packages/contracts` içinde **bir kez** tanımlanır; API alanı
değiştiğinde tüketen taraf **derlenmez.** Hata ekrana değil, derleyiciye düşer.

## Servis yaşam döngüleri (ayrı backend varsa)

| Nest | .NET karşılığı | Ne zaman |
|---|---|---|
| `DEFAULT` (singleton) | `Singleton` | Durumsuz servisler: yapılandırma, sistem saati, politika sınıfları, mapper |
| `REQUEST` | `Scoped` | İsteğe özel veri: aktif kullanıcı, correlation ID |
| `TRANSIENT` | `Transient` | Nadir — gerekçesiz kullanılmaz |

⛔ **İstek bazlı veri singleton serviste tutulmaz.** Tutulursa iki kullanıcının
verisi karışır: *Ali'nin isteği Veli'nin bilgisiyle işlenir.* Bu hata tek
kullanıcılı testte **hiç görünmez**, yük altında ortaya çıkar ve kurumsal bir
sistemde yanlış kişinin verisini göstermek — yani KVKK ihlali — demektir.

⛔ **Captive dependency:** scoped bir servis singleton içine enjekte edilmez;
singleton onu ilk istekteki hâliyle dondurur.

**Aktif kullanıcı ve sistem saati** doğrudan statik yapılardan okunmaz;
`nestjs-cls` (AsyncLocalStorage) ve `Clock` soyutlaması üzerinden gelir —
her istek kendi izole bağlamında yaşar, ikisi de test edilebilir.
Arka plan işlerinde HTTP bağlamı **yoktur**; iş kendi bağlamını kurar.

## İsimlendirme
- Klasör ve dosya: `kebab-case` (`appointment-service.ts`)
- React bileşen dosyası: `PascalCase.tsx`
- Değişken/fonksiyon: `camelCase` · Tip/Interface: `PascalCase` · Sabit: `UPPER_SNAKE`
- Tüm kod isimleri **İngilizce**. Kullanıcıya görünen metinler Türkçe.

## Boyut sınırları
Dosya > 300 satır → böl. Fonksiyon > 50 satır → böl. İç içe if > 3 seviye → erken return.

## Veri akışı kuralları
- Sunucu bileşeni varsayılandır; `"use client"` sadece etkileşim gerekiyorsa.
- Gizli anahtar veya iş kuralı istemciye gönderilmez.
- Dış API çağrıları **sunucu tarafında** yapılır ve cache'lenir.
