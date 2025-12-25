# Szybka konfiguracja bazy danych

## Opcja 1: Supabase (Zalecana)
1. Przejdź do https://supabase.com
2. Zarejestruj się (darmowe konto)
3. Utwórz nowy projekt
4. Skopiuj connection string z Settings > Database
5. Dodaj do Vercel: `vercel env add DATABASE_URL`

## Opcja 2: Neon
1. Przejdź do https://neon.tech
2. Zarejestruj się (darmowe konto)
3. Utwórz nowy projekt
4. Skopiuj connection string
5. Dodaj do Vercel: `vercel env add DATABASE_URL`

## Po skonfigurowaniu bazy danych:
```bash
# Uruchom migracje
npx prisma migrate deploy

# Wdróż ponownie
vercel --prod --yes
```

## Tymczasowe rozwiązanie - SQLite w chmurze
Możemy też użyć tymczasowej bazy SQLite dla demonstracji.
