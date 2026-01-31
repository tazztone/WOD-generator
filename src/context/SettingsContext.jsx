import { createContext, useContext, useState, useEffect } from 'react';
import { loadConfig, saveConfig } from '../engine/storage';
import { setGlobalVolume } from '../engine/audio';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [lang, setLang] = useState('en');
    const [config, setConfig] = useState(loadConfig());
    const [tooltip, setTooltip] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Save Config Changes & Update Audio
    useEffect(() => {
        saveConfig(config);
        if (config.volume !== undefined) {
            setGlobalVolume(config.volume);
        }
    }, [config]);

    const toggleLang = () => setLang(l => l === 'en' ? 'de' : 'en');

    const handleTooltip = (e, text) => {
        if (!text) return;
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text });
    };

    const clearTooltip = () => setTooltip(null);

    const value = {
        lang,
        setLang,
        toggleLang,
        config,
        setConfig,
        tooltip,
        handleTooltip,
        clearTooltip,
        modalOpen,
        setModalOpen
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};
