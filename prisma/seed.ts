import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
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

  // Tworzenie produktów
  const products = [
    // Elektronika
    {
      name: 'iPhone 15 Pro',
      description: 'Najnowszy iPhone z zaawansowaną kamerą i procesorem A17 Pro. Ekran Super Retina XDR 6.1", aparat 48MP, akumulator na cały dzień.',
      price: 4999.99,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      stock: 10,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: true,
      isFeatured: true
    },
    {
      name: 'MacBook Air M2',
      description: 'Lekki i wydajny laptop z procesorem Apple M2. Ekran Retina 13.3", 8GB RAM, 256GB SSD. Idealny do pracy i rozrywki.',
      price: 5999.99,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      stock: 5,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: false,
      isFeatured: true
    },
    {
      name: 'iPad Pro 12.9"',
      description: 'Najpotężniejszy iPad z ekranem Liquid Retina XDR 12.9", procesorem M2, wsparciem dla Apple Pencil.',
      price: 6999.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      stock: 8,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Inteligentny zegarek z ekranem Always-On, GPS, monitorowaniem zdrowia i baterią na 18 godzin.',
      price: 1999.99,
      image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
      stock: 15,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'AirPods Pro 2',
      description: 'Słuchawki bezprzewodowe z aktywnym tłumieniem hałasu, przestrzennym dźwiękiem i baterią na 6 godzin.',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
      stock: 20,
      categoryId: electronics.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'Konsola PlayStation 5',
      description: 'Najnowsza konsola Sony z procesorem AMD Zen 2, 16GB RAM, dyskiem SSD 825GB. W zestawie pad DualSense.',
      price: 2499.99,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
      stock: 6,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: false,
      isFeatured: true
    },
    {
      name: 'Xbox Series X',
      description: 'Najpotężniejsza konsola Microsoft z procesorem AMD Zen 2, 16GB RAM, dyskiem SSD 1TB. Wsparcie dla 4K 120fps.',
      price: 2299.99,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400',
      stock: 7,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: false,
      isFeatured: false
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'Konsola hybrydowa z ekranem OLED 7", 64GB pamięci, kontrolerami Joy-Con. Idealna do grania w domu i w podróży.',
      price: 1799.99,
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
      stock: 12,
      categoryId: electronics.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: false
    },
    // Odzież
    {
      name: 'Koszulka bawełniana',
      description: 'Wygodna koszulka z 100% bawełny organicznej. Dostępna w wielu kolorach i rozmiarach. Idealna na co dzień.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      stock: 50,
      categoryId: clothing.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Spodnie jeansowe',
      description: 'Klasyczne spodnie jeansowe w różnych rozmiarach. Wygodne, trwałe, uniwersalne. Dostępne w kilku kolorach.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      stock: 30,
      categoryId: clothing.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Bluza z kapturem',
      description: 'Ciepła bluza z kapturem, idealna na chłodniejsze dni. Miękki materiał, wygodny krój, kieszenie z przodu.',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      stock: 25,
      categoryId: clothing.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Sukienka letnia',
      description: 'Lekka sukienka letnia z naturalnych materiałów. Elegancka, wygodna, idealna na lato. Dostępna w kilku wzorach.',
      price: 179.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      stock: 35,
      categoryId: clothing.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Marynarka elegancka',
      description: 'Klasyczna marynarka elegancka do biura i na specjalne okazje. Wysokiej jakości materiał, dopasowany krój.',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb708b?w=400',
      stock: 15,
      categoryId: clothing.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: true
    },
    {
      name: 'Szalik wełniany',
      description: 'Ciepły szalik wełniany w różnych kolorach. Idealny na zimę, miękki i przyjemny w dotyku.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
      stock: 40,
      categoryId: clothing.id,
      isPopular: false,
      isRecommended: false
    },
    // Książki
    {
      name: 'Harry Potter i Kamień Filozoficzny',
      description: 'Pierwsza część serii o młodym czarodzieju. Magiczna przygoda, która zachwyci czytelników w każdym wieku.',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?w=400',
      stock: 25,
      categoryId: books.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Władca Pierścieni',
      description: 'Epicka trylogia fantasy J.R.R. Tolkiena. Klasyka literatury fantasy, która zainspirowała miliony czytelników.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      stock: 15,
      categoryId: books.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Hobbit',
      description: 'Przedpremierowa opowieść do Władcy Pierścieni. Przygoda Bilba Bagginsa w Śródziemiu.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      stock: 20,
      categoryId: books.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Gra o Tron',
      description: 'Pierwszy tom serii Pieśń Lodu i Ognia. Intrygi, walka o władzę, magia i fantastyka.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      stock: 18,
      categoryId: books.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Duma i Uprzedzenie',
      description: 'Klasyczna powieść Jane Austen o miłości, klasie społecznej i uprzedzeniach w XIX-wiecznej Anglii.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      stock: 22,
      categoryId: books.id,
      isPopular: false,
      isRecommended: true
    },
    // Sport
    {
      name: 'Piłka nożna',
      description: 'Profesjonalna piłka nożna do gry na boisku. Wysokiej jakości, trwała, zgodna z normami FIFA.',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400',
      stock: 20,
      categoryId: sports.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Rower górski',
      description: 'Wydajny rower górski do jazdy terenowej. Amortyzacja przednia, 21 biegów, solidna rama aluminiowa.',
      price: 2499.99,
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400',
      stock: 8,
      categoryId: sports.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: true
    },
    {
      name: 'Hantle regulowane',
      description: 'Zestaw hantli regulowanych 2x20kg. Idealne do treningu siłowego w domu. Bezpieczne i wygodne.',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      stock: 12,
      categoryId: sports.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Mata do jogi',
      description: 'Antypoślizgowa mata do jogi, grubość 6mm. Idealna do ćwiczeń, jogi i pilatesu. Łatwa w czyszczeniu.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      stock: 30,
      categoryId: sports.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Buty do biegania',
      description: 'Profesjonalne buty do biegania z amortyzacją. Wygodne, oddychające, idealne na długie dystanse.',
      price: 449.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      stock: 18,
      categoryId: sports.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Rakieta tenisowa',
      description: 'Profesjonalna rakieta tenisowa z grafitem. Idealna dla początkujących i zaawansowanych graczy.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1622163642999-4c1dc44aab33?w=400',
      stock: 14,
      categoryId: sports.id,
      isPopular: false,
      isRecommended: false
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Najnowszy smartfon Samsung z zaawansowaną kamerą AI. Ekran Dynamic AMOLED 6.2", procesor Snapdragon 8 Gen 3.',
      price: 3999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      stock: 12,
      categoryId: electronics.id,
      isPopular: true,
      isRecommended: false,
      isFeatured: true
    },
    {
      name: 'Słuchawki bezprzewodowe',
      description: 'Wysokiej jakości słuchawki z aktywnym tłumieniem hałasu. Bateria na 30 godzin, dźwięk przestrzenny.',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      stock: 25,
      categoryId: electronics.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Kamera GoPro Hero 12',
      description: 'Akcyjna kamera 4K z stabilizacją obrazu. Wodoodporna, idealna do sportów ekstremalnych.',
      price: 2499.99,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      stock: 9,
      categoryId: electronics.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'Kurtka zimowa',
      description: 'Ciepła kurtka zimowa z wodoodpornym materiałem. Wypełnienie puchowe, kaptur, kieszenie z zamkami.',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      stock: 15,
      categoryId: clothing.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Buty sportowe',
      description: 'Wygodne buty sportowe do codziennego użytku. Amortyzacja, oddychający materiał, uniwersalny design.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      stock: 40,
      categoryId: clothing.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Czapka zimowa',
      description: 'Ciepła czapka zimowa z wełny. Elastyczna, wygodna, dostępna w wielu kolorach.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
      stock: 45,
      categoryId: clothing.id,
      isPopular: false,
      isRecommended: false
    },
    // Uroda
    {
      name: 'Krem nawilżający',
      description: 'Naturalny krem nawilżający do twarzy. Zawiera kwas hialuronowy, witaminę E, idealny na dzień i noc.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      stock: 30,
      categoryId: beauty.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Szampon do włosów',
      description: 'Delikatny szampon dla wszystkich typów włosów. Bez parabenów, z naturalnymi składnikami.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
      stock: 50,
      categoryId: beauty.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Pomadka do ust',
      description: 'Nawilżająca pomadka do ust z filtrem SPF 15. Długotrwałe nawilżenie, naturalny kolor.',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1631214524027-52fd89a27527?w=400',
      stock: 60,
      categoryId: beauty.id,
      isPopular: true,
      isRecommended: true
    },
    {
      name: 'Perfumy damskie',
      description: 'Eleganckie perfumy damskie z nutami kwiatowymi. Trwały zapach, elegancka butelka.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
      stock: 20,
      categoryId: beauty.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: true
    },
    {
      name: 'Maska do twarzy',
      description: 'Oczyszczająca maska do twarzy z węglem aktywnym. Głębokie oczyszczenie, matowienie skóry.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400',
      stock: 35,
      categoryId: beauty.id,
      isPopular: true,
      isRecommended: false
    },
    // Dom i Ogród
    {
      name: 'Lampa stołowa',
      description: 'Elegancka lampa stołowa z regulacją jasności. Nowoczesny design, żarówka LED, dotykowy włącznik.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      stock: 20,
      categoryId: home.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: true
    },
    {
      name: 'Doniczka ceramiczna',
      description: 'Piękna doniczka ceramiczna do roślin. Ręcznie wykonana, różne rozmiary, odporna na warunki atmosferyczne.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
      stock: 35,
      categoryId: home.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Dywan nowoczesny',
      description: 'Elegancki dywan nowoczesny do salonu. Miękki, łatwy w czyszczeniu, dostępny w kilku kolorach.',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
      stock: 10,
      categoryId: home.id,
      isPopular: false,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'Poduszka dekoracyjna',
      description: 'Miękka poduszka dekoracyjna do salonu. Wysokiej jakości materiał, różne wzory i kolory.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1584100936595-8b1ddf2c5b13?w=400',
      stock: 40,
      categoryId: home.id,
      isPopular: true,
      isRecommended: false
    },
    {
      name: 'Zestaw noży kuchennych',
      description: 'Profesjonalny zestaw noży kuchennych ze stali nierdzewnej. Drewniana deska do krojenia w zestawie.',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1594736797933-d0cbc0c0b0e0?w=400',
      stock: 15,
      categoryId: home.id,
      isPopular: true,
      isRecommended: true,
      isFeatured: false
    },
    {
      name: 'Świece zapachowe',
      description: 'Zestaw świec zapachowych sojowych. Naturalne woski, różne zapachy, długi czas palenia.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1602874805361-803b5e2e9a31?w=400',
      stock: 28,
      categoryId: home.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Książka kucharska',
      description: 'Przepisy kuchni polskiej - tradycyjne i nowoczesne. Ponad 200 sprawdzonych przepisów z pięknymi zdjęciami.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      stock: 18,
      categoryId: books.id,
      isPopular: false,
      isRecommended: true
    },
    {
      name: 'Sapiens - Krótka historia ludzkości',
      description: 'Bestseller Yuvala Noaha Harariego o historii ludzkości. Fascynująca opowieść o naszym gatunku.',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      stock: 16,
      categoryId: books.id,
      isPopular: true,
      isRecommended: false
    }
  ]

  const createdProducts = []
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product
    })
    createdProducts.push(createdProduct)
  }

  // Tworzenie bannerów
  const banners = [
    {
      title: 'Wielka wyprzedaż!',
      subtitle: 'Do -50% na wybrane produkty',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800',
      link: '/sale',
      active: true,
      order: 1
    },
    {
      title: 'Nowe produkty',
      subtitle: 'Sprawdź nasze najnowsze oferty',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      link: '/new',
      active: true,
      order: 2
    }
  ]

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner
    })
  }

  // Tworzenie użytkowników
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = [
    {
      email: 'jan.kowalski@example.com',
      name: 'Jan Kowalski',
      password: hashedPassword,
      role: 'USER' as const
    },
    {
      email: 'anna.nowak@example.com',
      name: 'Anna Nowak',
      password: hashedPassword,
      role: 'USER' as const
    },
    {
      email: 'piotr.wisniewski@example.com',
      name: 'Piotr Wiśniewski',
      password: hashedPassword,
      role: 'USER' as const
    },
    {
      email: 'admin@sklep.pl',
      name: 'Administrator',
      password: hashedPassword,
      role: 'ADMIN' as const
    }
  ]

  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    })
    createdUsers.push(createdUser)
  }

  // Tworzenie fake'owych zamówień
  const fakeOrders = [
    {
      user: createdUsers[0], // Jan Kowalski
      status: 'DELIVERED' as const,
      paymentStatus: 'PAID' as const,
      total: 5089.98,
      items: [
        { product: createdProducts[0], quantity: 1, price: 4999.99 }, // iPhone 15 Pro
        { product: createdProducts[2], quantity: 1, price: 89.99 }    // Koszulka
      ],
      shippingAddress: {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phone: '+48 123 456 789',
        address: 'ul. Kwiatowa 15/3',
        city: 'Warszawa',
        postalCode: '00-001',
        country: 'Polska'
      },
      createdAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      user: createdUsers[1], // Anna Nowak
      status: 'SHIPPED' as const,
      paymentStatus: 'PAID' as const,
      total: 6199.98,
      items: [
        { product: createdProducts[1], quantity: 1, price: 5999.99 }, // MacBook Air
        { product: createdProducts[3], quantity: 1, price: 199.99 }   // Spodnie
      ],
      shippingAddress: {
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@example.com',
        phone: '+48 987 654 321',
        address: 'ul. Długa 42',
        city: 'Kraków',
        postalCode: '31-001',
        country: 'Polska'
      },
      createdAt: new Date('2024-01-20T14:15:00Z')
    },
    {
      user: createdUsers[2], // Piotr Wiśniewski
      status: 'CONFIRMED' as const,
      paymentStatus: 'PAID' as const,
      total: 2649.98,
      items: [
        { product: createdProducts[7], quantity: 1, price: 2499.99 }, // Rower
        { product: createdProducts[6], quantity: 1, price: 149.99 }   // Piłka
      ],
      shippingAddress: {
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        email: 'piotr.wisniewski@example.com',
        phone: '+48 555 123 456',
        address: 'ul. Sportowa 8',
        city: 'Poznań',
        postalCode: '61-001',
        country: 'Polska'
      },
      createdAt: new Date('2024-01-25T09:45:00Z')
    },
    {
      user: createdUsers[0], // Jan Kowalski - drugie zamówienie
      status: 'PENDING' as const,
      paymentStatus: 'PENDING' as const,
      total: 119.98,
      items: [
        { product: createdProducts[4], quantity: 2, price: 39.99 },   // Harry Potter x2
        { product: createdProducts[5], quantity: 1, price: 79.99 }    // Władca Pierścieni
      ],
      shippingAddress: {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phone: '+48 123 456 789',
        address: 'ul. Kwiatowa 15/3',
        city: 'Warszawa',
        postalCode: '00-001',
        country: 'Polska'
      },
      createdAt: new Date('2024-01-28T16:20:00Z')
    },
    {
      user: createdUsers[1], // Anna Nowak - drugie zamówienie
      status: 'CANCELLED' as const,
      paymentStatus: 'FAILED' as const,
      total: 289.98,
      items: [
        { product: createdProducts[2], quantity: 2, price: 89.99 },   // Koszulka x2
        { product: createdProducts[3], quantity: 1, price: 199.99 }   // Spodnie
      ],
      shippingAddress: {
        firstName: 'Anna',
        lastName: 'Nowak',
        email: 'anna.nowak@example.com',
        phone: '+48 987 654 321',
        address: 'ul. Długa 42',
        city: 'Kraków',
        postalCode: '31-001',
        country: 'Polska'
      },
      createdAt: new Date('2024-01-22T11:30:00Z')
    }
  ]

  // Tworzenie zamówień z adresami dostawy
  for (const orderData of fakeOrders) {
    const order = await prisma.order.create({
      data: {
        userId: orderData.user.id,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        total: orderData.total,
        createdAt: orderData.createdAt,
        updatedAt: orderData.createdAt
      }
    })

    // Tworzenie adresu dostawy
    await prisma.shippingAddress.create({
      data: {
        orderId: order.id,
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        email: orderData.shippingAddress.email,
        phone: orderData.shippingAddress.phone,
        address: orderData.shippingAddress.address,
        city: orderData.shippingAddress.city,
        postalCode: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country,
        createdAt: orderData.createdAt,
        updatedAt: orderData.createdAt
      }
    })

    // Tworzenie elementów zamówienia
    for (const item of orderData.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.price
        }
      })
    }
  }

  console.log('Dane zostały pomyślnie dodane do bazy danych!')
  console.log(`Utworzono:
  - ${products.length} produktów
  - ${banners.length} bannerów
  - ${users.length} użytkowników
  - ${fakeOrders.length} zamówień z adresami dostawy`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
