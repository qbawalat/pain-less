# Architektura UI dla pAIN-less

## 1. Przegląd struktury UI

pAIN-less to aplikacja webowa z interfejsem inspirowanym Pip-Boy z Fallout, oferująca kompleksowe zarządzanie zdrowiem i suplementacją. Główna struktura UI opiera się na jednym widoku głównym z profilem zdrowotnym, uzupełnionym o dodatkowe widoki specjalistyczne. Interfejs wykorzystuje system toastów do powiadomień i oferuje uproszczony kalendarz w widoku głównym.

## 2. Lista widoków

### 2.1 Widok główny (/)
- **Główny cel**: Prezentacja kompleksowego profilu zdrowotnego użytkownika
- **Kluczowe informacje**:
  - Podstawowe dane zdrowotne (waga, wzrost, wiek)
  - Uproszczony kalendarz tygodniowy
  - Lista aktualnych suplementów
  - Ostatnie alerty zdrowotne
  - Kluczowe parametry użytkownika
- **Kluczowe komponenty**:
  - Panel statystyk zdrowotnych (styl Pip-Boy)
  - Mini-kalendarz tygodniowy
  - Lista suplementów z możliwością szybkiego dodawania
  - System toastów dla alertów
- **UX i dostępność**:
  - Responsywny układ z priorytetem dla urządzeń mobilnych
  - Wysoki kontrast dla lepszej czytelności
  - Klawiaturowa nawigacja
  - Czytelne etykiety i opisy

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
3. Interakcje z profilem:
   - Dodawanie/edycja suplementów
   - Przegląd alertów
   - Sprawdzanie kalendarza
4. Generowanie planu suplementacji:
   - Wywołanie AI
   - Przegląd rekomendacji
   - Akceptacja/odrzucenie planu
5. Nawigacja do widoków specjalistycznych:
   - Rozszerzony kalendarz
   - Ustawienia
   - Wyniki badań

## 4. Układ i struktura nawigacji

### 4.1 Główna nawigacja
- Pasek nawigacyjny z logo i menu
- System toastów dla alertów
- Szybki dostęp do kluczowych funkcji

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
- **SupplementList**: Lista suplementów z możliwością szybkiego dodawania
- **CalendarWidget**: Uproszczony widok kalendarza
- **AlertSystem**: System powiadomień i alertów
- **FormComponents**: Zestaw komponentów formularzy z walidacją
- **LoadingStates**: Komponenty stanów ładowania
- **ErrorBoundaries**: Obsługa błędów i wyjątków

### 5.2 Komponenty specjalistyczne
- **AIPrompt**: Interfejs generowania planu suplementacji
- **MedicalResultsTable**: Tabela wyników badań
- **SettingsPanel**: Panel ustawień użytkownika
- **ExtendedCalendar**: Rozszerzony widok kalendarza 