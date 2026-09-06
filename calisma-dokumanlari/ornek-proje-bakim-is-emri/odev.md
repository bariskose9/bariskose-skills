# Yazılım Geliştirici Teknik Değerlendirme Çalışması

> **Bu dosya `odev.docx`'in okunabilir kopyasıdır.** Word dosyası VS Code'da
> açılmaz (ikili dosya). İçerik birebir aynıdır, yalnızca biçimlendirilmiştir.
> ⛔ **Gerçeğin kaynağı `odev.docx`'tir** — çelişki olursa o kazanır.

---

## 1. Çalışmanın Amacı

Bu çalışma, mevcut teknik bilgi seviyenizi ve bir yazılım projesini uçtan uca geliştirebilme yetkinliğinizi değerlendirmek amacıyla hazırlanmıştır.

Bu çalışma bir eğitim ödevi değildir. Hazır bir mimariyi, veri tabanı şemasını veya kod iskeletini tamamlamanız beklenmemektedir. Verilen iş ihtiyacını analiz etmeniz, teknik kararları vermeniz, uygulama mimarisini oluşturmanız ve çalışan bir sistem teslim etmeniz beklenmektedir.

Değerlendirme sırasında özellikle aşağıdaki alanlardaki yetkinliğiniz incelenecektir:

- C# ve .NET hâkimiyeti
- ASP.NET Core Web API geliştirme
- React ile frontend geliştirme
- Nesne yönelimli programlama
- Proje mimarisi
- SOLID prensipleri
- DRY prensibi
- Tasarım desenlerinin doğru kullanımı
- Factory Pattern
- Entity Framework Core
- PostgreSQL
- Veri tabanı modelleme
- DBML ile şema dokümantasyonu
- Dependency Injection ve servis yaşam döngüleri
- Mapping işlemleri
- Hangfire ve zamanlanmış görevler
- Docker ve Docker Compose
- Git kullanımı
- Unit test ve integration test geliştirme
- Hata yönetimi
- Transaction ve concurrency yönetimi
- Kod kalitesi ve teknik dokümantasyon

Çalışan bir uygulama teslim edilmesi tek başına yeterli değildir. Teslim edilen kodun, mimari kararların ve kullanılan tekniklerin tarafınızdan açıklanabilmesi beklenmektedir.

## 2. Proje Konusu

- Bakım ve İş Emri Yönetim Sistemi

Bir kurumun farklı lokasyonlarında bulunan cihaz, ekipman, araç ve diğer varlıklarının bakım ve arıza süreçlerini yöneten bir web uygulaması geliştirmeniz beklenmektedir.

Sistem üzerinden:

- Kuruma ait lokasyonlar yönetilebilmelidir.
- Lokasyonlara bağlı varlıklar yönetilebilmelidir.
- Varlıklar için arıza, bakım veya kontrol talepleri oluşturulabilmelidir.
- Oluşturulan talepler iş emrine dönüştürülebilmelidir.
- İş emirleri uygun personele atanabilmelidir.
- İş emirlerinin durumları takip edilebilmelidir.
- İş emirlerine yorum ve işlem kaydı eklenebilmelidir.
- İş emri geçmişi görüntülenebilmelidir.
- İş emirleri için SLA süreleri hesaplanabilmelidir.
- Yaklaşan ve geçen SLA süreleri sistem tarafından takip edilebilmelidir.
- Kullanıcılara sistem içi bildirim oluşturulabilmelidir.
- Yönetim ekranında temel operasyon istatistikleri gösterilebilmelidir.

Projenin kapsamı aşağıdaki bölümlerde açıklanmıştır. Belirtilmeyen teknik detaylarda tutarlı ve gerekçelendirilebilir kararlar vermeniz beklenmektedir.

## 3. Kullanılması Zorunlu Teknolojiler

- Backend
- Güncel ve desteklenen bir .NET sürümü
- ASP.NET Core Web API
- C#
- Entity Framework Core
- PostgreSQL
- FluentValidation
- Hangfire
- AutoMapper veya Mapster
- OpenAPI
- Scalar veya Swagger
- Frontend
- React
- JavaScript veya TypeScript
- Vite
- React Router
- Test
- xUnit, NUnit veya MSTest
- Tercih edilen bir assertion kütüphanesi
- PostgreSQL ile çalışan integration test altyapısı
- Altyapı
- Docker
- Docker Compose
- Git

Tercih edilen paketlerin ve teknik yaklaşımların neden kullanıldığı açıklanabilmelidir.

## 4. Kullanıcı Rolleri

Sistemde en az aşağıdaki roller bulunmalıdır:

- Yönetici
- Kullanıcıları yönetebilir.
- Lokasyonları yönetebilir.
- Varlıkları yönetebilir.
- Tüm iş emirlerini görüntüleyebilir.
- İş emirlerini atayabilir.
- İş emri durumlarını değiştirebilir.
- Yönetim raporlarını görüntüleyebilir.
- Operasyon Sorumlusu
- Talepleri ve iş emirlerini görüntüleyebilir.
- İş emri oluşturabilir.
- İş emirlerini teknik personele atayabilir.
- İş emri önceliğini yönetebilir.
- İş emri durumlarını takip edebilir.
- Teknik Personel
- Kendisine atanmış iş emirlerini görüntüleyebilir.
- İş emri üzerinde çalışmaya başlayabilir.
- İş emrine yorum ekleyebilir.
- İş emrini beklemeye alabilir.
- İş emrini çözüldü durumuna getirebilir.
- Yaptığı işlemleri açıklayabilir.
- Talep Oluşturan Kullanıcı
- Yeni arıza veya bakım talebi oluşturabilir.
- Kendi oluşturduğu talepleri görüntüleyebilir.
- Talebin ve iş emrinin mevcut durumunu takip edebilir.

