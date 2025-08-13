import React from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * CalendarHeader
 * Toolbar with date navigation, view switcher, and primary actions.
 */
export default function CalendarHeader({ onCreate }) {
  const { currentView, setCurrentView, currentDate, goPrev, goNext, goToday, selectedCalendar } = useCalendar();

  return (
    <div className="header">
      <div className="segmented" role="tablist" aria-label="Calendar view">
        <button
          className={currentView === 'month' ? 'active' : ''}
          onClick={() => setCurrentView('month')}
          role="tab"
          aria-selected={currentView === 'month'}
        >
          Month
        </button>
        <button
          className={currentView === 'week' ? 'active' : ''}
          onClick={() => setCurrentView('week')}
          role="tab"
          aria-selected={currentView === 'week'}
        >
          Week
        </button>
        <button
          className={currentView === 'day' ? 'active' : ''}
          onClick={() => setCurrentView('day')}
          role="tab"
          aria-selected={currentView === 'day'}
        >
          Day
        </button>
      </div>

      <div className="spacer" />

      <button className="button ghost" onClick={goPrev} aria-label="Previous period">←</button>
      <button className="button ghost" onClick={goToday} aria-label="Today">Today</button>
      <button className="button ghost" onClick={goNext} aria-label="Next period">→</button>

      <div className="spacer" />

      <div className="date-title">
        {format(currentDate, currentView === 'month' ? 'MMMM yyyy' : currentView === 'week' ? "'Week of' MMM d, yyyy" : 'EEEE, MMM d, yyyy')}
        {selectedCalendar ? ` • ${selectedCalendar.name}` : ''}
      </div>

      <div className="spacer" />

      <button className="button accent" onClick={onCreate}>+ New event</button>
    </div>
  );
}
