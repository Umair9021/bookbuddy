import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

export default function LightboxOverlay({ lightboxOpen, imageMessages, lightboxIndex, setLightboxOpen, sending, lbPrev, lbNext, onLightboxTouchStart, onLightboxTouchMove, onLightboxTouchEnd, prevLightboxIndex, animateDirection, animating }) {
  if (!lightboxOpen || !imageMessages[lightboxIndex]) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)} onTouchStart={onLightboxTouchStart} onTouchMove={onLightboxTouchMove} onTouchEnd={onLightboxTouchEnd}>
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {sending && (<div className="text-white p-2 rounded-full bg-black/40 flex items-center justify-center" title="Sending..."><svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg></div>)}
        <button aria-label="Close image" className="text-white p-2 rounded-full bg-black/40" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}><X size={18} /></button>
      </div>

      <button aria-label="Previous image" className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40" onClick={(e) => { e.stopPropagation(); lbPrev(); }}><ChevronLeft size={24} /></button>

      <div className="max-w-full max-h-full flex items-center justify-center overflow-hidden relative">
        {prevLightboxIndex !== null && imageMessages[prevLightboxIndex] && (
          <img src={imageMessages[prevLightboxIndex].content} alt="previous" className={`absolute transition-opacity duration-300 ${animateDirection === 1 ? 'opacity-0' : 'opacity-60'}`} style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
        )}

        <div className="relative">
          <img src={imageMessages[lightboxIndex].content} alt="preview" className={`rounded transition-opacity duration-300 ${animating ? 'opacity-100' : 'opacity-100'}`} style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
        </div>
      </div>

      <button aria-label="Next image" className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black/40" onClick={(e) => { e.stopPropagation(); lbNext(); }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}
