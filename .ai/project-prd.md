# Dokument wymagań produktu (PRD) - pAIN-less

## 1. Przegląd produktu

pAIN-less to aplikacja webowa wspomagana przez sztuczną inteligencję, której celem jest pomoc użytkownikom w zarządzaniu informacjami zdrowotnymi oraz suplementacją. Aplikacja nie zastępuje profesjonalnej opieki medycznej, a wszystkie rekomendacje, alerty i sugestie powinny być traktowane jako pomocnicze informacje wymagające konsultacji z lekarzem.

### 1.1 Główne funkcjonalności
- Profil zdrowotny użytkownika
- Kalendarz zdrowotny
- System planów suplementacji wspomagany AI
- Panel alertów zdrowotnych

### 1.2 Technologie
Frontend:
- Astro 5 jako główny framework do tworzenia szybkich, wydajnych stron
- React 19 dla komponentów interaktywnych
- TypeScript 5 dla statycznego typowania
- Tailwind 4 do stylowania
- Shadcn/ui jako biblioteka komponentów UI

Backend:
- Supabase jako Backend-as-a-Service
- PostgreSQL jako baza danych
- Wbudowany system autentykacji Supabase

AI:
- Openrouter.ai jako platforma do komunikacji z modelami AI
- Dostęp do różnych modeli (OpenAI, Anthropic, Google)

Infrastruktura:
- Github Actions do CI/CD
- DigitalOcean do hostowania
- Docker do konteneryzacji

## 2. Problem użytkownika

Głównym problemem jest rozproszenie i skomplikowanie w zarządzaniu informacjami zdrowotnymi oraz suplementacją. Użytkownicy:
- Nie mają pełnego obrazu swojego stanu zdrowia
- Mają trudności z podejmowaniem świadomych decyzji dotyczących suplementacji
- Są narażeni na potencjalnie niebezpieczne interakcje między suplementami
- Brakuje im spójnego systemu śledzenia historii zdrowotnej

## 3. Wymagania funkcjonalne

### 3.1 Profil zdrowotny
- Historia chorób i kontuzji
- Choroby występujące w rodzinie
- Lista przyjmowanych suplementów
- Wyniki badań medycznych
- Miesięczne przypomnienia o aktualizacji

### 3.2 Kalendarz zdrowotny
- Automatyczne oznaczenie wydarzeń z profilu
- Wizualizacja okresów suplementacji
- Dokładność oznaczeń na poziomie 95%

### 3.3 System planów suplementacji
- Analiza danych zdrowotnych użytkownika
- Generowanie spersonalizowanych rekomendacji
- Wykrywanie potencjalnych interakcji
- Proces weryfikacji i akceptacji planu
- Wskaźnik pewności AI dla rekomendacji

### 3.4 Panel alertów
- Regularne analizy AI stanu zdrowia
- Ostrzeżenia o potencjalnych zagrożeniach
- Dwa poziomy alertów: informacyjny i ostrzegawczy

## 4. Granice produktu

### 4.1 Co jest w zakresie MVP
- Profil zdrowotny z pełnymi informacjami
- Kalendarz zdrowotny z automatycznym oznaczaniem
- System planów suplementacji z AI i wskaźnikiem pewności
- Panel alertów zdrowotnych
- Wersja webowa

### 4.2 Co NIE jest w zakresie MVP
- Integracja z urządzeniami medycznymi
- Automatyczne przypomnienia o przyjmowaniu suplementów
- Funkcje społecznościowe
- Zaawansowana analityka i wykresy trendów
- Aplikacja mobilna
- Integracja z systemami opieki zdrowotnej
- System punktowy i poziomy użytkownika

## 5. Historyjki użytkowników

### US-001: Rejestracja i logowanie
Jako nowy użytkownik chcę się zarejestrować w systemie, aby uzyskać dostęp do aplikacji.

Kryteria akceptacji:
- Użytkownik może zarejestrować się przez email
- Użytkownik otrzymuje email weryfikacyjny
- Użytkownik może się zalogować po weryfikacji
- Użytkownik ma dostęp tylko do swoich danych
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-006).

### US-002: Aktualizacja profilu zdrowotnego
Jako użytkownik chcę aktualizować swój profil zdrowotny, aby system mógł generować trafne rekomendacje.

Kryteria akceptacji:
- Użytkownik może dodać nową chorobę/kontuzję
- Użytkownik może dodać choroby rodzinne
- Użytkownik może dodać suplementy
- Użytkownik może dodać wyniki badań
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-006).

### US-003: Przeglądanie kalendarza
Jako użytkownik chcę przeglądać swój kalendarz zdrowotny, aby śledzić wydarzenia.

Kryteria akceptacji:
- Kalendarz pokazuje wydarzenia z profilu
- Wydarzenia są poprawnie oznaczone (95% dokładność)
- Użytkownik widzi okresy suplementacji
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-006).

### US-004: Generowanie planu suplementacji
Jako użytkownik chcę otrzymać spersonalizowany plan suplementacji.

Kryteria akceptacji:
- System analizuje dane zdrowotne
- System generuje rekomendacje
- System wykrywa potencjalne interakcje
- System pokazuje wskaźnik pewności AI
- Użytkownik może zaakceptować lub odrzucić plan
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-006).

### US-005: Otrzymywanie alertów
Jako użytkownik chcę otrzymywać alerty o potencjalnych zagrożeniach.

Kryteria akceptacji:
- System wysyła alerty o interakcjach
- Alerty mają odpowiedni poziom (informacyjny/ostrzegawczy)
- Użytkownik musi potwierdzić ostrzeżenia
- Funkcjonalność nie jest dostępna bez logowania się do systemu (US-006).

### US-006: Bezpieczny dostęp i uwierzytelnianie

- Tytuł: Bezpieczny dostęp
- Opis: Jako użytkownik chcę mieć możliwość rejestracji i logowania się do systemu w sposób zapewniający bezpieczeństwo moich danych.
- Kryteria akceptacji:
  - Logowanie i rejestracja odbywają się na dedykowanych stronach.
  - Logowanie wymaga podania adresu email i hasła.
  - Rejestracja wymaga podania adresu email, hasła i potwierdzenia hasła.
  - Użytkownik NIE MOŻE korzystać z zadnych featureow bez logowania się do systemu (US-001, US-002, US-003, US-004, US-005).
  - Użytkownik może logować się do systemu poprzez przycisk w prawym górnym rogu.
  - Użytkownik może się wylogować z systemu poprzez przycisk w prawym górnym rogu w navbarze
  - Nie korzystamy z zewnętrznych serwisów logowania (np. Google, GitHub).
  - Odzyskiwanie hasła powinno być możliwe.

## 6. Metryki sukcesu

### 6.1 Metryki użytkownika
- 90% użytkowników regularnie aktualizuje profil
- 80% wygenerowanych planów jest akceptowanych
- Użytkownicy sprawdzają alerty raz w tygodniu
- Kalendarz poprawnie oznacza 95% wydarzeń

### 6.2 Metryki techniczne
- Czas ładowania strony < 3s
- Dostępność systemu 99.9%
- Dokładność rekomendacji AI > 80%
- Skuteczność wykrywania interakcji > 95%

### 6.3 Metryki biznesowe
- Wzrost regularności aktualizacji profilu
- Wzrost akceptacji planów suplementacji
- Wzrost częstotliwości sprawdzania alertów
- Wzrost dokładności oznaczeń w kalendarzu 