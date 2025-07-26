import React, { useState, useEffect } from 'react';
import axios from 'axios';

const cellStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  borderBottom: '1px solid #e0e0e0',
};

const Countries = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('/api/delay-rules/top');
        setRules(response.data);
      } catch (err) {
        setError('Ошибка при получении правил');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка правил...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '20px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        color: '#333',
      }}>
        Неочевидные признаки задержки рейсов
      </h2>

      <div style={{
        overflowX: 'auto',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '600px',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', color: '#444' }}>
              <th style={cellStyle}>Условие</th>
              <th style={cellStyle}>Поддержка</th>
              <th style={cellStyle}>Достоверность</th>
              <th style={cellStyle}>Подъем</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f8ff')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fafafa')}
              >
                <td style={cellStyle}>{rule.rule}</td>
                <td style={cellStyle}>{rule.support.toFixed(3)}</td>
                <td style={cellStyle}>{rule.confidence.toFixed(3)}</td>
                <td style={cellStyle}>{rule.lift.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Countries;
