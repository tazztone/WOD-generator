

// TODO: Add loading/spinner state variant for async actions
// TODO: Add disabled state styling
// TODO: Consider adding aria-busy and aria-disabled attributes
const VARIANTS = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]",
    secondary: "bg-slate-800 border border-slate-700 hover:border-emerald-500 text-slate-200 group",
    ghost: "text-slate-500 hover:text-white hover:bg-slate-800",
    danger: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
    icon: "p-2 rounded-full hover:bg-slate-800 text-slate-400"
};

const SIZES = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-4 text-lg uppercase tracking-wider font-black",
    icon: "p-2"
};

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = "",
    onClick,
    fullWidth = false,
    ...props
}) => {
    const baseClass = "rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2";
    const variantClass = VARIANTS[variant] || VARIANTS.primary;
    const sizeClass = SIZES[size] || SIZES.md;
    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};
