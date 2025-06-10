# Plan implementacji widoku ustawień użytkownika

## 1. Przegląd

Widok ustawień użytkownika w aplikacji pAIN-less umożliwia zarządzanie preferencjami i danymi użytkownika. Zawiera sekcje do zarządzania danymi osobowymi, preferencjami powiadomień oraz ustawieniami prywatności.

## 2. Routing widoku

- Ścieżka: `/settings`
- Middleware: Wymagana autentykacja
- Layout: Główny layout aplikacji

## 3. Struktura komponentów

```
SettingsView
├── NavigationBar
├── SettingsLayout
│   ├── SettingsSidebar
│   └── SettingsContent
├── PersonalDataSection
│   └── PersonalDataForm
├── NotificationSettingsSection
│   └── NotificationPreferences
├── PrivacySettingsSection
│   └── PrivacyControls
└── ToastContainer
```

## 4. Szczegóły komponentów

### SettingsLayout

- Opis: Główny układ widoku ustawień
- Główne elementy:
  - Sidebar z nawigacją
  - Obszar zawartości
  - Nagłówek sekcji
- Obsługiwane interakcje:
  - Przełączanie sekcji
  - Nawigacja
- Typy:
  - SettingsSection
- Propsy:
  - currentSection: SettingsSection
  - onSectionChange: (section: SettingsSection) => void

### PersonalDataSection

- Opis: Sekcja danych osobowych
- Główne elementy:
  - Formularz danych
  - Przyciski akcji
  - Walidacja
- Obsługiwane interakcje:
  - Edycja danych
  - Zapisywanie zmian
- Obsługiwana walidacja:
  - Wymagane pola
  - Format danych
  - Unikalność
- Typy:
  - PersonalData
  - ValidationRules
- Propsy:
  - data: PersonalData
  - onSave: (data: PersonalData) => void
  - validationRules: ValidationRules

### NotificationSettingsSection

- Opis: Sekcja preferencji powiadomień
- Główne elementy:
  - Lista preferencji
  - Przełączniki
  - Kategorie
- Obsługiwane interakcje:
  - Włączanie/wyłączanie powiadomień
  - Ustawianie preferencji
- Typy:
  - NotificationPreferences
  - NotificationCategory
- Propsy:
  - preferences: NotificationPreferences
  - onPreferenceChange: (pref: NotificationPreference) => void

### PrivacySettingsSection

- Opis: Sekcja ustawień prywatności
- Główne elementy:
  - Kontrolki prywatności
  - Opcje udostępniania
  - Historia aktywności
- Obsługiwane interakcje:
  - Zmiana ustawień
  - Eksport danych
  - Usuwanie konta
- Obsługiwana walidacja:
  - Potwierdzenie akcji
  - Weryfikacja tożsamości
- Typy:
  - PrivacySettings
  - DataExportOptions
- Propsy:
  - settings: PrivacySettings
  - onSettingsChange: (settings: PrivacySettings) => void
  - onDataExport: (options: DataExportOptions) => void

## 5. Typy

### PersonalData

```typescript
interface PersonalData {
  id: string;
  email: string;
  name: string;
  birthDate: Date;
  phone?: string;
  language: string;
  timezone: string;
  updatedAt: Date;
}
```

### NotificationPreferences

```typescript
interface NotificationPreferences {
  email: {
    healthAlerts: boolean;
    supplementReminders: boolean;
    systemUpdates: boolean;
  };
  push: {
    healthAlerts: boolean;
    supplementReminders: boolean;
    systemUpdates: boolean;
  };
  frequency: "immediate" | "daily" | "weekly";
}
```

### PrivacySettings

```typescript
interface PrivacySettings {
  dataSharing: {
    healthData: boolean;
    supplementData: boolean;
    analytics: boolean;
  };
  visibility: {
    profile: "public" | "private";
    healthData: "public" | "private";
    supplementData: "public" | "private";
  };
  dataRetention: {
    period: number;
    autoDelete: boolean;
  };
}
```

## 6. Zarządzanie stanem

- Custom hook `useSettings` do zarządzania ustawieniami
- Custom hook `useNotifications` do zarządzania powiadomieniami
- Custom hook `usePrivacy` do zarządzania prywatnością
- Local state dla formularzy
- Context `SettingsContext` do współdzielenia stanu

## 7. Integracja API

- GET /api/settings - pobieranie ustawień
- PUT /api/settings - aktualizacja ustawień
- GET /api/settings/notifications - preferencje powiadomień
- PUT /api/settings/notifications - aktualizacja powiadomień
- GET /api/settings/privacy - ustawienia prywatności
- PUT /api/settings/privacy - aktualizacja prywatności
- POST /api/settings/export - eksport danych
- DELETE /api/settings/account - usuwanie konta

## 8. Interakcje użytkownika

- Edycja danych osobowych
- Zarządzanie powiadomieniami
- Konfiguracja prywatności
- Eksport danych
- Usuwanie konta
- Zmiana języka i strefy czasowej

## 9. Warunki i walidacja

- Walidacja formularzy
- Weryfikacja tożsamości
- Sprawdzanie uprawnień
- Walidacja danych
- Obsługa limitów API

## 10. Obsługa błędów

- Wyświetlanie komunikatów w toastach
- Fallback UI dla komponentów
- Obsługa błędów sieciowych
- Walidacja danych
- Error boundaries

## 11. Kroki implementacji

1. Przygotowanie struktury komponentów
2. Implementacja formularzy
3. Dodanie walidacji
4. Integracja z API
5. Implementacja zarządzania stanem
6. Dodanie obsługi błędów
7. Testy i optymalizacja
8. Dokumentacja
