import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getAccessToken, googleSignIn } from '../firebase';

interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
}

interface CalendarSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  defaultDescription?: string;
}

export const CalendarSchedulerModal: React.FC<CalendarSchedulerModalProps> = ({
  isOpen,
  onClose,
  defaultTitle = 'ব্যবসার কাঁচামাল সোর্সিং ও বাজার যাচাই',
  defaultDescription = 'অল্প পুঁজির ব্যবসা প্ল্যাটফর্ম থেকে নির্ধারিত উদ্যোক্তা কর্মপরিকল্পনা।',
}) => {
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [dateStr, setDateStr] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeStr, setTimeStr] = useState('10:00');
  const [notes, setNotes] = useState(defaultDescription);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Explicit Confirmation State (Mandatory per Google Workspace Skill)
  const [pendingAction, setPendingAction] = useState<{
    type: 'create' | 'delete';
    eventId?: string;
    summary: string;
  } | null>(null);

  useEffect(() => {
    if (defaultTitle) setTitle(defaultTitle);
    if (defaultDescription) setNotes(defaultDescription);
  }, [defaultTitle, defaultDescription]);

  const fetchCalendarEvents = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        setLoading(false);
        return;
      }
      setNeedsAuth(false);
      const timeMin = new Date().toISOString();
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          timeMin
        )}&maxResults=8&singleEvents=true&orderBy=startTime`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 401 || res.status === 403) {
        setNeedsAuth(true);
        return;
      }
      const data = await res.json();
      setEvents(data.items || []);
    } catch (err) {
      console.error('Calendar fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCalendarEvents();
    }
  }, [isOpen]);

  const handleConnectGoogleCalendar = async () => {
    setLoading(true);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setNeedsAuth(false);
        await fetchCalendarEvents();
      }
    } catch (err) {
      console.error('Google Calendar auth error:', err);
      setStatusMessage('Google Calendar সংযোগ সম্পন্ন হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const executeConfirmedAction = async () => {
    if (!pendingAction) return;
    const currentAction = pendingAction;
    setPendingAction(null);
    setLoading(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        setNeedsAuth(true);
        return;
      }

      if (currentAction.type === 'create') {
        const startDateTime = new Date(`${dateStr}T${timeStr}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const res = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: title,
              description: notes,
              start: { dateTime: startDateTime.toISOString() },
              end: { dateTime: endDateTime.toISOString() },
            }),
          }
        );

        if (res.ok) {
          setStatusMessage('আপনার Google Calendar-এ ব্যবসায়িক রিমাইন্ডার যুক্ত হয়েছে!');
          await fetchCalendarEvents();
        } else {
          setStatusMessage('ইভেন্ট তৈরি করা যায়নি। পুনরায় Google Sign-In করুন।');
        }
      } else if (currentAction.type === 'delete' && currentAction.eventId) {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${currentAction.eventId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok || res.status === 204) {
          setStatusMessage('ইভেন্টটি Google Calendar থেকে মুছে ফেলা হয়েছে।');
          await fetchCalendarEvents();
        }
      }
    } catch (error) {
      console.error('Calendar mutation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Google Calendar উদ্যোক্তা শিডিউলার"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Google Calendar উদ্যোক্তা প্ল্যানার
              </h3>
              <p className="text-xs text-slate-500">
                ব্যবসা শুরুর ধাপ ও মিটিং রিমাইন্ডার ক্যালেন্ডারে যুক্ত করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Mandatory Explicit Confirmation Dialog before modifying/deleting user Calendar data */}
        {pendingAction && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-1">
                <p className="font-bold text-sm">আপনি কি নিশ্চিত? (নিশ্চিতকরণ প্রয়োজন)</p>
                {pendingAction.type === 'create' ? (
                  <p>
                    আপনার Google Calendar-এ <strong>“{pendingAction.summary}”</strong> শিরোনামে নতুন ইভেন্ট যুক্ত করা হবে ({dateStr} • {timeStr})।
                  </p>
                ) : (
                  <p>
                    আপনার Google Calendar থেকে <strong>“{pendingAction.summary}”</strong> ইভেন্টটি স্থায়ীভাবে মুছে ফেলা হবে।
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#044E36] text-white hover:bg-[#033d2a]"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        )}

        {needsAuth ? (
          <div className="bg-slate-50 rounded-2xl p-5 text-center space-y-3 border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার Google Calendar-এ ব্যবসার চেকলিস্ট ও সোর্সিং রিমাইন্ডার দেখতে বা যুক্ত করতে Google অ্যাকাউন্টের সাথে সংযোগ করুন।
            </p>
            <button
              type="button"
              onClick={handleConnectGoogleCalendar}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold shadow-xs hover:bg-slate-50 min-h-[44px]"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google (Calendar সংযোগ)</span>
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">
                নতুন ব্যবসায়িক মাইলফলক / রিমাইন্ডার যুক্ত করুন
              </h4>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  কাজের শিরোনাম
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">সময়</label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">নোট / বিবরণ</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setPendingAction({
                    type: 'create',
                    summary: title,
                  })
                }
                disabled={loading || !title.trim()}
                className="w-full h-11 rounded-xl bg-[#044E36] hover:bg-[#033d2a] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Google Calendar-এ রিমাইন্ডার যোগ করুন</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  আপনার আসন্ন ক্যালেন্ডার ইভেন্টসমূহ
                </h4>
                <button
                  type="button"
                  onClick={fetchCalendarEvents}
                  className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>রিফ্রেশ</span>
                </button>
              </div>
              {loading ? (
                <p className="text-xs text-slate-500 py-3">লোড হচ্ছে...</p>
              ) : events.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">
                  কোনো আসন্ন ইভেন্ট পাওয়া যায়নি। উপরে নতুন ব্যবসায়িক রিমাইন্ডার তৈরি করুন।
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-slate-800 truncate">{ev.summary}</p>
                        <p className="text-[11px] text-slate-500 tabular-nums">
                          {ev.start?.dateTime
                            ? new Date(ev.start.dateTime).toLocaleString('bn-BD')
                            : ev.start?.date}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingAction({
                            type: 'delete',
                            eventId: ev.id,
                            summary: ev.summary,
                          })
                        }
                        aria-label={`মুছে ফেলুন ${ev.summary}`}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
