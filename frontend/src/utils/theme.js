// frontend/src/utils/theme.js — Light Premium Design System
import { createTheme } from '@mui/material';

// ─── Brand Palette ───────────────────────────────────────────
const MC = {
  red:           '#D32F2F',
  redBright:     '#EF4444',
  redDark:       '#B71C1C',
  redLight:      '#FFEBEE',
  redTint:       '#FFF5F5',
  charcoal:      '#111827',
  textDark:      '#1F2937',
  textBody:      '#374151',
  textMuted:     '#6B7280',
  textLight:     '#9CA3AF',
  bgWhite:       '#FFFFFF',
  bgLight:       '#F8F9FB',
  bgAlt:         '#F3F4F6',
  border:        '#E5E7EB',
  borderLight:   '#F3F4F6',
  shadow:        '0 4px 20px rgba(0,0,0,0.08)',
  shadowLg:      '0 12px 40px rgba(0,0,0,0.12)',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: MC.red,    light: MC.redBright, dark: MC.redDark,   contrastText: '#fff' },
    secondary: { main: '#374151', light: '#6B7280',    dark: '#111827',    contrastText: '#fff' },
    error:     { main: MC.redBright },
    warning:   { main: '#F59E0B' },
    info:      { main: '#2563EB' },
    success:   { main: '#059669' },
    background: {
      default: MC.bgLight,
      paper:   MC.bgWhite,
    },
    text: {
      primary:   MC.textDark,
      secondary: MC.textMuted,
      disabled:  MC.textLight,
    },
    divider: MC.border,
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 1.05,
      color: MC.charcoal,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
      color: MC.charcoal,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: MC.charcoal,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.015em',
      color: MC.charcoal,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      color: MC.charcoal,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      color: MC.charcoal,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      lineHeight: 1.75,
      color: MC.textBody,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      lineHeight: 1.65,
      color: MC.textMuted,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.08em',
    },
    overline: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      letterSpacing: '0.14em',
      fontSize: '0.7rem',
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    // ── Button ───────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 700,
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-2px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedPrimary: {
          background: MC.red,
          boxShadow: '0 4px 16px rgba(211,47,47,0.25)',
          '&:hover': {
            background: MC.redDark,
            boxShadow: '0 8px 24px rgba(211,47,47,0.35)',
          },
        },
        outlinedPrimary: {
          borderColor: MC.red,
          color: MC.red,
          '&:hover': {
            background: MC.redLight,
            borderColor: MC.redDark,
          },
        },
        textPrimary: {
          color: MC.red,
          '&:hover': { background: MC.redLight },
        },
      },
    },

    // ── AppBar ───────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          backdropFilter: 'none',
          borderBottom: `1px solid ${MC.border}`,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          color: MC.textDark,
        },
      },
    },

    // ── Paper ────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          background: MC.bgWhite,
          backgroundImage: 'none',
          border: `1px solid ${MC.border}`,
          borderRadius: '14px',
          boxShadow: MC.shadow,
        },
        elevation0: { boxShadow: 'none', border: 'none' },
      },
    },

    // ── Card ─────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          background: MC.bgWhite,
          backgroundImage: 'none',
          border: `1px solid ${MC.border}`,
          borderRadius: '14px',
          boxShadow: MC.shadow,
          transition: 'all 0.22s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: MC.shadowLg,
          },
        },
      },
    },

    // ── TextField ────────────────────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            background: '#FAFAFA',
            '& fieldset': { borderColor: MC.border },
            '&:hover fieldset': { borderColor: '#9CA3AF' },
            '&.Mui-focused fieldset': {
              borderColor: MC.red,
              boxShadow: `0 0 0 3px rgba(211,47,47,0.1)`,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: MC.red },
          '& .MuiOutlinedInput-input': { color: MC.textDark },
        },
      },
    },

    // ── Select ───────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: '10px' },
      },
    },

    // ── Chip ─────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.8rem',
        },
        colorPrimary: {
          background: MC.redLight,
          color: MC.red,
          border: `1px solid rgba(211,47,47,0.2)`,
        },
      },
    },

    // ── Stepper ──────────────────────────────────────────────
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          color: MC.textMuted,
          '&.Mui-active': { color: MC.textDark, fontWeight: 700 },
          '&.Mui-completed': { color: MC.red },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: MC.border,
          '&.Mui-active': { color: MC.red },
          '&.Mui-completed': { color: MC.red },
        },
        text: { fill: MC.textMuted },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: { borderColor: MC.border },
      },
    },

    // ── Divider ──────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: MC.border },
      },
    },

    // ── Tab ──────────────────────────────────────────────────
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          '&.Mui-selected': { color: MC.red },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: MC.red },
      },
    },

    // ── Alert ────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontFamily: '"Inter", sans-serif',
        },
      },
    },

    // ── Dialog ───────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '18px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.15)',
        },
      },
    },

    // ── CssBaseline ──────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#FFFFFF',
          color: MC.textBody,
        },
      },
    },
  },
});

// ─── Helper Exports ──────────────────────────────────────────
export const MC_COLORS = MC;

export const redGradientText = {
  background: `linear-gradient(135deg, ${MC.red} 0%, #F97316 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

export const gradientText = redGradientText;

// ─── Background Keyframes (for GlobalStyles) ──────────────────
export const backgroundKeyframes = {
  '@keyframes pulse': {
    '0%, 100%': { opacity: 0.5, transform: 'scale(0.97)' },
    '50%':      { opacity: 0.8, transform: 'scale(1.03)' },
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%':      { transform: 'translateY(-10px)' },
  },
};

// ─── Mock Data (content locked — do not edit) ─────────────────
export const mockData = {
  navItems: ['Home', 'Services', 'About', 'Contact'],

  features: [
    {
      title: 'Smart Scheduling',
      description: 'AI-powered booking system that finds the perfect slot for your needs.',
    },
    {
      title: 'Real-time Updates',
      description: 'Live notifications and progress tracking throughout your service.',
    },
    {
      title: 'Digital Records',
      description: 'Complete service history accessible anytime, anywhere.',
    },
    {
      title: 'Smart Diagnostics',
      description: 'Advanced tools ensure accurate diagnosis and efficient repairs.',
    },
    {
      title: 'Live Queue Update',
      description: 'Real-time progress tracking so you never miss your turn.',
    },
  ],

  processSteps: [
    {
      title: 'Book Your Service',
      desc: 'Select your service type and preferred time slot through our intelligent booking system.',
    },
    {
      title: 'Smart Drop-off',
      desc: 'Quick vehicle inspection and digital check-in at our modern Imaduwa facility.',
    },
    {
      title: 'Real-time Tracking',
      desc: 'Monitor progress with live updates and collect when ready.',
    },
  ],

  stats: [
    { label: 'Happy Customers',    value: '5,000+' },
    { label: 'Services Completed', value: '15,000+' },
    { label: 'Average Rating',     value: '4.9/5' },
    { label: 'Response Time',      value: '<2hrs' },
  ],
};