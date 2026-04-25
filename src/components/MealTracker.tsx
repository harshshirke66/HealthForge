"use client";
import React, { useState, ChangeEvent } from 'react';
import { X, Loader2, Wand2, Mic } from 'lucide-react';
import axios from 'axios';
import './MealTracker.css';

interface MealTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const MealTracker: React.FC<MealTrackerProps> = ({ isOpen, onClose, onSave }) => {
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [category, setCategory] = useState<string>('Breakfast');

  const categories = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner', 'Other'];

  React.useEffect(() => {
    if (isOpen) {
      setDescription('');
      setResult(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';

      const response = await axios.post('/api/meals/analyze', {
        mealDescription: description,
        userId: userId
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
          <button 
            onClick={onClose} 
            className="close-btn"
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="modal-body">
          <div className="category-selector">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`cat-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="description">Describe what you ate. AI will handle the rest.</p>
          
          <div className="input-group">
            <textarea 
              placeholder="e.g., Two scrambled eggs with avocado toast and a black coffee"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              className="glass"
            />
            <button 
                className="voice-btn glass" 
                aria-label="Use voice input"
                title="Voice Input"
                type="button"
            >
                <Mic size={20} />
            </button>
          </div>

          <button 
            onClick={handleAnalyze} 
            disabled={loading || !description}
            className="btn-primary analyze-btn"
            type="button"
            title="Analyze meal with AI"
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <><Wand2 size={18} /> Analyze with AI</>}
          </button>

          {result && (
            <div className="analysis-result glass animate-fade-in">
              <h3>{result.data.name || 'Unknown Meal'}</h3>
              <div className="result-grid">
                <div className="res-stat">
                  <span>Calories</span>
                  <strong>{result.data.calories || 0}</strong>
                </div>
                <div className="res-stat">
                  <span>Protein</span>
                  <strong>{result.data.protein || 0}g</strong>
                </div>
                <div className="res-stat">
                  <span>Carbs</span>
                  <strong>{result.data.carbs || 0}g</strong>
                </div>
                <div className="res-stat">
                  <span>Fat</span>
                  <strong>{result.data.fat || 0}g</strong>
                </div>
              </div>
              <p className="ai-note">{result.ai_reasoning}</p>
              <button 
                className="btn-primary save-btn" 
                onClick={async () => {
                  if (loading) return;
                  setLoading(true);
                  try {
                    const storedUser = localStorage.getItem('user');
                    const userId = storedUser ? JSON.parse(storedUser).id : '1';
                    
                    await axios.post('/api/meals', {
                      ...result.data,
                      userId,
                      category
                    });
                    
                    if (onSave) onSave();
                    window.dispatchEvent(new Event('refreshDashboard'));
                    onClose();
                  } catch (err) {
                    console.error(err);
                    alert("Failed to save meal.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                title="Confirm and save meal"
              >
                {loading ? 'Saving...' : 'Confirm & Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealTracker;
