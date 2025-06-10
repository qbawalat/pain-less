# Plan implementacji widoku kalendarza suplementacji

## 1. Przegląd

Widok kalendarza suplementacji w aplikacji pAIN-less oferuje wizualizację harmonogramu przyjmowania suplementów użytkownika. Widok jest tylko do odczytu i pozwala na przeglądanie suplementów w kontekście czasowym.

## 2. Routing widoku

- Ścieżka: `/calendar`
- Middleware: Wymagana autentykacja
- Layout: Główny layout aplikacji

## 3. Struktura komponentów

```
CalendarView
├── NavigationBar
├── CalendarHeader
│   ├── ViewSelector
│   └── FilterPanel
├── CalendarGrid
│   ├── MonthView
│   ├── WeekView
│   └── DayView
└── SupplementTooltip
```

## 4. Szczegóły komponentów

### CalendarHeader

- Opis: Nagłówek kalendarza z kontrolkami widoku i filtrami
- Główne elementy:
  - Przełącznik widoku (miesiąc/tydzień/dzień)
  - Panel filtrów suplementów
  - Przyciski nawigacji
- Obsługiwane interakcje:
  - Zmiana widoku
  - Filtrowanie suplementów
  - Nawigacja między okresami
- Typy:
  - ViewType
  - SupplementFilterOptions
- Propsy:
  - currentView: ViewType
  - onViewChange: (view: ViewType) => void
  - onFilterChange: (filters: SupplementFilterOptions) => void

### CalendarGrid

- Opis: Główny komponent wyświetlający kalendarz z suplementami
- Główne elementy:
  - Siatka kalendarza
  - Komórki dni
  - Oznaczenia suplementów
- Obsługiwane interakcje:
  - Hover nad suplementem (tooltip)
  - Kliknięcie w dzień (wyświetlenie listy suplementów)
- Typy:
  - SupplementCalendarEvent[]
  - DateRange
- Propsy:
  - supplements: SupplementCalendarEvent[]
  - viewType: ViewType
  - onDateSelect: (date: Date) => void

### SupplementTooltip

- Opis: Tooltip wyświetlający szczegóły suplementu
- Główne elementy:
  - Nazwa suplementu
  - Dawka i częstotliwość
  - Status (przyjęty/pominięty)
- Typy:
  - SupplementCalendarEvent
- Propsy:
  - supplement: SupplementCalendarEvent
  - isOpen: boolean

## 5. Typy

### SupplementCalendarEvent

```typescript
interface SupplementCalendarEvent {
  id: string;
  supplementName: string;
  dosage: string;
  frequency: string;
  scheduledDate: Date;
  status: "scheduled" | "taken" | "missed";
  userSupplementId: string;
}
```

### SupplementFilterOptions

```typescript
interface SupplementFilterOptions {
  supplementIds: string[];
  dateRange: DateRange;
  status: string[];
  search: string;
}
```

### DateRange

```typescript
interface DateRange {
  start: Date;
  end: Date;
}
```

## 6. Zarządzanie stanem

- Custom hook `useSupplementCalendar` do pobierania harmonogramu suplementów
- Custom hook `useCalendarFilters` do zarządzania filtrami
- Local state dla widoku i nawigacji

## 7. Integracja API

- GET /api/supplements/calendar - pobieranie harmonogramu suplementów
- Wykorzystanie istniejących danych z user-supplements

## 8. Interakcje użytkownika

- Przełączanie widoków kalendarza (miesiąc/tydzień/dzień)
- Filtrowanie suplementów
- Nawigacja między okresami
- Przeglądanie szczegółów suplementów (tooltip)

## 9. Logika biznesowa

- Generowanie harmonogramu na podstawie user-supplements
- Obliczanie dat przyjmowania na podstawie częstotliwości
- Wyświetlanie statusu suplementów (zaplanowane/przyjęte/pominięte)

## 10. Obsługa błędów

- Wyświetlanie komunikatów w toastach
- Fallback UI dla komponentów
- Obsługa błędów sieciowych
- Error boundaries

## 11. Kroki implementacji

1. Przygotowanie struktury komponentów
2. Implementacja podstawowych widoków kalendarza
3. Dodanie systemu filtrów
4. Integracja z API suplementów
5. Dodanie tooltipów i szczegółów
6. Obsługa błędów i loading states
7. Testy i optymalizacja
