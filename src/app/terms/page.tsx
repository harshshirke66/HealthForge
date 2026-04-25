"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import '../../styles/legal.css';

export default function TermsOfService() {
  return (
    <div className="legal-container">
      <div className="legal-content terms">
        <div className="legal-badge">Legal Contract</div>
        
        <h1>Terms of Service</h1>
        
        <p>By initializing a HealthForge account, you are agreeing to the following terms of operation. We keep things simple, transparent, and absolutely brutal.</p>

        <h2>1. System Usage</h2>
        <p>HealthForge is an AI-powered analytics tool. It is NOT a medical device. If our AI tells you to drink 3 gallons of water, use common sense.</p>
        <ul>
          <li>You are responsible for your own physical safety during generated workouts.</li>
          <li>HealthForge provides intelligence, you provide the execution.</li>
          <li>Do not reverse engineer our proprietary CSS animations. (We'll know.)</li>
        </ul>

        <h2>2. Subscription & Access</h2>
        <p>Access to the Forge requires an active system profile. We reserve the right to terminate accounts that attempt to manipulate our API endpoints or abuse the Groq integration.</p>
        
        <h2>3. Liability Mandate</h2>
        <p>HealthForge Intelligence, its creators, and affiliates are completely indemnified from any injuries, missed PRs, or dietary failures you experience while using the platform.</p>

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
