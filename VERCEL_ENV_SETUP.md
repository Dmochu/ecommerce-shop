# Konfiguracja zmiennych środowiskowych na Vercel

## ✅ Już dodane:
- `JWT_SECRET` - wygenerowany automatycznie

## ⚠️ Wymagane do dodania ręcznie:

### 1. DATABASE_URL
**Wymagane dla działania aplikacji!**

Opcje:
- **Neon** (darmowe): https://neon.tech
- **Supabase** (darmowe): https://supabase.com

Po utworzeniu bazy danych, dodaj connection string:
```bash
vercel env add DATABASE_URL production
# Wklej: postgresql://username:password@hostname/database?sslmode=require
```

### 2. STRIPE_SECRET_KEY
**Wymagane dla płatności!**

1. Zarejestruj się na https://stripe.com
2. Przejdź do Dashboard > Developers > API keys
3. Skopiuj Secret key (sk_test_... dla testów lub sk_live_... dla produkcji)
4. Dodaj:
```bash
vercel env add STRIPE_SECRET_KEY production
```

### 3. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
**Wymagane dla płatności!**

1. W Stripe Dashboard > Developers > API keys
2. Skopiuj Publishable key (pk_test_... lub pk_live_...)
3. Dodaj:
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
```

## Opcjonalne zmienne:

- `APACZKA_API_KEY` - dla integracji z Apaczką (kurier)
- `APACZKA_USERNAME` - username do Apaczki
- `APACZKA_PASSWORD` - hasło do Apaczki
- `APACZKA_API_URL` - URL API Apaczki
- `CRON_SECRET` - dla cron jobs
- `NEXT_PUBLIC_APP_URL` - URL aplikacji
- `NEXT_PUBLIC_BASE_URL` - Base URL aplikacji

## Po dodaniu zmiennych:

1. Uruchom migracje bazy danych:
```bash
npx prisma migrate deploy
```

2. Wdróż ponownie:
```bash
vercel --prod
```

## Sprawdź zmienne:
```bash
vercel env ls
```

