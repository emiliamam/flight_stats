import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

const PunctualityChartWithTable = ({ data }) => {
  const [minFlights, setMinFlights] = useState(1000); // фильтр по мин. кол-ву рейсов

  // Фильтруем данные по minFlights
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => item['Количество рейсов'] >= minFlights);
  }, [data, minFlights]);

  // Данные для графика — отображаем пунктуальность по отправлению
  const chartData = useMemo(() => {
    return {
      labels: filteredData.map(item => item.Авиакомпания),
      datasets: [
        {
          label: 'Пунктуальность отправления (%)',
          data: filteredData.map(item => item.Отправление),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Пунктуальность прибытия (%)',
          data: filteredData.map(item => item.Прибытие),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [filteredData]);

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center'}}>
        Аналитика пунктуальности авиакомпаний
      </h2>

      <div style={{ marginBottom: 15, textAlign: 'center' }}>
        <label>
          Минимальное количество рейсов для отображения:{' '}
          <input
            type="number"
            value={minFlights}
            min={0}
            max={Math.max(...data.map(d => d['Количество рейсов']))}
            onChange={(e) => setMinFlights(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </label>
      </div>

      {/* Таблица */}
      <div style={{ overflowX: 'auto', marginBottom: 30 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={thStyle}>Авиакомпания</th>
              <th style={thStyle}>Код</th>
              <th style={thStyle}>Количество рейсов</th>
              <th style={thStyle}>Отмены</th>
              <th style={thStyle}>Пунктуальность отправления (%)</th>
              <th style={thStyle}>Пунктуальность прибытия (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td style={tdStyle}>{item.Авиакомпания}</td>
                <td style={tdStyle}>{item.Код}</td>
                <td style={tdStyle}>{item['Количество рейсов']}</td>
                <td style={tdStyle}>{item.Отмены}</td>
                <td style={tdStyle}>{item.Отправление.toFixed(1)}</td>
                <td style={tdStyle}>{item.Прибытие.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* График */}
      <div style={{ height: 500 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: false },
              tooltip: {
                callbacks: {
                  label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
                },
              },
            },
            scales: {
              y: {
                min: 0,
                max: 100,
                title: { display: true, text: 'Пунктуальность (%)' },
              },
              x: {
                title: { display: true, text: 'Авиакомпания' },
                ticks: { maxRotation: 90, minRotation: 45 },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const thStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '8px 12px',
  border: '1px solid #ddd',
};

export default PunctualityChartWithTable;
