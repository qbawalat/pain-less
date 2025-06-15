# Podsumowanie rozmów dotyczących PRD - pAIN-less

## Decyzje

1. System będzie oparty na Supabase do zarządzania danymi i autentykacji
2. Implementacja będzie prosta, zgodnie z podejściem MVP
3. Miesięczne przypomnienia emailowe o aktualizacji profilu
4. System punktowy z 3 poziomami użytkownika
5. Prosty kalendarz bez historii zmian
6. Podstawowa baza wiedzy o suplementach (top 50)
7. System ostrzeżeń z 2 poziomami (informacyjny i ostrzegawczy)
8. Prosty proces weryfikacji planów suplementacji
9. Brak przechowywania historii zmian w kalendarzu
10. Uproszczony system feedbacku dla rekomendacji AI
11. Wszystkie dane zdrowotne wprowadzane są bezpośrednio przez użytkownika
12. Każdy kolejny wpis w profilu to nowa historia (brak deaktualizacji)
13. Zatwierdzenie planu suplementacji wymaga akceptacji użytkownika
14. W przypadku konfliktu suplementów system oznacza ostrzeżenie i wymaga potwierdzenia
15. Każdy użytkownik ma dostęp tylko do swoich danych
16. System nie będzie integrował się z urządzeniami medycznymi w MVP
17. Brak automatycznych przypomnień o przyjmowaniu suplementów
18. Brak funkcji społecznościowych
19. Brak zaawansowanej analityki i wykresów trendów
20. Brak aplikacji mobilnej (tylko wersja web)
21. Brak integracji z systemami opieki zdrowotnej
22. Model AI będzie działał na podstawie wybranego modelu i initial contextu
23. Wydarzenia w kalendarzu oznaczane są na podstawie danych podanych przez użytkownika
24. System nie będzie przechowywał historii zmian (uproszczenie MVP)

## Dopasowane rekomendacje

1. Implementacja prostego szablonu emaila z kluczowymi informacjami
2. Wprowadzenie uproszczonego systemu poziomów użytkownika
3. Stworzenie podstawowej bazy wiedzy o suplementach
4. Implementacja prostego procesu weryfikacji planu
5. Definicja uproszczonych poziomów ostrzeżeń
6. Projekt minimalistycznego interfejsu systemu punktowego

## Podsumowanie planowania PRD

### Główne wymagania funkcjonalne

- Profil zdrowotny z miesięcznymi przypomnieniami
- System punktowy (3 poziomy: 0-50, 51-200, 201+)
- Kalendarz zdrowotny bez historii zmian
- Podstawowa baza wiedzy o suplementach
- System ostrzeżeń (2 poziomy)
- Prosty proces weryfikacji planów
- Brak integracji z urządzeniami zewnętrznymi
- Tylko wersja webowa

### Kluczowe historie użytkownika

- Regularna aktualizacja profilu zdrowotnego
- Przeglądanie i zarządzanie kalendarzem
- Otrzymywanie i reagowanie na alerty
- Tworzenie i weryfikacja planów suplementacji
- Potwierdzanie ostrzeżeń o konfliktach suplementów

### Kryteria sukcesu

- 90% użytkowników regularnie aktualizuje profil
- 80% akceptacji planów suplementacji
- 95% dokładność oznaczeń w kalendarzu
- Regularne sprawdzanie alertów (raz w tygodniu)

### Sposoby mierzenia

- System punktowy za aktualizacje
- Procent akceptacji planów
- Dokładność oznaczeń w kalendarzu
- Częstotliwość sprawdzania alertów

## Nierozwiązane kwestie

1. Konkretne metryki dla oceny jakości rekomendacji AI
2. Szczegółowe wymagania dotyczące formatu i zawartości emaili
3. Dokładne progi punktowe dla poszczególnych poziomów użytkownika
4. Minimalne wymagania dotyczące bazy wiedzy o suplementach
5. Konkretne kryteria dla poziomów ostrzeżeń
6. Szczegóły implementacji modelu AI i jego initial contextu
7. Konkretne wymagania dotyczące bezpieczeństwa danych w Supabase
