import { NextRequest, NextResponse } from 'next/server';
import { Booking } from '../../../types/appointment';

let mockBookings: Booking[] = []; 

export async function POST(request: NextRequest) {
  try {
    const newBooking = await request.json();
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
      status: 'booked',
    };
    mockBookings.unshift(booking); 
    console.log('📅 BOOKED:', booking);
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const data = phone ? mockBookings.filter(b => b.phone === phone) : mockBookings;
  console.log('📋 Profile fetch:', phone, data.length, 'bookings');
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const index = mockBookings.findIndex(b => b.id === id);
  if (index > -1) {
    const booking = mockBookings[index];
    mockBookings.splice(index, 1);
    console.log(`📱 MOCK CANCEL SMS to ${booking.phone}: ${id} cancelled`);
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false });
}
