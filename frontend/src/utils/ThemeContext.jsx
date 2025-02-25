import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getDashboardTheme } from './dashboardTheme';

const ThemeContext = createContext();

export const DashboardThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        return localStorage.getItem('dashboardTheme') || 'light';
    });

    const theme = useMemo(() => getDashboardTheme(mode), [mode]);

    useEffect(() => {
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            if (mode === 'dark') {
                dashboardContainer.setAttribute('data-theme', 'dark');
            } else {
                dashboardContainer.removeAttribute('data-theme');
            }
        }
    }, [mode]);

    const toggleTheme = () => {
        setMode((prev) => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('dashboardTheme', newMode);
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode, theme }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useDashboardTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useDashboardTheme must be used within a DashboardThemeProvider');
    }
    return context;
};