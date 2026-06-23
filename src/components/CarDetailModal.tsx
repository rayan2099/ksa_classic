import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Gauge, ShieldCheck, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Car } from '../types.js';

interface CarDetailModalProps {
  car: Car;
  onClose: () => void;
  onOpenInquiry: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({ car, onClose, onOpenInquiry }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(car.price);

  const formattedMileage = new Intl.NumberFormat('en-CA').format(car.mileage) + ' km';

  const images = car.images && car.images.length > 0 
    ? car.images 
    : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      id="car-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-neutral-900 w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-detail-modal-btn"
          className="absolute top-4 right-4 z-30 bg-neutral-900/85 hover:bg-neutral-800 text-white p-2 rounded-full transition-colors border border-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Slideshow */}
        <div className="w-full md:w-1/2 bg-neutral-950 flex flex-col justify-between relative aspect-video md:aspect-auto">
          <div className="relative flex-grow flex items-center justify-center min-h-[300px] md:h-full">
            <img
              src={images[activeImageIndex]}
              alt={`${car.title} view ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition-colors z-20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 bg-black/50 hover:bg-black/75 text-white p-1.5 rounded-full transition-colors z-20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Badge overlay */}
            {car.condition === 'sold' && (
              <div className="absolute top-4 left-4 bg-red-600 text-white font-heading font-bold text-xs uppercase tracking-widest px-4 py-1.5 shadow-lg border border-white">
                SOLD
              </div>
            )}
            {car.condition === 'new_arrival' && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white font-heading font-bold text-xs uppercase tracking-widest px-4 py-1.5 shadow-lg">
                New Arrival
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          {images.length > 1 && (
            <div className="bg-neutral-900 p-3 flex space-x-2 overflow-x-auto border-t border-neutral-800">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & CTA */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[600px]">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold font-heading px-2 py-0.5 uppercase tracking-wider rounded-sm">
                {car.year}
              </span>
              {car.type && (
                <span className={`text-[10px] font-bold font-heading px-2.5 py-0.5 uppercase tracking-wider rounded-sm ${
                  car.type === 'project' 
                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                    : 'bg-neutral-950 text-accent border border-neutral-800'
                }`}>
                  {car.type === 'project' ? 'Project Build' : 'Classic Icon'}
                </span>
              )}
              <span className="text-xs text-neutral-500 font-mono flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {car.location || 'Vancouver, BC'}
              </span>
            </div>

            <h2 className="font-heading text-2xl md:text-3xl font-bold uppercase text-neutral-900 tracking-tight leading-none mb-3">
              {car.title}
            </h2>

            <div className="text-2xl font-heading font-bold text-accent mb-6 border-b border-neutral-100 pb-3">
              {formattedPrice}
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-neutral-50 p-4 rounded-sm border border-neutral-100">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-heading">Make</span>
                <span className="text-sm font-bold text-neutral-800">{car.make}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-heading">Model</span>
                <span className="text-sm font-bold text-neutral-800">{car.model}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-heading">Mileage</span>
                <span className="text-sm font-bold text-neutral-800 font-mono flex items-center">
                  <Gauge className="w-3.5 h-3.5 text-neutral-400 mr-1.5" />
                  {formattedMileage}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-heading">Condition</span>
                <span className="text-sm font-bold text-neutral-800 capitalize">
                  {car.condition === 'new_arrival' ? 'New Arrival' : car.condition === 'sold' ? 'Sold' : 'Available'}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mb-6">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">Vehicle Profile</h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                {car.description || 'No detailed specifications have been uploaded for this exquisite automobile.'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex space-x-3">
              {car.contact_phone && (
                <a
                  href={`tel:${car.contact_phone}`}
                  className="flex-1 flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3.5 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Call Dealership</span>
                </a>
              )}

              <button
                onClick={() => onOpenInquiry(car)}
                id="modal-cta-message"
                className="flex-1 flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white py-3.5 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors border border-neutral-900"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>Send Message</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-neutral-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-accent mr-1" />
              Secure transaction guaranteed via KSA Classic Vancouver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
