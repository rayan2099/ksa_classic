import React from 'react';
import { Phone, Mail, MapPin, Calendar, Gauge } from 'lucide-react';
import { Car } from '../types.js';

interface CarCardProps {
  car: Car;
  onDetailClick: (car: Car) => void;
  onMessageClick: (car: Car, e: React.MouseEvent) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onDetailClick, onMessageClick }) => {
  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat('en-CA').format(car.mileage) + ' km';

  const shortDescription = car.description 
    ? car.description.length > 100 
      ? car.description.slice(0, 97) + '...'
      : car.description
    : 'No description provided for this classic model.';

  return (
    <div
      onClick={() => onDetailClick(car)}
      id={`car-card-${car.id}`}
      className="group relative bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:border-accent transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Gallery Wrapper */}
      <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
        <img
          src={car.images && car.images.length > 0 ? car.images[0] : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'}
          alt={car.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Condition Ribbon / Overlay Badges */}
        {car.condition === 'new_arrival' && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white font-heading font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-sm shadow-sm z-10">
            New Arrival
          </div>
        )}

        {car.condition === 'sold' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-red-600 text-white font-heading font-bold text-xs tracking-widest uppercase py-1.5 px-6 transform -rotate-12 border-2 border-white shadow-lg">
              SOLD
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-sans text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                {car.year} {car.make}
              </span>
              {car.type && (
                <span className={`text-[8px] font-heading font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                  car.type === 'project' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-neutral-900 text-accent border border-neutral-800'
                }`}>
                  {car.type === 'project' ? 'Project' : 'Classic'}
                </span>
              )}
            </div>
            <span className="flex items-center text-[11px] text-neutral-500">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 mr-1" />
              {car.location || 'Location on request'}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-neutral-900 tracking-tight uppercase group-hover:text-accent transition-colors mb-3">
            {car.title}
          </h3>

          <div className="flex items-center justify-between py-2 border-y border-neutral-100 mb-3">
            <div className="text-xl font-heading font-bold text-accent">
              {formattedPrice}
            </div>
            <div className="flex items-center text-xs text-neutral-600 font-mono">
              <Gauge className="w-4 h-4 text-neutral-400 mr-1" />
              {formattedMileage}
            </div>
          </div>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-4">
            {shortDescription}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center space-x-3 pt-3 border-t border-neutral-100 mt-auto">
          {car.contact_phone ? (
            <a
              href={`tel:${car.contact_phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2.5 px-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors"
              title={`Call Owner at ${car.contact_phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>Call</span>
            </a>
          ) : null}

          <button
            onClick={(e) => onMessageClick(car, e)}
            id={`msg-btn-${car.id}`}
            className="flex-1 flex items-center justify-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 px-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors border border-neutral-900"
          >
            <Mail className="w-3.5 h-3.5 text-accent" />
            <span>Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};
