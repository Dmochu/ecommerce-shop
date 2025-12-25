# ⚡ Szybki Setup Neon - 5 minut

## Krok 1: Utwórz konto (2 min)
1. Przejdź na: **https://neon.tech**
2. Kliknij **"Sign Up"** (możesz użyć GitHub)
3. Zaloguj się

## Krok 2: Utwórz projekt (1 min)
1. Kliknij **"Create Project"**
2. Wypełnij:
   - **Project name:** `ecommerce-shop` (lub dowolna nazwa)
   - **Region:** Wybierz najbliższy (np. Europe - Frankfurt)
   - **PostgreSQL version:** Zostaw domyślną (15)
3. Kliknij **"Create Project"**

## Krok 3: Skopiuj Connection String (1 min)
1. Po utworzeniu projektu zobaczysz dashboard
2. Znajdź sekcję **"Connection Details"** lub **"Connection string"**
3. Kliknij przycisk **"Copy"** obok connection string
4. Będzie wyglądać tak:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

## Krok 4: Wyślij mi connection string
Wklej connection string tutaj, a ja:
- Dodam go do Vercel
- Uruchomię migracje
- Zdeployuję aplikację

**Gotowe!** 🎉

---

## Alternatywnie - przez Vercel Dashboard:
1. Przejdź na: https://vercel.com/dmochu2s-projects/ecommerce-shop-1/settings/environment-variables
2. Znajdź `DATABASE_URL` (Production)
3. Kliknij "Edit"
4. Wklej connection string z Neon
5. Zapisz
6. Uruchom ponownie: `vercel --prod`

