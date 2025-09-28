import { alpha } from "@mui/material";
import { theme } from "../../utils/theme";

export const backgroundStyles = {
  mainContainer: {
    minHeight: '100vh',
    background: theme.palette.background.default,
    pt: 10,
    pb: 6,
  },
  backgroundEffects: {
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  },
  gradient: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(180deg, 
      ${theme.palette.background.default} 0%, 
      #141922 50%,
      ${theme.palette.background.default} 100%
    )`,
  },
  floatingOrb: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
    filter: 'blur(60px)',
    animation: 'float 8s ease-in-out infinite',
  }
};