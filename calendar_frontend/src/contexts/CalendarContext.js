import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { addDays, addMonths, addWeeks, formatISO, startOfDay } from 'date-fns';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const CalendarContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * useCalendar
 * Hook to access calendar data and methods.
 */
export function useCalendar() {
  /** Provides access to the CalendarContext. */
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * CalendarProvider
 * Provides calendars, events, selection state, view state and CRUD methods for events.
 */
export function CalendarProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [currentView, setCurrentView] = useState('month'); // month | week | day
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCalendar = useMemo(
    () => calendars.find(c => c.id === selectedCalendarId) || null,
    [calendars, selectedCalendarId]
  );

  // Load calendars on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const list = await api.calendars.list();
        setCalendars(list);
        if (list?.length && !selectedCalendarId) {
          setSelectedCalendarId(list[0].id);
        }
      } catch (e) {
        // gracefully ignore to keep UI usable without backend
        setCalendars([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Load events whenever selection or date window changes
  useEffect(() => {
    if (!isAuthenticated || !selectedCalendarId) return;
    (async () => {
      setLoading(true);
      try {
        const range = getCurrentRange(currentView, currentDate);
        const list = await api.events.list({
          calendarId: selectedCalendarId,
          start: formatISO(range.start),
          end: formatISO(range.end),
        });
        setEvents(list || []);
      } catch (e) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated, selectedCalendarId, currentView, currentDate]);

  // PUBLIC_INTERFACE
  const refreshEvents = useCallback(async () => {
    /** Refreshes events for the current view/date window. */
    if (!selectedCalendarId) return;
    const range = getCurrentRange(currentView, currentDate);
    const list = await api.events.list({
      calendarId: selectedCalendarId,
      start: formatISO(range.start),
      end: formatISO(range.end),
    });
    setEvents(list || []);
  }, [selectedCalendarId, currentView, currentDate]);

  // Date navigation based on view
  // PUBLIC_INTERFACE
  const goPrev = useCallback(() => {
    /** Navigate to previous period based on current view. */
    if (currentView === 'month') setCurrentDate(d => addMonths(d, -1));
    else if (currentView === 'week') setCurrentDate(d => addWeeks(d, -1));
    else setCurrentDate(d => addDays(d, -1));
  }, [currentView]);

  // PUBLIC_INTERFACE
  const goNext = useCallback(() => {
    /** Navigate to next period based on current view. */
    if (currentView === 'month') setCurrentDate(d => addMonths(d, 1));
    else if (currentView === 'week') setCurrentDate(d => addWeeks(d, 1));
    else setCurrentDate(d => addDays(d, 1));
  }, [currentView]);

  // PUBLIC_INTERFACE
  const goToday = useCallback(() => {
    /** Navigate to today's date. */
    setCurrentDate(startOfDay(new Date()));
  }, []);

  // CRUD
  // PUBLIC_INTERFACE
  const createEvent = useCallback(async (payload) => {
    /** Creates a new event in the selected calendar and refreshes events. */
    const data = await api.events.create({ ...payload, calendarId: selectedCalendarId });
    await refreshEvents();
    return data;
  }, [selectedCalendarId, refreshEvents]);

  // PUBLIC_INTERFACE
  const updateEvent = useCallback(async (id, payload) => {
    /** Updates an event and refreshes events. */
    const data = await api.events.update(id, payload);
    await refreshEvents();
    return data;
  }, [refreshEvents]);

  // PUBLIC_INTERFACE
  const deleteEvent = useCallback(async (id) => {
    /** Deletes an event and refreshes events. */
    await api.events.remove(id);
    await refreshEvents();
  }, [refreshEvents]);

  // PUBLIC_INTERFACE
  const inviteParticipants = useCallback(async (eventId, emails) => {
    /** Sends invitations to participants for a specific event. */
    return api.events.invite(eventId, emails);
  }, []);

  const value = useMemo(() => ({
    calendars,
    selectedCalendarId,
    setSelectedCalendarId,
    selectedCalendar,
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    events,
    loading,
    goPrev,
    goNext,
    goToday,
    createEvent,
    updateEvent,
    deleteEvent,
    inviteParticipants,
    refreshEvents,
  }), [
    calendars, selectedCalendarId, selectedCalendar, currentView, currentDate, events, loading,
    goPrev, goNext, goToday, createEvent, updateEvent, deleteEvent, inviteParticipants, refreshEvents
  ]);

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// Helpers
function getCurrentRange(view, date) {
  const d = new Date(date);
  if (view === 'month') {
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  }
  if (view === 'week') {
    const day = d.getDay();
    const diff = (day + 6) % 7; // Monday start
    const start = new Date(d);
    start.setDate(d.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
}
