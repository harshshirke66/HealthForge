"use client";
import React from 'react';
import { Dumbbell, Trophy, Calendar } from 'lucide-react';

const FitnessSection: React.FC = () => {
  return (
    <div className="section-container animate-fade-in">
      <div className="section-header">
        <h2>Fitness Tracker</h2>
        <p>Log your workouts and monitor your strength gains.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card glass">
            <div className="metric-header">
                <div className="icon-box orange"><Dumbbell size={20} /></div>
                <span>Total Workouts</span>
            </div>
            <div className="metric-value">12</div>
            <div className="metric-footer">This month</div>
        </div>
        
        <div className="metric-card glass">
            <div className="metric-header">
                <div className="icon-box purple"><Trophy size={20} /></div>
                <span>Strength Score</span>
            </div>
            <div className="metric-value">740</div>
            <div className="metric-footer">Top 15% in your age group</div>
        </div>

        <div className="chart-card glass span-2">
            <div className="card-header"><h3>Weekly Activity</h3></div>
            <div className="activity-dots">
                {Array.from({length: 28}).map((_, i) => (
                    <div key={i} className={`dot ${Math.random() > 0.5 ? 'active' : ''}`} title={`Activity on day ${i+1}`}></div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessSection;
