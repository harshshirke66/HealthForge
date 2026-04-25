"use client";
import React, { useState } from 'react';
import { X, Loader2, Wand2, Mic } from 'lucide-react';
import axios from 'axios';
import './MealTracker.css';

interface MealTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MealTracker: React.FC<MealTrackerProps> = ({ isOpen, onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/meals/analyze', {
        mealDescription: description,
        userId: 1
      });
      
      setResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze meal. Please check your connection or AI API key.");
    } finally {

      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass animate-fade-in">
        <header className="modal-header">
          <h2>Track Your Meal</h2>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </header>

        <div className="modal-body">
          <p className="description">Describe what you ate, or use voice. AI will handle the macros.</p>
          
          <div className="input-group">
            <textarea 
              placeholder="e.g., Two scrambled eggs with avocado toast and a black coffee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass"
            />
            <button className="voice-btn glass"><Mic size={20} /></button>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={loading || !description}
            className="btn-primary analyze-btn"
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <><Wand2 size={18} /> Analyze with AI</>}
          </button>

          {result && (
            <div className="analysis-result glass animate-fade-in">
              <h3>{result.data.name}</h3>
              <div className="result-grid">
                <div className="res-stat">
                  <span>Calories</span>
                  <strong>{result.data.calories}</strong>
                </div>
                <div className="res-stat">
                  <span>Protein</span>
                  <strong>{result.data.protein}g</strong>
                </div>
                <div className="res-stat">
                  <span>Carbs</span>
                  <strong>{result.data.carbs}g</strong>
                </div>
                <div className="res-stat">
                  <span>Fat</span>
                  <strong>{result.data.fat}g</strong>
                </div>
              </div>
              <p className="ai-note">{result.ai_reasoning}</p>
              <button className="btn-primary save-btn" onClick={onClose}>Confirm & Save</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealTracker;
