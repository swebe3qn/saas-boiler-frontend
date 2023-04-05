import { createTheme } from "@mui/material";



declare module '@mui/material' {
  interface Palette {
    dark: Palette['primary'];
  }

  interface PaletteOptions {
    dark?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    dark: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    dark: true;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#00e6a1'
    },
    secondary: {
      main: '#F0F4FB'
    },
    dark: {
      main: '#141F27',
      contrastText: '#fff'
    },
  },
  typography: {
    fontFamily: ['Proxima Regular', 'Helvetica', 'sans-serif'].join(',')
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          fontFamily: 'Proxima Bold'
        },
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '.9rem',
          backgroundColor: '#141F27'
        }
      }
    },
  }
});