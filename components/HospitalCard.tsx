"use client";

import { Hospital } from '../types/appointment';

interface HospitalCardProps {
  hospital: Hospital;
  onSelect: (id: string) => void;
  selected: boolean;
}

export default function HospitalCard({ hospital, onSelect, selected }: HospitalCardProps) {
  return (
    <div className="card-doctor cursor-pointer" onClick={() => onSelect(hospital.id)}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 hospital-bg rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">{hospital.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{hospital.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{hospital.city}, {hospital.state || 'India'}</p>
          <p className="text-sm font-semibold text-green-600">★ {hospital.rating}/5</p>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{hospital.address}</p>
        </div>
      </div>
      {selected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-75 animate-pulse"></div>
      )}
    </div>
  );
}

