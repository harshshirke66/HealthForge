"use client";
import React, { useState, useEffect, CSSProperties } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Flame, Zap, Brain, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';
import AIChat from './AIChat';
import Onboarding from './Onboarding';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string>('1');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const id = storedUser ? JSON.parse(storedUser).id : '1';
        setUserId(id);
        
        const response = await axios.get(`/api/dashboard?userId=${id}`);
        setData(response.data);
        
        if (response.data.onboarded === false) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Loader2 className="spinner" size={48} />
        <p>Loading your health data...</p>
      </div>
    );
  }

  const { summary, weightTrend, recentMeals } = data || { 
    summary: { calories: 0, protein: 0, water: 0 }, 
    weightTrend: [], 
    recentMeals: [] 
  };

  const caloriesProgress = Math.min((summary.calories / 2500) * 100, 100);
  const waterProgress = Math.min((summary.water / 2.5) * 100, 100);
  const proteinProgress = Math.min((summary.protein / 120) * 100, 100);

  return (
    <>
      {showOnboarding && (
        <Onboarding 
          userId={userId} 
          onComplete={() => {
            setShowOnboarding(false);
            window.location.reload(); // Refresh to get updated stats
          }} 
        />
      )}
      <div className="dashboard-grid animate-fade-in">
      {/* Top row: Summary Cards */}
      <div className="metric-card glass glass-hover">
        <div className="metric-bg-pattern"></div>
        <div className="metric-header">
          <div className="icon-box orange"><Flame size={20} /></div>
          <span>Calories</span>
        </div>
        <div className="metric-value">{summary.calories} <span className="unit">kcal</span></div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar orange" 
            style={{ '--progress': `${caloriesProgress}%` } as React.CSSProperties}
          ></div>
        </div>
        <div className="metric-footer">Daily Target: 2,500</div>
      </div>

      <div className="metric-card glass glass-hover">
        <div className="metric-bg-pattern"></div>
        <div className="metric-header">
          <div className="icon-box blue"><Droplets size={20} /></div>
          <span>Water</span>
        </div>
        <div className="metric-value">{summary.water.toFixed(1)} <span className="unit">L</span></div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar blue" 
            style={{ '--progress': `${waterProgress}%` } as React.CSSProperties}
          ></div>
        </div>
        <div className="metric-footer">Daily Target: 2.5L</div>
      </div>

      <div className="metric-card glass glass-hover">
        <div className="metric-bg-pattern"></div>
        <div className="metric-header">
          <div className="icon-box purple"><Zap size={20} /></div>
          <span>Protein</span>
        </div>
        <div className="metric-value">{summary.protein} <span className="unit">g</span></div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar purple" 
            style={{ '--progress': `${proteinProgress}%` } as React.CSSProperties}
          ></div>
        </div>
        <div className="metric-footer">Daily Target: 120g</div>
      </div>

      {/* Main Charts & Trends */}
      <div className="chart-card glass span-2">
        <div className="card-header">
          <h3>Weight Trend</h3>
          <span className="subtitle">{weightTrend.length > 0 ? 'Last 7 logs' : 'No logs yet'}</span>
        </div>
        <div className="chart-container">
          {weightTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightTrend}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">Start logging your weight to see trends</div>
          )}
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="ai-insight-card glass">
        <div className="card-header ai">
          <Brain size={20} />
          <h3>AI Coach Insights</h3>
        </div>
        <div className="insight-list">
          {summary.calories === 0 ? (
            <div className="insight-item">
              <div className="bullet"></div>
              <p>Log your first meal to get personalized AI advice!</p>
            </div>
          ) : (
            <>
              <div className="insight-item">
                <div className="bullet"></div>
                <p>You've consumed {summary.calories} kcal so far. {summary.calories > 2000 ? "Getting close to your limit!" : "Keep going!"}</p>
              </div>
              <div className="insight-item">
                <div className="bullet"></div>
                <p>Your protein intake is at {summary.protein}g. {summary.protein < 50 ? "Try adding some lean meat or beans." : "Great protein levels!"}</p>
              </div>
            </>
          )}
        </div>
        <button className="btn-outline" title="View detailed AI analysis">Ask AI Assistant</button>
      </div>

      {/* Recent Activity */}
      <div className="chart-card glass span-3">
         <div className="card-header">
            <h3>Recent Meals</h3>
         </div>
         <div className="meal-table">
            {recentMeals.length > 0 ? recentMeals.map((meal: any, i: number) => (
              <div key={i} className="meal-row">
                  <div className="meal-info">
                      <span className="meal-name">{meal.name}</span>
                      <span className="meal-time">{meal.time}</span>
                  </div>
                  <div className="meal-stats">
                      <span className="stat">{meal.calories} kcal</span>
                      <span className="stat protein">{meal.protein}g Protein</span>
                  </div>
              </div>
            )) : (
              <div className="empty-state">No meals logged today</div>
            )}
         </div>
      </div>

      {/* AI Assistant Section */}
      <div className="chart-card glass span-3">
        <div className="card-header">
          <MessageSquare size={20} />
          <h3>AI Health Assistant</h3>
        </div>
        <AIChat />
      </div>
    </div>
    </>
  );
};

export default Dashboard;
