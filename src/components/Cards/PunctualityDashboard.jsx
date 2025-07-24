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
import useFlightStats from '../../shared/useFlightStats';

const delayStats = [
  { time: '08:00', onTime: 45, delayed: 10, canceled: 2 },
  { time: '09:00', onTime: 50, delayed: 8, canceled: 1 },
  { time: '10:00', onTime: 48, delayed: 12, canceled: 3 },
  { time: '11:00', onTime: 52, delayed: 6, canceled: 1 },
  { time: '12:00', onTime: 47, delayed: 15, canceled: 4 },
  { time: '13:00', onTime: 51, delayed: 9, canceled: 0 },
];

const getColor = (key) => {
  switch (key) {
    case 'green':
      return '#34c38f';
    case 'yellow':
      return '#f1b44c';
    case 'red':
      return '#f46a6a';
    case 'blue':
      return '#556ee6';
    default:
      return '#ccc';
  }
};

const th = {
  padding: '12px',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 600,
};

const td = {
  padding: '10px 12px',
  borderBottom: '1px solid #eee',
};

const summaryData = [
  { label: 'Вылетели вовремя', value: 130, color: 'green' },
  { label: 'С задержкой > 15 м', value: 28, color: 'yellow' },
  { label: 'Отменены', value: 3, color: 'red' },
  { label: 'Рейсов в воздухе сейчас', value: 57, color: 'blue'},
];

const airportsData = [
  { name: 'Шереметьево', onTime: 92, avgDelay: 5, canceled: 5 },
  { name: 'Домодедово', onTime: 87, avgDelay: 8, canceled: 9 },
  { name: 'Владивосток', onTime: 83, avgDelay: 9, canceled: 4 },
  { name: 'Казань', onTime: 81, avgDelay: 10, canceled: 7 },
  { name: 'Пулково', onTime: 77, avgDelay: 12, canceled: 10 },
  { name: 'Сочи', onTime: 75, avgDelay: 14, canceled: 8 },
];
const PunctualityDashboard = ({ handleCountryChange }) => {
  const [countries, setCountries] = useState([]);
  const {stats} = useFlightStats();
  console.log(stats, 'stats')
  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Ситуационный центр пунктуальности</h2>
      
      <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
        {summaryData.map(({ label, value, color, icon }) => (
          <div key={label} style={{
            flex: '1 1 200px',
            backgroundColor: getColor(color),
            color: 'white',
            padding: '15px 20px',
            borderRadius: 12,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{icon} {label}</div>
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
      <YAxis />
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
