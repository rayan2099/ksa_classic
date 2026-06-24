import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onScrollToSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToSection }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-neutral-950 text-neutral-400 border-t border-neutral-900">
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo / Brand column */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <img
                src="https://i.imgur.com/5fwPaIG.png"
                alt="KSA Classics Logo"
                id="footer-logo"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-heading text-lg font-bold tracking-widest text-white">
                KSA <span className="text-accent">CLASSICS</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              A focused marketplace for collector cars and restoration projects, with clear listings and direct access to the showroom team.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-6">
              Collection Categories
            </h4>
            <ul className="space-y-3 text-xs font-sans">
              <li>
                <button
                  onClick={() => onScrollToSection?.('inventory')}
                  className="hover:text-accent transition-colors text-left"
                >
                  All Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection?.('classic')}
                  className="hover:text-accent transition-colors text-left"
                >
                  Classic Cars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection?.('project')}
                  className="hover:text-accent transition-colors text-left"
                >
                  Project Builds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection?.('sold')}
                  className="hover:text-accent transition-colors text-left"
                >
                  Recently Sold
                </button>
              </li>
            </ul>
          </div>

          {/* Location / Business hours */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-6">
              Showroom Hours
            </h4>
            <ul className="space-y-3 text-xs font-sans text-neutral-500">
              <li className="flex items-start">
                <Clock className="w-4 h-4 text-accent mr-2.5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-neutral-300">Mon — Fri: 9:00 AM – 6:00 PM</p>
                  <p className="font-bold text-neutral-300">Saturday: 10:00 AM – 4:00 PM</p>
                  <p>Sunday: Closed (Private Viewings Only)</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-6">
              Contact
            </h4>
            <ul className="space-y-3.5 text-xs font-sans">
              <li className="flex items-center">
                <MapPin className="w-4 h-4 text-accent mr-2.5 flex-shrink-0" />
                <span>Private viewings by confirmed appointment</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-accent mr-2.5 flex-shrink-0" />
                <span>Direct details provided after inquiry</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-accent mr-2.5 flex-shrink-0" />
                <a href="mailto:info@ksaclassic.com" className="hover:text-white transition-colors">
                  info@ksaclassic.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lower Copyright Row */}
      <div className="bg-neutral-950 border-t border-neutral-900 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-600">
          <p>© {currentYear} KSA Classics. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 sm:mt-0 font-mono text-[10px]">
            <Link to="/admin/login" className="hover:text-accent transition-colors">
              Employee Access Portal
            </Link>
            <span>•</span>
            <span className="text-neutral-700">Collector cars & restoration projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
