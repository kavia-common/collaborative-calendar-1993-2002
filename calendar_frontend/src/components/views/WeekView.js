import React, { useMemo } from 'react';
import { addDays, endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';
import { useCalendar } from '../../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * WeekView
 * Displays events grouped by each day of the current week.
 */
export default function WeekView({ onSelectEvent }) {
  const { currentDate, events } = useCalendar();

  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const d = [];
    let cur = start;
    while (cur <= end) {
      d.push(cur);
      cur = addDays(cur, 1);
    }
    return d;
  }, [currentDate]);

  return (
    <div className="list">
      {days.map((day) => {
        const todaysEvents = (events || [])
          .filter(ev => isSameDay(new Date(ev.start), day))
          .sort((a,b) => new Date(a.start) - new Date(b.start));
        return (
          <div key={day.toISOString()} className="card">
            <div style={{ minWidth: 160, fontWeight: 700 }}>{format(day, 'EEE, MMM d')}</div>
            <div style={{ flex: 1 }}>
              {todaysEvents.length ? todaysEvents.map(ev => (
                <div key={ev.id} className="event-pill" style={{ marginBottom: 6 }} onClick={() => onSelectEvent(ev)}>
                  <span className="time">{format(new Date(ev.start), 'HH:mm')}</span>
                  <span>{ev.title}</span>
                </div>
              )) : <span style={{ color: 'var(--text-secondary)' }}>No events</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
