import React, { useState, useEffect } from 'react';
import { CarCard } from './CarCard.js';
import { Car } from '../types.js';
import { mockCars } from '../data/mockCars.js';
import { Search, SlidersHorizontal, RefreshCw, AlertCircle } from 'lucide-react';

interface InventoryProps {
  onCarDetailClick: (car: Car) => void;
  onCarMessageClick: (car: Car) => void;
  tabRef?: React.RefObject<HTMLDivElement | null>;
  activeSection?: string;
}

type TabType = 'all' | 'classic' | 'project' | 'sold';
type PriceRange = 'all' | 'under-50000' | '50000-150000' | '150000-300000' | 'over-300000';
type YearRange = 'all' | 'pre-1960' | '1960-1969' | '1970-1979' | '1980-plus';
type AvailabilityFilter = 'all' | 'new_arrival' | 'available' | 'sold';

export const Inventory: React.FC<InventoryProps> = ({
  onCarDetailClick,
  onCarMessageClick,
  tabRef,
  activeSection = 'all'
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>('all');
  const [selectedYearRange, setSelectedYearRange] = useState<YearRange>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilityFilter>('all');

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) {
        throw new Error('Inventory API unavailable.');
      }
      const data = await res.json() as Car[];
      setCars(data.length > 0 ? data : mockCars);
    } catch (err) {
      console.error('Error fetching cars', err);
      setCars(mockCars);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (activeSection === 'classic') {
      setActiveTab('classic');
    } else if (activeSection === 'project') {
      setActiveTab('project');
    } else if (activeSection === 'sold') {
      setActiveTab('sold');
    } else {
      setActiveTab('all');
    }
  }, [activeSection]);

  const uniqueMakes = ['all', ...Array.from(new Set<string>(cars.map((c) => c.make))).sort((a, b) => a.localeCompare(b))];
  const uniqueModels = [
    'all',
    ...Array.from(
      new Set<string>(
        cars
          .filter((car) => selectedMake === 'all' || car.make.toLowerCase() === selectedMake.toLowerCase())
          .map((c) => c.model)
      )
    ).sort((a, b) => a.localeCompare(b))
  ];

  useEffect(() => {
    setSelectedModel('all');
  }, [selectedMake]);

  const matchesPriceRange = (price: number) => {
    if (selectedPriceRange === 'under-50000') return price < 50000;
    if (selectedPriceRange === '50000-150000') return price >= 50000 && price <= 150000;
    if (selectedPriceRange === '150000-300000') return price > 150000 && price <= 300000;
    if (selectedPriceRange === 'over-300000') return price > 300000;
    return true;
  };

  const matchesYearRange = (year: number) => {
    if (selectedYearRange === 'pre-1960') return year < 1960;
    if (selectedYearRange === '1960-1969') return year >= 1960 && year <= 1969;
    if (selectedYearRange === '1970-1979') return year >= 1970 && year <= 1979;
    if (selectedYearRange === '1980-plus') return year >= 1980;
    return true;
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMake('all');
    setSelectedModel('all');
    setSelectedPriceRange('all');
    setSelectedYearRange('all');
    setSelectedAvailability('all');
    setActiveTab('all');
  };

  // Filters logic:
  // Tab Filters:
  // 'all' -> non-sold cars
  // 'classic' -> available classic cars
  // 'project' -> available project cars
  // 'sold' -> recently sold cars
  const filteredCars = cars.filter((car) => {
    // Tab Filter
    if (activeTab === 'all' && selectedAvailability !== 'sold' && car.condition === 'sold') return false;
    if (activeTab === 'classic' && (car.condition === 'sold' || car.type !== 'classic')) return false;
    if (activeTab === 'project' && (car.condition === 'sold' || car.type !== 'project')) return false;
    if (activeTab === 'sold' && car.condition !== 'sold') return false;

    // Search query
    const matchesSearch =
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.year.toString().includes(searchQuery);

    // Make select filter
    const matchesMake = selectedMake === 'all' || car.make.toLowerCase() === selectedMake.toLowerCase();
    const matchesModel = selectedModel === 'all' || car.model.toLowerCase() === selectedModel.toLowerCase();
    const matchesAvailability = selectedAvailability === 'all' || car.condition === selectedAvailability;

    return (
      matchesSearch &&
      matchesMake &&
      matchesModel &&
      matchesPriceRange(car.price) &&
      matchesYearRange(car.year) &&
      matchesAvailability
    );
  });

  return (
    <div ref={tabRef} id="inventory-section" className="py-20 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase font-heading font-bold text-accent tracking-widest block mb-2">
            The Collection
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-heading uppercase text-neutral-900 tracking-tight">
            Current Inventory
          </h2>
          <div className="h-1 w-12 bg-accent mx-auto mt-4"></div>
        </div>

        {/* Tab Controls & Search Filter Controls */}
        <div className="flex flex-col gap-5 mb-8 border-b border-neutral-200 pb-6">
          {/* Tabs */}
          <div className="grid grid-cols-2 sm:flex gap-1 bg-neutral-100 p-1 rounded-sm max-w-lg w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-heading font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              All Inventory
            </button>
            <button
              onClick={() => setActiveTab('classic')}
              className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-heading font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'classic'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Classic Icons
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-heading font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'project'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Project Builds
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-heading font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'sold'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Recently Sold
            </button>
          </div>

          {/* Search & Detailed Filters */}
          <div className="bg-white border border-neutral-200 rounded-sm shadow-sm p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by year, make, model, or listing name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-between gap-3 lg:w-auto">
                <p className="text-[10px] uppercase tracking-widest font-heading font-bold text-neutral-500">
                  {filteredCars.length} Listing{filteredCars.length === 1 ? '' : 's'}
                </p>
                <button
                  onClick={fetchCars}
                  className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-sm transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                  title="Refresh Showroom"
                  aria-label="Refresh Showroom"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider font-heading font-bold text-neutral-500 mb-1.5">
                  Make
                </span>
                <div className="relative">
                  <SlidersHorizontal className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition-colors appearance-none capitalize cursor-pointer"
                  >
                    {uniqueMakes.map((make) => (
                      <option key={make} value={make}>
                        {make === 'all' ? 'All Makes' : make}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider font-heading font-bold text-neutral-500 mb-1.5">
                  Model
                </span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 px-3 text-xs font-sans outline-none transition-colors appearance-none capitalize cursor-pointer"
                >
                  {uniqueModels.map((model) => (
                    <option key={model} value={model}>
                      {model === 'all' ? 'All Models' : model}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider font-heading font-bold text-neutral-500 mb-1.5">
                  Price Range
                </span>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value as PriceRange)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 px-3 text-xs font-sans outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">Any Price</option>
                  <option value="under-50000">Under $50K</option>
                  <option value="50000-150000">$50K - $150K</option>
                  <option value="150000-300000">$150K - $300K</option>
                  <option value="over-300000">$300K+</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider font-heading font-bold text-neutral-500 mb-1.5">
                  Year
                </span>
                <select
                  value={selectedYearRange}
                  onChange={(e) => setSelectedYearRange(e.target.value as YearRange)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 px-3 text-xs font-sans outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">Any Year</option>
                  <option value="pre-1960">Pre-1960</option>
                  <option value="1960-1969">1960s</option>
                  <option value="1970-1979">1970s</option>
                  <option value="1980-plus">1980+</option>
                </select>
              </label>

              <label className="block">
                <span className="block text-[10px] uppercase tracking-wider font-heading font-bold text-neutral-500 mb-1.5">
                  Availability
                </span>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value as AvailabilityFilter)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-accent rounded-sm py-2.5 px-3 text-xs font-sans outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="all">Any Status</option>
                  <option value="new_arrival">New Arrival</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </label>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={resetFilters}
                className="text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* List Loading States (Skeletons) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-sm p-4 space-y-4">
                <div className="aspect-video w-full bg-neutral-200 rounded-sm animate-pulse"></div>
                <div className="h-4 bg-neutral-200 rounded-sm animate-pulse w-3/4"></div>
                <div className="h-3 bg-neutral-200 rounded-sm animate-pulse w-1/2"></div>
                <div className="h-6 bg-neutral-200 rounded-sm animate-pulse w-full"></div>
                <div className="h-8 bg-neutral-100 rounded-sm animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white border border-neutral-200 rounded-sm shadow-sm max-w-2xl mx-auto px-6">
            <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-heading text-lg font-bold text-neutral-800 uppercase tracking-tight">
              No listings in this category yet.
            </h3>
            <p className="text-xs text-neutral-500 font-sans mt-2 max-w-md mx-auto">
              No vehicles match these filters. Reset the search or contact us about the model you are looking for.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-xs font-heading font-bold uppercase tracking-wider text-accent border border-accent hover:bg-accent hover:text-neutral-950 px-5 py-2.5 rounded-sm transition-all"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          /* Card Grid: 1 col mobile, 2 col tablet, 3 col desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onDetailClick={onCarDetailClick}
                onMessageClick={(c, e) => {
                  e.stopPropagation();
                  onCarMessageClick(c);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
