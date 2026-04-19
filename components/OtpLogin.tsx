"use client";

import { useState, useEffect } from 'react';
import { OtpRequest, OtpVerify, ApiResponse } from '../types/appointment';

export default function OtpLogin({ onLogin }: { onLogin: (phone: string) => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.match(/^[\+]?[1-9][\d]{9,14}$/)) {
      setMessage('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone } as OtpRequest),
    });
    const data: ApiResponse = await res.json();
    setLoading(false);
    if (data.success) {
      setStep('otp');
      setResendTimer(60);
      setMessage('OTP sent! Check your phone.');
    } else {
      setMessage(data.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;
    setLoading(true);
    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code } as OtpVerify),
    });
    const data: ApiResponse = await res.json();
    setLoading(false);
    if (data.success) {
      onLogin(phone);
    } else {
      setMessage(data.error || 'Invalid OTP');
    }
  };

  useEffect(() => {
    if (step === 'otp') {
      const timer = setInterval(() => {
        setResendTimer((t) => {
          if (t <= 1) {
            clearInterval(timer);
            return 60;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleOtpKey = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
<div className="form-container">
      <h2 className="text-3xl font-bold text-center mb-8 hospital-primary">Secure Login</h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Verify your phone to book appointments</p>
      
      {step === 'phone' ? (
        <form onSubmit={sendOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4 text-center">Enter 6-digit OTP</label>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpKey(i, e.target.value)}
                  className="otp-input"
                  disabled={loading}
                />
              ))}
            </div>
            <p className="text-xs text-center text-gray-500">
              Resend in {resendTimer}s
            </p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}
      
      {message && (
        <div className={`mt-4 p-3 rounded-xl ${message.includes('OTP sent') || message.includes('Verify') ? 'success-msg' : 'bg-red-100 border-red-400 text-red-800'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