Rol isimleri değiştirilebilir. Ancak yetkilerin ve sorumlulukların birbirinden ayrılması beklenmektedir.

## 5. Temel Modüller

### 5.1 Kimlik Doğrulama ve Yetkilendirme

Sistemde kullanıcı girişi bulunmalıdır.

Beklenenler:

- JWT tabanlı authentication
- Refresh token yönetimi
- Role-based authorization
- Pasif kullanıcıların sisteme girişinin engellenmesi
- Token sürelerinin konfigürasyon üzerinden yönetilmesi
- Şifrelerin güvenli şekilde saklanması
- Yetkisiz ve yasaklı erişimlerin doğru HTTP durum kodlarıyla karşılanması

Gerçek kullanıcı bilgileri veya secret değerler source control içerisine eklenmemelidir.

### 5.2 Lokasyon Yönetimi

Kurumun farklı lokasyonları yönetilebilmelidir.

Lokasyonlar için en az aşağıdaki işlemler bulunmalıdır:

- Listeleme
- Detay görüntüleme
- Oluşturma
- Güncelleme
- Aktif veya pasif duruma alma

Pasif bir lokasyonda yeni varlık veya yeni iş emri oluşturulmasına izin verilmemelidir.

### 5.3 Varlık Yönetimi

Lokasyonlara bağlı cihaz, ekipman, araç veya diğer varlıklar yönetilebilmelidir.

Varlıklar için:

- Listeleme
- Filtreleme
- Detay görüntüleme
- Oluşturma
- Güncelleme
- Durum değiştirme

işlemleri bulunmalıdır.

Her varlığın:

- Bağlı olduğu lokasyon
- Varlık türü
- Kurum içerisindeki tanımlayıcı bilgileri
- Kritiklik seviyesi
- Operasyonel durumu
- Bakım bilgileri

takip edilebilmelidir.

Kullanım dışı veya emekliye ayrılmış bir varlık için yeni iş emri oluşturulup oluşturulamayacağı bir iş kuralı olarak ele alınmalıdır.

### 5.4 Talep ve İş Emri Yönetimi

Sistemde kullanıcılar arıza, bakım, kontrol, kurulum veya benzeri talepler oluşturabilmelidir.

Talep veya iş emrinde en az aşağıdaki bilgiler bulunmalıdır:

- İlgili lokasyon
- İlgili varlık
- Talebi oluşturan kullanıcı
- İş emri türü
- Başlık
- Açıklama
- Öncelik
- Mevcut durum
- Atanan teknik personel
- Oluşturulma zamanı
- Son işlem zamanı
- SLA bitiş zamanı
- Çözüm bilgisi

İş emrinin sistem içerisinde benzersiz ve kullanıcı tarafından okunabilir bir numarası bulunmalıdır.

İş emri numarasının nasıl üretileceği tarafınızdan tasarlanmalıdır.

## 6. İş Emri Durum Yönetimi

İş emirlerinin durumları kontrolsüz şekilde değiştirilememelidir.

Sistemde en az aşağıdaki durumlar bulunmalıdır:

- Açık
- Atandı
- İşlemde
- Parça veya dış işlem bekliyor
- Çözüldü
- Kapatıldı
- İptal edildi

Durum isimleri değiştirilebilir. Ancak durumların iş akışındaki anlamları açık olmalıdır.

En az aşağıdaki kurallar uygulanmalıdır:

- Atanmamış bir iş emri işleme alınamamalıdır.
- İş emri yalnızca teknik personel rolüne sahip bir kullanıcıya atanabilmelidir.
- İş emri çözüldü durumuna alınırken çözüm açıklaması girilmelidir.
- Kapatılmış bir iş emri normal güncelleme işlemleriyle değiştirilememelidir.
- İptal edilmiş bir iş emri üzerinde işlem yapılamamalıdır.
- Her durum değişikliği geçmiş kaydı oluşturmalıdır.
- Atama ve görevden alma işlemleri geçmiş kayıtlarıyla takip edilmelidir.
- Geçersiz durum geçişleri backend tarafında engellenmelidir.
- Durum değişikliği ile geçmiş kaydı aynı işlem bütünlüğü içerisinde gerçekleştirilmelidir.

Durum geçiş kurallarının controller veya endpoint içerisinde dağınık koşul bloklarıyla yönetilmesi beklenmemektedir.

## 7. SLA Yönetimi ve Factory Pattern

Factory Pattern kullanılması zorunludur.

Factory Pattern, iş emrine uygulanacak SLA politikasının belirlenmesinde kullanılmalıdır.

SLA politikasının belirlenmesinde en az aşağıdaki bilgiler dikkate alınmalıdır:

