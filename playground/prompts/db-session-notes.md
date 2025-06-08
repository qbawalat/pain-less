# Database Planning Summary - pAIN-less

## Decisions Made

1. Uproszczenie struktury badań medycznych do formatu: badanie + opis
2. Przechowywanie historii badań medycznych permanentnie
3. Brak wersjonowania planów suplementacji
4. Analizy AI wykonywane tylko na żądanie użytkownika
5. Przechowywanie wszystkich alertów z prostym rozróżnieniem statusu (accepted/pending)
6. Użycie boolean `is_warning` zamiast enumu dla typów alertów
7. Przechowywanie interakcji suplementów per użytkownik w formacie JSONB
8. Przechowywanie daty ostatniej analizy AI w profilu użytkownika
9. Użycie pola `last_reminder_date` w profilu zamiast osobnej tabeli
10. Użycie osobnej tabeli dla suplementów
11. Brak potrzeby indeksów na polach `deleted_at` i `user_id`
12. Brak walidacji unikalności kombinacji suplementów
13. Brak walidacji formatu nazw badań i opisów
14. Ograniczenie danych użytkownika do podstawowych informacji

## Matched Recommendations

1. Użycie prostego schematu dla badań medycznych
2. Implementacja soft delete dla wszystkich tabel
3. Użycie RLS dla wszystkich tabel z danymi użytkownika
4. Użycie prostych constraintów CHECK dla dat
5. Użycie JSONB dla elastycznych struktur danych
6. Nie potrzebujemy dodatkowych pól w tabeli suplementów? 
7. Nie potrzebujemy walidacji unikalności nazw suplementów? 
8. Nie potrzebujemy indeksów na polach `created_at` i `updated_at`? 
9. Nie potrzebujemy walidacji formatu wiadomości alertów? 

## Database Planning Summary

### Main Requirements
- Prosty schemat bazy danych skupiony na MVP
- Bezpieczne przechowywanie danych medycznych
- Elastyczna struktura dla interakcji suplementów
- Efektywne zarządzanie alertami
- Minimalny zestaw danych użytkownika

### Key Entities
1. **health_profiles**
   - Podstawowe dane użytkownika:
     - email
     - data urodzenia
     - wzrost
     - waga
   - Daty ostatnich analiz i przypomnień
   - Interakcje suplementów w JSONB

2. **supplements**
   - Podstawowa tabela suplementów
   - Prosta struktura (id, nazwa)

3. **medical_tests**
   - Historia badań medycznych
   - Prosta struktura (badanie + opis)

4. **alerts**
   - System alertów
   - Rozróżnienie typu przez boolean
   - Statusy pending/accepted

### Security and Scalability
- RLS dla wszystkich tabel
- Soft delete dla wszystkich encji
- Proste constrainty dla walidacji danych
- Brak skomplikowanych indeksów
- Elastyczna struktura JSONB dla interakcji

### Relationships
- Wszystkie tabele użytkownika powiązane przez `user_id`
- Proste relacje 1:N między użytkownikiem a jego danymi
