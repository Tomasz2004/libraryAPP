# Przykładowe wywołania API - Library API

## Testy formularzy

### 1. FORMULARZ: Wyszukiwanie książek według autora, tytułu, gatunku lub roku wydania

```bash
# Wyszukiwanie po tytule
curl "http://localhost:8080/api/ksiazki/search?tytul=sql"

# Wyszukiwanie po autorze
curl "http://localhost:8080/api/ksiazki/search?autor=kowalski"

# Wyszukiwanie po gatunku
curl "http://localhost:8080/api/ksiazki/search?gatunek=Nauka"

# Wyszukiwanie po roku wydania
curl "http://localhost:8080/api/ksiazki/search?rokWydania=2018"

# Kombinacja kilku parametrów
curl "http://localhost:8080/api/ksiazki/search?tytul=pan&autor=mickiewicz"
curl "http://localhost:8080/api/ksiazki/search?gatunek=Nauka&rokWydania=2018"
```

### 2. FORMULARZ: Lista wypożyczeń z filtrowaniem po zakresie dat i użytkowniku

```bash
# Wypożyczenia w zakresie dat
curl "http://localhost:8080/api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30"

# Wypożyczenia konkretnego czytelnika
curl "http://localhost:8080/api/wypozyczenia/search?czytelnikId=1"

# Kombinacja: zakres dat + czytelnik
curl "http://localhost:8080/api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30&czytelnikId=1"

# Wszystkie wypożyczenia
curl "http://localhost:8080/api/wypozyczenia/search"
```

### 3. FORMULARZ: Filtr dostępności książek

```bash
# Dostępne egzemplarze
curl "http://localhost:8080/api/egzemplarze/search?status=dostepny"

# Wypożyczone egzemplarze
curl "http://localhost:8080/api/egzemplarze/search?status=wypozyczony"

# Zablokowane egzemplarze
curl "http://localhost:8080/api/egzemplarze/search?status=zablokowany"

# Egzemplarze w konkretnej bibliotece
curl "http://localhost:8080/api/egzemplarze/search?bibliotekaId=1"

# Dostępne w konkretnej bibliotece
curl "http://localhost:8080/api/egzemplarze/search?status=dostepny&bibliotekaId=1"
```

### 4. FORMULARZ: Filtr czytelników

```bash
# Czytelnicy z aktywnymi wypożyczeniami
curl "http://localhost:8080/api/czytelnicy?filterType=activeLoans"

# Czytelnicy bez aktywnych wypożyczeń
curl "http://localhost:8080/api/czytelnicy?filterType=noActiveLoans"

# Tylko aktywni czytelnicy (konto aktywne)
curl "http://localhost:8080/api/czytelnicy?aktywny=true"

# Tylko nieaktywni czytelnicy (konto nieaktywne)
curl "http://localhost:8080/api/czytelnicy?aktywny=false"

# Alternatywne endpointy
curl "http://localhost:8080/api/czytelnicy/active-loans"
curl "http://localhost:8080/api/czytelnicy/no-active-loans"
```

---

## Testy podstawowych endpointów

### Książki

```bash
# Wszystkie książki
curl http://localhost:8080/api/ksiazki

# Książka po ID
curl http://localhost:8080/api/ksiazki/1

# Po tytule
curl http://localhost:8080/api/ksiazki/tytul/SQL

# Po autorze
curl http://localhost:8080/api/ksiazki/autor/kowalski

# Po gatunku
curl http://localhost:8080/api/ksiazki/gatunek/Nauka

# Po roku
curl http://localhost:8080/api/ksiazki/rok/2018
```

### Wypożyczenia

```bash
# Wszystkie wypożyczenia
curl http://localhost:8080/api/wypozyczenia

# Wypożyczenie po ID
curl http://localhost:8080/api/wypozyczenia/1

# Wypożyczenia danego czytelnika
curl http://localhost:8080/api/wypozyczenia/czytelnik/1

# Aktywne wypożyczenia
curl http://localhost:8080/api/wypozyczenia/aktywne

# Zwrócone wypożyczenia
curl http://localhost:8080/api/wypozyczenia/zwrocone
```

### Egzemplarze

```bash
# Wszystkie egzemplarze
curl http://localhost:8080/api/egzemplarze

# Egzemplarz po ID
curl http://localhost:8080/api/egzemplarze/1

# Dostępne
curl http://localhost:8080/api/egzemplarze/dostepne

# Wypożyczone
curl http://localhost:8080/api/egzemplarze/wypozyczone

# Danej książki
curl http://localhost:8080/api/egzemplarze/ksiazka/1

# Z danej biblioteki
curl http://localhost:8080/api/egzemplarze/biblioteka/1
```

### Czytelnicy

```bash
# Wszyscy czytelnicy
curl http://localhost:8080/api/czytelnicy

# Czytelnik po ID
curl http://localhost:8080/api/czytelnicy/1
```

### Autorzy

```bash
# Wszyscy autorzy
curl http://localhost:8080/api/autorzy

# Autor po ID
curl http://localhost:8080/api/autorzy/1

# Wyszukiwanie po nazwisku
curl "http://localhost:8080/api/autorzy/search?nazwisko=kowalski"

# Po kraju
curl http://localhost:8080/api/autorzy/kraj/Polska
```

### Biblioteki

```bash
# Wszystkie biblioteki
curl http://localhost:8080/api/biblioteki

# Biblioteka po ID
curl http://localhost:8080/api/biblioteki/1
```

### Pracownicy

```bash
# Wszyscy pracownicy
curl http://localhost:8080/api/pracownicy

# Pracownik po ID
curl http://localhost:8080/api/pracownicy/1

# Z danej biblioteki
curl http://localhost:8080/api/pracownicy/biblioteka/1

# Po stanowisku
curl http://localhost:8080/api/pracownicy/stanowisko/bibliotekarz
```

---

## Testowanie z formatowaniem JSON (wymaga jq)

```bash
# Zainstaluj jq jeśli nie masz:
# sudo apt install jq

# Przykłady z formatowaniem:
curl -s http://localhost:8080/api/ksiazki | jq

curl -s "http://localhost:8080/api/ksiazki/search?tytul=sql" | jq

curl -s "http://localhost:8080/api/wypozyczenia/search?dataOd=2025-11-01&dataDo=2025-11-30" | jq

curl -s "http://localhost:8080/api/egzemplarze/search?status=dostepny" | jq

curl -s "http://localhost:8080/api/czytelnicy?filterType=activeLoans" | jq
```
