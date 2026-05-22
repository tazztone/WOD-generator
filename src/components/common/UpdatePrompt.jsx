import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisterError(error) {
            console.error('SW registration error', error);
        },
    });

    if (!needRefresh) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl z-50 flex flex-col gap-3 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-white font-bold text-sm">Update Available</h3>
                    <p className="text-slate-400 text-xs mt-1">A new version of the app is ready.</p>
                </div>
                <button 
                    onClick={() => setNeedRefresh(false)}
                    className="text-slate-500 hover:text-white"
                >
                    ✕
                </button>
            </div>
            <button
                onClick={() => updateServiceWorker(true)}
                className="w-full bg-neon-blue text-black font-bold py-2 rounded text-sm hover:bg-blue-400 transition-colors"
            >
                Reload to Update
            </button>
        </div>
    );
}
