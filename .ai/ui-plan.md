# Architektura UI dla pAIN-less

## 1. Przegląd struktury UI

pAIN-less to aplikacja webowa z interfejsem inspirowanym Pip-Boy z Fallout, oferująca kompleksowe zarządzanie zdrowiem i suplementacją. Główna struktura UI opiera się na jednym widoku głównym z profilem zdrowotnym, uzupełnionym o dodatkowe widoki specjalistyczne. Interfejs wykorzystuje system toastów do powiadomień i oferuje uproszczony kalendarz w widoku głównym.

## 2. Lista widoków

### 2.1 Widok główny (/)

- **Główny cel**: Prezentacja kompleksowego profilu zdrowotnego użytkownika z możliwością AI analizy
- **Kluczowe informacje**:
  - Podstawowe dane zdrowotne (waga, wzrost, wiek)
  - Uproszczony kalendarz tygodniowy
  - Lista aktualnych suplementów
  - Ostatnie alerty zdrowotne
  - Kluczowe parametry użytkownika
  - **Centralny przycisk AI analizy zdrowotnej**
- **Kluczowe komponenty**:
  - Panel statystyk zdrowotnych (styl Pip-Boy)
  - **AIHealthAnalysisButton** - centralny, prominentny przycisk do generowania AI analizy
  - Mini-kalendarz tygodniowy
  - Lista suplementów z możliwością szybkiego dodawania
  - System toastów dla alertów
- **UX i dostępność**:
  - Responsywny układ z priorytetem dla urządzeń mobilnych
  - **Centralny CTA (Call-to-Action) dla AI analizy** - widoczny i łatwo dostępny
  - Wysoki kontrast dla lepszej czytelności
  - Klawiaturowa nawigacja
  - Czytelne etykiety i opisy
- **Interakcje AI**:
  - **Przycisk "Ask AI for Health Analysis"** - centralnie umieszczony między głównymi sekcjami
  - Integracja z `/api/kindly-ask-for/health-analysis`
  - Loading state podczas generowania analizy
  - Wyświetlanie wyników w modal/toast
  - Animacje i feedback dla lepszego UX

### 2.2 Rozszerzony kalendarz (/calendar)

- **Główny cel**: Szczegółowy widok wydarzeń zdrowotnych
- **Kluczowe informacje**:
  - Pełny kalendarz z oznaczeniami wydarzeń
  - Okresy suplementacji
  - Historia badań i wizyt
- **Kluczowe komponenty**:
  - Interaktywny kalendarz
  - Filtry wydarzeń
  - Legenda oznaczeń
- **UX i dostępność**:
  - Możliwość przełączania widoków (tydzień/miesiąc)
  - Filtrowanie po typie wydarzenia
  - Wsparcie dla czytników ekranu

### 2.3 Ustawienia użytkownika (/settings)

- **Główny cel**: Zarządzanie preferencjami i danymi użytkownika
- **Kluczowe informacje**:
  - Dane osobowe
  - Preferencje powiadomień
  - Ustawienia prywatności
- **Kluczowe komponenty**:
  - Formularze ustawień
  - Przełączniki preferencji
  - Panel prywatności
- **UX i dostępność**:
  - Proste formularze z walidacją
  - Potwierdzenia zmian
  - Jasne opisy ustawień

### 2.4 Wyniki badań (/medical-results)

- **Główny cel**: Zarządzanie i przegląd wyników badań
- **Kluczowe informacje**:
  - Historia badań
  - Wykresy trendów
  - Notatki medyczne
- **Kluczowe komponenty**:
  - Tabela wyników
  - Wykresy zmian
  - Formularz dodawania wyników
- **UX i dostępność**:
  - Sortowanie i filtrowanie wyników
  - Eksport danych
  - Wsparcie dla różnych formatów dat

## 3. Mapa podróży użytkownika

### 3.1 Główny przepływ

1. Logowanie/Rejestracja
2. Widok główny z profilem zdrowotnym
3. **Interakcja z AI analizą** (nowy kluczowy punkt):
   - Kliknięcie centralnego przycisku AI analizy
   - Oczekiwanie na wyniki (loading state)
   - Przegląd rekomendacji AI
   - Działania na podstawie analizy
4. Interakcje z profilem:
   - Dodawanie/edycja suplementów
   - Przegląd alertów
   - Sprawdzanie kalendarza
5. Generowanie planu suplementacji:
   - Wywołanie AI
   - Przegląd rekomendacji
   - Akceptacja/odrzucenie planu
6. Nawigacja do widoków specjalistycznych:
   - Rozszerzony kalendarz
   - Ustawienia
   - Wyniki badań

## 4. Układ i struktura nawigacji

### 4.1 Główna nawigacja

- Pasek nawigacyjny z logo i menu
- System toastów dla alertów
- Szybki dostęp do kluczowych funkcji
- **Centralny przycisk AI - główny CTA ekranu**

### 4.2 Struktura menu

- Profil (strona główna)
- Kalendarz
- Ustawienia
- Wyniki badań

### 4.3 Nawigacja kontekstowa

- Breadcrumbs dla głębszych widoków
- Szybki powrót do widoku głównego
- Filtry i wyszukiwanie

## 5. Kluczowe komponenty

### 5.1 Komponenty wspólne

- **NavigationBar**: Główna nawigacja z systemem toastów
- **HealthStats**: Panel statystyk zdrowotnych w stylu Pip-Boy
- **AIHealthAnalysisButton**: Centralny przycisk do generowania AI analizy zdrowotnej
- **SupplementList**: Lista suplementów z możliwością szybkiego dodawania
- **CalendarWidget**: Uproszczony widok kalendarza
- **AlertSystem**: System powiadomień i alertów
- **FormComponents**: Zestaw komponentów formularzy z walidacją
- **LoadingStates**: Komponenty stanów ładowania
- **ErrorBoundaries**: Obsługa błędów i wyjątków

### 5.2 Komponenty specjalistyczne

- **AIPrompt**: Interfejs generowania planu suplementacji
- **AIAnalysisModal**: Modal do wyświetlania wyników AI analizy zdrowotnej
- **MedicalResultsTable**: Tabela wyników badań
- **SettingsPanel**: Panel ustawień użytkownika
- **ExtendedCalendar**: Rozszerzony widok kalendarza

## 6. AI Health Analysis - szczegóły implementacji

### 6.1 AIHealthAnalysisButton

- **Położenie**: Centrum ekranu, między sekcją HealthStats a resztą komponentów
- **Wygląd**: Duży, prominentny przycisk w stylu Pip-Boy z ikoną AI/mózgu
- **Tekst**: "Ask AI for Health Analysis" / "Poproś AI o analizę zdrowia"
- **Stany**:
  - Domyślny: Aktywny, zachęcający do kliknięcia
  - Loading: Animacja ładowania z tekstem "Analyzing..."
  - Success: Krótka animacja sukcesu przed wyświetleniem wyników
  - Error: Stan błędu z możliwością ponownej próby

### 6.2 Integracja z API

- **Endpoint**: `/api/kindly-ask-for/health-analysis`
- **Metoda**: GET request
- **Obsługa błędów**: Toast notifications + retry option
- **Wyniki**: Modal z analizą AI lub toast z kluczowymi insights

### 6.3 UX Flow

1. Użytkownik widzi centralny przycisk na home screen
2. Klik aktywuje loading state
3. Request do AI endpoint
4. Wyświetlenie wyników w czytelnej formie
5. Opcje działań na podstawie analizy (dodaj supplement, umów wizytę, etc.)
