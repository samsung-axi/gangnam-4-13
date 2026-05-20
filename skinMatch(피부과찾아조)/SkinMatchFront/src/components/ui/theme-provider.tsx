import * as React from "react";
import { createContext, useContext } from "react";

// Professional theme configuration based on dermatology design system
export interface ThemeConfig {
  siteName: string;
  description: string;
  
  // Professional spacing scale
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
  };

  // Professional typography system
  typography: {
    fontFamily: {
      primary: string;
      fallback: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
    };
    fontWeights: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeights: {
      tight: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
  };

  // Professional layout system
  layout: {
    header: {
      height: string;
      position: string;
      zIndex: string;
    };
    sections: {
      hero: {
        paddingTop: string;
        paddingBottom: string;
      };
      default: {
        paddingTop: string;
        paddingBottom: string;
      };
    };
    container: {
      maxWidth: string;
      margin: string;
      padding: string;
    };
  };

  // Professional border radius
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    full: string;
  };

  // Professional animations
  animations: {
    transition: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      ease: string;
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };

  // Professional breakpoints
  breakpoints: {
    mobile: string;
    tablet: string;
    laptop: string;
    desktop: string;
    wide: string;
  };
}

// Default professional dermatology theme configuration
const defaultThemeConfig: ThemeConfig = {
  siteName: "SkinMatch",
  description: "Professional skin analysis and dermatology consultation platform",
  
  spacing: {
    xs: "8px",
    sm: "12px", 
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
    "6xl": "160px",
  },

  typography: {
    fontFamily: {
      primary: '"Inter Variable", "SF Pro Display", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      fallback: "system-ui, sans-serif",
    },
    fontSizes: {
      xs: "12px",
      sm: "13px",
      base: "16px", 
      lg: "21px",
      xl: "24px",
      "2xl": "32px",
      "3xl": "48px",
      "4xl": "56px",
    },
    fontWeights: {
      normal: "400",
      medium: "510",
      semibold: "538", 
      bold: "600",
    },
    lineHeights: {
      tight: "1.1",
      normal: "1.33",
      relaxed: "1.5",
      loose: "1.75",
    },
  },

  layout: {
    header: {
      height: "65px",
      position: "fixed",
      zIndex: "100",
    },
    sections: {
      hero: {
        paddingTop: "72px",
        paddingBottom: "128px",
      },
      default: {
        paddingTop: "80px",
        paddingBottom: "80px",
      },
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
    },
  },

  borderRadius: {
    none: "0px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    "2xl": "24px",
    full: "9999px",
  },

  animations: {
    transition: {
      fast: "150ms ease",
      normal: "300ms ease",
      slow: "500ms ease",
    },
    easing: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },

  breakpoints: {
    mobile: "640px",
    tablet: "768px", 
    laptop: "1024px",
    desktop: "1280px",
    wide: "1536px",
  },
};

const ThemeContext = createContext<ThemeConfig | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  config?: Partial<ThemeConfig>;
}

export function ThemeProvider({ children, config }: ThemeProviderProps) {
  const themeConfig = React.useMemo(() => ({
    ...defaultThemeConfig,
    ...config,
  }), [config]);

  return (
    <ThemeContext.Provider value={themeConfig}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { defaultThemeConfig };