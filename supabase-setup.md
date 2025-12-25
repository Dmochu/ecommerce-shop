# Konfiguracja Supabase dla Vercel

## Kroki:

### 1. Utwórz konto na Supabase
1. Przejdź do https://supabase.com
2. Kliknij "Start your project"
3. Zarejestruj się (darmowe konto)

### 2. Utwórz nowy projekt
1. Kliknij "New Project"
2. Wybierz organizację
3. Wpisz nazwę projektu: "ecommerce-shop"
4. Wybierz region (np. Europe West)
5. Ustaw hasło bazy danych
6. Kliknij "Create new project"

### 3. Skopiuj connection string
1. Przejdź do Settings > Database
2. Skopiuj "Connection string" (URI)
3. Będzie wyglądać tak:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### 4. Dodaj do Vercel
```bash
vercel env add DATABASE_URL
# Wklej connection string z Supabase
```

### 5. Uruchom migracje
```bash
npx prisma migrate deploy
```

### 6. Wdróż ponownie
```bash
vercel --prod --yes
```
