import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, MapPin, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';
import { Car } from '../types.js';

interface CarCardProps {
  car: Car;
  onDetailClick: (car: Car) => void;
  onMessageClick: (car: Car, e: React.MouseEvent) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onDetailClick, onMessageClick }) => {
  const images = car.images && car.images.length > 0
    ? car.images
    : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  useEffect(() => {
    setActiveImageIndex((current) => Math.min(current, images.length - 1));
  }, [images.length]);

  const showPreviousImage = (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    setActiveImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const showNextImage = (event?: React.SyntheticEvent) => {
    event?.stopPropagation();
    setActiveImageIndex((current) => (current + 1) % images.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    didSwipe.current = false;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || images.length < 2) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < 45) return;
    didSwipe.current = true;

    if (distance > 0) {
      showPreviousImage(event);
    } else {
      showNextImage(event);
    }
  };

  const handleCardClick = () => {
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    onDetailClick(car);
  };

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
      onClick={handleCardClick}
      id={`car-card-${car.id}`}
      className="group relative bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:border-accent transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Gallery Wrapper */}
      <div
        className="relative aspect-video w-full bg-neutral-100 overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[activeImageIndex]}
          alt={`${car.title} view ${activeImageIndex + 1} of ${images.length}`}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              aria-label={`Previous image of ${car.title}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 hover:bg-black/80 text-white backdrop-blur-sm transition-colors"
              aria-label={`Next image of ${car.title}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {images.length <= 10 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/45 px-2 py-1.5 rounded-full backdrop-blur-sm">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === activeImageIndex ? 'bg-accent w-4' : 'bg-white/65 hover:bg-white'
                    }`}
                    aria-label={`Show image ${index + 1} of ${car.title}`}
                    aria-current={index === activeImageIndex ? 'true' : undefined}
                  />
                ))}
              </div>
            )}

            <span className="absolute top-3 right-3 z-20 bg-black/60 text-white text-[9px] font-mono px-2 py-1 rounded-sm backdrop-blur-sm">
              {activeImageIndex + 1}/{images.length}
            </span>
          </>
        )}

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
