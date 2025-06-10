# Plan implementacji widoku głównego

## 1. Przegląd

Widok główny aplikacji pAIN-less prezentuje kompleksowy profil zdrowotny użytkownika w stylu Pip-Boy z Fallout. Zawiera podstawowe dane zdrowotne, uproszczony kalendarz tygodniowy, listę aktualnych suplementów oraz system alertów zdrowotnych. Widok jest zoptymalizowany pod kątem urządzeń mobilnych i zapewnia wysoką dostępność.

## 2. Routing widoku

- Ścieżka: `/`
- Middleware: Wymagana autentykacja
- Layout: Główny layout aplikacji

## 3. Struktura komponentów

```
MainView
├── NavigationBar
├── HealthStats
│   ├── BasicInfo
│   └── MedicalConditions
├── CalendarWidget
│   └── WeekView
├── SupplementList
│   └── SupplementItem
├── AlertSystem
│   └── AlertItem
└── ToastContainer
```

## 4. Szczegóły komponentów

### NavigationBar

- Opis: Główna nawigacja aplikacji z systemem powiadomień
- Główne elementy:
  - Logo aplikacji
  - Menu nawigacyjne
  - Profil użytkownika
- Obsługiwane interakcje:
  - Nawigacja między widokami
  - Otwieranie menu profilu
- Typy:
  - NavigationProps
  - UserProfile
- Propsy:
  - user: UserProfile
  - notifications: Notification[]

### HealthStats

- Opis: Panel statystyk zdrowotnych w stylu Pip-Boy
- Główne elementy:
  - Podstawowe dane (waga, wzrost, wiek)
  - Lista chorób i kontuzji
  - Historia rodzinna
- Obsługiwane interakcje:
  - Edycja danych
  - Rozwijanie/zwijanie sekcji
- Obsługiwana walidacja:
  - Waga > 0
  - Wzrost > 0
  - Data urodzenia wymagana
- Typy:
  - HealthProfileResponse
  - HealthProfileUpdate
- Propsy:
  - profile: HealthProfileResponse
  - onUpdate: (data: HealthProfileUpdate) => void

### CalendarWidget

- Opis: Uproszczony widok kalendarza tygodniowego
- Główne elementy:
  - Widok tygodniowy
  - Oznaczenia wydarzeń
  - Nawigacja między tygodniami
- Obsługiwane interakcje:
  - Przełączanie tygodni
  - Wyświetlanie szczegółów wydarzenia
- Typy:
  - CalendarEvent[]
  - WeekViewProps
- Propsy:
  - events: CalendarEvent[]
  - onEventClick: (event: CalendarEvent) => void

### SupplementList

- Opis: Lista aktualnych suplementów użytkownika
- Główne elementy:
  - Lista suplementów
  - Przycisk dodawania
  - Filtry i wyszukiwarka
- Obsługiwane interakcje:
  - Dodawanie suplementu
  - Edycja suplementu
  - Usuwanie suplementu
- Obsługiwana walidacja:
  - Data końcowa >= data początkowa
  - Dawka wymagana
  - Częstotliwość wymagana
- Typy:
  - UserSupplementResponse[]
  - UserSupplementCreate
- Propsy:
  - supplements: UserSupplementResponse[]
  - onAdd: (supplement: UserSupplementCreate) => void
  - onEdit: (id: string, supplement: UserSupplementCreate) => void
  - onDelete: (id: string) => void

### AlertSystem

- Opis: System alertów zdrowotnych
- Główne elementy:
  - Lista alertów
  - Przyciski akcji
  - Status alertu
- Obsługiwane interakcje:
  - Potwierdzanie alertu
  - Rozwijanie szczegółów
- Typy:
  - HealthAlertResponse[]
  - AlertType
- Propsy:
  - alerts: HealthAlertResponse[]
  - onAcknowledge: (id: string) => void

## 5. Typy

### HealthProfileViewModel

```typescript
interface HealthProfileViewModel {
  id: string;
  birthDate: Date;
  height: number;
  weight: number;
  medicalConditions: string[];
  familyConditions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### CalendarEventViewModel

```typescript
interface CalendarEventViewModel {
  id: string;
  type: "supplement" | "alert" | "medical";
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  status: "active" | "completed" | "cancelled";
}
```

## 6. Zarządzanie stanem

- Custom hook `useHealthProfile` do zarządzania profilem zdrowotnym
- Custom hook `useSupplements` do zarządzania suplementami
- Custom hook `useAlerts` do zarządzania alertami
- Context `CalendarContext` do zarządzania stanem kalendarza
- Local state dla komponentów formularzy

## 7. Integracja API

- GET /api/health-profiles - pobieranie profilu
- PUT /api/health-profiles - aktualizacja profilu
- GET /api/user-supplements - lista suplementów
- POST /api/user-supplements - dodawanie suplementu
- GET /api/health-alerts - lista alertów
- PUT /api/health-alerts/:id/acknowledge - potwierdzanie alertu

## 8. Interakcje użytkownika

- Aktualizacja danych profilu
- Zarządzanie suplementami
- Nawigacja w kalendarzu
- Potwierdzanie alertów
- Filtrowanie i wyszukiwanie

## 9. Warunki i walidacja

- Walidacja formularzy przed wysłaniem
- Sprawdzanie uprawnień użytkownika
- Weryfikacja dat i wartości numerycznych
- Obsługa limitów API
- Walidacja stanu komponentów

## 10. Obsługa błędów

- Wyświetlanie komunikatów błędów w toastach
- Fallback UI dla komponentów
- Retry mechanizm dla API calls
- Graceful degradation
- Error boundaries dla komponentów

## 11. Kroki implementacji

1. Przygotowanie struktury projektu i komponentów
2. Implementacja podstawowych komponentów UI
3. Integracja z API i zarządzanie stanem
4. Implementacja logiki biznesowej
5. Dodanie walidacji i obsługi błędów
6. Testy i optymalizacja
7. Dokumentacja i code review
