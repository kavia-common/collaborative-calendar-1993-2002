import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCalendar } from '../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Navigation sidebar including calendar selection and actions.
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const { calendars, selectedCalendarId, setSelectedCalendarId } = useCalendar();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">C</div>
        <div>
          <div className="title">Calendar</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{user?.email}</div>
        </div>
      </div>

      <div className="section-title">Navigation</div>
      <div className="calendar-list">
        <Link className="calendar-item" to="/" data-active={location.pathname === '/'}>🏠 Dashboard</Link>
        <Link className="calendar-item" to="/settings">⚙️ Settings</Link>
      </div>

      <div className="section-title">Your Calendars</div>
      <div className="calendar-list">
        {calendars && calendars.length > 0 ? calendars.map(c => (
          <div
            key={c.id}
            className={`calendar-item ${selectedCalendarId === c.id ? 'active' : ''}`}
            onClick={() => setSelectedCalendarId(c.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' ? setSelectedCalendarId(c.id) : null)}
          >
            <div className="calendar-dot" />
            <div>{c.name}</div>
          </div>
        )) : <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No calendars</div>}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button className="button ghost" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
