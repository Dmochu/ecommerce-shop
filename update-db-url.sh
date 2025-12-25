#!/bin/bash

DB_URL="postgresql://neondb_owner:npg_j0qa8snozFTv@ep-withered-bird-a4lutx3i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "Aktualizuję DATABASE_URL w Vercel..."

# Usuń stare wartości
echo "y" | vercel env rm DATABASE_URL production 2>/dev/null
echo "y" | vercel env rm DATABASE_URL preview 2>/dev/null
echo "y" | vercel env rm DATABASE_URL development 2>/dev/null

# Dodaj nowe
echo "$DB_URL" | vercel env add DATABASE_URL production
echo "$DB_URL" | vercel env add DATABASE_URL preview
echo "$DB_URL" | vercel env add DATABASE_URL development

echo "✅ DATABASE_URL zaktualizowany!"

