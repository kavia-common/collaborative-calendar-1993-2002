import React from 'react';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from '../../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * DayView
 * Displays events for the selected day as a list with time badges.
 */
export default function DayView({ onSelectEvent }) {
  const { currentDate, events } = useCalendar();
  const todaysEvents = (events || [])
    .filter(ev => isSameDay(new Date(ev.start), currentDate))
    .sort((a,b) => new Date(a.start) - new Date(b.start));

  return (
    <div className="list">
      <div className="card" style={{ fontWeight: 800 }}>
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </div>
      {todaysEvents.length ? todaysEvents.map(ev => (
        <div key={ev.id} className="card event-pill" onClick={() => onSelectEvent(ev)}>
          <span className="time">{format(new Date(ev.start), 'HH:mm')}</span>
          <span style={{ flex: 1 }}>{ev.title}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{ev.location || ''}</span>
        </div>
      )) : <div className="card" style={{ color: 'var(--text-secondary)' }}>No events</div>}
    </div>
  );
}