- İş emri önceliği
- Varlığın kritiklik seviyesi
- İş emri türü

Sistemde en az aşağıdaki öncelik seviyeleri bulunmalıdır:

- Düşük
- Normal
- Yüksek
- Kritik

Her SLA politikası en az aşağıdaki bilgileri hesaplayabilmelidir:

- İş emrinin tamamlanması gereken son zaman
- İlk hatırlatma zamanı
- Escalation zamanı

Her öncelik seviyesi veya iş kuralı için uygun SLA davranışlarının ayrı sınıflarda ele alınması beklenmektedir.

Factory kullanımında aşağıdaki konulara dikkat edilmelidir:

- SLA seçme koşulları sistemin farklı bölümlerine dağılmamalıdır.
- Yeni bir SLA politikası eklendiğinde mevcut kodda mümkün olduğunca az değişiklik yapılmalıdır.
- Factory, Service Locator olarak kullanılmamalıdır.
- Factory yalnızca göstermelik bir sınıf olmamalıdır.
- Factory ve SLA politikaları unit testlerle doğrulanmalıdır.
- Tasarım Open/Closed Principle ile uyumlu olmalıdır.

SLA sürelerini ve hesaplama kurallarını tarafınızdan belirlemeniz beklenmektedir. Belirlediğiniz kurallar dokümante edilmelidir.

## 8. SOLID Prensipleri

Projenin tamamında SOLID prensiplerine uyulması zorunludur.

Özellikle aşağıdaki durumlara dikkat edilmelidir:

- Controller veya endpoint sınıflarında iş kuralları bulunmamalıdır.
- Tek bir servis, sistemdeki bütün işlemlerden sorumlu olmamalıdır.
- Birbirinden bağımsız işlemler aşırı geniş interface’ler içerisinde toplanmamalıdır.
- Domain ve application katmanları altyapı detaylarına doğrudan bağımlı olmamalıdır.
- Yeni bir iş kuralının eklenmesi mevcut kodun büyük ölçüde değiştirilmesini gerektirmemelidir.
- Interface uygulamaları tanımlanan kontratları bozmamalıdır.
- Sistem saati, kullanıcı bilgisi ve dış servisler abstraction üzerinden kullanılmalıdır.
- Domain katmanı Entity Framework Core, Hangfire veya ASP.NET Core bağımlılıklarını bilmemelidir.

SOLID prensiplerinin yalnızca dokümantasyonda açıklanması değil, kod tabanında uygulanması beklenmektedir.

## 9. DRY Prensibi

Projede tekrarlanan iş kurallarından ve tekrarlanan teknik kodlardan kaçınılmalıdır.

Aşağıdaki türde tekrarlar oluşmamalıdır:

- Aynı validasyonun farklı endpointlerde tekrar yazılması
- Durum geçiş kontrollerinin farklı servislerde tekrar edilmesi
- Aynı mapping işlemlerinin farklı sınıflarda bulunması
- Aynı hata response yapısının controllerlarda tekrar oluşturulması
- Audit alanlarının her işlemde ayrı ayrı doldurulması
- Aynı filtreleme ve sayfalama kodlarının farklı endpointlere kopyalanması
- Aynı bildirim oluşturma kurallarının farklı background joblarda tekrar edilmesi

DRY prensibi uygulanırken gereksiz ve anlamsız abstraction oluşturulmamalıdır.

## 10. Proje Mimarisi

Projenin mimarisi tarafınızdan tasarlanmalıdır.

Aşağıdaki mimari yaklaşımlardan biri tercih edilebilir:

- Clean Architecture
- Onion Architecture
- Katmanlı mimari
- Vertical Slice Architecture
- Modüler monolit

Başka bir yaklaşım da kullanılabilir. Ancak tercih edilen mimarinin gerekçelendirilmesi ve proje genelinde tutarlı şekilde uygulanması gerekir.

Aşağıdaki sorumlulukların birbirinden ayrılması beklenmektedir:

- Domain modelleri ve domain kuralları
- Application use case’leri
- Veri erişimi ve altyapı implementasyonları
- API endpointleri
- Background job işlemleri
- Mapping
- Validasyon
- Authentication ve authorization

Proje yapısının yalnızca klasör isimlerinden ibaret olmaması gerekir. Katmanlar arasındaki bağımlılık yönleri teknik olarak korunmalıdır.

## 11. Veri Tabanı Tasarımı

Hazır bir veri tabanı şeması verilmeyecektir.

Projenin veri modelini iş gereksinimlerine göre tasarlamanız beklenmektedir.

Veri tabanı olarak PostgreSQL kullanılmalıdır.

Veri tabanı tasarımı kurum tarafından iletilen veri tabanı geliştirme ve isimlendirme kurallarına uygun olmalıdır.

Bu kapsamda:

- Tablo yapıları
- Kolonlar
- Primary keyler
- Foreign keyler
- Unique constraintler
- Indexler
- Nullable alanlar
- Audit alanları
- Soft delete kullanımı
- Cascade davranışları
- Enumların saklanma biçimi
- Concurrency yaklaşımı
- Tarih ve saat saklama yaklaşımı
- İşlem geçmişi tabloları
- Bildirim tekrarlarını engelleyen yapılar

