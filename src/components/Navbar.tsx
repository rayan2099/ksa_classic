import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Phone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface NavbarProps {
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScrollToSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 shadow-lg py-3'
          : 'bg-neutral-950/60 backdrop-blur-sm border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Section */}
          <Link to="/" onClick={() => handleNavClick('hero')} className="flex items-center space-x-3 group">
            <img
              src="https://i.imgur.com/5fwPaIG.png"
              alt="KSA Classics Logo"
              id="navbar-logo"
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // If it fails to load, just render a fallback
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="font-heading text-lg sm:text-xl font-bold tracking-widest text-white group-hover:text-accent transition-colors">
              KSA <span className="text-accent">CLASSICS</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-7">
            <button
              onClick={() => handleNavClick('inventory')}
              className="font-heading text-xs tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
            >
              All Listings
            </button>
            <button
              onClick={() => handleNavClick('classic')}
              className="font-heading text-xs tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
            >
              Classics
            </button>
            <button
              onClick={() => handleNavClick('project')}
              className="font-heading text-xs tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick('sold')}
              className="font-heading text-xs tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
            >
              Recently Sold
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="font-heading text-xs tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
            >
              Contact
            </button>
            
            <div className="h-4 w-[1px] bg-neutral-800"></div>

            {user ? (
              <Link
                to="/admin"
                className="flex items-center text-xs tracking-wider font-heading font-bold text-accent hover:text-white uppercase transition-colors border border-accent/30 hover:border-accent px-3 py-1.5 rounded-sm"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="text-neutral-400 hover:text-accent transition-colors p-1"
                title="Portal Login"
                aria-label="Portal Login"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-btn"
              className="text-neutral-300 hover:text-accent focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-dropdown" className="md:hidden bg-neutral-950 border-b border-neutral-800 px-4 py-6 space-y-4 animate-fade-in">
          <button
            onClick={() => handleNavClick('inventory')}
            className="block w-full text-left font-heading text-sm tracking-wider text-neutral-300 hover:text-accent font-bold uppercase py-2"
          >
            All Listings
          </button>
          <button
            onClick={() => handleNavClick('classic')}
            className="block w-full text-left font-heading text-sm tracking-wider text-neutral-300 hover:text-accent font-bold uppercase py-2"
          >
            Classics
          </button>
          <button
            onClick={() => handleNavClick('project')}
            className="block w-full text-left font-heading text-sm tracking-wider text-neutral-300 hover:text-accent font-bold uppercase py-2"
          >
            Projects
          </button>
          <button
            onClick={() => handleNavClick('sold')}
            className="block w-full text-left font-heading text-sm tracking-wider text-neutral-300 hover:text-accent font-bold uppercase py-2"
          >
            Recently Sold
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left font-heading text-sm tracking-wider text-neutral-300 hover:text-accent font-bold uppercase py-2"
          >
            Contact
          </button>
          <hr className="border-neutral-800" />
          {user ? (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center font-heading text-sm tracking-wider text-accent font-bold uppercase py-2"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Portal
            </Link>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-heading text-sm tracking-wider text-neutral-400 hover:text-accent font-bold uppercase py-2"
            >
              Portal Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
