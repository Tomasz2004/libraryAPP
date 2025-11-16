# Library API - System Biblioteczny

REST API dla systemu zarządzania wypożyczalnią książek z pełną obsługą wyszukiwania i filtrowania.

## 🎯 Funkcjonalności

✅ **4 wymagane formularze:**

1. Wyszukiwanie książek według autora, tytułu, gatunku lub roku wydania
2. Lista wypożyczeń z filtrowaniem po zakresie dat i użytkowniku
3. Filtr dostępności książek (dostępne/wypożyczone)
4. Filtr czytelników z aktywnymi/nieaktywnymi wypożyczeniami

✅ **36 endpointów GET** dla wszystkich tabel i filtrów

✅ **7 tabel:** Autorzy, Biblioteki, Pracownicy, Czytelnicy, Książki, Egzemplarze, Wypożyczenia

## 🚀 Szybki start

### 1. Przygotuj bazę danych

```sql
-- Połącz się z PostgreSQL i uruchom skrypt SQL z treści zadania
-- Utworzy to tabele i przykładowe dane
```

### 2. Skonfiguruj połączenie (opcjonalnie)

Edytuj `src/main/resources/application.properties` jeśli potrzeba:

```properties
spring.datasource.url=jdbc:postgresql://172.18.128.1:5432/librarydb
spring.datasource.username=postgres
spring.datasource.password=admin
```

### 3. Uruchom aplikację

```bash
./mvnw spring-boot:run
```

### 4. Testuj API

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **API Base URL:** http://localhost:8080/api

## 📖 Dokumentacja

- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - pełna dokumentacja wszystkich endpointów
- **[CURL_EXAMPLES.md](CURL_EXAMPLES.md)** - przykłady wywołań dla każdego endpointu
- **[STRUCTURE.md](STRUCTURE.md)** - szczegółowa struktura projektu

## 🔍 Przykłady użycia

### Wyszukiwanie książek

```bash
curl "http://localhost:8080/api/ksiazki/search?tytul=sql&autor=kowalski"
```

### Lista wypożyczeń w zakresie dat

```bash
curl "http://localhost:8080/api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30"
```

### Dostępne egzemplarze w bibliotece

```bash
curl "http://localhost:8080/api/egzemplarze/search?status=dostepny&bibliotekaId=1"
```

### Czytelnicy z aktywnymi wypożyczeniami

```bash
curl "http://localhost:8080/api/czytelnicy?filterType=activeLoans"
```

## 📊 Struktura projektu

```
src/main/java/com/postgresql/libraryAPI/
├── model/          # 7 encji JPA
├── repository/     # 7 repozytoriów Spring Data
├── controller/     # 7 kontrolerów REST
└── dto/            # 3 obiekty DTO
```

## 🛠️ Technologie

- Spring Boot 3.5.7
- Spring Data JPA
- PostgreSQL
- Lombok
- SpringDoc OpenAPI (Swagger)
- Java 21

## ✅ Status

- ✅ Wszystkie modele encji utworzone
- ✅ Wszystkie repozytoria z metodami filtrowania
- ✅ Wszystkie kontrolery z endpointami GET
- ✅ 4 wymagane formularze zaimplementowane
- ✅ DTO dla złożonych zapytań
- ✅ Projekt kompiluje się bez błędów
- ✅ Dokumentacja API

## 📝 Endpointy formularzy

| Formularz            | Endpoint                       | Parametry                         |
| -------------------- | ------------------------------ | --------------------------------- |
| Wyszukiwanie książek | `GET /api/ksiazki/search`      | tytul, autor, gatunek, rokWydania |
| Lista wypożyczeń     | `GET /api/wypozyczenia/search` | dataOd, dataDo, czytelnikId       |
| Dostępność książek   | `GET /api/egzemplarze/search`  | status, bibliotekaId              |
| Filtr czytelników    | `GET /api/czytelnicy`          | filterType, aktywny               |

---

**Autor:** GitHub Copilot  
**Data:** 2025-11-16  
**Wersja:** 1.0.0