tarafınızdan tasarlanmalıdır.

Veri modelinizin DBML formatında hazırlanması zorunludur.

Zorunlu dosya:

- docs/database.dbml

DBML dosyası ile Entity Framework Core migrationları birbiriyle uyumlu olmalıdır.

Veri tabanı kararları ayrıca dokümante edilmelidir.

Dokümantasyonda en az aşağıdaki kararlar açıklanmalıdır:

- Tabloların ve ilişkilerin neden bu şekilde tasarlandığı
- Hangi alanlara index eklendiği
- Composite index tercihleri
- Enumların nasıl saklandığı
- Soft delete kullanılan yapılar
- Silme davranışları
- Audit yaklaşımı
- Concurrency yönetimi
- Tarih ve saat standardı
- İş emri numarası üretme yöntemi
- Bildirim tekrarlarını önleme yöntemi

Hazır bir şemayı veya bu çalışmayla ilgisiz mevcut bir projeyi uyarlamak yerine, verilen iş ihtiyacına göre veri modeli oluşturmanız beklenmektedir.

## 12. Entity Framework Core

Entity Framework Core kullanılması zorunludur.

Aşağıdaki konuların doğru uygulanması beklenmektedir:

- DbContext yapılandırması
- Fluent API
- Entity configuration sınıfları
- Migration yönetimi
- İlişki tanımları
- Unique ve composite indexler
- Delete behavior
- Transaction yönetimi
- Optimistic concurrency
- Async sorgular
- CancellationToken
- AsNoTracking
- Projection
- Sayfalama
- Filtreleme
- Sıralama
- N+1 probleminin önlenmesi
- Gereksiz Include kullanımından kaçınılması

Entity konfigürasyonlarının tek ve büyük bir OnModelCreating bloğu içerisinde toplanması beklenmemektedir.

- Repository Kullanımı

Repository Pattern zorunlu değildir.

Repository kullanılması durumunda:

- Kullanım gerekçesi açıklanmalıdır.
- Entity Framework Core’un mevcut yetenekleri gereksiz şekilde sınırlandırılmamalıdır.
- Her entity için birbirinin aynısı generic CRUD servisleri oluşturulmamalıdır.
- Unit of Work ile DbContext arasındaki ilişki açıklanabilmelidir.
- IQueryable kullanımının katmanlar arasındaki etkisi değerlendirilmelidir.

Pattern kullanmış görünmek amacıyla eklenen yapılar olumlu değerlendirilmeyecektir.

## 13. Mapping

AutoMapper veya Mapster kullanılması zorunludur.

En az aşağıdaki mapping işlemleri bulunmalıdır:

- Entity’den listeleme DTO’suna dönüşüm
- Entity’den detay DTO’suna dönüşüm
- API request modelinden application modeline dönüşüm
- Sorgu sonucunun doğrudan response modeline projection edilmesi

Kurallar:

- Entityler doğrudan API response olarak dönülmemelidir.
- Mapping içerisinde iş kuralı çalıştırılmamalıdır.
- Hassas bilgiler response modellerine taşınmamalıdır.
- Mapping konfigürasyonları modüler şekilde oluşturulmalıdır.
- Mapping konfigürasyonlarının doğruluğu test edilmelidir.
- Listeleme işlemlerinde bütün tablo belleğe alınarak mapping yapılmamalıdır.

Seçtiğiniz mapping aracını ve tercih nedeninizi açıklamanız beklenmektedir.

## 14. Dependency Injection ve Service Lifecycle

Dependency Injection doğru şekilde kullanılmalıdır.

Aşağıdaki yaşam döngülerine hâkimiyet değerlendirilecektir:

- Transient
- Scoped
- Singleton

Projenizde kullandığınız temel servislerin hangi yaşam döngüsüyle kaydedildiğini ve nedenini dokümante etmeniz beklenmektedir.

Özellikle aşağıdaki konular değerlendirilecektir:

- DbContext yaşam döngüsü
- Application service yaşam döngüsü
- Mapper yaşam döngüsü
- Factory yaşam döngüsü
- Current user servisi
- Sistem saati servisi
- Hangfire job servisleri
- Background worker içerisindeki scope yönetimi
- Disposable servislerin yönetimi
- Scoped servisin singleton servis içerisinde tutulmaması
- Singleton servislerde request bazlı mutable veri tutulmaması
- Captive dependency oluşturulmaması
- Service Locator yaklaşımından kaçınılması

Dokümantasyonda aşağıdaki servisler için lifetime tablosu hazırlanmalıdır:

- DbContext
- Application servisleri
- Mapper
- SLA Factory
- Current user servisi
- Sistem saati
- Hangfire job servisleri
- Kullanılan diğer önemli servisler

Her tercih gerekçelendirilmelidir.

## 15. Hangfire ve Zamanlanmış Görevler

Hangfire kullanılması zorunludur.

Hangfire verileri PostgreSQL üzerinde saklanmalıdır.

En az aşağıdaki job türleri uygulanmalıdır:

- SLA Hatırlatma Görevi

Bir iş emri oluşturulduğunda veya SLA zamanı değiştiğinde ileri bir tarih için job planlanmalıdır.

Job:

