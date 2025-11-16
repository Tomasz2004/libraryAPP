# Library API - Struktura Projektu

## 🎯 Utworzone komponenty

### 📦 Modele (Encje JPA) - 7 tabel

```
src/main/java/com/postgresql/libraryAPI/model/
├── Autor.java          - Tabela: autorzy
├── Biblioteka.java     - Tabela: biblioteki
├── Pracownik.java      - Tabela: pracownicy
├── Czytelnik.java      - Tabela: czytelnicy
├── Ksiazka.java        - Tabela: ksiazki
├── Egzemplarz.java     - Tabela: egzemplarze
└── Wypozyczenie.java   - Tabela: wypozyczenia
```

### 🗃️ Repozytoria (Spring Data JPA) - 7 repozytoriów

```
src/main/java/com/postgresql/libraryAPI/repository/
├── AutorRepository.java         - Metody: findByNazwiskoContaining, findByKraj
├── BibliotekaRepository.java    - Podstawowe operacje CRUD
├── PracownikRepository.java     - Metody: findByBiblioteka, findByStanowisko
├── CzytelnikRepository.java     - Metody: findByAktywny, findWithActiveLoans, findWithoutActiveLoans
├── KsiazkaRepository.java       - Metody: searchKsiazki (zaawansowane wyszukiwanie)
├── EgzemplarzRepository.java    - Metody: findByStatus, searchEgzemplarze
└── WypozyczenieRepository.java  - Metody: searchWypozyczenia (filtrowanie po datach i użytkowniku)
```

### 🎮 Kontrolery (REST API) - 7 kontrolerów

```
src/main/java/com/postgresql/libraryAPI/controller/
├── AutorController.java         - /api/autorzy
├── BibliotekaController.java    - /api/biblioteki
├── PracownikController.java     - /api/pracownicy
├── CzytelnikController.java     - /api/czytelnicy
├── KsiazkaController.java       - /api/ksiazki
├── EgzemplarzController.java    - /api/egzemplarze
└── WypozyczenieController.java  - /api/wypozyczenia
```

### 📋 DTO (Data Transfer Objects) - 3 DTO

```
src/main/java/com/postgresql/libraryAPI/dto/
├── KsiazkaSearchDTO.java     - DTO dla wyszukiwania książek
├── EgzemplarzDTO.java        - DTO dla egzemplarzy z pełnymi informacjami
└── WypozyczenieDTO.java      - DTO dla wypożyczeń z pełnymi informacjami
```

---

## ✅ Zaimplementowane formularze

### 1️⃣ Wyszukiwanie książek według autora, tytułu, gatunku lub roku wydania

- **Endpoint:** `GET /api/ksiazki/search`
- **Parametry:** `tytul`, `autor`, `gatunek`, `rokWydania` (wszystkie opcjonalne)
- **Funkcjonalność:** Zaawansowane wyszukiwanie z możliwością kombinacji parametrów
- **Implementacja:**
  - Repository: `KsiazkaRepository.searchKsiazki()`
  - Controller: `KsiazkaController.searchKsiazki()`

### 2️⃣ Lista wypożyczeń z filtrowaniem po zakresie dat i użytkowniku

- **Endpoint:** `GET /api/wypozyczenia/search`
- **Parametry:** `dataOd`, `dataDo`, `czytelnikId` (wszystkie opcjonalne)
- **Funkcjonalność:** Filtrowanie wypożyczeń z sortowaniem po dacie (DESC)
- **Implementacja:**
  - Repository: `WypozyczenieRepository.searchWypozyczenia()`
  - Controller: `WypozyczenieController.searchWypozyczenia()`

### 3️⃣ Filtr dostępności książek – wyświetlanie pozycji dostępnych lub wypożyczonych

- **Endpoint:** `GET /api/egzemplarze/search`
- **Parametry:** `status`, `bibliotekaId` (opcjonalne)
- **Funkcjonalność:** Filtrowanie egzemplarzy po statusie i bibliotece
- **Dodatkowe endpointy:**
  - `GET /api/egzemplarze/dostepne` - tylko dostępne
  - `GET /api/egzemplarze/wypozyczone` - tylko wypożyczone
- **Implementacja:**
  - Repository: `EgzemplarzRepository.searchEgzemplarze()`
  - Controller: `EgzemplarzController.searchEgzemplarze()`

### 4️⃣ Filtr czytelników – ograniczenie listy do osób z aktywnymi lub nieaktywnymi wypożyczeniami

