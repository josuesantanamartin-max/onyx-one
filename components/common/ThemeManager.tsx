import React, { useEffect } from 'react';
import { useUserStore } from '../../store/useUserStore';

const ThemeManager: React.FC = () => {
    const { theme } = useUserStore();

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme class/attribute
        root.removeAttribute('data-theme');
        root.classList.remove('dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            if (systemTheme === 'dark') {
                root.setAttribute('data-theme', 'dark');
                root.classList.add('dark');
            }
        } else if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
        } else {
            // Light mode is default, do nothing (or explicitly set light if needed)
            root.setAttribute('data-theme', 'light');
        }
    }, [theme]);

    return null;
};

export default ThemeManager;
