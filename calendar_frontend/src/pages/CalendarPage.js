import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CalendarHeader from '../components/CalendarHeader';
import MonthView from '../components/views/MonthView';
import WeekView from '../components/views/WeekView';
import DayView from '../components/views/DayView';
import EventModal from '../components/EventModal';
import { useCalendar } from '../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * CalendarPage
 * Main page layout for the collaborative calendar.
 */
export default function CalendarPage() {
  const { currentView } = useCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function openNew() {
    setSelectedEvent(null);
    setModalOpen(true);
  }
  function openExisting(ev) {
    setSelectedEvent(ev);
    setModalOpen(true);
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <CalendarHeader onCreate={openNew} />
        {currentView === 'month' && (
          <MonthView
            onSelectDay={() => openNew()}
            onSelectEvent={(ev) => openExisting(ev)}
          />
        )}
        {currentView === 'week' && (
          <WeekView
            onSelectEvent={(ev) => openExisting(ev)}
          />
        )}
        {currentView === 'day' && (
          <DayView
            onSelectEvent={(ev) => openExisting(ev)}
          />
        )}
      </main>
      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={selectedEvent}
      />
    </div>
  );
}
