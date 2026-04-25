"use client";
import React, { useState } from 'react';
import { Loader2, Target, Scale, Ruler, Activity } from 'lucide-react';
import axios from 'axios';
import './Onboarding.css';

interface OnboardingProps {
  userId: string;
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ userId, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    startingWeight: '',
    targetWeight: '',
    activityLevel: 'moderate'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/user/onboarding', {
        userId,
        ...formData
      });
      onComplete();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay onboarding-overlay">
      <div className="modal-content onboarding-content glass animate-fade-in">
        <header className="onboarding-header">
          <h1>Welcome to the Forge</h1>
          <p>Let's calibrate your dashboard for your specific body goals.</p>
        </header>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="onboarding-grid">
            <div className="form-group neo">
              <label><Ruler size={18} /> Height (cm)</label>
              <input 
                type="number" 
                placeholder="175" 
                required 
                value={formData.height}
                onChange={e => setFormData({...formData, height: e.target.value})}
              />
            </div>
            <div className="form-group neo">
              <label><Scale size={18} /> Current Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="75.5" 
                required 
                value={formData.startingWeight}
                onChange={e => setFormData({...formData, startingWeight: e.target.value})}
              />
            </div>
            <div className="form-group neo">
              <label><Target size={18} /> Target Weight (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="70.0" 
                required 
                value={formData.targetWeight}
                onChange={e => setFormData({...formData, targetWeight: e.target.value})}
              />
            </div>
            <div className="form-group neo">
              <label><Activity size={18} /> Activity Level</label>
              <select 
                value={formData.activityLevel}
                onChange={e => setFormData({...formData, activityLevel: e.target.value})}
                title="Select your activity level"
              >
                <option value="sedentary">Sedentary</option>
                <option value="moderate">Moderate</option>
                <option value="active">Very Active</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary onboarding-submit" disabled={loading}>
            {loading ? <Loader2 className="spinner" /> : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
