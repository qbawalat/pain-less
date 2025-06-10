# Plan implementacji widoku wyników badań

## 1. Przegląd

Widok wyników badań w aplikacji pAIN-less umożliwia zarządzanie i przegląd wyników badań medycznych. Zawiera historię badań, wykresy trendów oraz notatki medyczne. Widok zapewnia zaawansowane funkcje wizualizacji i analizy danych zdrowotnych.

## 2. Routing widoku

- Ścieżka: `/medical-results`
- Middleware: Wymagana autentykacja
- Layout: Główny layout aplikacji

## 3. Struktura komponentów

```
MedicalResultsView
├── NavigationBar
├── ResultsLayout
│   ├── ResultsSidebar
│   └── ResultsContent
├── ResultsTable
│   └── ResultRow
├── ResultsChart
│   └── TrendLine
├── ResultsForm
│   └── ResultInput
├── NotesSection
│   └── NoteEditor
└── ToastContainer
```

## 4. Szczegóły komponentów

### ResultsLayout

- Opis: Główny układ widoku wyników
- Główne elementy:
  - Sidebar z filtrami
  - Obszar zawartości
  - Nagłówek sekcji
- Obsługiwane interakcje:
  - Filtrowanie wyników
  - Przełączanie widoków
- Typy:
  - ResultsView
  - FilterOptions
- Propsy:
  - currentView: ResultsView
  - onViewChange: (view: ResultsView) => void
  - onFilterChange: (filters: FilterOptions) => void

### ResultsTable

- Opis: Tabela wyników badań
- Główne elementy:
  - Nagłówki kolumn
  - Wiersze wyników
  - Sortowanie
- Obsługiwane interakcje:
  - Sortowanie wyników
  - Filtrowanie
  - Wybór wyniku
- Obsługiwana walidacja:
  - Format danych
  - Zakresy wartości
- Typy:
  - MedicalResult[]
  - SortOptions
- Propsy:
  - results: MedicalResult[]
  - onSort: (options: SortOptions) => void
  - onResultSelect: (result: MedicalResult) => void

### ResultsChart

- Opis: Wykres trendów wyników
- Główne elementy:
  - Wykres liniowy
  - Oś czasu
  - Legenda
- Obsługiwane interakcje:
  - Zoom
  - Przesuwanie
  - Wybór zakresu
- Typy:
  - ChartData
  - TimeRange
- Propsy:
  - data: ChartData
  - timeRange: TimeRange
  - onRangeChange: (range: TimeRange) => void

### ResultsForm

- Opis: Formularz dodawania wyników
- Główne elementy:
  - Pola formularza
  - Walidacja
  - Przyciski akcji
- Obsługiwane interakcje:
  - Wprowadzanie danych
  - Walidacja
  - Zapisywanie
- Obsługiwana walidacja:
  - Wymagane pola
  - Format danych
  - Zakresy wartości
- Typy:
  - MedicalResultInput
  - ValidationRules
- Propsy:
  - onSubmit: (data: MedicalResultInput) => void
  - validationRules: ValidationRules

### NotesSection

- Opis: Sekcja notatek medycznych
- Główne elementy:
  - Edytor notatek
  - Historia notatek
  - Tagi
- Obsługiwane interakcje:
  - Edycja notatek
  - Dodawanie tagów
  - Przeglądanie historii
- Typy:
  - MedicalNote
  - NoteTag
- Propsy:
  - notes: MedicalNote[]
  - onNoteSave: (note: MedicalNote) => void
  - onTagAdd: (tag: NoteTag) => void

## 5. Typy

### MedicalResult

```typescript
interface MedicalResult {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: Date;
  referenceRange: {
    min: number;
    max: number;
  };
  status: "normal" | "abnormal" | "critical";
  notes?: string;
  attachments?: string[];
}
```

### ChartData

```typescript
interface ChartData {
  results: {
    date: Date;
    value: number;
    type: string;
  }[];
  referenceRanges: {
    type: string;
    min: number;
    max: number;
  }[];
  trends: {
    type: string;
    direction: "up" | "down" | "stable";
    significance: number;
  }[];
}
```

### MedicalNote

```typescript
interface MedicalNote {
  id: string;
  resultId: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}
```

## 6. Zarządzanie stanem

- Custom hook `useMedicalResults` do zarządzania wynikami
- Custom hook `useResultsChart` do zarządzania wykresami
- Custom hook `useMedicalNotes` do zarządzania notatkami
- Local state dla formularzy
- Context `ResultsContext` do współdzielenia stanu

## 7. Integracja API

- GET /api/medical-results - pobieranie wyników
- POST /api/medical-results - dodawanie wyniku
- PUT /api/medical-results/:id - aktualizacja wyniku
- DELETE /api/medical-results/:id - usuwanie wyniku
- GET /api/medical-results/chart - dane do wykresu
- GET /api/medical-results/notes - notatki
- POST /api/medical-results/notes - dodawanie notatki

## 8. Interakcje użytkownika

- Przeglądanie wyników
- Dodawanie nowych wyników
- Edycja istniejących wyników
- Analiza trendów
- Zarządzanie notatkami
- Eksport danych

## 9. Warunki i walidacja

- Walidacja formularzy
- Sprawdzanie zakresów referencyjnych
- Weryfikacja formatu danych
- Walidacja dat
- Obsługa limitów API

## 10. Obsługa błędów

- Wyświetlanie komunikatów w toastach
- Fallback UI dla komponentów
- Obsługa błędów sieciowych
- Walidacja danych
- Error boundaries

## 11. Kroki implementacji

1. Przygotowanie struktury komponentów
2. Implementacja tabeli wyników
3. Dodanie wykresów trendów
4. Implementacja formularzy
5. Integracja z API
6. Dodanie systemu notatek
7. Implementacja walidacji
8. Testy i optymalizacja
9. Dokumentacja
