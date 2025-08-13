import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';

/**
 * PUBLIC_INTERFACE
 * EventModal
 * Modal dialog for creating and editing calendar events with invitations.
 */
export default function EventModal({ open, onClose, initial }) {
  const { selectedCalendarId, calendars, createEvent, updateEvent, deleteEvent, inviteParticipants } = useCalendar();
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [start, setStart] = useState(initial?.start ? new Date(initial.start) : new Date());
  const [end, setEnd] = useState(initial?.end ? new Date(initial.end) : new Date(new Date().getTime() + 60 * 60 * 1000));
  const [location, setLocation] = useState(initial?.location || '');
  const [calendarId, setCalendarId] = useState(initial?.calendarId || selectedCalendarId || null);
  const [invites, setInvites] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setDescription(initial?.description || '');
      setStart(initial?.start ? new Date(initial.start) : new Date());
      setEnd(initial?.end ? new Date(initial.end) : new Date(new Date().getTime() + 60 * 60 * 1000));
      setLocation(initial?.location || '');
      setCalendarId(initial?.calendarId || selectedCalendarId || null);
      setInvites('');
    }
  }, [open, initial, selectedCalendarId]);

  if (!open) return null;

  async function onSave() {
    const payload = {
      title,
      description,
      start: start.toISOString(),
      end: end.toISOString(),
      location,
      calendarId,
    };
    if (initial?.id) {
      await updateEvent(initial.id, payload);
      if (invites.trim()) {
        const emails = invites.split(',').map(s => s.trim()).filter(Boolean);
        await inviteParticipants(initial.id, emails);
      }
    } else {
      const ev = await createEvent(payload);
      if (invites.trim()) {
        const emails = invites.split(',').map(s => s.trim()).filter(Boolean);
        await inviteParticipants(ev.id, emails);
      }
    }
    onClose?.();
  }

  async function onDelete() {
    if (initial?.id) {
      await deleteEvent(initial.id);
      onClose?.();
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ fontWeight: 800 }}>{initial?.id ? 'Edit event' : 'New event'}</div>
          <button className="button ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div>
              <label>Title</label>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
            </div>
            <div>
              <label>Location</label>
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (optional)" />
            </div>
          </div>
          <div className="row">
            <div>
              <label>Start</label>
              <input
                className="input"
                type="datetime-local"
                value={format(start, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setStart(new Date(e.target.value))}
              />
            </div>
            <div>
              <label>End</label>
              <input
                className="input"
                type="datetime-local"
                value={format(end, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setEnd(new Date(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label>Description</label>
            <textarea className="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes or agenda (optional)" />
          </div>
          <div className="row">
            <div>
              <label>Calendar</label>
              <select className="select" value={calendarId || ''} onChange={(e) => setCalendarId(e.target.value)}>
                <option value="" disabled>Select calendar</option>
                {calendars?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label>Invite participants (comma-separated emails)</label>
              <input className="input" value={invites} onChange={(e) => setInvites(e.target.value)} placeholder="alice@example.com, bob@example.com" />
            </div>
          </div>
        </div>
        <div className="actions">
          {initial?.id ? <button className="button" onClick={onSave}>Save</button> : <button className="button" onClick={onSave}>Create</button>}
          {initial?.id ? <button className="button ghost" onClick={onDelete}>Delete</button> : null}
        </div>
      </div>
    </div>
  );
}
