import { Car } from '../types.js';

export const mockCars: Car[] = [
  {
    id: 'mock-corvette-stingray',
    title: '1967 Chevrolet Corvette Stingray',
    make: 'Chevrolet',
    model: 'Corvette Stingray',
    year: 1967,
    price: 129000,
    mileage: 45000,
    location: 'Vancouver, BC',
    description: 'Numbers-matching 427/435hp Stingray with a four-speed manual transmission and documented restoration history.',
    condition: 'new_arrival',
    type: 'classic',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=82&w=1600',
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=82&w=1600',
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-25T00:00:00.000Z'
  },
  {
    id: 'mock-porsche-carrera',
    title: '1973 Porsche 911 Carrera RS',
    make: 'Porsche',
    model: '911 Carrera RS',
    year: 1973,
    price: 345000,
    mileage: 82000,
    location: 'Vancouver, BC',
    description: 'Grand Prix White lightweight example with a matching-numbers 2.7L flat-six and extensive historical documentation.',
    condition: 'available',
    type: 'classic',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=82&w=1600',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-24T00:00:00.000Z'
  },
  {
    id: 'mock-shelby-cobra',
    title: '1965 Shelby Cobra 427 S/C',
    make: 'Shelby',
    model: 'Cobra 427 S/C',
    year: 1965,
    price: 185000,
    mileage: 12000,
    location: 'Vancouver, BC',
    description: 'Guardsman Blue roadster powered by a thunderous 427ci V8, with side pipes and a carefully finished leather interior.',
    condition: 'available',
    type: 'classic',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=82&w=1600',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-23T00:00:00.000Z'
  },
  {
    id: 'mock-datsun-240z',
    title: '1971 Datsun 240Z Series I',
    make: 'Datsun',
    model: '240Z',
    year: 1971,
    price: 18500,
    mileage: 142000,
    location: 'Vancouver, BC',
    description: 'Complete Series I restoration candidate with a matching-numbers L24 engine, manual gearbox, and solid structural condition.',
    condition: 'available',
    type: 'project',
    images: [
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-22T00:00:00.000Z'
  },
  {
    id: 'mock-dodge-charger',
    title: '1968 Dodge Charger R/T 440',
    make: 'Dodge',
    model: 'Charger R/T',
    year: 1968,
    price: 34000,
    mileage: 115000,
    location: 'Vancouver, BC',
    description: 'Authentic R/T project supplied with a period-correct 440 Big Block and 727 Torqueflite automatic transmission.',
    condition: 'new_arrival',
    type: 'project',
    images: [
      'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-21T00:00:00.000Z'
  },
  {
    id: 'mock-mustang-boss',
    title: '1969 Ford Mustang Boss 429',
    make: 'Ford',
    model: 'Mustang Boss 429',
    year: 1969,
    price: 260000,
    mileage: 31000,
    location: 'Vancouver, BC',
    description: 'Documented Royal Maroon Boss 429 with a numbers-matching powertrain and a concours-quality restoration.',
    condition: 'sold',
    type: 'classic',
    images: [
      'https://images.unsplash.com/photo-1612466285769-ac9380c5780d?auto=format&fit=crop&q=82&w=1600'
    ],
    contact_phone: '+1 604-555-0199',
    created_at: '2026-06-20T00:00:00.000Z'
  }
];
