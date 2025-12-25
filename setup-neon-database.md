# Konfiguracja bazy danych Neon dla Vercel

## Kroki do wykonania:

### 1. Utwórz konto na Neon
1. Przejdź do https://neon.tech
2. Zarejestruj się (darmowe konto)
3. Utwórz nowy projekt

### 2. Skopiuj connection string
Po utworzeniu projektu, skopiuj connection string z panelu Neon.
Będzie wyglądać mniej więcej tak:
```
postgresql://username:password@hostname/database?sslmode=require
```

### 3. Zaktualizuj DATABASE_URL w Vercel
```bash
vercel env rm DATABASE_URL
vercel env add DATABASE_URL
# Wklej nowy connection string z Neon
```

### 4. Uruchom migracje
```bash
npx prisma migrate deploy
```

### 5. Wdróż na Vercel
```bash
vercel --prod --yes
```

## Alternatywnie - Supabase:
1. Przejdź do https://supabase.com
2. Utwórz nowy projekt
3. Skopiuj connection string z Settings > Database
4. Zaktualizuj DATABASE_URL w Vercel
