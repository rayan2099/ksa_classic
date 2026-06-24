import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';
import { Hero } from '../components/Hero.js';
import { Inventory } from '../components/Inventory.js';
import { CarDetailModal } from '../components/CarDetailModal.js';
import { MessageModal } from '../components/MessageModal.js';
import { Footer } from '../components/Footer.js';
import { Car } from '../types.js';
import { Mail, Phone, MapPin, Send, MessageSquare, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const Home: React.FC = () => {
  const [selectedCarForDetail, setSelectedCarForDetail] = useState<Car | null>(null);
  const [selectedCarForMessage, setSelectedCarForMessage] = useState<Car | null>(null);
  const [activeSection, setActiveSection] = useState('all');

  const inventoryRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Scroll handler
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('all');
    } else if (sectionId === 'inventory') {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('all');
    } else if (sectionId === 'classic') {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('classic');
    } else if (sectionId === 'project') {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('project');
    } else if (sectionId === 'sold') {
      inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('sold');
    } else if (sectionId === 'contact') {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to section passed from router navigation state (e.g., returning from login or admin panel)
  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const section = (location.state as any).scrollTo;
      // Timeout to allow DOM mount
      setTimeout(() => {
        handleScrollToSection(section);
      }, 100);
    }
  }, [location]);

  // General Inquire submission form
  const handleGeneralInquire = async (data: any) => {
    try {
      // General inquiries are mapped to a dummy or main featured car (e.g. car-id-1)
      const payload = {
        car_id: 'car-id-1', // Default corvette
        buyer_name: data.name,
        buyer_email: data.email,
        buyer_phone: data.phone,
        message: `[General Inquiry] ${data.message}`
      };

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Your message has been sent! We'll be in touch soon.", {
          style: {
            background: '#1A1A1A',
            color: '#F5F5F5',
            border: '1px solid #C9A84C',
            borderRadius: '2px',
          }
        });
        reset();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to submit message. Please try again.');
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen w-full overflow-x-hidden">
      <div 
        id="showroom-portal" 
        className="min-h-screen flex flex-col justify-between bg-[#F5F5F5] text-[#2C2C2C] max-w-[1440px] mx-auto shadow-2xl relative"
      >
        {/* Navbar */}
        <Navbar onScrollToSection={handleScrollToSection} />

        {/* Hero Section */}
        <Hero onBrowseClick={() => handleScrollToSection('inventory')} />

        {/* Showroom Collections Section */}
        <Inventory
          tabRef={inventoryRef}
          activeSection={activeSection}
          onCarDetailClick={(car) => setSelectedCarForDetail(car)}
          onCarMessageClick={(car) => setSelectedCarForMessage(car)}
        />

      {/* General Showroom Inquiry Contact Section */}
      <div ref={contactRef} id="contact" className="py-24 bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left col: text and location detail */}
            <div className="space-y-8">
              <div>
                <span className="text-[10px] uppercase font-heading font-bold text-accent tracking-widest block mb-2">
                  Get in touch
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-heading uppercase text-white tracking-tight">
                  Contact Showroom
                </h2>
                <div className="h-1 w-12 bg-accent mt-4 mb-6"></div>
                <p className="text-sm text-neutral-400 font-sans leading-relaxed max-w-lg">
                  Would you like to schedule a private viewing, arrange bespoke vehicle transport, or submit an acquisition request? Reach out to our advisors in Vancouver, BC.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-accent mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-neutral-200">Showroom Address</h4>
                    <p className="text-xs text-neutral-400 mt-1">1090 West Georgia St, Vancouver, BC V6E 3V7</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-accent mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-neutral-200">Telephone Line</h4>
                    <p className="text-xs text-neutral-400 mt-1">+1 (604) 555-0199</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-accent mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase text-neutral-200">General Mailbox</h4>
                    <p className="text-xs text-neutral-400 mt-1">info@ksaclassic.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right col: Form contact */}
            <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-sm shadow-xl relative">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-200 mb-6 border-b border-neutral-800 pb-4">
                Showroom Acquisition & Inquiry
              </h3>

              <form onSubmit={handleSubmit(handleGeneralInquire)} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="e.g. Robert Vancouver"
                      className={`w-full bg-neutral-900 border ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-accent'
                      } rounded-sm py-3 pl-11 pr-4 text-xs font-sans outline-none transition-colors text-white`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 mt-1">{(errors.name as any).message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      placeholder="e.g. robert@vancouver.ca"
                      className={`w-full bg-neutral-900 border ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-accent'
                      } rounded-sm py-3 pl-11 pr-4 text-xs font-sans outline-none transition-colors text-white`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 mt-1">{(errors.email as any).message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="e.g. 604-555-0100"
                      className="w-full bg-neutral-900 border border-neutral-800 focus:border-accent rounded-sm py-3 pl-11 pr-4 text-xs font-sans outline-none transition-colors text-white"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-400 mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                    <textarea
                      rows={4}
                      {...register('message', { required: 'Message is required' })}
                      placeholder="Share details of what vehicles you are looking to acquire or view..."
                      className={`w-full bg-neutral-900 border ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-accent'
                      } rounded-sm py-3 pl-11 pr-4 text-xs font-sans outline-none transition-colors resize-none text-white`}
                    />
                  </div>
                  {errors.message && <p className="text-[10px] text-red-500 mt-1">{(errors.message as any).message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="general-submit-btn"
                  className="w-full bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider py-4 rounded-sm transition-all flex items-center justify-center space-x-2 border border-accent cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquire Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer onScrollToSection={handleScrollToSection} />

      {/* Overlays: Car Specification Detail Modal */}
      {selectedCarForDetail && (
        <CarDetailModal
          car={selectedCarForDetail}
          onClose={() => setSelectedCarForDetail(null)}
          onOpenInquiry={(car) => {
            setSelectedCarForDetail(null);
            setSelectedCarForMessage(car);
          }}
        />
      )}

      {/* Overlays: Car Dedicated Contact Message Modal */}
      {selectedCarForMessage && (
        <MessageModal
          car={selectedCarForMessage}
          onClose={() => setSelectedCarForMessage(null)}
        />
      )}
    </div>
  </div>
  );
};
