import React from 'react';
import { ArrowRight, Sparkles, MapPin, Wrench, ShieldCheck, Trophy } from 'lucide-react';

interface HeroProps {
  onBrowseClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseClick }) => {
  return (
    <div
      id="hero"
      className="relative min-h-[100vh] sm:min-h-[90vh] flex flex-col justify-center bg-neutral-950 overflow-hidden pt-28 pb-16"
    >
      {/* Background Image with Rich Multi-Layered Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.imgur.com/wokOdvh.jpg"
          alt="Vintage Classic Car"
          className="w-full h-full object-cover object-center opacity-85 scale-100 transform transition duration-1000"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000";
          }}
        />
        {/* Black to lighter dark gradient overlay for supreme visual appeal and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/45 to-neutral-950/15"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/20 mix-blend-color-dodge"></div>
        {/* Dark radial glow behind the text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-[140px] pointer-events-none"></div>
        {/* Elegant bottom blending mask */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between h-full">
        <div className="max-w-4xl space-y-6">
          {/* Marketplace Pill Badge */}
          <div className="inline-flex items-center space-x-2 bg-neutral-900/80 backdrop-blur-md border border-accent/30 rounded-full px-4 py-1.5 shadow-lg shadow-black/35 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-200 font-bold font-heading">
              Canada's Classic &amp; Project Car Marketplace
            </span>
          </div>

          {/* Majestic Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-heading text-white uppercase tracking-tight leading-[1.05] sm:leading-[0.95]">
            KSA <span className="text-accent text-glow">CLASSICS</span>
          </h1>

          {/* Responsive Description */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-neutral-300 font-sans tracking-wide leading-relaxed">
            Find and buy classic collector cars and vintage project cars. From fully restored legendary icons in showroom condition to rare barn finds ready for your garage restoration.
          </p>

          {/* Action Call to Actions */}
          <div className="flex pt-4">
            <button
              onClick={onBrowseClick}
              id="hero-cta-browse"
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-widest py-4 px-10 rounded-sm transition-all duration-300 hover:shadow-xl hover:shadow-accent/25 flex items-center justify-center space-x-2.5 border border-accent cursor-pointer group"
            >
              <span>Explore The Marketplace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Visual Marketplace Metrics (Bento-lite row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-neutral-800/60">
          {/* Metric 1 */}
          <div className="bg-neutral-950/50 backdrop-blur-md border border-neutral-900 p-5 rounded-sm hover:border-accent/20 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">120+</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-heading font-bold">Pristine Classics</p>
            <p className="text-[10px] text-neutral-500 font-sans mt-1">Concours & survivor condition</p>
          </div>

          {/* Metric 2 */}
          <div className="bg-neutral-950/50 backdrop-blur-md border border-neutral-900 p-5 rounded-sm hover:border-accent/20 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">85+</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-heading font-bold">Project Builds</p>
            <p className="text-[10px] text-neutral-500 font-sans mt-1">Barn-finds & rolling restorations</p>
          </div>

          {/* Metric 3 */}
          <div className="bg-neutral-950/50 backdrop-blur-md border border-neutral-900 p-5 rounded-sm hover:border-accent/20 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">100%</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-heading font-bold">Verified Deals</p>
            <p className="text-[10px] text-neutral-500 font-sans mt-1">Inspected vin & titles</p>
          </div>

          {/* Metric 4 */}
          <div className="bg-neutral-950/50 backdrop-blur-md border border-neutral-900 p-5 rounded-sm hover:border-accent/20 transition-all group">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-sm text-accent group-hover:bg-accent group-hover:text-neutral-950 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">BC Wide</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-heading font-bold">Vancouver Based</p>
            <p className="text-[10px] text-neutral-500 font-sans mt-1">Bespoke transport & viewing</p>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/40 to-transparent"></div>
    </div>
  );
};
