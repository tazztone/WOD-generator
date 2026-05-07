import { useMemo } from 'react';

export const Tooltip = ({ x, y, text }) => {
  const id = useMemo(() => `tt-${Math.random().toString(36).substr(2, 5)}`, []);

  // Viewport edge detection
  const padding = 12;
  const width = 200; // Estimated max-width
  const height = 60; // Estimated height

  let left = x;
  let top = y - 10;
  let isFlipped = false;

  // Horizontal clamping
  if (left - width / 2 < padding) left = width / 2 + padding;
  if (left + width / 2 > window.innerWidth - padding)
    left = window.innerWidth - padding - width / 2;

  // Vertical clamping (flip if near top)
  if (top - height < padding) {
    top = y + 25;
    isFlipped = true;
  }

  return (
    <div
      id={id}
      role="tooltip"
      aria-live="polite"
      className="fixed z-[100] px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl border border-slate-600 pointer-events-none transform -translate-x-1/2 duration-200 max-w-[250px] text-center animate-in fade-in zoom-in-95"
      style={{
        left,
        top,
        transform: `translateX(-50%) ${!isFlipped ? 'translateY(-100%)' : ''}`,
      }}
    >
      {text}
      {/* Arrow */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
          isFlipped ? 'bottom-full border-b-slate-800' : 'top-full border-t-slate-800'
        }`}
      />
    </div>
  );
};
