import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const DelayCharts = () => {
  const [delayData, setDelayData] = useState(null);
  const [cancellationsData, setCancellationsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const delayResponse = await fetch('http://localhost:8000/delay_histogram');
        const delayJson = await delayResponse.json();

        console.log(delayJson, 'delayJson')
        const cancellationsResponse = await fetch('http://localhost:8000/cancellations_distribution');
        const cancellationsJson = await cancellationsResponse.json();

        setDelayData(delayJson[0]); // первый объект с гистограммой задержек
        setCancellationsData(cancellationsJson); // массив с отменами по авиакомпаниям
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Загрузка данных...</p>;
  if (!delayData || !cancellationsData) return <p>Нет данных для отображения</p>;

  // Формируем данные для графика задержек
  const delayLabels = Object.keys(delayData);
  const delayCounts = Object.values(delayData);

  const delayChartData = {
    labels: delayLabels,
    datasets: [
      {
        label: 'Количество рейсов',
        data: delayCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Данные для отмен — сортируем по убыванию количества
  const cancellationsSorted = [...cancellationsData].sort((a, b) => b.cancellations - a.cancellations);

  const cancellationsChartData = {
    labels: cancellationsSorted.map(item => item.airlines),
    datasets: [
      {
        label: 'Количество отмен',
        data: cancellationsSorted.map(item => item.cancellations),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div style={{ padding: 20, marginBottom: 120 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Анализ задержек и отмен рейсов</h2>

      <section style={{ marginBottom: 40 }}>
        <h3>Гистограмма задержек вылета</h3>
        <Bar
          data={delayChartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, title: { display: true, text: 'Количество рейсов' } },
              x: { title: { display: true, text: 'Диапазон задержки' } },
            },
          }}
        />
      </section>

      <section>
        <h3>Распределение отмен по авиакомпаниям</h3>
        <Bar
          data={cancellationsChartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, min: 0, title: { display: true, text: 'Количество отмен' } },
              x: { title: { display: true, text: 'Авиакомпания' } },
            },
          }}
        />

        {/* Таблица отмен */}
        <div style={{ overflowX: 'auto', marginTop: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={thStyle}>Авиакомпания</th>
                <th style={thStyle}>Количество отмен</th>
              </tr>
            </thead>
            <tbody>
            
              {cancellationsSorted.filter(item => item.cancellations >= 0).map((item, i) => (
                <tr key={i} style={{ textAlign: 'center' }}>
                  <td style={tdStyle}>{item.airlines}</td>
                  <td style={tdStyle}>{item.cancellations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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

export default DelayCharts;
