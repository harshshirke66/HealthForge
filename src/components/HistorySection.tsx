"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Sparkles, Utensils, Moon } from 'lucide-react';

const HistorySection: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [historyData, setHistoryData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setSuggestions(null);
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';
      const response = await axios.get(`/api/history?userId=${userId}&date=${date}`);
      setHistoryData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [date]);

  const handleGetSuggestions = async () => {
    if (!historyData) return;
    setAnalyzing(true);
    try {
      const response = await axios.post('/api/ai/chat', {
        message: `Analyze my data for ${date}: 
          Meals: ${JSON.stringify(historyData.meals)}
          Sleep: ${JSON.stringify(historyData.sleep)}
          Summary: ${JSON.stringify(historyData.summary)}
          Provide 3 short, actionable suggestions to improve my health based on this specific day.`
      });
      setSuggestions(response.data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="section-container animate-fade-in">
      <div className="section-header-row">
        <div className="section-header">
          <h2>Daily History</h2>
          <p>Review your logs and get AI-powered insights for any day.</p>
        </div>
        <div className="date-picker-box glass">
          <Calendar size={18} />
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
            title="Select date"
          />
        </div>
      </div>

      <div className="history-grid">
        <div className="history-main">
          <div className="metric-card glass">
            <div className="card-header">
              <div className="icon-box yellow"><Utensils size={18} /></div>
              <h3>Meals for {date}</h3>
            </div>
            <div className="history-list">
              {historyData?.meals.length > 0 ? historyData.meals.map((meal: any) => (
                <div key={meal.id} className="history-item">
                  <div className="item-info">
                    <strong>{meal.name}</strong>
                    <span>{meal.category}</span>
                  </div>
                  <div className="item-macros">
                    <span>{meal.calories} kcal</span>
                    <span className="p">{meal.protein}g P</span>
                  </div>
                </div>
              )) : <p className="empty-msg">No meals logged for this day.</p>}
            </div>
          </div>

          <div className="metric-card glass">
            <div className="card-header">
              <div className="icon-box purple"><Moon size={18} /></div>
              <h3>Sleep Log</h3>
            </div>
            {historyData?.sleep ? (
              <div className="sleep-summary">
                <div className="summary-stat">
                  <span>Slept at:</span>
                  <strong>{new Date(historyData.sleep.sleep_time).toLocaleTimeString()}</strong>
                </div>
                <div className="summary-stat">
                  <span>Woke at:</span>
                  <strong>{new Date(historyData.sleep.wake_time).toLocaleTimeString()}</strong>
                </div>
                <div className="quality-bar">
                  Quality: {historyData.sleep.quality}/5
                </div>
              </div>
            ) : <p className="empty-msg">No sleep data for this day.</p>}
          </div>
        </div>

        <div className="history-sidebar">
          <div className="metric-card glass ai-card">
            <div className="card-header">
              <div className="icon-box cyan"><Sparkles size={18} /></div>
              <h3>AI Daily Review</h3>
            </div>
            <div className="ai-content">
              {suggestions ? (
                <div className="suggestions-box animate-fade-in">
                  <p>{suggestions}</p>
                </div>
              ) : (
                <div className="ai-cta">
                  <p>Let AI analyze your day and suggest improvements.</p>
                  <button 
                    onClick={handleGetSuggestions} 
                    className="btn-primary"
                    disabled={analyzing}
                  >
                    {analyzing ? 'Analyzing...' : 'Generate Insights'}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="metric-card glass summary-card">
             <div className="card-header"><h3>Daily Summary</h3></div>
             <div className="summary-stats">
                <div className="stat-pill">
                  <span>Calories</span>
                  <strong>{historyData?.summary.total_calories || 0}</strong>
                </div>
                <div className="stat-pill">
                  <span>Protein</span>
                  <strong>{historyData?.summary.total_protein || 0}g</strong>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
