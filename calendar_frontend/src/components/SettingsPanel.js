import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * SettingsPanel
 * Simple settings component allowing user to view basic profile info.
 */
export default function SettingsPanel() {
  const { user } = useAuth();
  const [theme] = useState('light'); // reserved for future theme toggle

  return (
    <div className="auth-card">
      <div className="card">
        <div className="title">Settings</div>
        <div className="subtitle">Personalize your calendar experience.</div>
        <div className="form">
          <div>
            <label>Email</label>
            <input className="input" value={user?.email || ''} readOnly />
          </div>
          <div>
            <label>Theme</label>
            <input className="input" value={theme} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
