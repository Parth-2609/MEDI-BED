"use client";

import { useState, useEffect } from 'react';
import { Booking, User } from '../../types/appointment';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgSrc = ev.target?.result as string;
        setImage(imgSrc);
        const updatedUser = {...user, image: imgSrc};
        localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    const loggedPhone = localStorage.getItem('loggedPhone');
    if (loggedUser) {
      const u: User = JSON.parse(loggedUser);
      setUser(u);
      fetchBookings(u.phone);
    } else if (loggedPhone) {
      window.location.href = '/';
    } else {
      window.location.href = '/';
    }
  }, []);

  const fetchBookings = async (phone: string) => {
    setLoading(true);
    console.log('🔍 Profile loading bookings for phone:', phone);
    const res = await fetch(`/api/bookings?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    console.log('📋 Profile received:', data.data?.length || 0, 'bookings');
    setBookings(data.data || []);
    setLoading(false);
  };

const cancelBooking = async (id: string) => {
    if (confirm('Cancel appointment?')) {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBookings(user!.phone);
      }
    }
  };

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading appointments...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center"><a href="/" className="btn-primary">Login to view profile</a></div>;

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <div className="inline-block relative mb-8">
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=3b82f6&color=fff`} 
              alt={user.name}
              className="w-32 h-32 rounded-full shadow-2xl border-4 border-white mx-auto object-cover"
            />
            <label className="absolute -bottom-3 -right-3 bg-blue-500 text-white p-3 rounded-full cursor-pointer hover:bg-blue-600 shadow-lg transition-all">
              ✏️
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-xl font-semibold text-gray-700">{user.name}</p>
          <p className="text-xl font-semibold text-gray-700">{user.phone}</p>
        </div>

        <h2 className="text-3xl font-bold mb-12 text-gray-900 text-center">My Appointments ({bookings.length})</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="success-msg text-2xl mb-6 p-8">No appointments yet</div>
            <a href="/" className="btn-primary text-lg px-8 py-4">Book Now</a>
          </div>
        ) : (
          <div className="grid gap-6">
{bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="card-doctor p-8 cursor-pointer hover:shadow-2xl" 
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 hospital-bg rounded-2xl flex items-center justify-center shrink-0 mt-1">
                      <span className="text-xl font-bold text-white">{booking.doctorId.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{booking.doctorId}</h3>
                      <p className="text-lg font-medium text-blue-600">{booking.department}</p>
                      <p className="text-xl font-semibold text-gray-900 mt-1">{booking.date} at {booking.time}</p>
                      <p className="text-gray-600 mt-1">{booking.hospitalId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-xl font-bold text-lg">
                      {booking.status.toUpperCase()}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelBooking(booking.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        <div className="text-center mt-20">
          <a href="/" className="btn-primary text-xl py-4 px-10 inline-block">
            + New Appointment
          </a>
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl max-h-[90vh] overflow-auto shadow-2xl border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
            <div className="space-y-4 text-lg">
              <p><strong>Patient:</strong> {selectedBooking.patientName}</p>
              <p><strong>Phone:</strong> {selectedBooking.phone}</p>
              <p><strong>Email:</strong> {selectedBooking.email}</p>
              <p><strong>Doctor:</strong> {selectedBooking.doctorId}</p>
              <p><strong>Hospital:</strong> {selectedBooking.hospitalId}</p>
              <p><strong>Department:</strong> {selectedBooking.department}</p>
              <p><strong>Date:</strong> {selectedBooking.date}</p>
              <p><strong>Time:</strong> {selectedBooking.time}</p>
              <p><strong>Status:</strong> <span className={`px-4 py-1 rounded-full font-bold ${selectedBooking.status === 'booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{selectedBooking.status.toUpperCase()}</span></p>
            </div>
            <button 
              onClick={() => setSelectedBooking(null)}
              className="btn-primary mt-8 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
