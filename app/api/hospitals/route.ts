import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Hospital } from '../../../types/appointment';

const mockHospitals: Record<string, Hospital[]> = {
  'Delhi': [
    { id: 'AIIMS DELHI', name: 'AIIMS Delhi', city: 'Delhi', address: 'Ansari Nagar, New Delhi', rating: 4.8 },
    { id: 'Apollo Hospital Delhi', name: 'Apollo Hospital Delhi', city: 'Delhi', address: 'Sarita Vihar, Delhi', rating: 4.6 },
    { id: 'Fortis Escorts', name: 'Fortis Escorts', city: 'Delhi', address: 'Okhla Road, Delhi', rating: 4.5 },
    { id: 'Max Super Speciality', name: 'Max Super Speciality', city: 'Delhi', address: 'Saket, New Delhi', rating: 4.7 },
    { id: 'Medanta Medicity', name: 'Medanta Medicity', city: 'Delhi', address: 'Gurgaon (near Delhi)', rating: 4.6 },
  ],
  'Hyderabad': [
    { id: 'Apollo Hospital Hyderabad', name: 'Apollo Hospitals Hyderabad', city: 'Hyderabad', address: 'Jubilee Hills', rating: 4.7 },
    { id: 'Yashoda Hospital', name: 'Yashoda Hospitals', city: 'Hyderabad', address: 'Secunderabad', rating: 4.6 },
    { id: 'Continental Hospital', name: 'Continental Hospitals', city: 'Hyderabad', address: 'Gachibowli', rating: 4.5 },
    { id: 'KIMS Hospital', name: 'KIMS Hospitals', city: 'Hyderabad', address: 'Secunderabad', rating: 4.6 },
    { id: 'Care Hospital', name: 'Care Hospitals', city: 'Hyderabad', address: 'Banjara Hills', rating: 4.4 },
  ],
  'Bangalore': [
    { id: 'Narayana Health', name: 'Narayana Health', city: 'Bangalore', address: 'Bommasandra', rating: 4.6 },
    { id: 'Manipal Hospital', name: 'Manipal Hospital', city: 'Bangalore', address: 'Old Airport Road', rating: 4.5 },
    { id: 'Apollo Spectra', name: 'Apollo Spectra', city: 'Bangalore', address: 'Koramangala', rating: 4.4 },
    { id: 'Fortis Hospital', name: 'Fortis Hospital', city: 'Bangalore', address: 'Bannerghatta Road', rating: 4.5 },
    { id: 'Columbia Asia', name: 'Columbia Asia', city: 'Bangalore', address: 'Hebbal', rating: 4.3 },
  ],
  'Mumbai': [
    { id: 'Lilavati Hospital', name: 'Lilavati Hospital', city: 'Mumbai', address: 'Bandra West', rating: 4.7 },
    { id: 'Kokilaben Hospital', name: 'Kokilaben Hospital', city: 'Mumbai', address: 'Andheri West', rating: 4.8 },
    { id: 'Nanavati Max Hospital', name: 'Nanavati Max Hospital', city: 'Mumbai', address: 'Vile Parle West', rating: 4.6 },
    { id: 'Jaslok Hospital', name: 'Jaslok Hospital', city: 'Mumbai', address: 'Peddar Road', rating: 4.5 },
    { id: 'Breach Candy Hospital', name: 'Breach Candy Hospital', city: 'Mumbai', address: 'Breach Candy', rating: 4.4 },
  ],
  'Chennai': [
    { id: 'Apollo Hospitals Chennai', name: 'Apollo Hospitals Chennai', city: 'Chennai', address: 'Greams Road', rating: 4.7 },
    { id: 'Fortis Malar Hospital', name: 'Fortis Malar Hospital', city: 'Chennai', address: 'Adyar', rating: 4.5 },
    { id: 'MIOT International', name: 'MIOT International', city: 'Chennai', address: 'Manapakkam', rating: 4.6 },
    { id: 'Global Hospital', name: 'Global Hospital', city: 'Chennai', address: 'Perumbakkam', rating: 4.4 },
    { id: 'Santhosh Hospital', name: 'Santhosh Hospital', city: 'Chennai', address: 'Besant Nagar', rating: 4.3 },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || '';
  const state = searchParams.get('state') || '';

  const hospitals = mockHospitals[city as keyof typeof mockHospitals] || [];

  return NextResponse.json({
    success: true,
    message: `Found ${hospitals.length} hospitals in ${city}`,
    data: hospitals,
  });
}

