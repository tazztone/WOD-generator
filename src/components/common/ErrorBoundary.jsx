import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 text-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-red-500/10 p-4 rounded-full mb-6 animate-bounce">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase italic mb-2">Something went wrong</h1>
                    <p className="text-slate-400 mb-8 max-w-sm">We encountered an unexpected error. Don't worry, your settings should be safe.</p>

                    <div className="w-full max-w-xs space-y-3">
                        <Button onClick={this.handleReload} fullWidth size="lg">
                            <RefreshCw size={20} className="mr-2" /> Reload App
                        </Button>
                        <Button
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                            variant="danger"
                            size="sm"
                            fullWidth
                        >
                            Hard Reset (Clear Data)
                        </Button>
                    </div>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-8 p-4 bg-slate-900 rounded-lg text-left w-full overflow-auto max-h-48 border border-slate-800">
                            <code className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </code>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
