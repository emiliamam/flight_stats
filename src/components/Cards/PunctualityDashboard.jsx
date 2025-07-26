import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const getColor = (key) => {
  switch (key) {
    case 'green': return '#34c38f';
    case 'yellow': return '#f1b44c';
    case 'red': return '#f46a6a';
    case 'blue': return '#556ee6';
    default: return '#ccc';
  }
};

const PunctualityDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [delayStats, setDelayStats] = useState([]);

  useEffect(() => {
    fetch('/api/flights?limit=500')
      .then(res => res.json())
      .then(data => {
        setFlights(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(flights)
    if (!flights.length) return;

    let onTime = 0;
    let delayed = 0;
    let canceled = 0;
    let inAir = 0;

    const delayByHour = {};

    flights.forEach(flight => {
      const dc = flight.delay_category?.toLowerCase() || '';
      if (dc === 'отменен' || dc === 'отменено' || dc === 'canceled') {
        canceled++;
      } else if (dc === 'нет_задержки' || dc === 'нет задержки') {
        onTime++;
      } else if (dc) {
        delayed++;
      }

      if (flight.fact_departure && !flight.fact_arrival) {
        inAir++;
      }

      if (flight.plan_departure) {
        const dt = new Date(flight.plan_departure);
        const hourStr = dt.getHours().toString().padStart(2, '0') + ':00';

        if (!delayByHour[hourStr]) {
          delayByHour[hourStr] = { onTime: 0, delayed: 0, canceled: 0 };
        }
        if (dc === 'отменен' || dc === 'отменено' || dc === 'canceled') {
          delayByHour[hourStr].canceled++;
        } else if (dc === 'нет_задержки' || dc === 'нет задержки') {
          delayByHour[hourStr].onTime++;
        } else if (dc) {
          delayByHour[hourStr].delayed++;
        }
      }
    });

    const delayStatsArr = Object.entries(delayByHour)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, counts]) => ({
        time,
        ...counts,
      }));

    setSummaryData([
      { label: 'Вылетели вовремя', value: onTime, color: 'green' },
      { label: 'С задержкой', value: delayed, color: 'yellow' },
      { label: 'Отменены', value: canceled, color: 'red' },
      { label: 'Рейсов в воздухе сейчас', value: inAir, color: 'blue' },
    ]);
    setDelayStats(delayStatsArr);

  }, [flights]);

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Ситуационный центр пунктуальности</h2>

      <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
        {summaryData.map(({ label, value, color }) => (
          <div key={label} style={{
            flex: '1 1 200px',
            backgroundColor: getColor(color),
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value} рейсов</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 40 }}>Динамика задержек за день</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={delayStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="onTime" stroke="#34c38f" name="Вовремя" strokeWidth={3} />
            <Line type="monotone" dataKey="delayed" stroke="#f1b44c" name="С задержкой" strokeWidth={3} />
            <Line type="monotone" dataKey="canceled" stroke="#f46a6a" name="Отменены" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PunctualityDashboard;
