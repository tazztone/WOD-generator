

export const Card = ({ children, className = "", noPadding = false }) => {
    return (
        <div className={`bg-slate-800/50 rounded-xl border border-slate-700 ${noPadding ? '' : 'p-4'} ${className}`}>
            {children}
        </div>
    );
};
