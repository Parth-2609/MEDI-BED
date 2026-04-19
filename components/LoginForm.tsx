"use client";

import { useState } from 'react';
import { User } from '../types/appointment';

interface LoginFormProps {
  onUserSubmit: (user: User) => void;
}

export default function LoginForm({ onUserSubmit }: LoginFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const cities = ['Delhi', 'Hyderabad', 'Bangalore', 'Mumbai', 'Chennai'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-add +91 for India numbers
    let formattedPhone = formData.phone.trim();
    if (formattedPhone.startsWith('9') && formattedPhone.length === 10) {
      formattedPhone = '+91' + formattedPhone;
    }
    
    if (!formattedPhone.match(/^[\+]?[1-9][\d]{9,14}$/)) {
      setMessage('Invalid phone (10 digits for India)');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    // Save with formatted phone
    const userData = { ...formData, phone: formattedPhone };
    localStorage.setItem('loggedUser', JSON.stringify(userData as User));
    localStorage.setItem('loggedPhone', formattedPhone);
    
    // Trigger OTP API
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formattedPhone }),
    });
    
    const data = await res.json();
    
    setLoading(false);
    
    if (data.success) {
      setMessage('OTP sent to ' + formattedPhone + '! Enter 123456');
      onUserSubmit(userData as User);
    } else {
      setMessage(data.error || 'Send failed');
    }
  };

  return (
    <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Welcome to MediBed</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Enter details to login</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="form-input"
            required
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <input
            type="text"
            placeholder="State Name"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
            className="form-input"
            maxLength={10}
            required
          />
          {/* <p className="text-xs text-gray-500 mt-1">Will be sent as +919654634041</p> */}
        </div>
        
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending OTP...' : 'Send OTP via SMS'}
        </button>
      </form>
      
      {message && (
        <div className={`mt-6 p-4 rounded-xl ${
          message.includes('OTP sent') ? 'success-msg' : 'bg-red-100 border border-red-400 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

