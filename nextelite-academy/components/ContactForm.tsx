import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { TrialSettings } from '../types';

interface ContactFormProps {
  trialSettings?: TrialSettings;
  onSubmit: (data: any) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ trialSettings, onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'English Debate',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t.form.validation.name;
    if (!formData.email.trim()) {
      newErrors.email = t.form.validation.emailReq;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.form.validation.emailInv;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t.form.validation.phoneReq;
    } else if (!/^\d{8,}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = t.form.validation.phoneInv;
    }
    if (!formData.message.trim()) newErrors.message = t.form.validation.msgReq;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        type: 'contact',
        name: formData.name,
        contactInfo: formData.email,
        details: formData.message,
        courseInterest: formData.course,
        timestamp: new Date()
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', course: 'English Debate', message: '' });
      setErrors({});
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 p-8 rounded-xl text-center border-2 border-green-100 h-full flex flex-col justify-center items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">{t.form.sentTitle}</h3>
        <p className="text-green-600 mb-6">{t.form.sentDesc}</p>
        <button 
          onClick={() => setIsSubmitted(false)}
          className="text-green-700 font-bold underline hover:text-green-800"
        >
          {t.form.sendAgain}
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.name} <span className="text-red-500">*</span></label>
        <div className="relative">
          <input 
            type="text" 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-brand-blue'}`}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          {errors.name && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.email} <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-brand-blue'}`}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.phone} <span className="text-red-500">*</span></label>
          <input 
            type="tel" 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-brand-blue'}`}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.course}</label>
        <select 
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-blue/20 focus:border-brand-blue outline-none bg-white"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
        >
          <option value="English Debate">English Debate</option>
          <option value="Logical Thinking">Logical Thinking</option>
          <option value="AI Coding">AI Coding</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">{t.form.message} <span className="text-red-500">*</span></label>
        <textarea 
          rows={4} 
          className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-brand-blue'}`}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1 ml-1">{errors.message}</p>}
      </div>

      <button 
        type="submit" 
        className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-brand-blue transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex justify-center items-center"
      >
        <Send className="w-5 h-5 mr-2" /> {t.form.send}
      </button>
    </form>
  );
};

export default ContactForm;