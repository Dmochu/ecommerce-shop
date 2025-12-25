# Konfiguracja API Apaczki

## Wprowadzenie

API Apaczki zostało zintegrowane z aplikacją e-commerce, aby umożliwić automatyczne tworzenie przesyłek i śledzenie ich statusu.

## Konfiguracja

### 1. Zmienne środowiskowe

Dodaj następujące zmienne do pliku `.env`:

```env
# Apaczka API
APACZKA_API_URL="https://api.apaczka.pl"
APACZKA_API_KEY="your-apaczka-api-key"
APACZKA_USERNAME="your-apaczka-username"
APACZKA_PASSWORD="your-apaczka-password"
```

### 2. Uzyskanie danych dostępowych

1. Zarejestruj się na stronie [Apaczka.pl](https://apaczka.pl)
2. Przejdź do panelu API
3. Wygeneruj klucz API
4. Skopiuj dane dostępowe (username, password, api_key)

## Endpointy API

### Tworzenie przesyłki
```
POST /api/shipping/create-shipment
```

**Body:**
```json
{
  "orderId": "order-id"
}
```

**Response:**
```json
{
  "success": true,
  "shipmentId": "shipment-id",
  "trackingNumber": "tracking-number",
  "labelUrl": "https://example.com/label.pdf"
}
```

### Sprawdzanie statusu przesyłki
```
GET /api/shipping/track-shipment?trackingNumber=tracking-number
```

**Response:**
```json
{
  "success": true,
  "status": {
    "status": "delivered",
    "lastUpdate": "2024-01-01T12:00:00Z",
    "events": [...]
  }
}
```

### Pobieranie dostępnych usług
```
GET /api/shipping/services
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "id": "inpost",
      "name": "InPost",
      "price": 12.99,
      "estimatedDelivery": "1-2 dni robocze"
    }
  ]
}
```

### Obliczanie ceny przesyłki
```
POST /api/shipping/calculate-price
```

**Body:**
```json
{
  "sender": {
    "name": "Sklep Online",
    "email": "sklep@example.com",
    "phone": "+48 123 456 789",
    "address": "ul. Przykładowa 1",
    "city": "Warszawa",
    "postalCode": "00-000",
    "country": "Polska"
  },
  "recipient": {
    "name": "Jan Kowalski",
    "email": "jan@example.com",
    "phone": "+48 987 654 321",
    "address": "ul. Odbiorcy 1",
    "city": "Kraków",
    "postalCode": "30-000",
    "country": "Polska"
  },
  "package": {
    "weight": 1.5,
    "length": 20,
    "width": 15,
    "height": 10,
    "description": "Zamówienie #123"
  },
  "service": "inpost"
}
```

## Użycie w aplikacji

### Panel administratora

Komponent `ShippingManager` został dodany do panelu administratora i umożliwia:
- Przeglądanie dostępnych usług kurierskich
- Tworzenie przesyłek dla zamówień
- Sprawdzanie statusu przesyłek
- Pobieranie etykiet

### Automatyczne tworzenie przesyłek

Po opłaceniu zamówienia, system automatycznie:
1. Pobiera dane adresowe z zamówienia
2. Oblicza wagę i wymiary paczki
3. Tworzy przesyłkę przez API Apaczki
4. Aktualizuje status zamówienia na "SHIPPED"

## Obsługiwane usługi kurierskie

- InPost
- DPD
- Poczta Polska
- UPS
- FedEx
- i inne dostępne w API Apaczki

## Rozwiązywanie problemów

### Błąd autoryzacji
- Sprawdź poprawność danych dostępowych w pliku `.env`
- Upewnij się, że konto Apaczki jest aktywne

### Błąd tworzenia przesyłki
- Sprawdź poprawność danych adresowych
- Upewnij się, że waga i wymiary paczki są w odpowiednich jednostkach
- Sprawdź logi serwera pod kątem szczegółowych błędów

### Błąd śledzenia przesyłki
- Sprawdź poprawność numeru śledzenia
- Upewnij się, że przesyłka została utworzona w systemie Apaczki

## Wsparcie

W przypadku problemów z API Apaczki:
1. Sprawdź dokumentację API na stronie Apaczka.pl
2. Skontaktuj się z supportem Apaczki
3. Sprawdź logi aplikacji w konsoli przeglądarki
