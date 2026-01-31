import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// TODO: Replace confirm dialog with a more polished in-app notification/banner for update prompts
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm("New update available. Reload?")) {
            updateSW(true);
        }
    },
});

import { ErrorBoundary } from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
