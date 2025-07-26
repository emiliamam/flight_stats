import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';

const TrendsAnalytics = () => {
  const [activeTab, setActiveTab] = useState('trend');
  const [punctualityTrendData, setPunctualityTrendData] = useState([]);
  const [delayHistogramData, setDelayHistogramData] = useState([]);
  const [cancellationsData, setCancellationsData] = useState([]);

  useEffect(() => {
    // Замените URL на ваши реальные эндпоинты
    fetch('/api/punctuality_trend')
      .then(res => res.json())
      .then(data => setPunctualityTrendData(data))
      .catch(console.error);

    fetch('/api/delay_histogram')
      .then(res => res.json())
      .then(data => setDelayHistogramData(data))
      .catch(console.error);

    fetch('/api/cancellations_distribution')
      .then(res => res.json())
      .then(data => setCancellationsData(data))
      .catch(console.error);
  }, []);

  // --- Формируем данные для графиков ---

  // 1. Тренд изменения пунктуальности (Line)
  const dates = Array.from(new Set(punctualityTrendData.map(d => d.date))).sort();
  const airlines = Array.from(new Set(punctualityTrendData.map(d => d.airline)));

  const punctualityTrendDatasets = airlines.map((airline, idx) => ({
    label: airline,
    data: dates.map(date => {
      const record = punctualityTrendData.find(d => d.airline === airline && d.date === date);
      return record ? record.punctuality : null;
    }),
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    fill: false,
  }));

  const punctualityTrendChartData = {
    labels: dates,
    datasets: punctualityTrendDatasets,
  };

  // 2. Гистограмма задержек (Bar)
  // Предполагаем, что delayHistogramData = [{ delayRange: "0-10", count: 123 }, ...]
  const delayLabels = delayHistogramData.map(d => d.delayRange);
  const delayCounts = delayHistogramData.map(d => d.count);

  const delayHistogramChartData = {
    labels: delayLabels,
    datasets: [
      {
        label: 'Количество рейсов',
        data: delayCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // 3. Круговая диаграмма отмен (Pie)
  // Предполагаем cancellationsData = [{ airline: 'Аэрофлот', cancellations: 20 }, ...]
  const cancellationLabels = cancellationsData.map(d => d.airline);
  const cancellationCounts = cancellationsData.map(d => d.cancellations);

  const cancellationsChartData = {
    labels: cancellationLabels,
    datasets: [
      {
        data: cancellationCounts,
        backgroundColor: cancellationLabels.map((_, i) => `hsl(${(i * 50) % 360}, 70%, 60%)`),
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Аналитика трендов авиаперевозок</h2>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('trend')}
          disabled={activeTab === 'trend'}
          style={buttonStyle(activeTab === 'trend')}
        >
          Тренд пунктуальности
        </button>
        <button
          onClick={() => setActiveTab('histogram')}
          disabled={activeTab === 'histogram'}
          style={buttonStyle(activeTab === 'histogram')}
        >
          Гистограмма задержек
        </button>
        <button
          onClick={() => setActiveTab('cancellations')}
          disabled={activeTab === 'cancellations'}
          style={buttonStyle(activeTab === 'cancellations')}
        >
          Отмены рейсов
        </button>
      </div>

      {activeTab === 'trend' && (
        <Line
          data={punctualityTrendChartData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Динамика пунктуальности авиакомпаний' },
            },
            scales: {
              y: { min: 0, max: 100, title: { display: true, text: 'Пунктуальность (%)' } },
              x: { title: { display: true, text: 'Дата' } },
            },
          }}
          height={400}
        />
      )}

      {activeTab === 'histogram' && (
        <Bar
          data={delayHistogramChartData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Распределение задержек рейсов' },
            },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Количество рейсов' } },
              x: { title: { display: true, text: 'Диапазон задержки (мин)' } },
            },
          }}
          height={400}
        />
      )}

      {activeTab === 'cancellations' && (
        <Pie
          data={cancellationsChartData}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: 'Распределение отмен рейсов по авиакомпаниям' },
              legend: { position: 'right' },
            },
          }}
          height={400}
        />
      )}
    </div>
  );
};

// Красивые кнопки — простая функция для стилей
const buttonStyle = (active) => ({
  marginRight: 10,
  padding: '8px 16px',
  borderRadius: 6,
  border: 'none',
  cursor: active ? 'default' : 'pointer',
  backgroundColor: active ? '#4caf50' : '#1976d2',
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
});

export default TrendsAnalytics;
