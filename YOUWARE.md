# Proje Hafızası - Gelmemeyegidenkitapkurdu

## Proje Özeti

Bu proje Netlify üzerinde yayınlanacak şekilde optimize edilmiş bir React + TypeScript web uygulamasıdır. Veri katmanı Supabase ile çalışır.

## Kesin Teknoloji Kararları

- Frontend: React 18 + TypeScript + Vite
- Stil: Tailwind CSS
- State: Zustand
- Backend servisleri: Supabase (REST/RPC/Auth)
- CI/CD: GitHub Actions
- Hosting: Netlify

## Kalıcı Geliştirme Kuralları

1. Framework değişimi yapılmaz; React + Vite korunur.
2. Veri erişimleri `src/api/client.ts` üzerinden yürütülür.
3. Supabase istemcisi tek noktadan (`src/lib/supabaseClient.ts`) yönetilir.
4. Admin oturum kontrolü store katmanında (`src/store/useStore.ts`) tutulur.
5. Netlify SPA yönlendirmesi için `public/_redirects` korunur.
6. Netlify yapılandırması `netlify.toml` üzerinden yönetilir.
7. Üretim öncesi `npm install` ardından `npm run build` sırası zorunludur.
8. Projede gereksiz template dosyaları ve artık klasörler tutulmaz.

## Supabase Bağlantı Bilgileri

- Project ID: `oxqobtlcbksfdajnvnoz`
- Project URL: `https://oxqobtlcbksfdajnvnoz.supabase.co`
- Kullanılan SQL şema dosyası: `database/supabase_init.sql`

## Veri Kalıcılığı ve Admin Kuralları

1. Admin düzenlemeden hiçbir içeriğin yeri veya değeri değişmez.
2. Admin girişi yapılmadan içerik yayınlanamaz, düzenlenemez veya silinemez.
3. Sayfa yenilendiğinde veriler kaybolmaz — tüm veri Supabase'de kalıcı olarak tutulur.
4. Admin silmeden hiçbir içerik silinmez (RLS politikaları ile korunur).
5. Görüntüleme sayıları yalnızca admin tarafından değiştirilebilir.
6. Her içerik yayınlandığı günün tarihini taşır; tarih sonradan değişmez.
7. Site arayüzü, yayınlama veya düzenleme akışı sebepsiz değiştirilmez.

## Veritabanı Sütun Eşlemesi

| Tablo | Görüntüleme Sütunu | Tarih Sütunu |
|-------|-------------------|--------------|
| writings | views | date |
| books | views | created_at |
| suggestions | views | created_at |
| polls | view_count | date |
| interviews | view_count | created_at |
| announcements | views | date |

## Notlar

- Güvenlik uyarılarının bir bölümü geçmişten gelen `yw_*` tablolarından kaynaklanır.
- Uygulamanın aktif akışı `admin_profile`, `writings`, `books`, `suggestions`, `polls`, `poll_options`, `interviews`, `dialogues`, `announcements` tablolarını kullanır.
