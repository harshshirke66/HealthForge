"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import '../../styles/legal.css';

export default function PrivacyDirective() {
  return (
    <div className="legal-container">
      <div className="legal-content privacy">
        <div className="legal-badge">Official Document</div>
        
        <h1>Privacy Directive</h1>
        
        <p>At HealthForge Intelligence, your biometric data is treated with military-grade precision. We do not farm your data, we do not sell your habits to advertisers, and we do not track your digital footprint outside of our ecosystem.</p>

        <h2>1. Zero Telemetry Protocol</h2>
        <p>Unlike legacy health trackers, HealthForge operates on a Zero Telemetry mandate. What happens in the Forge, stays in the Forge.</p>
        <ul>
          <li>No third-party ad-tracking pixels.</li>
          <li>No cross-app data sharing.</li>
          <li>Location data is strictly requested only when activating live GPS runs.</li>
        </ul>

        <h2>2. Data Encryption</h2>
        <p>All sensitive health inputs (weight, calories, sleep architecture) are hashed and encrypted at rest using AES-256 standard encryption on our Supabase infrastructure.</p>
        
        <h2>3. AI Processing</h2>
        <p>Your inputs are sent to the Groq AI LLaMa 3.1 engine via secure API channels for instantaneous analysis. Groq has strict privacy measures guaranteeing your prompts are not used to train global base models.</p>

        <div className="legal-footer">
          <Link href="/" className="legal-back-btn">
             <ArrowLeft size={20} /> Return to Base
          </Link>
          <span className="last-updated">UPDATED: APRIL 2026</span>
        </div>
      </div>
    </div>
  );
}
