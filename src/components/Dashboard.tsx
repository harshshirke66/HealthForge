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

  useEffect(() => {
    fetchDashboardData();
    window.addEventListener('refreshDashboard', fetchDashboardData);
    return () => window.removeEventListener('refreshDashboard', fetchDashboardData);
  }, []);

  const handleWaterChange = async (amountMl: number) => {
    try {
      await axios.post('/api/user/water', { userId, amount_ml: amountMl });
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      console.error("Error logging water", error);
    }
  };

  const handleWeightLog = async () => {
    const weight = prompt("Enter your current weight (kg):");
    if (!weight || isNaN(parseFloat(weight))) return;

    try {
      await axios.post('/api/user/weight', { userId, weight: parseFloat(weight) });
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      console.error("Error logging weight", error);
    }
  };

  const caloriesRef = React.useRef<HTMLDivElement>(null);
  const waterRef = React.useRef<HTMLDivElement>(null);
  const proteinRef = React.useRef<HTMLDivElement>(null);

  const { summary, weightTrend, recentMeals } = data || { 
    summary: { calories: 0, protein: 0, water: 0 }, 
    weightTrend: [], 
    recentMeals: [] 
  };

  const caloriesProgress = Math.min((summary.calories / 2500) * 100, 100);
  const waterProgress = Math.min((summary.water / 2.5) * 100, 100);
  const proteinProgress = Math.min((summary.protein / 120) * 100, 100);

  React.useEffect(() => {
    if (caloriesRef.current) caloriesRef.current.style.setProperty('--progress', `${caloriesProgress}%`);
    if (waterRef.current) waterRef.current.style.setProperty('--progress', `${waterProgress}%`);
    if (proteinRef.current) proteinRef.current.style.setProperty('--progress', `${proteinProgress}%`);
  }, [caloriesProgress, waterProgress, proteinProgress]);

  if (loading) {
    return (
      <div className="dashboard-loader">
        <Loader2 className="spinner" size={48} />
        <p>Loading your health data...</p>
      </div>
    );
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding 
          userId={userId} 
          onComplete={() => {
            setShowOnboarding(false);
            fetchDashboardData();
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
          <div ref={caloriesRef} className="progress-bar orange"></div>
        </div>
        <div className="metric-footer">Daily Target: 2,500</div>
      </div>

      <div className="metric-card glass glass-hover">
        <div className="metric-bg-pattern"></div>
        <div className="metric-header">
          <div className="icon-box blue"><Droplets size={20} /></div>
          <span>Water</span>
        </div>
        <div className="metric-value-row">
          <div className="metric-value">{summary.water.toFixed(1)} <span className="unit">L</span></div>
          <div className="quick-actions">
            <button className="action-btn" onClick={() => handleWaterChange(-250)} title="Remove 250ml">-</button>
            <button className="action-btn" onClick={() => handleWaterChange(250)} title="Add 250ml">+</button>
          </div>
        </div>
        <div className="progress-bar-container">
          <div ref={waterRef} className="progress-bar blue"></div>
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
          <div ref={proteinRef} className="progress-bar purple"></div>
        </div>
        <div className="metric-footer">Daily Target: 120g</div>
      </div>

      {/* Main Charts & Trends */}
      <div className="chart-card glass span-2">
        <div className="card-header">
          <div className="header-main">
            <h3>Weight Trend</h3>
            <span className="subtitle">{weightTrend.length > 0 ? 'Tracking Last 7 Logs' : 'No logs yet'}</span>
          </div>
          <button className="btn-primary btn-mini" onClick={handleWeightLog}>Log Weight</button>
        </div>
        <div className="chart-container">
          {weightTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={{ stroke: '#000', strokeWidth: 2 }} 
                  tickLine={false} 
                  tick={{fill: '#000', fontSize: 12, fontWeight: 700}} 
                />
                <YAxis 
                  axisLine={{ stroke: '#000', strokeWidth: 2 }}
                  tickLine={false}
                  tick={{fill: '#000', fontSize: 12, fontWeight: 700}}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: '#fff', 
                    border: '3px solid #000', 
                    borderRadius: '0',
                    boxShadow: '4px 4px 0px #000',
                    fontWeight: 800
                  }}
                  itemStyle={{ color: '#000' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  animationDuration={1500}
                />
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
                      <span className="meal-time">
                        {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
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
