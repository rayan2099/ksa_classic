import React from 'react';
import { ArrowRight, Sparkles, MapPin, Wrench, ShieldCheck, Trophy } from 'lucide-react';
// @ts-ignore
import classicCarSunsetBg from '../assets/images/classic_car_sunset_beach_1782304346164.jpg';
// @ts-ignore
import classicCarSunsetMobileBg from '../assets/images/classic_car_sunset_beach_mobile.webp';

interface HeroProps {
  onBrowseClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseClick }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div
        id="hero"
        style={isMobile ? {
          position: 'relative',
          overflow: 'hidden',
          height: '100vh',
          backgroundColor: '#0a0a0a'
        } : {}}
        className={isMobile ? "" : "relative min-h-screen flex flex-col justify-between bg-neutral-950 overflow-hidden"}
      >
        {/* Spacer to start below the fixed 56px navbar */}
        <div className="h-[56px] shrink-0" />

        {/* Background Image with Rich Multi-Layered Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src={isMobile ? classicCarSunsetMobileBg : classicCarSunsetBg}
            alt="Vintage Classic Car"
            style={isMobile ? {
              objectFit: 'contain',
              objectPosition: 'center top',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            } : {}}
            className={isMobile ? "opacity-90" : "w-full h-full object-cover object-right opacity-85 scale-100 transform transition duration-1000"}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000";
            }}
          />
          {/* Black to lighter dark gradient overlay for supreme visual appeal and legibility */}
          <div 
            style={isMobile ? {
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.4) 100%)',
              zIndex: 2
            } : {}}
            className={isMobile ? "" : "absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/20 mix-blend-color-dodge"></div>
          {/* Dark radial glow behind the text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[140px] pointer-events-none"></div>
          {/* Elegant bottom blending mask */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950/70 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between flex-grow pt-8 sm:pt-16 pb-0">
          <div 
            style={isMobile ? {
              position: 'absolute',
              top: '10%',
              left: '0',
              right: '0',
              padding: '0 20px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            } : {}}
            className={isMobile ? "" : "max-w-[55%] w-full space-y-6"}
          >
            {isMobile ? (
              <div
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)',
                  padding: '20px 16px 24px 16px',
                  borderRadius: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Marketplace Pill Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(201,168,76,0.5)',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'rgba(255,255,255,0.9)',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(4px)',
                    width: 'fit-content'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest text-neutral-200 font-bold font-heading">
                    Classic &amp; Project Car Marketplace
                  </span>
                </div>

                {/* Majestic Heading */}
                <h1
                  style={{
                    fontSize: '48px',
                    fontWeight: '900',
                    lineHeight: '0.92',
                    margin: 0
                  }}
                >
                  <span style={{ color: '#ffffff', display: 'block' }}>KSA</span>
                  <span style={{ color: '#C9A84C', display: 'block' }}>CLASSICS</span>
                </h1>

                {/* Responsive Description */}
                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.55',
                    color: 'rgba(255,255,255,0.8)',
                    maxWidth: '100%',
                    margin: 0
                  }}
                  className="font-sans tracking-wide"
                >
                  Explore classic and collectible cars, from carefully preserved icons to restoration projects selected for serious enthusiasts and collectors.
                </p>

              </div>
            ) : (
              <div className="space-y-6">
                {/* Marketplace Pill Badge */}
                <div className="inline-flex items-center space-x-2 bg-neutral-900/80 backdrop-blur-md border border-[#C9A84C]/30 rounded-full px-4 py-1.5 shadow-lg shadow-black/35">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C] animate-pulse" />
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-neutral-200 font-bold font-heading">
                    Classic &amp; Project Car Marketplace
                  </span>
                </div>

                {/* Majestic Heading */}
                <h1 className="text-3xl sm:text-7xl md:text-8xl font-bold font-heading text-white uppercase tracking-tight leading-[1.05] sm:leading-[0.95]">
                  KSA <span className="text-[#C9A84C] text-glow">CLASSICS</span>
                </h1>

                {/* Responsive Description */}
                <p className="max-w-2xl text-[10px] sm:text-base md:text-lg text-neutral-300 font-sans tracking-wide leading-relaxed">
                  Explore classic and collectible cars, from carefully preserved icons to restoration projects selected for serious enthusiasts and collectors.
                </p>

                {/* Action Call to Actions */}
                <div className="flex pt-2 sm:pt-4">
                  <button
                    onClick={onBrowseClick}
                    id="hero-cta-browse"
                    className="w-[280px] max-w-full bg-[#C9A84C] hover:bg-[#B09038] text-neutral-950 font-heading font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/25 flex items-center justify-center space-x-2.5 border border-[#C9A84C] cursor-pointer group"
                  >
                    <span>Browse Inventory</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {!isMobile && (
            /* Visual Marketplace Metrics - Desktop */
            <div className="flex w-full h-[72px] bg-black/75 border-t border-neutral-800/60 rounded-none overflow-hidden select-none">
              {/* Metric 1 */}
              <div className="w-1/4 shrink-0 grow-0 overflow-hidden h-full px-1 sm:px-4 py-1 sm:py-2 flex flex-col justify-center transition-all group">
                <div className="flex items-start space-x-1 sm:space-x-3 mb-0.5 sm:mb-1 whitespace-nowrap">
                  <div className="p-0.5 sm:p-1 bg-[#C9A84C]/10 rounded-sm text-[#C9A84C] shrink-0">
                    <Trophy className="w-[14px] h-[14px] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[15px] sm:text-2xl font-bold font-heading text-white tracking-tight leading-none">Curated</span>
                </div>
                <p className="text-[7px] sm:text-[10px] uppercase tracking-wider text-neutral-300 font-heading font-bold whitespace-nowrap overflow-hidden text-ellipsis">Classic Inventory</p>
                <p className="hidden sm:block text-[10px] text-neutral-500 font-sans whitespace-nowrap overflow-hidden text-ellipsis">Collector-focused vehicles</p>
              </div>

              {/* Metric 2 */}
              <div className="w-1/4 shrink-0 grow-0 overflow-hidden h-full px-1 sm:px-4 py-1 sm:py-2 flex flex-col justify-center transition-all group">
                <div className="flex items-start space-x-1 sm:space-x-3 mb-0.5 sm:mb-1 whitespace-nowrap">
                  <div className="p-0.5 sm:p-1 bg-[#C9A84C]/10 rounded-sm text-[#C9A84C] shrink-0">
                    <Wrench className="w-[14px] h-[14px] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[15px] sm:text-2xl font-bold font-heading text-white tracking-tight leading-none">Restoration</span>
                </div>
                <p className="text-[7px] sm:text-[10px] uppercase tracking-wider text-neutral-300 font-heading font-bold whitespace-nowrap overflow-hidden text-ellipsis">Project Cars</p>
                <p className="hidden sm:block text-[10px] text-neutral-500 font-sans whitespace-nowrap overflow-hidden text-ellipsis">Builds at varied stages</p>
              </div>

              {/* Metric 3 */}
              <div className="w-1/4 shrink-0 grow-0 overflow-hidden h-full px-1 sm:px-4 py-1 sm:py-2 flex flex-col justify-center transition-all group">
                <div className="flex items-start space-x-1 sm:space-x-3 mb-0.5 sm:mb-1 whitespace-nowrap">
                  <div className="p-0.5 sm:p-1 bg-[#C9A84C]/10 rounded-sm text-[#C9A84C] shrink-0">
                    <ShieldCheck className="w-[14px] h-[14px] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[15px] sm:text-2xl font-bold font-heading text-white tracking-tight leading-none">Reviewed</span>
                </div>
                <p className="text-[7px] sm:text-[10px] uppercase tracking-wider text-neutral-300 font-heading font-bold whitespace-nowrap overflow-hidden text-ellipsis">Listing Details</p>
                <p className="hidden sm:block text-[10px] text-neutral-500 font-sans whitespace-nowrap overflow-hidden text-ellipsis">Clear vehicle information</p>
              </div>

              {/* Metric 4 */}
              <div className="w-1/4 shrink-0 grow-0 overflow-hidden h-full px-1 sm:px-4 py-1 sm:py-2 flex flex-col justify-center transition-all group">
                <div className="flex items-start space-x-1 sm:space-x-3 mb-0.5 sm:mb-1 whitespace-nowrap">
                  <div className="p-0.5 sm:p-1 bg-[#C9A84C]/10 rounded-sm text-[#C9A84C] shrink-0">
                    <MapPin className="w-[14px] h-[14px] sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[15px] sm:text-2xl font-bold font-heading text-white tracking-tight leading-none">By Appointment</span>
                </div>
                <p className="text-[7px] sm:text-[10px] uppercase tracking-wider text-neutral-300 font-heading font-bold whitespace-nowrap overflow-hidden text-ellipsis">Private Viewings</p>
                <p className="hidden sm:block text-[10px] text-neutral-500 font-sans whitespace-nowrap overflow-hidden text-ellipsis">Flexible scheduling support</p>
              </div>
            </div>
          )}
        </div>

        {isMobile && (
          <div className="absolute inset-x-0 bottom-[170px] z-20 flex justify-center px-5">
            <button
              onClick={onBrowseClick}
              id="hero-cta-browse"
              className="w-full max-w-[270px] bg-[#C9A84C] hover:bg-[#B09038] text-neutral-950 font-heading font-bold text-xs uppercase tracking-widest py-4 px-7 rounded-sm transition-colors flex items-center justify-center gap-2.5 border border-[#C9A84C] shadow-xl shadow-black/40"
            >
              <span>Browse Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Subtle Bottom Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
      </div>

      {isMobile && (
        /* Visual Marketplace Metrics - Mobile (completely below the hero container, separate block) */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
            backgroundColor: '#1A1A1A',
            borderTop: '2px solid #C9A84C'
          }}
        >
          {/* Metric 1 */}
          <div
            style={{
              minWidth: 0,
              padding: '14px 6px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <div style={{ padding: '2px', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '2px', color: '#C9A84C', display: 'flex', alignItems: 'center' }}>
                <Trophy style={{ width: '14px', height: '14px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>Curated</span>
            </div>
            <p style={{ fontSize: '7px', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Classics</p>
          </div>

          {/* Metric 2 */}
          <div
            style={{
              minWidth: 0,
              padding: '14px 6px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <div style={{ padding: '2px', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '2px', color: '#C9A84C', display: 'flex', alignItems: 'center' }}>
                <Wrench style={{ width: '14px', height: '14px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>Restoration</span>
            </div>
            <p style={{ fontSize: '7px', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Projects</p>
          </div>

          {/* Metric 3 */}
          <div
            style={{
              minWidth: 0,
              padding: '14px 6px',
              borderRight: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <div style={{ padding: '2px', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '2px', color: '#C9A84C', display: 'flex', alignItems: 'center' }}>
                <ShieldCheck style={{ width: '14px', height: '14px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>Reviewed</span>
            </div>
            <p style={{ fontSize: '7px', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Verified</p>
          </div>

          {/* Metric 4 */}
          <div
            style={{
              minWidth: 0,
              padding: '14px 6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <div style={{ padding: '2px', backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: '2px', color: '#C9A84C', display: 'flex', alignItems: 'center' }}>
                <MapPin style={{ width: '14px', height: '14px' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', lineHeight: '1', whiteSpace: 'nowrap' }}>Private</span>
            </div>
            <p style={{ fontSize: '7px', textTransform: 'uppercase', color: '#ffffff', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Viewings</p>
          </div>
        </div>
      )}
    </>
  );
};
