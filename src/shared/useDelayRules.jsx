import { useState, useEffect } from 'react';

export default function useDelayRules(topN = 5) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/delay-rules/top`)
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при загрузке правил задержек:', err);
        setLoading(false);
      });
  }, [topN]);

  return { rules, loading };
}
