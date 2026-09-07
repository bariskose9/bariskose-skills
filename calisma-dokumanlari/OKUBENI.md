# Çalışma Dökümanları — bu klasör ne

> ⛔ **AJAN BU KLASÖRÜ OKUMAZ.** Buradaki hiçbir dosya kural değildir ve hiçbir
> projeye kopyalanmaz. Ajanın uyacağı kurallar
> `skills/yeni-proje/dosyalar/docs/standards/` altındadır.
>
> Bu klasör **Barış'ın okuması, çalışması ve hatırlaması** için var. Bağlam
> penceresini şişirmemesi için kasıtlı olarak kitin dışında tutulmuştur.

**Son güncelleme:** 2026-09-06

---

## Hangi dosya ne işe yarıyor

| Dosya | Ne anlatır | Ne zaman açılır |
|---|---|---|
| **`docs/KIT-REHBER.md`** (kit deposunda) | Kit ne yapıyor, sekiz adımlık akış, 19 standardın kapsamı, ajan kapıları, terim sözlüğü, kitin nerede durduğu | *"Kit tam olarak ne yapıyordu"* dediğinde |
| **`2-teknoloji-kartlari.md`** | Her teknoloji ne işe yarar, gerçek hayat örnekleriyle. Hangi durumda ne kullanılır. Bir isteğin uçtan uca yolu | Bir teknolojiyi anlamadığında · yeni projeye başlarken |
| **`ornek-proje-bakim-is-emri/`** | Uçtan uca yapılmış bir projenin bütün belgeleri | *"Bu gerçekte nasıl yazılıyordu"* dediğinde |

## Nereden başlamalı

**Kiti hatırlamak istiyorsan** → `docs/KIT-REHBER.md` (bu klasörde değil, kit deposunda)

**Bir teknolojiyi öğrenmek istiyorsan** → `2-teknoloji-kartlari.md`
Sırası önemli değil, kart kart okunur. Ama ilk kez okuyorsan **BÖLÜM Ö** ile
başla — hangi durumda neyin kullanıldığını orada topladık.

**Gerçek bir örnek görmek istiyorsan** → `ornek-proje-bakim-is-emri/`
Okuma sırası: `odev.md` (ne istendi) → `PRD-taslak.md` (neye dönüştü) →
`veri-modeli-ve-sahte-veri-plani.md` (veri nasıl kuruldu) →
`proje-teknoloji-ve-plan.md` (hangi teknoloji neden) →
`sunum-anlatim-plani.md` (nasıl anlatılır)

---

## ⚠️ Bu belgeler eskir

Kit her hafta değişiyor; bu klasör kitin **anlatımı**, kendisi değil. Çelişki
olursa **`docs/standards/` kazanır** — orası kuralın kaynağıdır, burası
açıklamadır.

Bir çelişki fark edersen söyle, o dosyayı güncellerim.

---

## Örnek projede ne var

`ornek-proje-bakim-is-emri/` — bir **teknik değerlendirme çalışması** için
uçtan uca hazırlanmış belgeler. Kurumun istediği stack C# / .NET / ASP.NET
Core Web API / React'ti; gerekçesi yazılarak Next.js + NestJS'e çevrildi.
Bu yüzden aynı zamanda *"kurum stack dayatırsa ne olur"* sorusunun canlı örneği.

| Dosya | Ne |
|---|---|
| `odev.md` | Kurumun verdiği şartname — girdi belgesi |
| `PRD-taslak.md` | Şartnamenin ürün gereksinim belgesine dönüşmüş hâli |
| `veri-modeli-ve-sahte-veri-plani.md` | Tablolar, ilişkiler, index kararları, KVKK envanteri, sahte veri planı |
| `proje-teknoloji-ve-plan.md` | **Tam hâli** — teknoloji kartları + o projeye özel bölümler + yapım planı |
| `sunum-anlatim-plani.md` | Teknik sunumda ne, hangi sırayla anlatılır |
| `KURUMDAN-OGRENECEKLERIM.md` | Kuruma sorulacaklar — isimlendirme kuralları, DevOps sınırı, kapsam |
| `YENI-OTURUM.md` | O projeyi devralan oturum için devir notu |
