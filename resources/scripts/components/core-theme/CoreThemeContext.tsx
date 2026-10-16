import React, { createContext, useState, useEffect, useContext } from 'react';

const CoreThemeContext = createContext();

export const CoreThemeProvider = ({ children }) => {
    const [panelName, setPanelName] = useState(localStorage.getItem('core_panelName') || 'Core Panel');
    const [logoUrl, setLogoUrl] = useState(localStorage.getItem('core_logoUrl') || '');
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('core_primaryColor') || '#6366f1');
    const [bgImage, setBgImage] = useState(localStorage.getItem('core_bgImage') || '');
    const [snowEffect, setSnowEffect] = useState(localStorage.getItem('core_snowEffect') === 'true');

    useEffect(() => {
        document.documentElement.style.setProperty('--core-primary', primaryColor);
        if (bgImage) {
            document.body.style.backgroundImage = `url(${bgImage})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
        }
        localStorage.setItem('core_panelName', panelName);
        localStorage.setItem('core_logoUrl', logoUrl);
        localStorage.setItem('core_primaryColor', primaryColor);
        localStorage.setItem('core_bgImage', bgImage);
        localStorage.setItem('core_snowEffect', snowEffect);
    }, [panelName, logoUrl, primaryColor, bgImage, snowEffect]);

    return (
        <CoreThemeContext.Provider value={{ 
            panelName, setPanelName, logoUrl, setLogoUrl, 
            primaryColor, setPrimaryColor, bgImage, setBgImage, 
            snowEffect, setSnowEffect 
        }}>
            {children}
        </CoreThemeContext.Provider>
    );
};

export const useCoreTheme = () => useContext(CoreThemeContext);
