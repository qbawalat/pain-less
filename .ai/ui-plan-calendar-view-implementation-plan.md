# Plan implementacji widoku rozszerzonego kalendarza

## 1. Przegląd
Widok rozszerzonego kalendarza w aplikacji pAIN-less oferuje szczegółowy widok wydarzeń zdrowotnych, w tym okresów suplementacji, historii badań i wizyt. Widok zapewnia zaawansowane funkcje filtrowania i wizualizacji danych zdrowotnych w kontekście czasowym.

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
├── EventList
│   └── EventItem
├── EventDetails
│   └── EventForm
└── ToastContainer
```

## 4. Szczegóły komponentów

### CalendarHeader
- Opis: Nagłówek kalendarza z kontrolkami widoku i filtrami
- Główne elementy:
  - Przełącznik widoku (miesiąc/tydzień/dzień)
  - Panel filtrów
  - Przyciski nawigacji
- Obsługiwane interakcje:
  - Zmiana widoku
  - Filtrowanie wydarzeń
  - Nawigacja między okresami
- Typy:
  - ViewType
  - FilterOptions
- Propsy:
  - currentView: ViewType
  - onViewChange: (view: ViewType) => void
  - onFilterChange: (filters: FilterOptions) => void

### CalendarGrid
- Opis: Główny komponent wyświetlający kalendarz
- Główne elementy:
  - Siatka kalendarza
  - Komórki dni
  - Oznaczenia wydarzeń
- Obsługiwane interakcje:
  - Kliknięcie w dzień
  - Przeciąganie wydarzeń
  - Zaznaczanie zakresu
- Obsługiwana walidacja:
  - Sprawdzanie dostępności terminów
  - Walidacja nakładających się wydarzeń
- Typy:
  - CalendarEvent[]
  - DateRange
- Propsy:
  - events: CalendarEvent[]
  - viewType: ViewType
  - onEventClick: (event: CalendarEvent) => void
  - onDateSelect: (date: Date) => void

### EventList
- Opis: Lista wydarzeń dla wybranego okresu
- Główne elementy:
  - Lista wydarzeń
  - Grupowanie po typie
  - Sortowanie
- Obsługiwane interakcje:
  - Wybór wydarzenia
  - Filtrowanie
  - Sortowanie
- Typy:
  - CalendarEvent[]
  - EventGroup
- Propsy:
  - events: CalendarEvent[]
  - onEventSelect: (event: CalendarEvent) => void
  - onEventUpdate: (event: CalendarEvent) => void

### EventDetails
- Opis: Panel szczegółów wydarzenia
- Główne elementy:
  - Formularz wydarzenia
  - Przyciski akcji
  - Historia zmian
- Obsługiwane interakcje:
  - Edycja wydarzenia
  - Usuwanie wydarzenia
  - Przeglądanie historii
- Obsługiwana walidacja:
  - Wymagane pola
  - Konflikty terminów
  - Poprawność dat
- Typy:
  - CalendarEvent
  - EventHistory
- Propsy:
  - event: CalendarEvent
  - onSave: (event: CalendarEvent) => void
  - onDelete: (id: string) => void

## 5. Typy

### CalendarEventViewModel
```typescript
interface CalendarEventViewModel {
  id: string;
  type: 'supplement' | 'medical' | 'visit' | 'test';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category: string;
  metadata: Record<string, any>;
}
```

### FilterOptions
```typescript
interface FilterOptions {
  types: string[];
  dateRange: DateRange;
  status: string[];
  priority: string[];
  search: string;
}
```

## 6. Zarządzanie stanem
- Custom hook `useCalendarEvents` do zarządzania wydarzeniami
- Custom hook `useCalendarFilters` do zarządzania filtrami
- Context `CalendarContext` do współdzielenia stanu kalendarza
- Local state dla formularzy i interakcji

## 7. Integracja API
- GET /api/calendar/events - pobieranie wydarzeń
- POST /api/calendar/events - tworzenie wydarzenia
- PUT /api/calendar/events/:id - aktualizacja wydarzenia
- DELETE /api/calendar/events/:id - usuwanie wydarzenia
- GET /api/calendar/events/history - historia zmian

## 8. Interakcje użytkownika
- Przełączanie widoków kalendarza
- Filtrowanie wydarzeń
- Dodawanie nowych wydarzeń
- Edycja istniejących wydarzeń
- Usuwanie wydarzeń
- Przeglądanie historii

## 9. Warunki i walidacja
- Walidacja dat i zakresów
- Sprawdzanie konfliktów terminów
- Weryfikacja uprawnień użytkownika
- Walidacja formularzy
- Obsługa limitów API

## 10. Obsługa błędów
- Wyświetlanie komunikatów w toastach
- Fallback UI dla komponentów
- Obsługa błędów sieciowych
- Walidacja danych
- Error boundaries

## 11. Kroki implementacji
1. Przygotowanie struktury komponentów
2. Implementacja podstawowych widoków kalendarza
3. Dodanie systemu filtrów
4. Implementacja zarządzania wydarzeniami
5. Integracja z API
6. Dodanie walidacji i obsługi błędów
7. Testy i optymalizacja
8. Dokumentacja 