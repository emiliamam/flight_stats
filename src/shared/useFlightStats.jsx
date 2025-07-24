import { useState, useEffect } from 'react';

// Статичный список IATA-кодов российских аэропортов (пример)
const RUSSIAN_AIRPORTS = ['SVO', 'DME', 'VKO', 'LED', 'AER', 'KZN', 'SVX', 'ROV', 'UFA', 'KGD', 'OVB', 'CEK', 'MRV', 'NJC', 'KRR', 'OMS', 'GOJ', 'KUF', 'BQS', 'UUS', 'VVO', 'KJA', 'IKT'];

export default function useFlightStats() {
  const [stats, setStats] = useState({
    hourlyStats: Array(24).fill().map((_, i) => ({ 
      hour: i, 
      onTime: 0, 
      delayed: 0, 
      cancelled: 0 
    })),
    currentFlights: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Запрос данных за сегодня
        const today = new Date().toISOString().split('T')[0]; // 2025-07-24
        let allFlights = [];
        let offset = 0;
        const limit = 100;
        const pagination = {};

        do {
          const response = await fetch(
            `https://api.aviationstack.com/v1/flights?access_key=c878f53f2faec4c836c07916329e90c8`
          );
          const json = await response.json();
          const data = json.data || [];
          const pagination = json.pagination || {};
          console.log(json, 'json')

          allFlights = [...allFlights, ...data];
          offset += limit;
        } while (offset < pagination.total);

        // 2. Фильтрация российских рейсов
        const russianFlights = allFlights.filter(flight => 
          RUSSIAN_AIRPORTS.includes(flight.departure.iata) || 
          RUSSIAN_AIRPORTS.includes(flight.arrival.iata)
        );

        console.log(russianFlights, 'russianFlights')

        // 3. Статистика по часам
        const hourlyStats = Array(24).fill().map((_, i) => ({
          hour: i,
          onTime: 0,
          delayed: 0,
          cancelled: 0
        }));

        russianFlights.forEach(flight => {
          if (!flight.departure.scheduled) return;
          
          const scheduledUTC = new Date(flight.departure.scheduled);
          const hourMoscow = (scheduledUTC.getUTCHours() + 3) % 24;
          
          if (flight.flight_status === 'cancelled') {
            hourlyStats[hourMoscow].cancelled += 1;
          } else if (flight.departure.actual) {
            const actualUTC = new Date(flight.departure.actual);
            const delayMinutes = (actualUTC - scheduledUTC) / 60000;
            
            delayMinutes <= 15 
              ? hourlyStats[hourMoscow].onTime += 1 
              : hourlyStats[hourMoscow].delayed += 1;
          }
        });

        // 4. Рейсы в воздухе
        const currentFlights = russianFlights.filter(
          flight => flight.flight_status === 'active'
        ).length;

        // 5. Обновление состояния
        setStats({ hourlyStats, currentFlights });
        setLoading(false);
        
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...stats, loading };
}