- İlgili iş emrini kontrol etmelidir.
- İş emri hâlen aktifse bildirim oluşturmalıdır.
- İş emri kapanmışsa işlem yapmamalıdır.
- Aynı hatırlatmanın birden fazla kez oluşturulmasını engellemelidir.
- SLA İhlali Kontrol Görevi

Belirli aralıklarla çalışan recurring job geliştirilmelidir.

Job:

- SLA zamanı geçmiş ve hâlen açık olan iş emirlerini bulmalıdır.
- İş emrini SLA ihlali olarak işaretlemelidir.
- İlgili kullanıcılara bildirim oluşturmalıdır.
- Tekrar çalıştığında duplicate bildirim üretmemelidir.
- Çalışma sonucunu loglamalıdır.
- Günlük Operasyon Özeti

Her gün çalışan bir recurring job geliştirilmelidir.

Özet içerisinde en az aşağıdaki bilgiler bulunmalıdır:

- Açık iş emri sayısı
- SLA ihlali bulunan iş emri sayısı
- Kritik iş emri sayısı
- Gün içerisinde tamamlanan iş emri sayısı
- Teknik personel bazında aktif iş yükü

Özetin veri tabanına kaydedilmesi veya yapılandırılmış log olarak oluşturulması tercih edilebilir.

- Arşiv Adayı Belirleme

Belirli bir süreden daha eski kapatılmış iş emirlerini arşiv adayı olarak belirleyen bir recurring job hazırlanmalıdır.

Fiziksel silme yapılması zorunlu değildir.

- Hangfire Kuralları
- Joblar idempotent olmalıdır.
- Job parametresi olarak büyük nesneler yerine tanımlayıcı değerler kullanılmalıdır.
- Retry durumları değerlendirilmelidir.
- Aynı jobın eş zamanlı çalışması dikkate alınmalıdır.
- Duplicate işlem ve bildirimler engellenmelidir.
- Job hataları loglanmalıdır.
- Job içerisinde HTTP request context’e güvenilmemelidir.
- Jobların kullandığı scoped servisler doğru scope içerisinde çözülmelidir.
- Job çalışmaları test edilmelidir.
- Hangfire Dashboard yetkisiz erişime açık bırakılmamalıdır.
- Jobların timezone davranışı açıklanmalıdır.

## 16. Bildirim Yönetimi

Kullanıcılara sistem içi bildirim oluşturulmalıdır.

Bildirimler en az aşağıdaki olaylarda üretilebilmelidir:

- Yeni iş emri atandığında
- İş emrinin durumu değiştiğinde
- SLA hatırlatma zamanı geldiğinde
- SLA ihlali oluştuğunda
- İş emrine yorum eklendiğinde

Kullanıcı:

- Bildirimlerini listeleyebilmeli
- Okunmamış bildirimleri görebilmeli
- Bir bildirimi okundu olarak işaretleyebilmeli
- Tüm bildirimleri okundu olarak işaretleyebilmelidir

Aynı sistem olayının tekrar işlenmesi durumunda duplicate bildirim oluşması engellenmelidir.

## 17. Listeleme, Filtreleme ve Sayfalama

İş emri listeleme ekranı server-side filtreleme, sıralama ve sayfalama kullanmalıdır.

En az aşağıdaki filtreler desteklenmelidir:

- Metin araması
- Lokasyon
- Varlık
- Atanan teknik personel
- İş emri türü
- Öncelik
- Durum
- SLA ihlali
- Oluşturulma tarihi aralığı
- SLA bitiş tarihi aralığı

Listeleme response’u en az aşağıdaki bilgileri içermelidir:

- Kayıtlar
- Mevcut sayfa
- Sayfa boyutu
- Toplam kayıt sayısı
- Toplam sayfa sayısı
- Sonraki sayfa bilgisi
- Önceki sayfa bilgisi

Kurallar:

- Filtreleme veri tabanı seviyesinde yapılmalıdır.
- Bütün kayıtlar belleğe alındıktan sonra filtreleme yapılmamalıdır.
- Varsayılan ve maksimum sayfa boyutu bulunmalıdır.
- Geçersiz sıralama alanları kontrol edilmelidir.
- Metin aramasının PostgreSQL üzerinde nasıl gerçekleştirildiği açıklanmalıdır.
- Sorgular için gerekli indexler veri modelinde değerlendirilmelidir.

## 18. Validasyon

FluentValidation kullanılması zorunludur.

Hem request formatları hem de iş kuralları doğrulanmalıdır.

Örnek validasyonlar:

- Zorunlu alanların boş bırakılmaması
- Alan uzunluklarının kontrol edilmesi
- Geçersiz enum değerlerinin engellenmesi
- Pasif lokasyonda işlem yapılmaması
- Uygun olmayan varlık durumunda iş emri oluşturulmaması
- Atanan kullanıcının aktif ve teknik personel olması
- Tarih aralıklarının tutarlı olması
- Çözüm açıklamasının gerekli durumlarda zorunlu olması
- Geçersiz durum geçişlerinin engellenmesi

Request validasyonu ile domain invariant arasındaki ayrım doğru yapılmalıdır.

Veri tabanı erişimi gerektiren kontrollerin hangi katmanda gerçekleştirildiği açıklanabilmelidir.

## 19. Hata Yönetimi

