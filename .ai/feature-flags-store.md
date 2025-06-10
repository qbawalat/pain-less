# Feature Flags Store - Szczegółowa Implementacja

## 1. Koncepcja Store'a

Store będzie singleton'em zarządzającym stanem flag funkcjonalności, implementującym wzorzec obserwatora dla reaktywnych aktualizacji na frontendzie.

## 2. Założenia Implementacyjne

### Kolizje Hashy

W implementacji świadomie akceptujemy możliwość kolizji hashy przy określaniu grup użytkowników dla rolloutów procentowych:

1. **Uproszczony Model**

   - Używamy prostej funkcji hashującej
   - Mapujemy wynik na zakres 0-99 (100 możliwych wartości)
   - Akceptujemy, że różni użytkownicy mogą trafić do tej samej grupy

2. **Uzasadnienie**

   - Przy rolloutach procentowych precyzja na poziomie pojedynczych użytkowników nie jest krytyczna
   - Kolizje nie wpływają na funkcjonalność - nadal osiągamy przybliżony target procentowy
   - Prostota implementacji > perfekcyjna dystrybucja

3. **Ograniczenia**
   - Rzeczywisty procent użytkowników może nieznacznie różnić się od zadeklarowanego
   - Nie należy używać tego mechanizmu do celów kryptograficznych czy bezpieczeństwa
   - System nie gwarantuje unikalności grup użytkowników między różnymi flagami
