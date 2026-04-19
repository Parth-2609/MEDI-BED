"use client";

import { useState } from 'react';
import { Doctor, Booking } from '../types/appointment';
import DoctorCard from './DoctorCard';

interface BookingFormProps {
  loggedPhone: string;
  onBookingSuccess: () => void;
}

export default function BookingForm({ loggedPhone, onBookingSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    department: '',
    doctorId: '',
    date: '',
    time: '',
  });
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const doctors: Doctor[] = [
    { id: '1', name: 'Dr. Alice Smith', specialty: 'Cardiologist', availability: ['Mon 9AM-5PM', 'Wed 2PM-8PM'] },
    { id: '2', name: 'Dr. Bob Johnson', specialty: 'Neurologist', availability: ['Tue 10AM-6PM', 'Thu 9AM-3PM'] },
    { id: '3', name: 'Dr. Carol Davis', specialty: 'Pediatrician', availability: ['Mon 1PM-7PM', 'Fri 8AM-4PM'] },
    { id: '4', name: 'Dr. David Wilson', specialty: 'General Physician', availability: ['Daily 9AM-5PM'] },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.time) {
      setMessage('Please fill all fields');
      return;
    }
    setLoading(true);
    const booking: Booking = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      phone: loggedPhone,
      email: formData.email,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      department: formData.department,
    };
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setMessage('Booking confirmed! SMS sent.');
      onBookingSuccess();
      setFormData({ patientName: '', email: '', department: '', doctorId: '', date: '', time: '' });
    } else {
      setMessage(data.error || 'Booking failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Book Appointment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.patientName}
            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            className="form-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <select
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
          className="form-input"
          required
        >
          <option value="">Select Department</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="General">General Medicine</option>
        </select>

        <div>
          <h4 className="text-lg font-semibold mb-4">Select Doctor</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={setSelectedDoctor}
                selected={selectedDoctor === doctor.id}
              />
            ))}
          </div>
          {selectedDoctor && (
            <p className="mt-2 text-sm text-green-600">Selected: {doctors.find(d => d.id === selectedDoctor)?.name}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <input type="hidden" value={selectedDoctor} onChange={() => {}} />
        
        <button type="submit" disabled={loading || !selectedDoctor} className="btn-primary w-full">
          {loading ? 'Booking...' : 'Confirm & Send SMS'}
        </button>
      </form>

      {message && (
        <div className={`p-4 rounded-xl mx-auto max-w-2xl ${message.includes('confirmed') ? 'success-msg' : 'bg-red-100 border-red-400 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

