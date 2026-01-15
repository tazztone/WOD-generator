

// TODO: Add edge detection to flip tooltip when near viewport edges
// TODO: Add proper ARIA attributes for screen reader support
export const Tooltip = ({ x, y, text }) => {
    return (
        <div
            className="fixed z-[100] px-3 py-2 bg-slate-800 text-xs text-slate-200 rounded-lg shadow-xl border border-slate-600 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 animate-in fade-in zoom-in-95 duration-200 max-w-[250px] text-center"
            style={{ left: x, top: y }}
        >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
    );
};
