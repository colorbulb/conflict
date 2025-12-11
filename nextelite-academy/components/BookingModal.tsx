import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Course, Submission } from '../types';
import { DEFAULT_TIME_SLOTS } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSubmit: (bookingData: any) => void;
  blockedDates?: string[];
  // We need the full trial settings object or at least the custom availability map now
  // For simplicity in this structure, let's assume the parent might pass specific availability, 
  // or we can hack it by passing the whole object if we updated the parent interface, 
  // but to adhere to strict typing let's just accept a customAvailability map prop or assume we look it up.
  // Given the current architecture, the parent App passes specific props. I'll update App.tsx to pass the trialSettings object or just add the map here.
  // Actually, I'll update the interface to accept the map.
  customAvailability?: Record<string, string[]>;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, courses, onSubmit, blockedDates = [], customAvailability = {} }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
  
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    phone: '',
    courseId: courses[0]?.id || ''
  });

  const [dates, setDates] = useState<Date[]>([]);

  // Generate next 14 days
  useEffect(() => {
    const nextDays = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      nextDays.push(d);
    }
    setDates(nextDays);
  }, []);

  const handleDaySelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    
    // Determine slots for this date
    const dateStr = date.toISOString().split('T')[0];
    if (customAvailability[dateStr]) {
        setAvailableTimeSlots(customAvailability[dateStr]);
    } else {
        setAvailableTimeSlots(DEFAULT_TIME_SLOTS);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone) return;

    onSubmit({
      type: 'trial',
      name: formData.name,
      contactInfo: formData.phone,
      details: `${selectedDate.toLocaleDateString()} - ${selectedTime}, Grade: ${formData.grade}`,
      courseInterest: courses.find(c => c.id === formData.courseId)?.title || 'General',
      timestamp: new Date()
    });

    setStep(2); // Success view
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', grade: '', phone: '', courseId: courses[0]?.id || '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-brand-blue p-6 flex justify-between items-center text-white shrink-0">
              <div>
                 <h2 className="text-2xl font-display font-bold">{t.booking.title}</h2>
                 <p className="text-blue-100 text-sm opacity-90">Secure your spot today!</p>
              </div>
              <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              {step === 1 ? (
                <div className="space-y-8">
                  
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-gray-700 font-bold mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brand-orange" /> {t.booking.selectDate}
                    </h3>
                    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                      {dates.map((date, idx) => {
                         const dateStr = date.toISOString().split('T')[0];
                         const isBlocked = blockedDates.includes(dateStr);
                         // Also check if custom availability array is empty for this day (admin disabled all hours)
                         const hasNoSlots = customAvailability[dateStr] && customAvailability[dateStr].length === 0;
                         const isDisabled = isBlocked || hasNoSlots;
                         
                         const isSelected = selectedDate?.toDateString() === date.toDateString();
                         
                         return (
                           <button
                             key={idx}
                             onClick={() => !isDisabled && handleDaySelect(date)}
                             disabled={isDisabled}
                             className={`flex-shrink-0 w-20 p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                               isDisabled
                                 ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                 : isSelected 
                                   ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-md' 
                                   : 'border-gray-200 bg-white text-gray-600 hover:border-brand-blue/50'
                             }`}
                           >
                             <span className="text-xs uppercase font-bold">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                             <span className={`text-xl font-bold ${isDisabled ? 'line-through decoration-red-400' : ''}`}>{date.getDate()}</span>
                           </button>
                         )
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <AnimatePresence>
                    {selectedDate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <h3 className="text-gray-700 font-bold mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-brand-orange" /> {t.booking.selectTime}
                        </h3>
                        {availableTimeSlots.length === 0 ? (
                            <p className="text-red-400 italic text-sm">No slots available for this date.</p>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {availableTimeSlots.map((time, idx) => (
                                <button
                                key={idx}
                                onClick={() => setSelectedTime(time)}
                                className={`p-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                                    selectedTime === time 
                                    ? 'border-brand-blue bg-brand-blue text-white' 
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                                >
                                {time}
                                </button>
                            ))}
                            </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <AnimatePresence>
                    {selectedDate && selectedTime && (
                      <motion.form 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
                      >
                         <h3 className="text-gray-700 font-bold border-b border-gray-100 pb-2 mb-4">{t.booking.details}</h3>
                         
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.name}</label>
                            <input 
                              required
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-brand-blue outline-none"
                            />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t.booking.grade}</label>
                                <input 
                                  required
                                  placeholder={t.booking.gradePh}
                                  value={formData.grade}
                                  onChange={e => setFormData({...formData, grade: e.target.value})}
                                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.phone}</label>
                                <input 
                                  required
                                  type="tel"
                                  value={formData.phone}
                                  onChange={e => setFormData({...formData, phone: e.target.value})}
                                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-brand-blue outline-none"
                                />
                             </div>
                         </div>

                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.course}</label>
                            <select
                               value={formData.courseId}
                               onChange={e => setFormData({...formData, courseId: e.target.value})}
                               className="w-full border rounded-lg p-2 bg-white outline-none"
                            >
                               {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                         </div>

                         <button 
                           type="submit"
                           className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-600 transition-colors shadow-lg"
                         >
                            {t.booking.confirm}
                         </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                   <div className="bg-green-100 p-6 rounded-full mb-6">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                   </div>
                   <h3 className="text-3xl font-bold text-gray-800 mb-4">{t.booking.success}</h3>
                   <p className="text-gray-600 max-w-md mb-8">{t.booking.successSub}</p>
                   <button 
                     onClick={handleClose}
                     className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-600 transition-colors"
                   >
                     {t.booking.close}
                   </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;