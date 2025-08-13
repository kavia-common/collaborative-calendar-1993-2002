import React, { useMemo } from 'react';
import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { useCalendar } from '../../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * MonthView
 * Renders a monthly grid calendar with events.
 */
export default function MonthView({ onSelectDay, onSelectEvent }) {
  const { currentDate, events } = useCalendar();

  const weeks = useMemo(() => {
    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const rows = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [currentDate]);

  const dayNames = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return new Array(7).fill(0).map((_, i) => format(addDays(start, i), 'EEE'));
  }, [currentDate]);

  return (
    <div className="calendar-grid">
      <div className="grid-month">
        <div className="grid-header">
          {dayNames.map((d) => (
            <div key={d} className="cell">{d}</div>
          ))}
        </div>
        {weeks.map((week, idx) => (
          <React.Fragment key={idx}>
            {week.map(day => {
              const inMonth = isSameMonth(day, currentDate);
              const todaysEvents = (events || []).filter(ev => isSameDay(new Date(ev.start), day));
              return (
                <div
                  key={day.toISOString()}
                  className={`day-cell ${isSameDay(day, new Date()) ? 'today' : ''}`}
                  style={{ opacity: inMonth ? 1 : 0.55, cursor: 'pointer' }}
                  onClick={() => onSelectDay(day)}
                >
                  <div className="date">{format(day, 'd')}</div>
                  <div className="events">
                    {todaysEvents.slice(0, 3).map(ev => (
                      <div key={ev.id} className="event-pill" onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}>
                        <span className="time">{format(new Date(ev.start), 'HH:mm')}</span>
                        <span>{ev.title}</span>
                      </div>
                    ))}
                    {todaysEvents.length > 3 && (
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        +{todaysEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
