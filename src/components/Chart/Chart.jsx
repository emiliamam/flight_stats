import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DirectionsCharts from './DirectionCharts/DirectionsCharts';
import PunctualityChartWithTable from './PunctualityChart/PunctualityChart';
import DelayCharts from './DelayCharts/DelayCharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('top3');
  const [top3Data, setTop3Data] = useState([]);
  const [directionData, setDirectionData] = useState([]);
  const [punctualityData, setPunctualityData] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    fetch('/api/get_top3')
      .then(res => res.json())
      .then(data => setTop3Data(data))
      .catch(console.error);

    fetch('/api/get_all_direction')
      .then(res => res.json())
      .then(data => setDirectionData(data))
      .catch(console.error);

    fetch('/api/get_airline_punctuality')
      .then(res => res.json())
      .then(data => setPunctualityData(data))
      .catch(console.error);
  }, []);

  console.log(top3Data, 'top3Data')
  console.log(directionData, 'directionData')
  console.log(punctualityData, 'punctualityData')

  // 1. Топ 3 авиакомпании - Bar chart
  // Топ 3 авиакомпании
const top3ChartData = {
  labels: top3Data.map(a => a.airline_name || a['Авиакомпания']),
  datasets: [
    {
      label: 'Пунктуальность вылета',
      backgroundColor: 'rgba(75,192,192,0.6)',
      data: top3Data.map(a => a.rating_departure ?? a['Отправление']),
    },
    {
      label: 'Пунктуальность прилёта',
      backgroundColor: 'rgba(153,102,255,0.6)',
      data: top3Data.map(a => a.rating_arrival ?? a['Прибытие']),
    },
  ],
};

// Направления - ограничим топ-10
const topDirections = [...directionData]
  .sort((a, b) => b.total_flights - a.total_flights)
  .slice(0, 10);

  const displayedDirections = directionData.slice(0, displayCount);

  const directionsLabels = displayedDirections.map(d => `${d.airport1} → ${d.airport2}`);
  const directionsCounts = displayedDirections.map(d => d.total_flights);
  
  const directionsChartData = {
    labels: directionsLabels,
    datasets: [{
      label: 'Количество рейсов',
      data: directionsCounts,
      backgroundColor: directionsLabels.map(() =>
        `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`
      ),
    }],
  };

  const directionsChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: context => {
            const idx = context.dataIndex;
            const item = displayedDirections[idx];
            return [
              `Рейсов: ${item.total_flights}`,
              `Пунктуальность: ${item.on_time_percentage ?? 'н/д'}%`
            ];
          }
        }
      },
      legend: { display: false }
    }
  };
  
// Пунктуальность - если даты нет, просто покажем среднюю пунктуальность по авиакомпаниям
const airlines = [...new Set(punctualityData.map(d => d['Авиакомпания']))];

const punctualityChartData = {
  labels: airlines,
  datasets: [
    {
      label: 'Пунктуальность отправления (%)',
      data: airlines.map(airline => {
        const rec = punctualityData.find(d => d['Авиакомпания'] === airline);
        return rec ? rec['Отправление'] : 0;
      }),
      backgroundColor: 'rgba(75,192,192,0.6)',
    },
    {
      label: 'Пунктуальность прибытия (%)',
      data: airlines.map(airline => {
        const rec = punctualityData.find(d => d['Авиакомпания'] === airline);
        return rec ? rec['Прибытие'] : 0;
      }),
      backgroundColor: 'rgba(153,102,255,0.6)',
    },
  ],
};



return (
  <div style={{ maxWidth: 1000, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>    
    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
      <button
        onClick={() => setActiveTab('top3')}
        disabled={activeTab === 'top3'}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: activeTab === 'top3' ? 'default' : 'pointer',
          backgroundColor: activeTab === 'top3' ? '#00539c' : '#e0e0e0',
          color: activeTab === 'top3' ? 'white' : '#333',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#81c784';
        }}
        onMouseLeave={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
      >
        Задержки
      </button>

      <button
        onClick={() => setActiveTab('directions')}
        disabled={activeTab === 'directions'}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: activeTab === 'directions' ? 'default' : 'pointer',
          backgroundColor: activeTab === 'directions' ? '#00539c' : '#e0e0e0',
          color: activeTab === 'directions' ? 'white' : '#333',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#81c784';
        }}
        onMouseLeave={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
      >
        Направления
      </button>

      <button
        onClick={() => setActiveTab('punctuality')}
        disabled={activeTab === 'punctuality'}
        style={{
          padding: '10px 20px',
          borderRadius: 8,
          border: 'none',
          cursor: activeTab === 'punctuality' ? 'default' : 'pointer',
          backgroundColor: activeTab === 'punctuality' ? '#00539c' : '#e0e0e0',
          color: activeTab === 'punctuality' ? 'white' : '#333',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#81c784';
        }}
        onMouseLeave={e => {
          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#e0e0e0';
        }}
      >
        Авиакомпании
      </button>
    </div>

    {activeTab === 'top3' && (<DelayCharts />
    )}

{activeTab === 'directions' && ( <DirectionsCharts directionData={directionData} />
)}
    {activeTab === 'punctuality' && (
      <PunctualityChartWithTable data={punctualityData}/>
    )}
  </div>
);

};

export default Analytics;