Uygulamada merkezi hata yönetimi bulunmalıdır.

Controller veya endpointlerde tekrar eden try/catch blokları kullanılmamalıdır.

Hata response’ları standart ve tutarlı bir formatta dönülmelidir.

En az aşağıdaki hata türleri ayrıştırılmalıdır:

- Validasyon hatası
- Kayıt bulunamadı
- Çakışma
- Yetkisiz erişim
- Yasaklı işlem
- İş kuralı ihlali
- Concurrency hatası
- Beklenmeyen sunucu hatası

Hata response’larında uygun durumlarda aşağıdaki bilgiler bulunmalıdır:

- HTTP durum kodu
- Hata başlığı
- Açıklama
- Uygulama hata kodu
- Trace veya correlation ID
- Alan bazlı validasyon hataları

Production ortamında stack trace kullanıcıya dönülmemelidir.

## 20. Transaction ve Concurrency

Birbiriyle ilişkili veri tabanı işlemleri uygun transaction sınırları içerisinde gerçekleştirilmelidir.

En az aşağıdaki işlemler transaction açısından değerlendirilmelidir:

- İş emri oluşturma ve ilk geçmiş kaydının oluşturulması
- İş emri atama ve atama geçmişinin oluşturulması
- İş emri durum değişikliği ve durum geçmişinin oluşturulması
- SLA ihlali işaretleme ve bildirim oluşturma
- Refresh token yenileme ve eski tokenın geçersiz hâle getirilmesi

Aynı iş emrinin birden fazla kullanıcı tarafından eş zamanlı güncellenmesi ele alınmalıdır.

Optimistic concurrency yaklaşımı uygulanmalıdır.

Concurrency çakışmalarında API’nin uygun bir conflict response’u üretmesi beklenmektedir.

Her işlem için gereksiz manuel transaction açılmamalıdır. Transaction sınırları bilinçli şekilde belirlenmelidir.

## 21. Audit ve Sistem Bağımlılıkları

Uygun kayıtlarda en az aşağıdaki audit bilgilerinin takip edilmesi beklenmektedir:

- Oluşturulma zamanı
- Oluşturan kullanıcı
- Güncellenme zamanı
- Güncelleyen kullanıcı

Audit alanlarının merkezi bir yaklaşımla yönetilmesi beklenmektedir.

Her servis veya handler içerisinde aynı audit kodunun tekrar yazılması uygun değildir.

Sistem saati ve mevcut kullanıcı bilgisi doğrudan statik yapılardan alınmamalıdır.

Bu bağımlılıkların abstraction üzerinden yönetilmesi beklenmektedir.

## 22. React Uygulaması

Frontend uygulaması React ile geliştirilmelidir.

Arayüzün ileri seviye görsel tasarıma sahip olması zorunlu değildir. Ancak sistemin temel özelliklerini kullanılabilir şekilde sunmalıdır.

En az aşağıdaki ekranlar bulunmalıdır:

- Giriş
- Dashboard
- İş emri listesi
- Yeni iş emri oluşturma
- İş emri detayı
- İş emri düzenleme
- Lokasyon listesi
- Varlık listesi
- Varlık detayı
- Bildirimler
- Yetkisiz erişim
- Bulunamadı
- İş Emri Listesi
- Server-side sayfalama
- Filtreleme
- Arama
- Sıralama
- Loading durumu
- Hata durumu
- Boş liste durumu
- Filtreleri temizleme
- Filtrelerin URL query parametreleriyle senkronizasyonu
- İş Emri Detayı
- İş emri bilgileri
- Lokasyon ve varlık bilgileri
- Atanan teknik personel
- SLA bilgileri
- SLA ihlal durumu
- Durum geçmişi
- Atama geçmişi
- Yorumlar
- Durum değiştirme
- Personel atama
- Yorum ekleme
- Frontend Teknik Beklentileri
- API çağrıları ortak bir katmanda yönetilmelidir.
- Tekrarlanan request kodlarından kaçınılmalıdır.
- Protected route kullanılmalıdır.
- Rol bazlı işlem görünürlüğü uygulanmalıdır.
- Backend validasyon hataları kullanıcıya gösterilmelidir.
- Formlar kontrollü şekilde yönetilmelidir.
- Token yenileme davranışı ele alınmalıdır.
- Büyük ve birden fazla sorumluluğa sahip componentlerden kaçınılmalıdır.
- State yönetimi tercihi açıklanmalıdır.

Hazır UI kütüphanesi kullanılabilir.

## 23. Test Beklentileri

Projede unit test, integration test ve architecture test bulunmalıdır.

- Unit Testler

En az aşağıdaki alanlar test edilmelidir:

- Factory Pattern
- SLA politikaları
- İş emri durum geçişleri
- Geçersiz durum geçişleri
- İş emri atama kuralları
- Çözüm açıklaması zorunluluğu
- Pasif lokasyon kuralları
- Kullanım dışı varlık kuralları
- Bildirim tekrarlarının engellenmesi
- SLA ihlali işleminin idempotent olması
- Kapalı iş emrinde background jobın işlem yapmaması
- Integration Testler

Integration testlerde gerçek PostgreSQL davranışı doğrulanmalıdır.

