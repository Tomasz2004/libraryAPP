# Library API - Dokumentacja Endpointów

API dla systemu bibliotecznego z pełną obsługą wyszukiwania i filtrowania.

## Adres bazowy

```
http://localhost:8080/api
```

## Swagger UI

```
http://localhost:8080/swagger-ui.html
```

---

## 📚 KSIĄŻKI (`/api/ksiazki`)

### Wszystkie książki

```http
GET /api/ksiazki
```

### Książka po ID

```http
GET /api/ksiazki/{id}
```

### ⭐ FORMULARZ: Wyszukiwanie książek według autora, tytułu, gatunku lub roku wydania

```http
GET /api/ksiazki/search?tytul={tytul}&autor={autor}&gatunek={gatunek}&rokWydania={rok}
```

**Parametry (wszystkie opcjonalne):**

- `tytul` - fragment tytułu książki (ignoruje wielkość liter)
- `autor` - fragment nazwiska autora (ignoruje wielkość liter)
- `gatunek` - dokładny gatunek
- `rokWydania` - rok wydania

**Przykłady:**

```
GET /api/ksiazki/search?tytul=sql
GET /api/ksiazki/search?autor=kowalski
GET /api/ksiazki/search?gatunek=Nauka&rokWydania=2018
GET /api/ksiazki/search?tytul=pan&autor=mickiewicz
```

### Inne endpointy książek

```http
GET /api/ksiazki/tytul/{tytul}         # Po tytule
GET /api/ksiazki/autor/{autor}         # Po autorze
GET /api/ksiazki/gatunek/{gatunek}     # Po gatunku
GET /api/ksiazki/rok/{rok}             # Po roku wydania
```

---

## 📋 WYPOŻYCZENIA (`/api/wypozyczenia`)

### Wszystkie wypożyczenia

```http
GET /api/wypozyczenia
```

### Wypożyczenie po ID

```http
GET /api/wypozyczenia/{id}
```

### ⭐ FORMULARZ: Lista wypożyczeń z filtrowaniem po zakresie dat i użytkowniku

```http
GET /api/wypozyczenia/search?dataOd={dataOd}&dataDo={dataDo}&czytelnikId={id}
```

**Parametry (wszystkie opcjonalne):**

- `dataOd` - data początkowa zakresu (format: YYYY-MM-DD)
- `dataDo` - data końcowa zakresu (format: YYYY-MM-DD)
- `czytelnikId` - ID czytelnika

**Przykłady:**

```
GET /api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30
GET /api/wypozyczenia/search?czytelnikId=1
GET /api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30&czytelnikId=1
```

### Inne endpointy wypożyczeń

```http
GET /api/wypozyczenia/czytelnik/{czytelnikId}  # Wypożyczenia danego czytelnika
GET /api/wypozyczenia/aktywne                   # Aktywne (nie zwrócone)
GET /api/wypozyczenia/zwrocone                  # Zwrócone
```

---

## 📖 EGZEMPLARZE (`/api/egzemplarze`)

### Wszystkie egzemplarze

```http
GET /api/egzemplarze
```

### Egzemplarz po ID

```http
GET /api/egzemplarze/{id}
```

### ⭐ FORMULARZ: Filtr dostępności książek

```http
GET /api/egzemplarze/search?status={status}&bibliotekaId={id}
```

**Parametry (opcjonalne):**

- `status` - dostepny / wypozyczony / zablokowany
- `bibliotekaId` - ID biblioteki

**Przykłady:**

```
GET /api/egzemplarze/search?status=dostepny
GET /api/egzemplarze/search?status=wypozyczony
GET /api/egzemplarze/search?bibliotekaId=1
GET /api/egzemplarze/search?status=dostepny&bibliotekaId=1
```

### Inne endpointy egzemplarzy

```http
GET /api/egzemplarze/status/{status}            # Po statusie
GET /api/egzemplarze/dostepne                   # Dostępne
GET /api/egzemplarze/wypozyczone                # Wypożyczone
GET /api/egzemplarze/ksiazka/{ksiazkaId}        # Danej książki
GET /api/egzemplarze/biblioteka/{bibliotekaId}  # Z danej biblioteki
```

---

## 👤 CZYTELNICY (`/api/czytelnicy`)

### Wszystkie czytelnicy

```http
GET /api/czytelnicy
```

### Czytelnik po ID

```http
GET /api/czytelnicy/{id}
```

### ⭐ FORMULARZ: Filtr czytelników z aktywnymi/nieaktywnymi wypożyczeniami

```http
GET /api/czytelnicy?filterType={filterType}&aktywny={aktywny}
```

**Parametry (opcjonalne):**

- `filterType` - activeLoans / noActiveLoans
- `aktywny` - true / false (aktywność konta)

**Przykłady:**

```
GET /api/czytelnicy?filterType=activeLoans      # Z aktywnymi wypożyczeniami
GET /api/czytelnicy?filterType=noActiveLoans    # Bez aktywnych wypożyczeń
GET /api/czytelnicy?aktywny=true                # Aktywne konta
GET /api/czytelnicy?aktywny=false               # Nieaktywne konta
```

### Inne endpointy czytelników

```http
GET /api/czytelnicy/active-loans       # Z aktywnymi wypożyczeniami
GET /api/czytelnicy/no-active-loans    # Bez aktywnych wypożyczeń
```

---

## ✍️ AUTORZY (`/api/autorzy`)

### Wszystkie autorzy

```http
GET /api/autorzy
```

### Autor po ID

```http
GET /api/autorzy/{id}
```

### Wyszukiwanie autorów

```http
GET /api/autorzy/search?nazwisko={nazwisko}  # Wyszukiwanie po nazwisku
GET /api/autorzy/kraj/{kraj}                 # Po kraju
```

---

## 🏛️ BIBLIOTEKI (`/api/biblioteki`)

### Wszystkie biblioteki

```http
GET /api/biblioteki
```

### Biblioteka po ID

```http
GET /api/biblioteki/{id}
```

---

## 👨‍💼 PRACOWNICY (`/api/pracownicy`)

### Wszyscy pracownicy

```http
GET /api/pracownicy
```

### Pracownik po ID

```http
GET /api/pracownicy/{id}
```

### Filtrowanie pracowników

```http
GET /api/pracownicy/biblioteka/{bibliotekaId}  # Z danej biblioteki
GET /api/pracownicy/stanowisko/{stanowisko}    # Po stanowisku
```

---

## 📊 Podsumowanie formularzy

### 1. Wyszukiwanie książek

```
GET /api/ksiazki/search?tytul=&autor=&gatunek=&rokWydania=
```

### 2. Lista wypożyczeń z filtrowaniem

```
GET /api/wypozyczenia/search?dataOd=&dataDo=&czytelnikId=
```

### 3. Filtr dostępności książek

```
GET /api/egzemplarze/search?status=&bibliotekaId=
```

### 4. Filtr czytelników

```
GET /api/czytelnicy?filterType=activeLoans|noActiveLoans&aktywny=true|false
```

---

## Uruchomienie aplikacji

1. Upewnij się, że PostgreSQL działa i baza danych `librarydb` istnieje
2. Uruchom skrypt SQL do utworzenia tabel
3. Uruchom aplikację:

```bash
./mvnw spring-boot:run
```

4. API będzie dostępne pod adresem: `http://localhost:8080/api`
5. Swagger UI: `http://localhost:8080/swagger-ui.html`

## Konfiguracja

Edytuj plik `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://172.18.128.1:5432/librarydb
spring.datasource.username=postgres
spring.datasource.password=admin
```
