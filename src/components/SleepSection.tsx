import React from 'react';
import axios from 'axios';
import { Moon } from 'lucide-react';

const SleepSection: React.FC = () => {
  const [sleepLog, setSleepLog] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    sleepTime: '',
    wakeTime: '',
    quality: 3
  });

  const fetchSleepData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';
      const response = await axios.get(`/api/user/sleep?userId=${userId}`);
      setSleepLog(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchSleepData();
  }, []);

  const handleSaveSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const start = new Date(formData.sleepTime);
    const end = new Date(formData.wakeTime);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    if (diff < 0) {
      alert("Wake time cannot be before sleep time. Please check your dates.");
      return;
    }
    if (diff > 16) {
      alert("You entered a sleep duration of over 16 hours! Please check if you accidentally selected PM instead of AM.");
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';
      await axios.post('/api/user/sleep', { 
        userId, 
        sleepTime: formData.sleepTime, 
        wakeTime: formData.wakeTime,
        quality: formData.quality
      });
      fetchSleepData();
      alert("Sleep logged successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const calculateDuration = () => {
    if (!sleepLog || !sleepLog.sleep_time || !sleepLog.wake_time) return 'No data';
    const start = new Date(sleepLog.sleep_time);
    const end = new Date(sleepLog.wake_time);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'No data';
    
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? `${diff.toFixed(1)}h` : 'Invalid range';
  };

  return (
    <div className="section-container animate-fade-in">
      <div className="section-header">
        <h2>Sleep Analysis</h2>
        <p>Monitor your circadian rhythm and sleep quality.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="metric-card glass">
            <div className="metric-header">
                <div className="icon-box purple"><Moon size={20} /></div>
                <span>Last Sleep</span>
            </div>
            <div className="metric-value">{calculateDuration()}</div>
            <div className="metric-footer">Goal: 8h 00m</div>
        </div>
        
        <div className="metric-card glass span-2">
            <div className="card-header"><h3>Log New Sleep</h3></div>
            <form onSubmit={handleSaveSleep} className="sleep-form">
                <div className="input-row">
                    <div className="input-group">
                        <label>Sleep Time</label>
                        <input 
                          type="datetime-local" 
                          value={formData.sleepTime}
                          onChange={e => setFormData({...formData, sleepTime: e.target.value})}
                          required 
                          title="Select sleep time"
                          placeholder="Select sleep time"
                        />
                    </div>
                    <div className="input-group">
                        <label>Wake Time</label>
                        <input 
                          type="datetime-local" 
                          value={formData.wakeTime}
                          onChange={e => setFormData({...formData, wakeTime: e.target.value})}
                          required 
                          title="Select wake time"
                          placeholder="Select wake time"
                        />
                    </div>
                </div>
                <button type="submit" className="btn-primary">Save Sleep Log</button>
            </form>
        </div>

        <div className="chart-card glass span-3">
            <div className="card-header"><h3>Sleep Stages Visualization</h3></div>
            <div className="sleep-stages-bar">
                <div className="stage deep">Deep</div>
                <div className="stage rem">REM</div>
                <div className="stage light">Light</div>
                <div className="stage awake">Awake</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SleepSection;
