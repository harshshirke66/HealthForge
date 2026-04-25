"use client";
import React, { useState, useEffect } from 'react';
import { Dumbbell, Trophy, CheckCircle, Flame, Activity, RefreshCw } from 'lucide-react';
import './FitnessSection.css';

interface Exercise {
  name: string;
  reps: string;
  sets: number;
}

interface WorkoutPlan {
  title: string;
  description: string;
  warmup: string[];
  exercises: Exercise[];
  cooldown: string[];
}

interface DailyWorkout {
  date: string;
  plan: WorkoutPlan;
  status: 'pending' | 'done';
}

const FitnessSection: React.FC = () => {
  const [todayWorkout, setTodayWorkout] = useState<DailyWorkout | null>(null);
  const [history, setHistory] = useState<DailyWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    loadOrGenerateWorkout();
  }, []);

  const loadOrGenerateWorkout = async (forceRegenerate = false) => {
    setIsLoading(true);
    setError('');
    try {
      const today = getTodayDateString();
      const savedHistoryStr = localStorage.getItem('hf_fitness_history');
      let currentHistory: DailyWorkout[] = savedHistoryStr ? JSON.parse(savedHistoryStr) : [];
      
      setHistory(currentHistory);

      const existingToday = currentHistory.find(w => w.date === today);

      if (existingToday && !forceRegenerate) {
        setTodayWorkout(existingToday);
        setIsLoading(false);
        return;
      }

      // Generate new workout
      const res = await fetch('/api/ai/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: 'intermediate' }) // could be dynamic based on user profile
      });

      const data = await res.json();

      if (data.success && data.workout) {
        const newDailyWorkout: DailyWorkout = {
          date: today,
          plan: data.workout,
          status: 'pending'
        };

        // Update history
        const updatedHistory = currentHistory.filter(w => w.date !== today);
        updatedHistory.push(newDailyWorkout);
        
        localStorage.setItem('hf_fitness_history', JSON.stringify(updatedHistory));
        setTodayWorkout(newDailyWorkout);
        setHistory(updatedHistory);
      } else {
        throw new Error(data.error || 'Failed to generate workout');
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to AI trainer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsDone = () => {
    if (!todayWorkout) return;
    
    const updatedWorkout = { ...todayWorkout, status: 'done' as const };
    setTodayWorkout(updatedWorkout);
    
    const updatedHistory = history.map(w => w.date === todayWorkout.date ? updatedWorkout : w);
    setHistory(updatedHistory);
    localStorage.setItem('hf_fitness_history', JSON.stringify(updatedHistory));
  };

  const totalWorkoutsDone = history.filter(w => w.status === 'done').length;

  return (
    <div className="section-container animate-fade-in">
      <div className="section-header">
        <h2>AI Personal Trainer</h2>
        <p>Your daily, zero-equipment home workout generated specifically for you.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card glass">
            <div className="metric-header">
                <div className="icon-box orange"><Dumbbell size={20} /></div>
                <span>Workouts Completed</span>
            </div>
            <div className="metric-value">{totalWorkoutsDone}</div>
            <div className="metric-footer">All time</div>
        </div>
        
        <div className="metric-card glass">
            <div className="metric-header">
                <div className="icon-box purple"><Trophy size={20} /></div>
                <span>Current Streak</span>
            </div>
            <div className="metric-value">{totalWorkoutsDone > 0 ? '1' : '0'}</div>
            <div className="metric-footer">Days in a row</div>
        </div>
      </div>

      {isLoading ? (
        <div className="metric-card glass fitness-center-card">
          <RefreshCw className="spin fitness-spin-icon" size={40} />
          <h3>Generating Your Workout...</h3>
          <p>Analyzing optimal bodyweight exercises for today.</p>
        </div>
      ) : error ? (
        <div className="metric-card glass fitness-center-card">
           <h3 className="fitness-error-text">Error</h3>
           <p>{error}</p>
           <button className="btn-primary fitness-retry-btn" onClick={() => loadOrGenerateWorkout(true)}>
             Retry Generation
           </button>
        </div>
      ) : todayWorkout ? (
        <div className="fitness-workout-card animate-slide-up">
          <div className="workout-header">
            <div>
              <h3>{todayWorkout.plan.title}</h3>
              <p>{todayWorkout.plan.description}</p>
            </div>
            <div className={`workout-status-badge ${todayWorkout.status === 'done' ? 'done' : ''}`}>
              {todayWorkout.status === 'done' ? 'Completed' : 'Pending'}
            </div>
          </div>

          <div className="workout-content">
            <div className="workout-section">
              <h4><Flame size={20} /> Warm Up</h4>
              <ul className="workout-list">
                {todayWorkout.plan.warmup.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="workout-section">
              <h4><Activity size={20} /> Main Workout</h4>
              <ul className="workout-list">
                {todayWorkout.plan.exercises.map((ex, idx) => (
                  <li key={idx}>
                    <span>{ex.name}</span>
                    <div className="exercise-details">
                      <span>{ex.sets} Sets</span>
                      <span>{ex.reps}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="workout-section">
              <h4><Activity size={20} className="fitness-faded-icon" /> Cool Down</h4>
              <ul className="workout-list">
                {todayWorkout.plan.cooldown.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="workout-actions">
            <button 
              className="btn-complete-workout" 
              onClick={markAsDone}
              disabled={todayWorkout.status === 'done'}
            >
              {todayWorkout.status === 'done' ? (
                <span className="fitness-flex-center"><CheckCircle size={24}/> Workout Finished</span>
              ) : 'Mark as Done'}
            </button>
          </div>
        </div>
      ) : null}

      {history.length > 0 && (
        <div className="fitness-history-section">
          <h3 className="fitness-history-title">Workout History</h3>
          <div className="fitness-history-grid">
            {history.slice().reverse().map((w, idx) => (
              <div key={idx} className={`history-card ${w.status}`}>
                <div className="date">{new Date(w.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}</div>
                <div className="title fitness-card-title">{w.plan.title}</div>
                <div className="status">{w.status === 'done' ? '✅ Completed' : '⏳ Skipped/Pending'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default FitnessSection;
