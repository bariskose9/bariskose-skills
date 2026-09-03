# 10 — Definition of Done

Bir iş, aşağıdaki maddelerin **tamamı** işaretlenmeden "bitti" sayılmaz.
"Sonra yaparız", "küçük değişiklik", "zaten çalışıyor" geçerli mazeret değildir.

## İşlevsellik
- [ ] PRD'deki kabul kriterlerinin hepsi karşılandı
- [ ] Mutlu yol baştan sona çalışıyor
- [ ] Hata yolları çalışıyor (geçersiz girdi, yetkisiz erişim, boş sonuç)
- [ ] Login olmadan erişimde beklenen davranış doğru (salt okuma / yönlendirme)

## Kod
- [ ] `lint` temiz, `typecheck` temiz, `build` başarılı
- [ ] `any` yok, ölü kod yok, konsol çıktısı bırakılmadı
- [ ] Katman ihlali yok (bileşen içinden DB çağrısı yok)

## Test
- [ ] Yeni davranış için test yazıldı ve geçiyor
- [ ] Hata düzeltmesiyse önce başarısız test yazıldı
- [ ] Tüm test paketi yeşil

## Güvenlik
- [ ] Girdi doğrulama var (Zod)
- [ ] Yetki + sahiplik kontrolü var
- [ ] Hata mesajı iç detay sızdırmıyor
- [ ] Yeni secret varsa `.env.example` güncellendi, `.env` commit edilmedi
- [ ] `npm audit` yeni kritik uyarı üretmiyor

## Arayüz
- [ ] Tarayıcıda 375px ve masaüstünde düzgün
- [ ] **Preview URL gerçek telefondan açılıp denendi** (dokunma, klavye, kaydırma)
      — *bunu ajan işaretleyemez.* Ajan, commit raporunun "telefon testi" satırında
      hangi adımların denenmesi gerektiğini yazar; kutuyu **kullanıcı** işaretler
- [ ] Dark mode ve light mode ikisinde de okunabilir
- [ ] Yükleniyor / boş / hata durumları var
- [ ] Klavye ile gezilebiliyor, kontrast yeterli
- [ ] Kullanıcıya görünen tüm metinler Türkçe ve anlaşılır
- [ ] Tasarım yönü ADR'sine uyuluyor; AI varsayılanlarına düşülmedi
      (`07-ui-design-system.md` → *AI varsayılanı*)
- [ ] Animasyon varsa `prefers-reduced-motion` destekleniyor, yalnızca
      `transform`/`opacity` animasyonlanıyor

## SEO — yalnızca indekslenecek sayfalarda (`18-seo.md`)
- [ ] JavaScript'siz gelen HTML'de ana içerik var (`curl` ile bakıldı)
- [ ] Sayfanın kendine özgü `title` + `description`'ı ve canonical adresi var
- [ ] Tek `h1`, başlık seviyesi atlanmıyor
- [ ] `sitemap.xml` bu sayfayı içeriyor (ya da bilerek dışarıda)
- [ ] Yapılandırılmış veri varsa sayfada görünenle **aynı**

## Tarayıcı doğrulaması
- [ ] Akış gerçekten tıklanarak denendi (kod okuyup varsaymak yeterli değil)
- [ ] Konsolda hata yok, network'te başarısız istek yok

## Beş gözle doğrulama (`06-testing.md`)
- [ ] Backend · Veri · Frontend · Tasarım/UX · Güvenlik gözlerinin **beşi de** geçildi
- [ ] **Etki alanı** yazıldı: hangi ekranlar, hangi API uçları, hangi eski kayıtlar
- [ ] Etkilenen yerlerden **en az biri fiilen açılıp** kontrol edildi
- [ ] Kullanıcıya *ne kontrol edildi ve neden* anlatıldı; yeni terimler
      `ogrendiklerim.md`'ye eklendi

## Teslim
- [ ] Commit raporu sunuldu ve onaylandı
- [ ] PR açıldı, CI yeşil, preview URL doğrulandı
- [ ] Mimari karar alındıysa ADR yazıldı
- [ ] Bilinen eksikler açıkça bildirildi (sessizce bırakılmadı)
