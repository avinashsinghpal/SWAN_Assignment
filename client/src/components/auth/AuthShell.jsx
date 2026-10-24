import { Link } from 'react-router-dom';
import { SplitFlapText } from '../landing/SplitFlapText.jsx';
import { SoundProvider } from '../landing/SoundContext.jsx';
import { AnimatedNoise } from '../landing/AnimatedNoise.jsx';
import { ArrowLeft } from 'lucide-react';

export function AuthShell({ splitWord = 'WELCOME', children }) {
  return (
    <SoundProvider>
      <div className="min-h-screen bg-[#020202] text-[#EEEEEE] font-mono flex flex-col lg:flex-row relative overflow-hidden">
        {/* Global grid background */}
        <div className="app-grid-bg" aria-hidden="true" />
        <div className="app-noise-overlay" aria-hidden="true" />

        {/* ── Left Editorial Panel (Desktop lg+) ─────────────────── */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 border-r border-[#222222]/40 z-10 overflow-hidden bg-[#020202]">
          <AnimatedNoise />

          {/* Vertical rotated label at left edge */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] tracking-[0.4em] uppercase text-[#717171] pointer-events-none select-none">
            SWAN DIGITAL
          </div>

          {/* Top navigation link */}
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#717171] hover:text-[#FE6A00] transition-colors"
            >
              <ArrowLeft size={14} /> Back to home
            </Link>

            <span className="text-[10px] uppercase tracking-widest text-[#717171]">
              System Access
            </span>
          </div>

          {/* Center editorial display */}
          <div className="my-auto py-12 pl-6">
            <div className="mb-4">
              <SplitFlapText
                word={splitWord}
                fontSize="clamp(3rem, 7vw, 7.5rem)"
              />
            </div>

            <h2 className="font-display text-4xl uppercase tracking-wide text-[#EEEEEE] mt-6 leading-none">
              Lead Management, Built for Growth Teams
            </h2>

            <p className="text-xs text-[#717171] max-w-md leading-relaxed mt-4 font-mono">
              High-velocity lead capture, automated distribution, and continuous activity auditing designed specifically for B2B digital agency workflows.
            </p>
          </div>

          {/* Bottom tag */}
          <div className="flex items-center justify-between pt-6 border-t border-[#222222]/40 text-[10px] uppercase tracking-widest text-[#717171]">
            <span>Production CRM</span>
            <span className="px-2.5 py-1 border border-[#222222] bg-[#060606] text-[#8A8A8A]">
              v1.0 / Swan Digital Solutions
            </span>
          </div>
        </div>

        {/* ── Mobile Compact Header (< lg) ────────────────────────── */}
        <div className="lg:hidden p-6 border-b border-[#222222]/40 flex items-center justify-between z-10 bg-[#020202]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#FE6A00]" />
            <span className="font-display text-2xl tracking-wider text-[#EEEEEE]">
              SWAN
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#717171] border-l border-[#222222] pl-2.5">
              LEADS
            </span>
          </div>

          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-[#717171] hover:text-[#FE6A00]"
          >
            Home
          </Link>
        </div>

        {/* ── Right Form Container ─────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 z-10">
          <div className="w-full max-w-md py-8">
            {children}
          </div>
        </div>
      </div>
    </SoundProvider>
  );
}
