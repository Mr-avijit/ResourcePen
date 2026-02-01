
export const DesignTokens = {
  global: {
    color: {
      primary: "#0284c7",
      secondary: "#06b6d4",
      black: "#000000",
      white: "#FFFFFF",
      zinc: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
        950: "#09090b"
      }
    },
    // Fix: Added space tokens to satisfy components using DesignTokens.global.space
    space: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem"
    },
    radius: {
      card: "2.5rem",
      button: "1rem",
      inner: "0.75rem"
    },
    typography: {
      family: {
        display: "'Plus Jakarta Sans', sans-serif",
        sans: "'Inter', sans-serif"
      },
      // Fix: Added size tokens to satisfy components using DesignTokens.global.typography.size
      size: {
        xs: "0.75rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "4xl": "2.25rem",
        "6xl": "3.75rem"
      }
    }
  },
  // Fix: Added themes tokens to satisfy components using DesignTokens.themes
  themes: {
    light: {
      surface: {
        primary: "#FFFFFF",
        secondary: "#F8FAFC",
        tertiary: "#F1F5F9"
      }
    },
    dark: {
      surface: {
        primary: "#000000",
        secondary: "#09090B",
        tertiary: "#18181B"
      }
    },
    pure: {
      surface: {
        primary: "#000000",
        secondary: "#000000",
        tertiary: "#000000"
      }
    }
  }
};
