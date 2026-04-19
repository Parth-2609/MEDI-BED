"use client";

import { useEffect, useState } from 'react';
import LoginForm from '../components/LoginForm';
import HospitalCard from '../components/HospitalCard';
import { Doctor } from '../types/appointment';
import DoctorCard from '../components/DoctorCard';

export default function Home() {
  const [step, setStep] = useState<'login' | 'verify-otp' | 'hospitals' | 'doctors' | 'booking' | 'confirmed'>('login');
  const [user, setUser] = useState(null);
  const [otpPhone, setOtpPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [doctors] = useState<Doctor[]>([
    { id: 'Dr. Rajesh Kumar', name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', availability: ['Mon-Fri 9AM-5PM'] },
    { id: 'Dr. Priya Sharma', name: 'Dr. Priya Sharma', specialty: 'Neurologist', availability: ['Tue-Thu 2PM-8PM'] },
    { id: 'Dr. Amit Patel', name: 'Dr. Amit Patel', specialty: 'Orthopedic', availability: ['Daily 10AM-4PM'] },
    { id: 'Dr. Neha Gupta', name: 'Dr. Neha Gupta', specialty: 'Pediatrician', availability: ['Wed-Fri 11AM-6PM'] },
    { id: 'Dr. Sanjay Singh', name: 'Dr. Sanjay Singh', specialty: 'General Physician', availability: ['Mon-Sat 8AM-8PM'] },
  ]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [formData, setFormData] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (userData) => {
    setUser(userData);
    setOtpPhone(userData.phone);
    setStep('verify-otp');
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: userData.phone, user: userData }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage('OTP sent to Phone Number!');
    } else {
      setMessage('Send failed');
    }
  };

  const handleOtpVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return setMessage('Enter full OTP');
    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: otpPhone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      const hRes = await fetch(`/api/hospitals?city=${user.city}`);
      const hData = await hRes.json();
      setHospitals(hData.data);
      setStep('hospitals');
    } else {
      setMessage(data.error);
    }
  };

  const handleHospitalSelect = (id) => {
    setSelectedHospital(id);
    setStep('doctors');
  };

  const handleDoctorSelect = (id) => {
    setSelectedDoctor(id);
    setStep('booking');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    const booking = {
      ...formData,
      patientName: user.name,
      phone: user.phone,
      email: user.email,
      doctorId: selectedDoctor,
      hospitalId: selectedHospital,
      department: doctors.find(d => d.id === selectedDoctor)?.specialty || '',
    };
    const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
setStep('confirmed');
    // Auto redirect to profile after 2s
    setTimeout(() => {
      window.location.href = '/profile';
    }, 1000);
    } else {
      setMessage(data.error);
    }
  };

  const selectedHospitalName = hospitals.find(h => h.id === selectedHospital)?.name || '';
  const selectedDoctorName = doctors.find(d => d.id === selectedDoctor)?.name || '';

  return (
 <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          MEDI-BED
        </h1>
        {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">Single form login + OTP → Hospitals → Doctors → Book (mock SMS)</p> */}
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center space-y-8">
{step === 'login' && <LoginForm onUserSubmit={handleLoginSubmit} />}

        {step === 'verify-otp' && (
          <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 hospital-primary">Enter OTP</h2>
            <p className="text-center text-gray-600 mb-6">Check {otpPhone} for OTP</p>
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((d, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[i] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && i < 5) document.getElementById(`o${i+1}`)?.focus();
                  }}
                  id={`o${i}`}
                  className="otp-input"
                />
              ))}
            </div>
            <button onClick={handleOtpVerify} disabled={loading || otp.join('').length !== 6} className="btn-primary w-full">
              Verify OTP
            </button>
            {message && <div className={`mt-4 p-3 rounded-xl ${message.includes('sent') ? 'success-msg' : 'bg-red-100 text-red-800'}`}>{message}</div>}
          </div>
        )}

        {step === 'hospitals' && (
          <>
            <h3 className="text-2xl font-bold mb-8 text-center">Hospitals in {user.city}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {hospitals.map(h => (
                <HospitalCard key={h.id} hospital={h} onSelect={handleHospitalSelect} selected={selectedHospital === h.id} />
              ))}
            </div>
          </>
        )}

        {step === 'doctors' && (
          <>
            <h3 className="text-2xl font-bold mb-8 text-center">{selectedHospitalName}</h3>
            <h4 className="text-xl mb-6 text-center">Select Doctor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {doctors.map(d => (
                <DoctorCard key={d.id} doctor={d} onSelect={handleDoctorSelect} selected={selectedDoctor === d.id} />
              ))}
            </div>
          </>
        )}

        {step === 'booking' && (
          <div className="max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Appointment with {selectedDoctorName} at {selectedHospitalName}
            </h3>
            <form onSubmit={handleBook} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input type="date" min={new Date().toISOString().split('T')[0]} className="form-input" onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                <input type="time" className="form-input" onChange={(e) => setFormData({...formData, time: e.target.value})} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Booking...' : 'Confirm Booking & SMS'}
              </button>
            </form>
            {message && <div className="p-4 rounded-xl bg-red-100 text-red-800 mt-4">{message}</div>}
          </div>
        )}

        {step === 'confirmed' && (
          <div className="text-center max-w-2xl p-12 bg-white/50 rounded-3xl shadow-2xl">
            <div className="success-msg text-3xl mb-8 animate-bounce">
              ✅ Booking Confirmed!
            </div>
            <p className="text-lg mb-8">Check Phone for SMS. Booked with {selectedDoctorName} at {selectedHospitalName}.</p>
            <button onClick={() => setStep('login')} className="btn-primary">New Booking</button>
          </div>
        )}
      </main>

      {/* <footer className="mt-20 text-sm text-gray-500 text-center">
        Mock OTP/SMS in console. Twilio ready.
      </footer> */}
    </div>
  );
}