Testcontainers veya eşdeğer bir yaklaşım kullanılabilir.

En az aşağıdaki senaryolar test edilmelidir:

- Migrationların boş veri tabanına uygulanması
- Kullanıcı girişi
- Yetkilendirme
- İş emri oluşturma
- İş emri listeleme ve filtreleme
- Server-side sayfalama
- Unique constraint ihlali
- Foreign key ihlali
- Durum geçmişinin transaction içerisinde kaydedilmesi
- Concurrency conflict
- SLA ihlal jobı
- Aynı jobın tekrar çalışmasında duplicate bildirim oluşmaması
- Pasif lokasyonda işlem yapılamaması
- Merkezi hata yönetimi

EF Core InMemory provider, PostgreSQL integration testlerinin yerine kullanılmamalıdır.

- Architecture Testler

Katman bağımlılıklarını doğrulayan testler hazırlanmalıdır.

En az aşağıdaki kurallar test edilmelidir:

- Domain katmanı diğer katmanlara bağımlı olmamalıdır.
- Application katmanı Infrastructure katmanına bağımlı olmamalıdır.
- API katmanı entityleri doğrudan response olarak dönmemelidir.
- Controller veya endpointler Infrastructure implementasyonlarına doğrudan bağımlı olmamalıdır.
- Katmanların isimlendirme ve bağımlılık kuralları korunmalıdır.

Testlerde yalnızca başarılı senaryolar değil, negatif ve sınır durumları da ele alınmalıdır.

## 24. Docker ve Docker Compose

Projenin tamamı Docker Compose üzerinden çalıştırılabilmelidir.

En az aşağıdaki servisler bulunmalıdır:

- PostgreSQL
- Backend API
- Hangfire Worker
- Frontend

API ve Worker’ın aynı process içerisinde çalıştırılması tercih edilirse bu karar gerekçelendirilmelidir.

Beklenenler:

- Backend için multi-stage Docker build
- Environment variable kullanımı
- Secretların image içerisine yazılmaması
- PostgreSQL volume
- Health check
- .dockerignore
- Container başlangıç sırasının doğru yönetilmesi
- Migration stratejisinin açıklanması
- Development ve production farklarının açıklanması

Temel sistem aşağıdaki komutla çalıştırılabilmelidir:

- docker compose up --build

## 25. Health Check ve Logging

En az aşağıdaki health check endpointleri bulunmalıdır:

- GET /health/liveGET /health/ready

Readiness kontrolü PostgreSQL bağlantısını değerlendirmelidir.

Structured logging kullanılmalıdır.

Loglarda uygun durumlarda aşağıdaki bilgiler bulunmalıdır:

- Correlation ID
- Kullanıcı ID
- İş emri ID
- Request path
- İşlem süresi
- Job tipi
- Job sonucu
- Exception bilgisi

Şifre, access token, refresh token ve benzeri hassas bilgiler loglanmamalıdır.

Request body’nin tamamının kontrolsüz şekilde loglanması beklenmemektedir.

## 26. Git Kullanımı

Proje ilk geliştirme adımından itibaren Git ile takip edilmelidir.

Beklenenler:

- Projenin tamamının tek commit ile gönderilmemesi
- Commit geçmişinin geliştirme sürecini göstermesi
- Commit mesajlarının yapılan değişikliği açıklaması
- Secret değerlerin commitlenmemesi
- Migrationların source control içerisinde bulunması
- Gereksiz binary dosyaların commitlenmemesi
- Birbirinden ilgisiz büyük değişikliklerin tek committe birleştirilmemesi
- Sonradan yapay olarak oluşturulmuş commit geçmişi bulunmaması

Branch stratejisi tarafınızdan belirlenebilir.

En az bir Pull Request veya Merge Request açılması ve yapılan değişikliklerin açıklanması beklenmektedir.

## 27. CI Pipeline

GitHub Actions, GitLab CI veya eşdeğer bir CI pipeline hazırlanmalıdır.

Pipeline en az aşağıdaki işlemleri gerçekleştirmelidir:

- Backend dependency restore
- Backend build
- Unit testler
- Integration testler
- Architecture testleri
- Frontend dependency kurulumu
- Frontend build
- Docker image build

Code coverage, format kontrolü, lint ve güvenlik taramaları eklenebilir.

## 28. Agent ve Yapay Zekâ Kullanımı

Agent ve yapay zekâ araçlarının kullanılması serbesttir.

Kullanılabilecek araçlara örnek olarak:

- ChatGPT
- Claude
- Claude Code
- Cursor Agent
- GitHub Copilot
- Codex
- IDE agentları

verilebilir.

Agent kullanımı değerlendirme açısından olumsuz bir durum değildir.

Ancak teslim edilen bütün kodun sorumluluğu size aittir.

Aşağıdaki konularda yeterli olmanız beklenmektedir:

- Teslim ettiğiniz kodu açıklayabilmek
- Mimari kararları savunabilmek
- Agent tarafından üretilen hataları tespit edebilmek
- Gereksiz abstractionları ayırt edebilmek
- Kullanılan paketlerin amacını açıklayabilmek
- Güvenlik ve performans etkilerini değerlendirebilmek
- Canlı inceleme sırasında kod üzerinde değişiklik yapabilmek
- Agent çıktısını inceleyip düzeltebilmek

