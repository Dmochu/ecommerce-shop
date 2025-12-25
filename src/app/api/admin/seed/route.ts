import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Endpoint do seedowania bazy danych
// Uruchom przez: GET /api/admin/seed?secret=YOUR_SECRET
// Lub: GET /api/admin/seed (tylko jeśli baza jest pusta)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    
    // Sprawdź czy baza jest pusta (jeśli tak, pozwól na seed bez secret)
    const productCount = await prisma.product.count()
    const categoryCount = await prisma.category.count()
    const isEmpty = productCount === 0 && categoryCount === 0
    
    // Prosta ochrona - w produkcji użyj lepszego systemu autoryzacji
    const expectedSecret = process.env.SEED_SECRET
    
    // Pozwól na seed jeśli:
    // 1. Podano poprawny secret LUB
    // 2. Baza jest pusta (pierwsze uruchomienie)
    if (!isEmpty && (!expectedSecret || secret !== expectedSecret)) {
      return NextResponse.json(
        { error: 'Unauthorized. Podaj poprawny secret lub uruchom gdy baza jest pusta.' },
        { status: 401 }
      )
    }
    
    if (!isEmpty && secret && secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized. Niepoprawny secret.' },
        { status: 401 }
      )
    }

    // Tworzenie kategorii
    const electronics = await prisma.category.upsert({
      where: { name: 'Elektronika' },
      update: {
        isPopular: true,
        isFeatured: true,
        description: 'Najnowsze smartfony, laptopy, słuchawki i akcesoria elektroniczne'
      },
      create: {
        name: 'Elektronika',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
        isPopular: true,
        isFeatured: true,
        description: 'Najnowsze smartfony, laptopy, słuchawki i akcesoria elektroniczne'
      }
    })

    const clothing = await prisma.category.upsert({
      where: { name: 'Odzież' },
      update: {
        isPopular: true,
        isFeatured: false,
        description: 'Modna odzież damska i męska - koszulki, spodnie, kurtki i buty'
      },
      create: {
        name: 'Odzież',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        isPopular: true,
        isFeatured: false,
        description: 'Modna odzież damska i męska - koszulki, spodnie, kurtki i buty'
      }
    })

    const books = await prisma.category.upsert({
      where: { name: 'Książki' },
      update: {
        isPopular: false,
        isFeatured: true,
        description: 'Książki dla każdego - literatura, poradniki, książki kucharskie'
      },
      create: {
        name: 'Książki',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        isPopular: false,
        isFeatured: true,
        description: 'Książki dla każdego - literatura, poradniki, książki kucharskie'
      }
    })

    const sports = await prisma.category.upsert({
      where: { name: 'Sport' },
      update: {
        isPopular: true,
        isFeatured: false,
        description: 'Sprzęt sportowy i akcesoria - rowery, piłki, odzież sportowa'
      },
      create: {
        name: 'Sport',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        isPopular: true,
        isFeatured: false,
        description: 'Sprzęt sportowy i akcesoria - rowery, piłki, odzież sportowa'
      }
    })

    const home = await prisma.category.upsert({
      where: { name: 'Dom i Ogród' },
      update: {
        isPopular: false,
        isFeatured: true,
        description: 'Dekoracje, meble, lampy i akcesoria do domu i ogrodu'
      },
      create: {
        name: 'Dom i Ogród',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        isPopular: false,
        isFeatured: true,
        description: 'Dekoracje, meble, lampy i akcesoria do domu i ogrodu'
      }
    })

    const beauty = await prisma.category.upsert({
      where: { name: 'Uroda' },
      update: {
        isPopular: false,
        isFeatured: false,
        description: 'Kosmetyki i produkty do pielęgnacji - kremy, szampony, makijaż'
      },
      create: {
        name: 'Uroda',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        isPopular: false,
        isFeatured: false,
        description: 'Kosmetyki i produkty do pielęgnacji - kremy, szampony, makijaż'
      }
    })

    // Lista produktów (skrócona wersja - pełna lista w seed.ts)
    const products = [
      // Elektronika
      { name: 'iPhone 15 Pro', description: 'Najnowszy iPhone z zaawansowaną kamerą i procesorem A17 Pro', price: 4999.99, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', stock: 10, categoryId: electronics.id, isPopular: true, isRecommended: true, isFeatured: true },
      { name: 'MacBook Air M2', description: 'Lekki i wydajny laptop z procesorem Apple M2', price: 5999.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 5, categoryId: electronics.id, isPopular: true, isRecommended: false, isFeatured: true },
      { name: 'Samsung Galaxy S24', description: 'Najnowszy smartfon Samsung z zaawansowaną kamerą AI', price: 3999.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', stock: 12, categoryId: electronics.id, isPopular: true, isRecommended: false, isFeatured: true },
      { name: 'Słuchawki bezprzewodowe', description: 'Wysokiej jakości słuchawki z aktywnym tłumieniem hałasu', price: 599.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', stock: 25, categoryId: electronics.id, isPopular: false, isRecommended: true },
      // Odzież
      { name: 'Koszulka bawełniana', description: 'Wygodna koszulka z 100% bawełny', price: 89.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', stock: 50, categoryId: clothing.id, isPopular: true, isRecommended: true },
      { name: 'Spodnie jeansowe', description: 'Klasyczne spodnie jeansowe w różnych rozmiarach', price: 199.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', stock: 30, categoryId: clothing.id, isPopular: false, isRecommended: true },
      { name: 'Kurtka zimowa', description: 'Ciepła kurtka zimowa z wodoodpornym materiałem', price: 399.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', stock: 15, categoryId: clothing.id, isPopular: true, isRecommended: false },
      { name: 'Buty sportowe', description: 'Wygodne buty sportowe do codziennego użytku', price: 299.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', stock: 40, categoryId: clothing.id, isPopular: true, isRecommended: true },
      // Książki
      { name: 'Harry Potter i Kamień Filozoficzny', description: 'Pierwsza część serii o młodym czarodzieju', price: 39.99, image: 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400', stock: 25, categoryId: books.id, isPopular: true, isRecommended: false },
      { name: 'Władca Pierścieni', description: 'Epicka trylogia fantasy J.R.R. Tolkiena', price: 79.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', stock: 15, categoryId: books.id, isPopular: false, isRecommended: true },
      // Sport
      { name: 'Piłka nożna', description: 'Profesjonalna piłka nożna do gry na boisku', price: 149.99, image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400', stock: 20, categoryId: sports.id, isPopular: true, isRecommended: true },
      { name: 'Rower górski', description: 'Wydajny rower górski do jazdy terenowej', price: 2499.99, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400', stock: 8, categoryId: sports.id, isPopular: false, isRecommended: true, isFeatured: true },
      // Uroda
      { name: 'Krem nawilżający', description: 'Naturalny krem nawilżający do twarzy', price: 89.99, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', stock: 30, categoryId: beauty.id, isPopular: false, isRecommended: true },
      { name: 'Szampon do włosów', description: 'Delikatny szampon dla wszystkich typów włosów', price: 49.99, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', stock: 50, categoryId: beauty.id, isPopular: true, isRecommended: false },
      // Dom i Ogród
      { name: 'Lampa stołowa', description: 'Elegancka lampa stołowa z regulacją jasności', price: 199.99, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', stock: 20, categoryId: home.id, isPopular: false, isRecommended: true, isFeatured: true },
      { name: 'Doniczka ceramiczna', description: 'Piękna doniczka ceramiczna do roślin', price: 79.99, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', stock: 35, categoryId: home.id, isPopular: true, isRecommended: false },
    ]

    // Usuń istniejące produkty (opcjonalnie - możesz to zakomentować jeśli chcesz zachować istniejące)
    // await prisma.product.deleteMany({})

    // Tworzenie produktów
    const createdProducts = []
    for (const product of products) {
      const existing = await prisma.product.findFirst({
        where: { name: product.name }
      })
      
      if (!existing) {
        const createdProduct = await prisma.product.create({
          data: product
        })
        createdProducts.push(createdProduct)
      }
    }

    // Tworzenie użytkownika admin (jeśli nie istnieje)
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await prisma.user.upsert({
      where: { email: 'admin@sklep.pl' },
      update: {},
      create: {
        email: 'admin@sklep.pl',
        name: 'Administrator',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    return NextResponse.json({
      success: true,
      message: `Dodano ${createdProducts.length} nowych produktów`,
      products: createdProducts.length,
      categories: 6
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd podczas seedowania' },
      { status: 500 }
    )
  }
}

