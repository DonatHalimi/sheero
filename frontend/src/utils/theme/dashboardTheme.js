import { createTheme } from '@mui/material/styles';

const colors = {
    light: {
        primaryMain: '#5b504b',
        secondaryMain: '#83776B',
        backgroundDefault: '#FFFFFF',
        backgroundPaper: '#FFFFFF',
        textPrimary: '#5c504b',
        textSecondary: '#5F5F5F',
        iconMain: '#5b504b',
        borderDefault: '#e0e0e0',
        buttonMain: '#5b504b',
        buttonDisabled: '#e0e0e0',
        buttonHover: '#5B504B',
        buttonText: '#FFFFFF',
        scrollbarThumb: '#CACFCD',
        scrollbarThumbHover: '#acb2b0',
        scrollbarTrack: '#F8F9FA',
        scrollbarCorner: '#FFFFFF',
        outlinedInputBorderHover: '#7c7164',
    },
    dark: {
        primaryMain: '#b7b7b7',
        secondaryMain: '#B5A79A',
        backgroundDefault: '#292929',
        backgroundPaper: '#292929',
        textPrimary: '#FFFFFF',
        textSecondary: '#B0B0B0',
        iconMain: '#FFFFFF',
        borderDefault: '#393939',
        buttonMain: '#545454',
        buttonDisabled: '#393939',
        buttonHover: '#5e5d5d',
        buttonText: '#e0dede',
        scrollbarThumb: '#4A4A4A',
        scrollbarThumbHover: '#6A6A6A',
        scrollbarTrack: '#2D2D2D',
        scrollbarCorner: '#1E1E1E',
        outlinedInputBorderHover: '#FFFFFF',
    },
};

export const getDashboardTheme = (mode) => {
    const c = colors[mode];
    return createTheme({
        typography: {
            fontFamily: 'Outfit, sans-serif',
            h1: { fontWeight: 700, fontSize: '2.125rem' },
            h2: { fontWeight: 700, fontSize: '1.5rem' },
            body1: { fontWeight: 400, fontSize: '1rem' },
            button: { fontWeight: 600, fontSize: '0.875rem', textTransform: 'none' },
        },
        palette: {
            mode,
            primary: { main: c.primaryMain },
            secondary: { main: c.secondaryMain },
            background: { default: c.backgroundDefault, paper: c.backgroundPaper },
            text: { primary: c.textPrimary, secondary: c.textSecondary },
            icon: { main: c.iconMain },
            border: { default: c.borderDefault },
            button: {
                main: c.buttonMain,
                disabled: c.buttonDisabled,
                hover: c.buttonHover,
                text: c.buttonText,
            },
            scrollbar: {
                thumb: c.scrollbarThumb,
                thumbHover: c.scrollbarThumbHover,
                track: c.scrollbarTrack,
                corner: c.scrollbarCorner,
            },
        },
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: c.outlinedInputBorderHover,
                        },
                    },
                },
            },
        },
    });
};