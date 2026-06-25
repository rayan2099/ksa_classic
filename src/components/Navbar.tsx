import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMobile && isMobileMenuOpen ? 'h-auto pb-4' : 'h-[56px] overflow-hidden'
      } ${
        isScrolled || isMobileMenuOpen
          ? 'bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-lg'
          : 'bg-neutral-950/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-full">
         <div className="flex items-center justify-between h-[56px]">
          {/* Logo Section */}
          <Link to="/" onClick={() => handleNavClick('hero')} className="flex items-center space-x-1.5 sm:space-x-3 group shrink-0">
            <img
              src="/logo.png"
              alt="KSA Classics Logo"
              id="navbar-logo"
              className="w-[40px] h-[40px] sm:h-12 sm:w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap' }}>KSA </span>
                <span style={{ color: '#C9A84C', fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '4px' }}>CLASSICS</span>
              </div>
            ) : (
              <span className="font-heading text-[13px] sm:text-xl font-bold tracking-widest text-white group-hover:text-accent transition-colors">
                KSA <span className="text-accent">CLASSICS</span>
              </span>
            )}
          </Link>

          {/* Conditional Rendering: Hamburger for Mobile, Horizontal Nav for Desktop */}
          {isMobile ? (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                marginLeft: 'auto'
              }}
              aria-label="Toggle navigation menu"
            >
              <span style={{ width: '22px', height: '2px', backgroundColor: '#C9A84C', display: 'block' }} />
              <span style={{ width: '22px', height: '2px', backgroundColor: '#C9A84C', display: 'block' }} />
              <span style={{ width: '22px', height: '2px', backgroundColor: '#C9A84C', display: 'block' }} />
            </button>
          ) : (
            /* Universal Horizontal Nav Items - Desktop Only */
            <div className="flex items-center space-x-2 sm:space-x-7 shrink-0 flex-nowrap whitespace-nowrap">
              <button
                onClick={() => handleNavClick('inventory')}
                className="font-heading text-[9px] sm:text-xs tracking-[0.03em] sm:tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
              >
                All Listings
              </button>
              <button
                onClick={() => handleNavClick('classic')}
                className="font-heading text-[9px] sm:text-xs tracking-[0.03em] sm:tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
              >
                Classics
              </button>
              <button
                onClick={() => handleNavClick('project')}
                className="font-heading text-[9px] sm:text-xs tracking-[0.03em] sm:tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
              >
                Projects
              </button>
              <button
                onClick={() => handleNavClick('sold')}
                className="font-heading text-[9px] sm:text-xs tracking-[0.03em] sm:tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
              >
                Recently Sold
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="font-heading text-[9px] sm:text-xs tracking-[0.03em] sm:tracking-wider text-neutral-300 hover:text-accent font-semibold uppercase transition-colors"
              >
                Contact
              </button>
              
              <div className="h-4 w-[1px] bg-neutral-800"></div>

              {user ? (
                <Link
                  to="/admin"
                  className="flex items-center text-[9px] sm:text-xs tracking-[0.05em] sm:tracking-wider font-heading font-bold text-accent hover:text-white uppercase transition-colors border border-accent/30 hover:border-accent px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-sm"
                >
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="inline sm:hidden">Admin</span>
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
          )}
        </div>

        {/* Mobile Expanded Menu Dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div className="flex flex-col space-y-4 px-4 py-4 border-t border-neutral-800 bg-neutral-900/95 mt-2 rounded-sm">
            <button
              onClick={() => handleNavClick('inventory')}
              className="text-left font-heading text-sm tracking-wider text-neutral-200 hover:text-accent font-semibold uppercase transition-colors"
            >
              All Listings
            </button>
            <button
              onClick={() => handleNavClick('classic')}
              className="text-left font-heading text-sm tracking-wider text-neutral-200 hover:text-accent font-semibold uppercase transition-colors"
            >
              Classics
            </button>
            <button
              onClick={() => handleNavClick('project')}
              className="text-left font-heading text-sm tracking-wider text-neutral-200 hover:text-accent font-semibold uppercase transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick('sold')}
              className="text-left font-heading text-sm tracking-wider text-neutral-200 hover:text-accent font-semibold uppercase transition-colors"
            >
              Recently Sold
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left font-heading text-sm tracking-wider text-neutral-200 hover:text-accent font-semibold uppercase transition-colors"
            >
              Contact
            </button>
            <div className="h-[1px] bg-neutral-800 my-1"></div>
            {user ? (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center font-heading text-sm font-bold text-accent hover:text-white uppercase transition-colors"
              >
                <Shield className="w-4 h-4 mr-2 text-accent" />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center font-heading text-sm font-bold text-neutral-400 hover:text-accent transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Portal Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
