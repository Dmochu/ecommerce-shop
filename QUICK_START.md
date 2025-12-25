# 🚀 Szybki Start - Konfiguracja Vercel

## Krok 1: Baza danych (5 minut) ⚡

### Opcja A: Neon (Polecane - najłatwiejsze)

1. **Przejdź na:** https://neon.tech
2. **Zarejestruj się** (darmowe konto)
3. **Utwórz nowy projekt:**
   - Kliknij "Create Project"
   - Wybierz region (np. Europe - Frankfurt)
   - Nazwij projekt (np. "ecommerce-shop")
   - Kliknij "Create Project"

4. **Skopiuj connection string:**
   - W dashboardzie Neon znajdź sekcję "Connection Details"
   - Kliknij "Copy" przy "Connection string"
   - Będzie wyglądać tak: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

5. **Dodaj do Vercel:**
   ```bash
   # Usuń placeholder
   vercel env rm DATABASE_URL production
   
   # Dodaj prawdziwy connection string
   vercel env add DATABASE_URL production
   # Wklej connection string z Neon
   
   # Dodaj też dla preview i development
   vercel env add DATABASE_URL preview
   vercel env add DATABASE_URL development
   ```

### Opcja B: Supabase (Alternatywa)

1. **Przejdź na:** https://supabase.com
2. **Utwórz projekt**
3. **Settings > Database > Connection string**
4. **Skopiuj connection string**
5. **Dodaj do Vercel** (jak wyżej)

---

## Krok 2: Stripe (Opcjonalne - można później)

### Dla testów (darmowe):

1. **Przejdź na:** https://stripe.com
2. **Zarejestruj się** (darmowe konto testowe)
3. **Dashboard > Developers > API keys**
4. **Skopiuj:**
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

5. **Zaktualizuj w Vercel:**
   ```bash
   vercel env rm STRIPE_SECRET_KEY production
   vercel env add STRIPE_SECRET_KEY production
   # Wklej sk_test_...
   
   vercel env rm NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
   # Wklej pk_test_...
   ```

**Uwaga:** Testowe klucze Stripe są bezpieczne - nie pobierają prawdziwych płatności!

---

## Krok 3: Uruchom migracje bazy danych

Po dodaniu DATABASE_URL:

```bash
# Uruchom migracje
npx prisma migrate deploy
```

---

## Krok 4: Wdróż na Vercel

```bash
vercel --prod
```

---

## ✅ Sprawdź status

```bash
# Zobacz wszystkie zmienne
vercel env ls

# Zobacz deploymenty
vercel ls --yes
```

---

## 🆘 Problemy?

### Błąd buildowania?
- Sprawdź czy DATABASE_URL jest poprawny
- Sprawdź logi: `vercel logs [deployment-url]`

### Błąd połączenia z bazą?
- Sprawdź czy connection string jest kompletny
- Sprawdź czy baza jest aktywna w Neon/Supabase

### Błąd Stripe?
- Jeśli nie potrzebujesz płatności od razu, możesz zostawić placeholdery
- Aplikacja będzie działać, tylko płatności nie będą działać

---

## 📝 Checklist

- [ ] Utworzono bazę danych (Neon/Supabase)
- [ ] DATABASE_URL zaktualizowany w Vercel
- [ ] Uruchomiono migracje (`npx prisma migrate deploy`)
- [ ] Stripe keys zaktualizowane (opcjonalnie)
- [ ] Deployment uruchomiony (`vercel --prod`)
- [ ] Aplikacja działa! 🎉

