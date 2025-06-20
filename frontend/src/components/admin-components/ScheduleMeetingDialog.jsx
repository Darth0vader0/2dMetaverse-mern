import React, { useState, useEffect } from 'react';

function ScheduleMeetingDialog({ open, onClose, onSchedule }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      setIsSubmitting(false);
    }
  }, [open]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSchedule({ 
        title: title.trim(), 
        date, 
        time, 
        description: description.trim(),
        datetime: `${date} ${time}`
      });
      onClose();
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md flex flex-col gap-4 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 id="dialog-title" className="font-semibold text-xl text-white">
            Schedule Meeting
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="meeting-title" className="block text-sm font-medium text-slate-300 mb-1">
              Meeting Title *
            </label>
            <input
              id="meeting-title"
              type="text"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="meeting-date" className="block text-sm font-medium text-slate-300 mb-1">
                Date *
              </label>
              <input
                id="meeting-date"
                type="date"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </div>

            <div>
              <label htmlFor="meeting-time" className="block text-sm font-medium text-slate-300 mb-1">
                Time *
              </label>
              <input
                id="meeting-time"
                type="time"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="meeting-description" className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="meeting-description"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional meeting description"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors font-medium"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scheduling...
              </>
            ) : (
              'Schedule Meeting'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleMeetingDialog;