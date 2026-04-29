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

## Notlar

- Güvenlik uyarılarının bir bölümü geçmişten gelen `yw_*` tablolarından kaynaklanır.
- Uygulamanın aktif akışı `admin_profile`, `writings`, `books`, `suggestions`, `polls`, `poll_options`, `interviews`, `dialogues`, `announcements` tablolarını kullanır.
