import { useLayoutEffect, useRef, useState } from 'react';

export const Tooltip = ({ x, y, text }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({
        flipped: false,
        offsetX: 0,
        ready: false
    });

    useLayoutEffect(() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const padding = 10;
        const tooltipHeight = rect.height;
        const tooltipWidth = rect.width;

        let flipped = false;
        let offsetX = 0;

        // Vertical flipping: if space above is less than tooltip height + padding
        if (y - tooltipHeight - padding < 0) {
            flipped = true;
        }

        // Horizontal adjustment: ensure tooltip stays within viewport
        const leftEdge = x - tooltipWidth / 2;
        const rightEdge = x + tooltipWidth / 2;

        if (leftEdge < padding) {
            offsetX = padding - leftEdge;
        } else if (rightEdge > window.innerWidth - padding) {
            offsetX = window.innerWidth - padding - rightEdge;
        }

        setPosition({ flipped, offsetX, ready: true });
    }, [x, y, text]);

    return (
        <div
            ref={ref}
            role="tooltip"
            aria-live="polite"
            className="fixed z-[100] px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl border border-slate-600 pointer-events-none animate-in fade-in zoom-in-95 duration-200 max-w-[250px] text-center"
            style={{
                left: x,
                top: y,
                transform: `translateX(calc(-50% + ${position.offsetX}px)) ${
                    position.flipped ? 'translateY(8px)' : 'translateY(calc(-100% - 8px))'
                }`,
                visibility: position.ready ? 'visible' : 'hidden'
            }}
        >
            {text}
            <div
                className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
                    position.flipped
                        ? 'bottom-full border-b-slate-800'
                        : 'top-full border-t-slate-800'
                }`}
                style={{
                    left: `calc(50% - ${position.offsetX}px)`
                }}
            />
        </div>
    );
};
