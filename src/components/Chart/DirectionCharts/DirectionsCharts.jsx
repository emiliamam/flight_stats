import React, { useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';


const DirectionsChart = ({ directionData }) => {
  const [displayCount, setDisplayCount] = useState(10);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedDirections = useMemo(() => {
    const sorted = [...directionData];
    if (sortKey) {
      sorted.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
    }
    return sorted.slice(0, displayCount);
  }, [directionData, sortKey, sortOrder, displayCount]);

  const pieData = useMemo(() => {
    return {
      labels: sortedDirections.map(d => `${d.airport1} → ${d.airport2}`),
      datasets: [
        {
          data: sortedDirections.map(d => d.total_flights),
          backgroundColor: sortedDirections.map(
            (_, i) => `hsl(${(i * 360) / displayCount}, 70%, 60%)`
          ),
        },
      ],
    };
  }, [sortedDirections, displayCount]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Анализ направлений рейсов</h2>

      <div style={{ textAlign: 'center', padding: 20 }}>
        <input
          type="range"
          min={1}
          max={Math.min(100, directionData.length)}
          value={displayCount}
          onChange={e => setDisplayCount(Number(e.target.value))}
          style={{ width: 300 }}
        />
        <div>{displayCount} направлений</div>
      </div>

      {/* 🔹 Таблица */}
      <div style={{ overflowX: 'auto', marginBottom: 30 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th style={thStyle}>Направление</th>
              <th style={thStyle} onClick={() => handleSort('total_flights')}>
                Рейсов {sortKey === 'total_flights' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={thStyle} onClick={() => handleSort('on_time_percentage')}>
                Пунктуальность (%) {sortKey === 'on_time_percentage' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={thStyle} onClick={() => handleSort('avg_delay_minutes')}>
                Ср. задержка (мин) {sortKey === 'avg_delay_minutes' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={thStyle} onClick={() => handleSort('missing_departure_count')}>
                Без отправления {sortKey === 'missing_departure_count' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDirections.map((d, i) => (
              <tr key={i} style={{ textAlign: 'center' }}>
                <td style={tdStyle}>{d.airport1} → {d.airport2}</td>
                <td style={tdStyle}>{d.total_flights}</td>
                <td style={tdStyle}>{d.on_time_percentage}</td>
                <td style={tdStyle}>{d.avg_delay_minutes}</td>
                <td style={tdStyle}>{d.missing_departure_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔸 Круговая диаграмма */}
      <div style={{ height: 500 }}>
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dir = sortedDirections[context.dataIndex];
                    return `${context.label}: ${context.formattedValue} рейсов — пунктуальность ${dir.on_time_percentage}%`;
                  }
                }
              }
            }
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
  cursor: 'pointer'
};

const tdStyle = {
  padding: '8px 12px',
  border: '1px solid #ddd',
};

export default DirectionsChart;