- **Endpoint:** `GET /api/czytelnicy`
- **Parametry:** `filterType` (activeLoans/noActiveLoans), `aktywny` (true/false)
- **Funkcjonalność:** Filtrowanie czytelników według statusu wypożyczeń i aktywności konta
- **Dodatkowe endpointy:**
  - `GET /api/czytelnicy/active-loans` - z aktywnymi wypożyczeniami
  - `GET /api/czytelnicy/no-active-loans` - bez aktywnych wypożyczeń
- **Implementacja:**
  - Repository: `CzytelnikRepository.findCzytelniciWithActiveLoans()`, `findCzytelniciWithoutActiveLoans()`
  - Controller: `CzytelnikController.getAllCzytelnicy()`

---

## 📚 Wszystkie endpointy GET

### Książki (7 endpointów)

- `GET /api/ksiazki` - wszystkie książki
- `GET /api/ksiazki/{id}` - książka po ID
- `GET /api/ksiazki/search` - **FORMULARZ: zaawansowane wyszukiwanie**
- `GET /api/ksiazki/tytul/{tytul}` - po tytule
- `GET /api/ksiazki/autor/{autor}` - po autorze
- `GET /api/ksiazki/gatunek/{gatunek}` - po gatunku
- `GET /api/ksiazki/rok/{rok}` - po roku wydania

### Wypożyczenia (6 endpointów)

- `GET /api/wypozyczenia` - wszystkie wypożyczenia
- `GET /api/wypozyczenia/{id}` - wypożyczenie po ID
- `GET /api/wypozyczenia/search` - **FORMULARZ: filtrowanie po datach i użytkowniku**
- `GET /api/wypozyczenia/czytelnik/{czytelnikId}` - wypożyczenia danego czytelnika
- `GET /api/wypozyczenia/aktywne` - aktywne wypożyczenia
- `GET /api/wypozyczenia/zwrocone` - zwrócone wypożyczenia

### Egzemplarze (8 endpointów)

- `GET /api/egzemplarze` - wszystkie egzemplarze
- `GET /api/egzemplarze/{id}` - egzemplarz po ID
- `GET /api/egzemplarze/search` - **FORMULARZ: filtr dostępności**
- `GET /api/egzemplarze/status/{status}` - po statusie
- `GET /api/egzemplarze/dostepne` - dostępne
- `GET /api/egzemplarze/wypozyczone` - wypożyczone
- `GET /api/egzemplarze/ksiazka/{ksiazkaId}` - danej książki
- `GET /api/egzemplarze/biblioteka/{bibliotekaId}` - z danej biblioteki

### Czytelnicy (5 endpointów)

- `GET /api/czytelnicy` - **FORMULARZ: filtr czytelników**
- `GET /api/czytelnicy/{id}` - czytelnik po ID
- `GET /api/czytelnicy/active-loans` - z aktywnymi wypożyczeniami
- `GET /api/czytelnicy/no-active-loans` - bez aktywnych wypożyczeń

### Autorzy (4 endpointy)

- `GET /api/autorzy` - wszyscy autorzy
- `GET /api/autorzy/{id}` - autor po ID
- `GET /api/autorzy/search?nazwisko={nazwisko}` - wyszukiwanie po nazwisku
- `GET /api/autorzy/kraj/{kraj}` - po kraju

### Biblioteki (2 endpointy)

- `GET /api/biblioteki` - wszystkie biblioteki
- `GET /api/biblioteki/{id}` - biblioteka po ID

### Pracownicy (4 endpointy)

- `GET /api/pracownicy` - wszyscy pracownicy
- `GET /api/pracownicy/{id}` - pracownik po ID
- `GET /api/pracownicy/biblioteka/{bibliotekaId}` - z danej biblioteki
- `GET /api/pracownicy/stanowisko/{stanowisko}` - po stanowisku

**RAZEM: 36 endpointów GET**

---

## 🚀 Uruchomienie

1. Uruchom bazę danych PostgreSQL
2. Wykonaj skrypt SQL (tworzenie tabel i przykładowych danych)
3. Uruchom aplikację:

```bash
./mvnw spring-boot:run
```

4. Testuj API:
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - API endpoint: http://localhost:8080/api

---

## 📖 Dokumentacja

- `API_ENDPOINTS.md` - pełna dokumentacja wszystkich endpointów
- `CURL_EXAMPLES.md` - przykłady wywołań curl dla każdego endpointu
- `README.md` - ogólne informacje o projekcie

---

## 🔧 Technologie

- **Spring Boot 3.5.7**
- **Spring Data JPA** - obsługa bazy danych
- **PostgreSQL** - baza danych
- **Lombok** - redukcja boilerplate code
- **SpringDoc OpenAPI** - automatyczna dokumentacja API (Swagger)
- **Java 21**
