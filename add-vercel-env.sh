#!/bin/bash

echo "🔧 Dodawanie zmiennych środowiskowych do Vercel..."
echo ""
echo "UWAGA: Musisz podać wartości dla następujących zmiennych:"
echo "1. DATABASE_URL - connection string do bazy PostgreSQL (Neon/Supabase)"
echo "2. JWT_SECRET - losowy sekretny string (min. 32 znaki)"
echo "3. STRIPE_SECRET_KEY - klucz z Stripe Dashboard"
echo "4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - publiczny klucz Stripe"
echo ""
echo "Jeśli nie masz jeszcze tych wartości, możesz:"
echo "- DATABASE_URL: Utwórz darmowe konto na https://neon.tech lub https://supabase.com"
echo "- JWT_SECRET: Wygeneruj losowy string (np. openssl rand -base64 32)"
echo "- Stripe keys: Zarejestruj się na https://stripe.com i pobierz klucze z Dashboard"
echo ""
read -p "Czy chcesz kontynuować? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# DATABASE_URL
echo ""
echo "📊 Dodawanie DATABASE_URL..."
read -p "Wklej DATABASE_URL (postgresql://...): " DATABASE_URL
if [ ! -z "$DATABASE_URL" ]; then
    echo "$DATABASE_URL" | vercel env add DATABASE_URL production
    echo "$DATABASE_URL" | vercel env add DATABASE_URL preview
    echo "$DATABASE_URL" | vercel env add DATABASE_URL development
    echo "✅ DATABASE_URL dodane"
else
    echo "⚠️  Pominięto DATABASE_URL"
fi

# JWT_SECRET
echo ""
echo "🔐 Dodawanie JWT_SECRET..."
read -p "Wklej JWT_SECRET (lub naciśnij Enter aby wygenerować): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Wygenerowano JWT_SECRET: $JWT_SECRET"
fi
if [ ! -z "$JWT_SECRET" ]; then
    echo "$JWT_SECRET" | vercel env add JWT_SECRET production
    echo "$JWT_SECRET" | vercel env add JWT_SECRET preview
    echo "$JWT_SECRET" | vercel env add JWT_SECRET development
    echo "✅ JWT_SECRET dodane"
else
    echo "⚠️  Pominięto JWT_SECRET"
fi

# STRIPE_SECRET_KEY
echo ""
echo "💳 Dodawanie STRIPE_SECRET_KEY..."
read -p "Wklej STRIPE_SECRET_KEY (sk_live_... lub sk_test_...): " STRIPE_SECRET
if [ ! -z "$STRIPE_SECRET" ]; then
    echo "$STRIPE_SECRET" | vercel env add STRIPE_SECRET_KEY production
    echo "$STRIPE_SECRET" | vercel env add STRIPE_SECRET_KEY preview
    echo "$STRIPE_SECRET" | vercel env add STRIPE_SECRET_KEY development
    echo "✅ STRIPE_SECRET_KEY dodane"
else
    echo "⚠️  Pominięto STRIPE_SECRET_KEY"
fi

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
echo ""
echo "💳 Dodawanie NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
read -p "Wklej NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_... lub pk_test_...): " STRIPE_PUBLIC
if [ ! -z "$STRIPE_PUBLIC" ]; then
    echo "$STRIPE_PUBLIC" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
    echo "$STRIPE_PUBLIC" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY preview
    echo "$STRIPE_PUBLIC" | vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY development
    echo "✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dodane"
else
    echo "⚠️  Pominięto NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
fi

echo ""
echo "✅ Zakończono! Sprawdź zmienne: vercel env ls"
echo ""
echo "Następny krok: vercel --prod"

