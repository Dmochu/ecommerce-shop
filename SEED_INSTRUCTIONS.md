# Instrukcja dodawania produktów testowych

## Opcja 1: Uruchomienie seeda lokalnie (jeśli masz skonfigurowaną bazę lokalnie)

1. Upewnij się, że masz plik `.env` z `DATABASE_URL`
2. Uruchom migracje:
   ```bash
   npx prisma migrate deploy
   ```
3. Uruchom seed:
   ```bash
   npm run db:seed
   ```

## Opcja 2: Uruchomienie seeda na produkcji (Vercel)

### Metoda A: Przez Vercel CLI

1. Upewnij się, że masz skonfigurowane `DATABASE_URL` w Vercel
2. Uruchom seed bezpośrednio na produkcji:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   npm run db:seed
   ```

### Metoda B: Przez Vercel Dashboard (zalecane)

1. Przejdź do Vercel Dashboard → Twój projekt → Settings → Environment Variables
2. Upewnij się, że `DATABASE_URL` jest ustawione dla Production
3. Uruchom seed przez Vercel CLI z zmiennymi środowiskowymi:
   ```bash
   vercel env pull .env.local
   DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2) npm run db:seed
   ```

### Metoda C: Przez API Endpoint (najprostsze - ZALECANE) ⭐

1. **Pobierz SEED_SECRET z Vercel:**
   ```bash
   vercel env pull .env.local
   grep SEED_SECRET .env.local
   ```

2. **Uruchom seed przez przeglądarkę:**
   Otwórz w przeglądarce:
   ```
   https://ecommerce-shop-1.vercel.app/api/admin/seed?secret=TWÓJ_SEED_SECRET
   ```
   
   Lub użyj curl:
   ```bash
   curl "https://ecommerce-shop-1.vercel.app/api/admin/seed?secret=TWÓJ_SEED_SECRET"
   ```

3. **Sprawdź odpowiedź** - powinieneś zobaczyć:
   ```json
   {
     "success": true,
     "message": "Dodano X nowych produktów",
     "products": X,
     "categories": 6
   }
   ```

**UWAGA:** SEED_SECRET został już dodany do Vercel. Możesz go zobaczyć w Vercel Dashboard → Settings → Environment Variables.

## Co zostało dodane:

- **Elektronika**: 8 produktów (iPhone, MacBook, iPad, Apple Watch, AirPods, PlayStation 5, Xbox, Nintendo Switch, Samsung Galaxy, słuchawki, GoPro)
- **Odzież**: 8 produktów (koszulki, spodnie, bluzy, sukienki, marynarki, kurtki, buty, szaliki, czapki)
- **Książki**: 6 produktów (Harry Potter, Władca Pierścieni, Hobbit, Gra o Tron, Duma i Uprzedzenie, książki kucharskie, Sapiens)
- **Sport**: 6 produktów (piłka, rower, hantle, mata do jogi, buty do biegania, rakieta tenisowa)
- **Uroda**: 5 produktów (kremy, szampony, pomadki, perfumy, maski)
- **Dom i Ogród**: 6 produktów (lampy, doniczki, dywany, poduszki, noże, świece)

**Razem: ~39 produktów testowych** w 6 kategoriach!

Wszystkie produkty mają:
- Opisy
- Ceny
- Zdjęcia (z Unsplash)
- Stan magazynowy
- Flagi popularności/rekomendacji/featured

