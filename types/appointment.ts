export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image?: string;
  availability: string[];
}

export interface Booking {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  doctorId: string;
  hospitalId: string;
  date: string;
  time: string;
  department: string;
  status: 'booked' | 'cancelled' | 'completed';
}


export interface OtpRequest {
  phone: string;
  user: User;
}

export interface OtpVerify {
  phone: string;
  code: string;
}

export interface User {
  name: string;
  email: string;
  city: string;
  state: string;
  phone: string;
  image?: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
}

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

