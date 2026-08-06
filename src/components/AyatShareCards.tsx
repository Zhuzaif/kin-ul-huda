import React, { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { captureCardWithBanner, prewarmShareAssets } from '../utils/shareCardImage';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

// ==========================================
// Types
// ==========================================
interface AyatShareCardsProps {
  arabicText: string;
  englishText: string;
  reference: string;
  onClose: () => void;
}

interface CardProps {
  arabic: string;
  english: string;
  reference: string;
  aSize: string;
  aLH: string;
  tSize: string;
}

// ==========================================
// Dynamic Text Size Calculator
// Adjusts font sizes based on text length
// to ensure proper fit within fixed-size cards
// ==========================================
function getTextStyles(arabic: string, english: string) {
  const aLen = arabic.length;
  const eLen = english.length;
  const aSize = aLen <= 20 ? '32px' : aLen <= 40 ? '28px' : aLen <= 70 ? '24px' : aLen <= 100 ? '21px' : aLen <= 150 ? '18px' : '16px';
  const aLH = aLen <= 20 ? '2' : aLen <= 40 ? '1.9' : aLen <= 70 ? '1.85' : aLen <= 100 ? '1.8' : '1.75';
  const tSize = eLen <= 40 ? '15px' : eLen <= 80 ? '14px' : eLen <= 130 ? '13px' : eLen <= 200 ? '12px' : '11px';
  return { aSize, aLH, tSize };
}

// Capture + promo-banner compositing lives in ../utils/shareCardImage.

// ==========================================
// CARD 1: THE KISWAH (Black & Gold)
// ==========================================
function KiswahCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  const Corner = ({ style }: { style: React.CSSProperties }) => (
    <svg style={{ position: 'absolute', width: 72, height: 72, color: '#C4A15E', ...style }} viewBox="0 0 100 100" fill="currentColor">
      <path d="M0,0 L100,0 C100,55 55,100 0,100 Z" opacity={0.1} />
      <path d="M0,0 L80,0 C80,44 44,80 0,80 Z" opacity={0.3} />
      <path d="M0,0 L60,0 C60,33 33,60 0,60 Z" opacity={0.6} />
      <path d="M0,0 L40,0 C40,22 22,40 0,40 Z" />
      <circle cx={20} cy={20} r={5} fill="#111" stroke="currentColor" strokeWidth={2} />
    </svg>
  );

  return (
    <div className="sc-base" style={{ backgroundColor: '#111', border: '2px solid #C4A15E' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, #1a1a1a 0, #1a1a1a 2px, transparent 2px, transparent 8px)', opacity: 0.5 }} />
      <Corner style={{ top: 8, left: 8 }} />
      <Corner style={{ top: 8, right: 8, transform: 'rotate(90deg)' }} />
      <Corner style={{ bottom: 8, left: 8, transform: 'rotate(-90deg)' }} />
      <Corner style={{ bottom: 8, right: 8, transform: 'rotate(180deg)' }} />
      <div style={{ position: 'absolute', inset: 16, border: '1px solid rgba(196,161,94,0.4)', zIndex: 10, pointerEvents: 'none' as const }} />
      <div className="sc-content">
        <div style={{ marginTop: 40 }}>
          <div style={{ backgroundColor: '#C4A15E', color: '#111', fontFamily: '"Cinzel", serif', fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', padding: '6px 20px', textTransform: 'uppercase' as const }}>
            Ayat of the Day
          </div>
        </div>
        <div className="sc-text-area">
          <p style={{ fontFamily: '"Amiri", serif', fontSize: aSize, color: '#C4A15E', fontWeight: 700, lineHeight: aLH, textShadow: '0 2px 8px rgba(0,0,0,0.3)', direction: 'rtl' }}>
            {arabic}
          </p>
          <svg className="sc-divider" width="160" height="16" viewBox="0 0 200 20" fill="none">
            <line x1={0} y1={10} x2={80} y2={10} stroke="#C4A15E" strokeWidth={1.5} />
            <line x1={120} y1={10} x2={200} y2={10} stroke="#C4A15E" strokeWidth={1.5} />
            <path d="M100 0 L105 10 L100 20 L95 10 Z" fill="#C4A15E" />
            <circle cx={88} cy={10} r={2} fill="#C4A15E" />
            <circle cx={112} cy={10} r={2} fill="#C4A15E" />
          </svg>
          <p style={{ color: '#d1d5db', fontFamily: '"Playfair Display", serif', fontSize: tSize, fontStyle: 'italic', lineHeight: 1.7 }}>
            &ldquo;{english}&rdquo;
          </p>
        </div>
        <div className="sc-footer" style={{ color: 'rgba(196,161,94,0.7)' }}>{reference}</div>
      </div>
    </div>
  );
}

// ==========================================
// CARD 2: GLOWING NIGHT (Ramadan Vibe)
// ==========================================
function GlowingNightCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  return (
    <div className="sc-base" style={{ background: 'linear-gradient(180deg, #020617 0%, #0B132B 50%, #1e3a8a 100%)' }}>
      {/* Stars */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}>
        <defs>
          <pattern id="sc-stars" width={100} height={100} patternUnits="userSpaceOnUse">
            <circle cx={10} cy={10} r={1} fill="#FFF" />
            <circle cx={50} cy={80} r={1.5} fill="#C4A15E" />
            <circle cx={80} cy={30} r={0.5} fill="#FFF" />
            <circle cx={30} cy={50} r={1} fill="#FFF" opacity={0.5} />
            <circle cx={70} cy={70} r={0.8} fill="#FFF" opacity={0.3} />
            <circle cx={90} cy={15} r={0.6} fill="#C4A15E" opacity={0.6} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sc-stars)" />
      </svg>
      {/* Lantern */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transformOrigin: 'top center', animation: 'lantern-swing 6s ease-in-out infinite', zIndex: 10, width: 80, height: 130 }}>
        <svg viewBox="0 0 100 150" fill="none" style={{ width: '100%', height: '100%' }}>
          <line x1={50} y1={0} x2={50} y2={30} stroke="#C4A15E" strokeWidth={2} strokeDasharray="4 2" />
          <path d="M30 40 L70 40 L50 30 Z" fill="#C4A15E" />
          <rect x={47} y={40} width={6} height={5} fill="#C4A15E" />
          <path d="M25 45 L75 45 L65 95 L35 95 Z" fill="rgba(196,161,94,0.1)" stroke="#C4A15E" strokeWidth={2} />
          <line x1={30} y1={45} x2={40} y2={95} stroke="#C4A15E" strokeWidth={1} />
          <line x1={70} y1={45} x2={60} y2={95} stroke="#C4A15E" strokeWidth={1} />
          <path d="M50 75 Q47 65 50 60 Q53 65 50 75 Z" fill="#FFE272">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </path>
          <rect x={48} y={75} width={4} height={15} fill="#FFF" />
          <path d="M35 95 L65 95 L50 110 Z" fill="#C4A15E" />
          <circle cx={50} cy={113} r={3} fill="#C4A15E" />
        </svg>
      </div>
      {/* Moon */}
      <svg style={{ position: 'absolute', top: 40, left: 40, width: 64, height: 64, opacity: 0.3 }} viewBox="0 0 100 100" fill="#C4A15E">
        <path d="M50,10 C27.9,10 10,27.9 10,50 C10,72.1 27.9,90 50,90 C59.8,90 68.8,86.5 75.9,80.6 C61,79.5 49.3,67 49.3,51.8 C49.3,37 60.5,24.8 75,22.8 C68.2,14.8 59.5,10 50,10 Z" />
      </svg>
      <div className="sc-content" style={{ paddingTop: 100 }}>
        <div style={{ fontFamily: '"Cinzel", serif', color: '#C4A15E', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 12, opacity: 0.8 }}>
          Daily Reflection
        </div>
        <div className="sc-text-area">
          <p style={{ fontFamily: '"Amiri", serif', fontSize: aSize, color: 'white', fontWeight: 700, lineHeight: aLH, textShadow: '0 0 15px rgba(196,161,94,0.6)', direction: 'rtl' }}>
            {arabic}
          </p>
          <div style={{ width: 60, height: 1, background: 'rgba(196,161,94,0.5)', margin: '20px auto' }} />
          <p style={{ color: '#bfdbfe', fontFamily: '"Playfair Display", serif', fontSize: tSize, fontStyle: 'italic', lineHeight: 1.7, maxWidth: 280 }}>
            &ldquo;{english}&rdquo;
          </p>
        </div>
        <div style={{ marginBottom: 24, fontFamily: '"Inter", sans-serif', color: 'rgba(196,161,94,0.6)', fontSize: 10, letterSpacing: '0.1em', border: '1px solid rgba(196,161,94,0.3)', borderRadius: 999, padding: '4px 14px' }}>
          {reference}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARD 3: ANDALUSIAN ARCH (Emerald)
// ==========================================
function AndalusianArchCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  return (
    <div className="sc-base" style={{ backgroundColor: '#064E3B', border: '1px solid #047857', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 12 }}>
      {/* Star pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C4A15E' fill-opacity='0.15'%3E%3Cpath d='M30 0l1.414 1.414L30 2.828l-1.414-1.414L30 0zm0 60l1.414-1.414L30 57.172l-1.414 1.414L30 60zM0 30l1.414 1.414L2.828 30 1.414 28.586 0 30zm60 0l-1.414-1.414L57.172 30l1.414 1.414L60 30zM15 15l1.414 1.414L15 17.828l-1.414-1.414L15 15zm30 30l1.414 1.414L45 47.828l-1.414-1.414L45 45zm0-30l1.414-1.414L47.828 15l-1.414 1.414L45 15zm-30 30l1.414-1.414L17.828 45l-1.414 1.414L15 45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      {/* Arch container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 10, backgroundColor: 'rgba(6,78,59,0.4)', backdropFilter: 'blur(2px)', borderTopLeftRadius: '50%', borderTopRightRadius: '50%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', border: '3px solid #C4A15E', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
        {/* Arch top decoration */}
        <svg style={{ width: '100%', height: 80, position: 'absolute', top: 0, left: 0 }} viewBox="0 0 100 30" preserveAspectRatio="none" fill="#C4A15E">
          <path d="M0,0 L100,0 L100,5 C75,5 75,25 50,25 C25,25 25,5 0,5 Z" opacity={0.8} />
          <path d="M0,0 L100,0 L100,2 C75,2 75,20 50,20 C25,20 25,2 0,2 Z" />
        </svg>
        <div style={{ marginTop: 50, backgroundColor: '#C4A15E', color: '#064E3B', padding: '4px 14px', fontSize: 9, fontFamily: '"Cinzel", serif', fontWeight: 700, letterSpacing: '0.2em', borderRadius: 2, zIndex: 20, textTransform: 'uppercase' as const }}>
          GUIDANCE
        </div>
        <div className="sc-text-area" style={{ zIndex: 20 }}>
          <p style={{ fontFamily: '"Amiri", serif', fontSize: aSize, color: 'white', fontWeight: 700, lineHeight: aLH, textShadow: '0 2px 4px rgba(0,0,0,0.3)', direction: 'rtl' }}>
            {arabic}
          </p>
          <svg className="sc-divider" width="60" height="20" viewBox="0 0 60 20" fill="none">
            <path d="M30 0 L40 10 L30 20 L20 10 Z" fill="#C4A15E" />
            <circle cx={10} cy={10} r={3} fill="#C4A15E" />
            <circle cx={50} cy={10} r={3} fill="#C4A15E" />
            <line x1={0} y1={10} x2={6} y2={10} stroke="#C4A15E" strokeWidth={2} />
            <line x1={54} y1={10} x2={60} y2={10} stroke="#C4A15E" strokeWidth={2} />
          </svg>
          <p style={{ color: '#C4A15E', fontFamily: '"Playfair Display", serif', fontSize: tSize, fontStyle: 'italic', lineHeight: 1.7 }}>
            &ldquo;{english}&rdquo;
          </p>
        </div>
        <div style={{ width: '100%', height: 48, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 14, zIndex: 20, background: 'linear-gradient(to top, rgba(6,78,59,0.9), transparent)' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: '"Cinzel", serif', fontSize: 10, letterSpacing: '0.15em' }}>
            {reference}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARD 4: ILLUMINATED MANUSCRIPT (Tezhib)
// ==========================================
function ManuscriptCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  return (
    <div className="sc-base" style={{ backgroundColor: '#FDFBF7', border: '5px double #8B0000', padding: 6 }}>
      {/* Paper texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }} />
      {/* Inner border */}
      <div style={{ position: 'relative', width: '100%', height: '100%', border: '1px solid #C4A15E', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10 }}>
        {/* Tezhib header ornament */}
        <svg style={{ width: '100%', maxWidth: 200, height: 50, marginBottom: 8 }} viewBox="0 0 200 60" fill="#9A7B4F">
          <path d="M100 5 C120 5 130 25 150 25 L50 25 C70 25 80 5 100 5 Z" />
          <path d="M150 25 C170 25 180 15 190 30 C170 30 160 40 150 25 Z" fill="#047857" />
          <path d="M50 25 C30 25 20 15 10 30 C30 30 40 40 50 25 Z" fill="#047857" />
          <circle cx={100} cy={15} r={4} fill="#FDFBF7" />
          <path d="M20 35 L180 35 L180 38 L20 38 Z" fill="#9A7B4F" />
        </svg>
        <h2 style={{ fontFamily: '"Cinzel", serif', color: '#8B0000', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, margin: '4px 0' }}>
          Verse of the Day
        </h2>
        <div className="sc-text-area">
          <p style={{ fontFamily: '"Amiri", serif', fontSize: aSize, color: '#2B2B2B', fontWeight: 700, lineHeight: aLH, direction: 'rtl' }}>
            {arabic}
          </p>
          <svg className="sc-divider" style={{ width: 80, height: 30 }} viewBox="0 0 100 30" fill="#047857">
            <path d="M50 5 Q60 20 80 15 Q60 25 50 15 Q40 25 20 15 Q40 20 50 5 Z" />
            <circle cx={50} cy={15} r={3} fill="#8B0000" />
            <line x1={10} y1={15} x2={30} y2={15} stroke="#9A7B4F" strokeWidth={1} />
            <line x1={70} y1={15} x2={90} y2={15} stroke="#9A7B4F" strokeWidth={1} />
          </svg>
          <p style={{ color: '#374151', fontFamily: '"Playfair Display", serif', fontSize: tSize, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.7, marginTop: 8 }}>
            &ldquo;{english}&rdquo;
          </p>
        </div>
        {/* Footer ornament */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ backgroundColor: '#8B0000', color: '#F3E5AB', padding: '4px 16px', fontSize: 10, borderRadius: 999, letterSpacing: '0.1em', fontFamily: '"Cinzel", serif' }}>
            {reference}
          </div>
          <svg style={{ width: 120, height: 20, marginTop: 6 }} viewBox="0 0 100 20" fill="#9A7B4F">
            <path d="M50 15 Q40 5 10 5 L90 5 Q60 5 50 15 Z" />
            <circle cx={50} cy={8} r={2} fill="#FDFBF7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARD 5: CLASSIC GREEN (Cream & Emerald)
// ==========================================
function ClassicGreenCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  return (
    <div className="sc-base" style={{
      backgroundColor: '#FAF4E8',
      backgroundImage: 'radial-gradient(#e0d5c1 0.5px, transparent 0.5px), radial-gradient(#e0d5c1 0.5px, #FAF4E8 0.5px)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      border: '1px solid #e3d9c6',
      padding: 12,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 0 40px rgba(200,180,150,0.2)',
    }}>
      {/* Inner green border */}
      <div style={{ border: '2px solid #2B4C3F', borderRadius: 8, height: '100%', padding: 4 }}>
        {/* Gold border */}
        <div style={{ border: '1px solid #C4A15E', borderRadius: 6, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
          {/* Decorative corners */}
          <div style={{ position: 'absolute', top: -15, left: -30, width: 50, height: 50, border: '1px solid #C4A15E', transform: 'rotate(45deg)', backgroundColor: '#FAF4E8', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: -15, right: -30, width: 50, height: 50, border: '1px solid #C4A15E', transform: 'rotate(45deg)', backgroundColor: '#FAF4E8', zIndex: 1 }} />
          {/* Header badge */}
          <div style={{
            backgroundColor: '#2B4C3F', color: '#C4A15E', fontFamily: '"Cinzel", serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '2px', padding: '7px 20px', borderRadius: '0 0 12px 12px', border: '1px solid #C4A15E',
            borderTop: 'none', position: 'absolute', top: 0, zIndex: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}>
            AYAT OF THE DAY
          </div>
          {/* Content */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 24px', transform: 'translateY(-14px)', zIndex: 2, width: '100%' }}>
            <p style={{ fontFamily: '"Amiri", serif', fontSize: aSize, color: '#2B4C3F', lineHeight: aLH, fontWeight: 700, marginBottom: 16, textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.05)', direction: 'rtl', margin: 0 }}>
              {arabic}
            </p>
            {/* Ornate divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80%', margin: '14px 0 18px' }}>
              <div style={{ flexGrow: 1, height: 1, background: 'linear-gradient(to right, transparent, #C4A15E, transparent)' }} />
              <span style={{ color: '#C4A15E', margin: '0 10px', fontSize: 16 }}>✦</span>
              <div style={{ flexGrow: 1, height: 1, background: 'linear-gradient(to right, transparent, #C4A15E, transparent)' }} />
            </div>
            <p style={{ fontSize: tSize, color: '#4a5550', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
              &ldquo;{english}&rdquo;
            </p>
          </div>
          {/* Reference */}
          <div style={{ position: 'absolute', bottom: 16, fontFamily: '"Cinzel", serif', fontSize: 10, color: '#2B4C3F', letterSpacing: '1px', zIndex: 2 }}>
            [{reference}]
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CARD 6: ORNAMENTAL EMERALD
// ==========================================
function OrnamentalEmeraldCard({ arabic, english, reference, aSize, aLH, tSize }: CardProps) {
  return (
    <div className="sc-base" style={{
      background: 'radial-gradient(130% 90% at 50% 0%, #054a38 0%, #022c22 65%)',
      boxShadow: '0 40px 70px -20px rgba(0,0,0,0.55), 0 18px 34px -18px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)',
      padding: '32px 28px',
      borderRadius: 6,
    }}>
      {/* Geometric pattern */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' as const }} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="sc-orn-tile" width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M20,3 L37,20 L20,37 L3,20 Z" fill="none" stroke="#f3dfa1" strokeWidth={0.6} />
            <rect x={11} y={11} width={18} height={18} transform="rotate(45 20 20)" fill="none" stroke="#f3dfa1" strokeWidth={0.6} />
            <circle cx={20} cy={20} r={2} fill="#f3dfa1" />
          </pattern>
        </defs>
        <rect width={200} height={200} fill="url(#sc-orn-tile)" />
      </svg>
      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 85% at 50% 28%, transparent 45%, #022c22 100%)', opacity: 0.65, pointerEvents: 'none' as const }} />
      {/* Mehrab arch */}
      <svg style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: '62%', maxWidth: 190, pointerEvents: 'none' as const }} viewBox="0 0 200 140">
        <path d="M28,140 L28,72 C28,32 58,12 100,12 C142,12 172,32 172,72 L172,140" fill="none" stroke="#cf9f2e" strokeWidth={1.6} opacity={0.35} />
        <path d="M44,140 L44,76 C44,44 66,26 100,26 C134,26 156,44 156,76 L156,140" fill="none" stroke="#cf9f2e" strokeWidth={1} opacity={0.22} />
        <circle cx={100} cy={36} r={3.5} fill="#cf9f2e" opacity={0.3} />
      </svg>
      {/* Frame */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' as const }} viewBox="0 0 340 520" preserveAspectRatio="none">
        <rect x={10} y={10} width={320} height={500} fill="none" stroke="#cf9f2e" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <rect x={16} y={16} width={308} height={488} fill="none" stroke="#cf9f2e" strokeWidth={0.7} opacity={0.65} vectorEffect="non-scaling-stroke" />
        <g stroke="#cf9f2e" strokeWidth={1} vectorEffect="non-scaling-stroke">
          <path d="M170,10 L170,3 M163,6.5 L177,6.5" />
          <path d="M170,510 L170,517 M163,513.5 L177,513.5" />
          <path d="M10,260 L3,260 M6.5,253 L6.5,267" />
          <path d="M330,260 L337,260 M333.5,253 L333.5,267" />
        </g>
      </svg>
      {/* Corner ornaments */}
      {[
        { top: 4, left: 4 },
        { top: 4, right: 4, transform: 'scaleX(-1)' },
        { bottom: 4, left: 4, transform: 'scaleY(-1)' },
        { bottom: 4, right: 4, transform: 'scale(-1, -1)' },
      ].map((pos, i) => (
        <svg key={i} style={{ position: 'absolute', width: 52, height: 52, zIndex: 1, pointerEvents: 'none' as const, ...pos } as React.CSSProperties} viewBox="0 0 100 100">
          <path d="M4,64 C4,30 30,4 64,4" fill="none" stroke="#cf9f2e" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
          <path d="M15,72 C15,40 40,15 72,15" fill="none" stroke="#cf9f2e" strokeWidth={0.8} opacity={0.55} vectorEffect="non-scaling-stroke" />
          <g transform="translate(15,15)">
            <circle r={7.5} fill="none" stroke="#fdf6e3" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            <path d="M0,-11 L2.4,-3.4 L10,-2.2 L3.8,2.7 L5.5,10.4 L0,6 L-5.5,10.4 L-3.8,2.7 L-10,-2.2 L-2.4,-3.4 Z" fill="#fdf6e3" />
          </g>
          <g fill="#cf9f2e">
            <rect x={33} y={33} width={7} height={7} transform="rotate(45 36.5 36.5)" />
            <rect x={56} y={9} width={4.5} height={4.5} transform="rotate(45 58.25 11.25)" />
            <rect x={9} y={56} width={4.5} height={4.5} transform="rotate(45 11.25 58.25)" />
          </g>
        </svg>
      ))}
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, transform: 'translateY(-6%)' }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 18px', marginBottom: 28,
          border: '1px solid #cf9f2e', borderRadius: 999, fontFamily: '"Cinzel", serif', fontSize: 10,
          letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: '#f3dfa1',
          backgroundImage: 'linear-gradient(115deg, transparent 42%, rgba(255,255,255,0.16) 50%, transparent 58%)',
          backgroundSize: '260% 100%', animation: 'badge-shimmer 7s ease-in-out infinite',
        }}>
          <svg width={9} height={9} viewBox="0 0 24 24" fill="#cf9f2e"><path d="M12 2 L14.5 9.4 L22 9.7 L15.9 14.3 L18.1 21.7 L12 17.2 L5.9 21.7 L8.1 14.3 L2 9.7 L9.5 9.4 Z" /></svg>
          <span>Ayat of the Day</span>
          <svg width={9} height={9} viewBox="0 0 24 24" fill="#cf9f2e"><path d="M12 2 L14.5 9.4 L22 9.7 L15.9 14.3 L18.1 21.7 L12 17.2 L5.9 21.7 L8.1 14.3 L2 9.7 L9.5 9.4 Z" /></svg>
        </div>
        {/* Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p style={{ fontFamily: '"Amiri", serif', fontWeight: 700, fontSize: aSize, lineHeight: aLH, textAlign: 'center', color: '#fdf6e3', textShadow: '0 2px 20px rgba(0,0,0,0.2)', maxWidth: '94%', margin: 0, direction: 'rtl' }}>
            {arabic}
          </p>
          <svg style={{ display: 'block', width: '60%', maxWidth: 180, height: 22, margin: '18px auto', overflow: 'visible' }} viewBox="0 0 320 34">
            <path d="M0,17 H118" stroke="#cf9f2e" strokeWidth={1} />
            <path d="M320,17 H202" stroke="#cf9f2e" strokeWidth={1} />
            <path d="M118,17 C127,7 133,7 142,17" fill="none" stroke="#cf9f2e" strokeWidth={1} />
            <path d="M202,17 C193,7 187,7 178,17" fill="none" stroke="#cf9f2e" strokeWidth={1} />
            <rect x={153} y={8} width={14} height={14} transform="rotate(45 160 15)" fill="none" stroke="#cf9f2e" strokeWidth={1.2} />
            <circle cx={160} cy={15} r={2.6} fill="#cf9f2e" />
          </svg>
          <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontWeight: 500, fontSize: tSize, lineHeight: 1.85, textAlign: 'center', color: '#cdbf98', maxWidth: '84%', margin: 0 }}>
            {english}
          </p>
        </div>
        {/* Reference */}
        <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid rgba(207,159,46,0.35)', fontFamily: '"Cinzel", serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#f3dfa1' }}>
          {reference}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Card Registry
// ==========================================
const CARD_DESIGNS = [
  { Component: KiswahCard, name: 'Kiswah' },
  { Component: GlowingNightCard, name: 'Night Sky' },
  { Component: AndalusianArchCard, name: 'Emerald' },
  { Component: ManuscriptCard, name: 'Manuscript' },
  { Component: ClassicGreenCard, name: 'Classic' },
  { Component: OrnamentalEmeraldCard, name: 'Ornamental' },
];

// ==========================================
// MAIN OVERLAY COMPONENT
// ==========================================
export default function AyatShareCards({ arabicText, englishText, reference, onClose }: AyatShareCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { aSize, aLH, tSize } = getTextStyles(arabicText, englishText);

  // Fetch html2canvas and the promo banner while the user is still browsing
  // designs, so the first Download/Share doesn't wait on the network.
  useEffect(() => {
    prewarmShareAssets();
  }, []);

  // Track active slide on scroll
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const newIndex = Math.round(scrollLeft / (offsetWidth));
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < CARD_DESIGNS.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  // Navigate to specific card
  const goToCard = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const slideWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  // Download card as PNG
  const handleDownload = useCallback(async () => {
    const el = cardRefs.current[activeIndex];
    if (!el || isCapturing) return;
    setIsCapturing(true);
    try {
      const blob = await captureCardWithBanner(el);
      if (blob) {
        const fileName = `ayat-card-${CARD_DESIGNS[activeIndex].name.toLowerCase()}.png`;
        if (Capacitor.isNativePlatform()) {
          const base64Data = await blobToBase64(blob);
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          await Share.share({
            url: savedFile.uri,
            dialogTitle: 'Save or Share Image',
          });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
    setIsCapturing(false);
  }, [activeIndex, isCapturing]);

  // Share card as image
  const handleShare = useCallback(async () => {
    const el = cardRefs.current[activeIndex];
    if (!el || isCapturing) return;
    setIsCapturing(true);
    try {
      const blob = await captureCardWithBanner(el);
      if (blob) {
        if (Capacitor.isNativePlatform()) {
          const fileName = `ayat-card-share.png`;
          const base64Data = await blobToBase64(blob);
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          await Share.share({
            title: 'Ayat of the Day',
            text: `${englishText} — ${reference}`,
            url: savedFile.uri,
          });
        } else if (navigator.share) {
          const file = new File([blob], 'ayat-card.png', { type: 'image/png' });
          await navigator.share({
            title: 'Ayat of the Day',
            text: `${englishText} — ${reference}`,
            files: [file],
          });
        } else {
          // Fallback: download if share not supported
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ayat-card.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
    setIsCapturing(false);
  }, [activeIndex, isCapturing, englishText, reference]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="share-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Header */}
        <div className="share-overlay-header">
          <span className="share-overlay-title">Select Design</span>
          <button className="share-overlay-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Card name */}
        <div style={{ textAlign: 'center', padding: '4px 0', fontFamily: '"Inter", sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
          {CARD_DESIGNS[activeIndex].name}
        </div>

        {/* Carousel */}
        <div className="share-carousel" ref={carouselRef} onScroll={handleScroll}>
          {CARD_DESIGNS.map(({ Component }, index) => (
            <div key={index} className="share-slide">
              <div ref={el => { cardRefs.current[index] = el; }}>
                <Component
                  arabic={arabicText}
                  english={englishText}
                  reference={reference}
                  aSize={aSize}
                  aLH={aLH}
                  tSize={tSize}
                />
              </div>
              {isCapturing && index === activeIndex && (
                <div className="share-loading">
                  <span>Processing...</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="share-dots">
          {CARD_DESIGNS.map((_, i) => (
            <button
              key={i}
              className={`share-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goToCard(i)}
              aria-label={`Card ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="share-actions">
          <button className="share-action-btn" onClick={handleDownload} disabled={isCapturing}>
            <Download size={16} />
            <span>Download</span>
          </button>
          <button className="share-action-btn primary" onClick={handleShare} disabled={isCapturing}>
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

