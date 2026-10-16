import { useEffect } from 'react';
import { useCoreTheme } from './CoreThemeContext';

export default () => {
    const { snowEffect } = useCoreTheme();

    useEffect(() => {
        if (!snowEffect) return;
        const container = document.createElement('div');
        document.body.appendChild(container);

        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            flake.innerHTML = '❄';
            flake.style.position = 'fixed';
            flake.style.top = '-10px';
            flake.style.color = '#fff';
            flake.style.pointerEvents = 'none';
            flake.style.zIndex = '9999';
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
            container.appendChild(flake);
        }
        return () => { document.body.removeChild(container); };
    }, [snowEffect]);

    return null;
};
