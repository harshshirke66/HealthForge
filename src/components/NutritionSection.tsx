import React from 'react';
import axios from 'axios';

const NutritionSection: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';
      const response = await axios.get(`/api/dashboard?userId=${userId}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
    window.addEventListener('refreshDashboard', fetchData);
    return () => window.removeEventListener('refreshDashboard', fetchData);
  }, []);

  if (loading) return <div className="loader">Updating nutrition data...</div>;

  const breakdown = data?.categoryBreakdown || [];

  return (
    <div className="section-container animate-fade-in">
      <div className="section-header">
        <h2>Nutrition Center</h2>
        <p>Detailed breakdown of your macro and micro nutrients.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card glass span-2">
            <div className="card-header"><h3>Daily Breakdown</h3></div>
            <div className="category-list">
                {breakdown.length > 0 ? breakdown.map((item: any) => (
                  <div key={item.category} className="category-stat-row">
                    <span className="cat-name">{item.category}</span>
                    <div className="cat-values">
                      <span>{item.calories} kcal</span>
                      <span className="protein">{item.protein}g P</span>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state">No meals logged for today.</div>
                )}
            </div>
        </div>
        
        <div className="metric-card glass">
            <div className="card-header"><h3>Quick Insights</h3></div>
            <div className="insight-list">
                {data?.summary.protein < 50 ? (
                  <p className="insight-text warning">Increase protein intake for better recovery.</p>
                ) : (
                  <p className="insight-text success">Great job on your protein targets today!</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSection;