Proje kökünde aşağıdaki dosya bulunmalıdır:

- AI_USAGE.md

Bu dosyada:

- Kullanılan araçlar
- Araçların hangi aşamalarda kullanıldığı
- Agentın ürettiği kodlarda yapılan önemli değişiklikler
- Agentın yanlış veya eksik ürettiği en az bir örnek
- Çıktıların nasıl doğrulandığı
- Mimari kararların nasıl verildiği

açıklanmalıdır.

“Agent böyle oluşturdu” açıklaması teknik kararların sorumluluğunu ortadan kaldırmaz.

## 29. Teknik Dokümantasyon

Projede en az aşağıdaki dokümanlar bulunmalıdır:

README.mdAI_USAGE.mddocs/database.dbmldocs/database-decisions.mddocs/architecture.mddocs/api.mddocs/testing.mddocs/lifecycle.mddocs/background-jobs.mddocs/decisions/

- README

README içerisinde en az aşağıdaki bilgiler bulunmalıdır:

- Projenin amacı
- Kullanılan teknolojiler
- Kurulum adımları
- Docker ile çalıştırma
- Docker olmadan çalıştırma
- Migration çalıştırma
- Testleri çalıştırma
- Environment variable listesi
- Development kullanıcıları
- Bilinen eksikler
- Varsayımlar
- Architecture Dokümanı
- Seçilen mimari yaklaşım
- Katmanların sorumlulukları
- Katman bağımlılıkları
- Request lifecycle
- Background job lifecycle
- Transaction sınırları
- Authentication ve authorization yaklaşımı
- Mapping yaklaşımı
- Architecture Decision Record

En az üç önemli teknik karar ADR olarak hazırlanmalıdır.

Örnek kararlar:

- Mimari yaklaşım seçimi
- Repository kullanma veya kullanmama kararı
- Mapping kütüphanesi seçimi
- Hangfire Worker mimarisi
- Concurrency yaklaşımı
- Enum saklama yöntemi
- Authentication yaklaşımı

## 30. Teslim Beklentileri

Teslim içerisinde en az aşağıdakiler bulunmalıdır:

- Çalışan backend uygulaması
- Çalışan React uygulaması
- PostgreSQL migrationları
- DBML veri modeli
- Dockerfilelar
- Docker Compose
- Unit testler
- Integration testler
- Architecture testleri
- CI pipeline
- Teknik dokümantasyon
- Anlamlı Git geçmişi
- Pull Request veya Merge Request

Proje yalnızca belirli bir geliştirme ortamında çalışacak şekilde bırakılmamalıdır.

Başka bir geliştirici README dosyasını takip ederek sistemi kurabilmeli, çalıştırabilmeli ve testleri yürütebilmelidir.

## 31. Teknik İnceleme

Teslim sonrasında teknik sunum ve canlı kod incelemesi yapılacaktır.

Sunum sırasında en az aşağıdaki konuların açıklanması beklenmektedir:

- Proje mimarisi
- Veri tabanı tasarımı
- Katman bağımlılıkları
- Factory Pattern uygulaması
- SLA hesaplama yaklaşımı
- İş emri durum yönetimi
- Entity Framework Core kullanımı
- Dependency Injection yaşam döngüleri
- Hangfire job mimarisi
- Transaction ve concurrency yönetimi
- Test stratejisi
- Docker yapısı
- Agent ve yapay zekâ kullanımı
- Bilinen teknik borçlar

Canlı inceleme sırasında:

- Rastgele seçilen kodların açıklanması
- Bir servis lifetime’ının değiştirilmesi
- Yeni bir SLA politikası eklenmesi
- Yeni bir iş kuralının uygulanması
- Bir background job probleminin çözülmesi
- Bir sorgunun performans açısından incelenmesi
- Yeni bir test senaryosu yazılması
- Küçük bir hata veya eksikliğin giderilmesi

istenebilir.

Canlı değişikliklerde agent kullanılıp kullanılamayacağı inceleme öncesinde ayrıca belirtilecektir.

## 32. Değerlendirme Kriterleri

Değerlendirme yalnızca özelliklerin tamamlanmasına göre yapılmayacaktır.

Aşağıdaki başlıklar birlikte değerlendirilecektir:

- Uygulamanın çalışabilirliği
- İş kurallarının doğruluğu
- Kod kalitesi
- C# ve .NET kullanımı
- Mimari tutarlılık
- SOLID ve DRY uyumu
- Factory Pattern’in doğru kullanımı
- Entity Framework Core kullanımı
- PostgreSQL veri modeli
- Hangfire güvenilirliği
- Dependency Injection ve lifecycle bilgisi
- Mapping yaklaşımı
- Testlerin niteliği
- Docker kullanımı
- Git geçmişi
- Teknik dokümantasyon
- Kodun açıklanabilirliği
- Agent çıktılarının denetlenebilmesi

Gereksiz teknoloji, pattern, katman veya abstraction eklemek tek başına olumlu değerlendirilmez.

Beklentimiz, verilen ihtiyacı karşılayan; sade, anlaşılabilir, test edilebilir, genişletilebilir ve çalışabilir bir çözüm ortaya koymanızdır.
