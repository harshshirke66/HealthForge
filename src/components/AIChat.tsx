"use client";
import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';
import './AIChat.css';

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I'm your HealthForge assistant. How can I help you reach your goals today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : '1';

      const response = await axios.post('/api/ai/chat', {
        message: userMessage,
        userId: userId
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.data.response }]);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "I'm having trouble connecting. Try again later.";
      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container glass">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message-wrapper ${msg.role}`}>
            <div className={`message-icon ${msg.role}`}>
              {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper ai">
            <div className="message-icon ai"><Bot size={16} /></div>
            <div className="message-content loading">
              <Loader2 size={16} className="spinner" /> AI is thinking...
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Ask about your health..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="glass"
        />
        <button 
          onClick={handleSend} 
          disabled={loading} 
          className="send-btn"
          aria-label="Send message"
          title="Send"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
