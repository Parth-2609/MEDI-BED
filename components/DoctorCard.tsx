import { Doctor } from '../types/appointment';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect: (id: string) => void;
  selected: boolean;
}

export default function DoctorCard({ doctor, onSelect, selected }: DoctorCardProps) {
  return (
    <div className="card-doctor cursor-pointer" onClick={() => onSelect(doctor.id)}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{doctor.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{doctor.name}</h3>
          <p className="text-blue-600 font-medium">{doctor.specialty}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{doctor.availability.join(', ')}</p>
        </div>
      </div>
      {selected && <div className="absolute inset-0 bg-green-200/50 rounded-2xl ring-4 ring-green-300"></div>}
    </div>
  );
}

