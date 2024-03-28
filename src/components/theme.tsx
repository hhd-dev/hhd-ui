import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
export const CONTENT_WIDTH = "500px";
export const QAM_WIDTH = "300px";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const createTheme = (brand: any) => {
  const theme = extendTheme(
    {
      config,
      colors: {
        brand: brand,
      },
      styles: {
        global: {
          body: {
            bg: "transparent",
            overflow: "hidden",
            // color: "transparent",
          },
        },
      },
      shadows: {
        outline: "0 0 0 3px var(--chakra-colors-brand-700)",
      },
    },
    withDefaultColorScheme({ colorScheme: "brand" })
  );

  const controllerTheme = extendTheme(theme, {
    styles: {
      global: {
        body: {
          userSelect: "none",
        },
        ":focus": {
          // remove ugly focus outline on modal
          outline: "0 !important",
          // boxShadow: "0 0 0 0 rgba(0, 0, 0, 0) !important",
        },
      },
    },
    shadows: {
      outline: 0,
    },
  });

  return { theme, controllerTheme };
};

export const { theme, controllerTheme } = createTheme({
  "50": "#E4BC1B",
  "100": "#E4BC1B",
  "200": "#E4BC1B",
  "300": "#E4BC1B",
  "400": "#E4BC1B",
  "500": "#E4BC1B",
  "600": "#B69616",
  "700": "#897110",
  "800": "#5B4B0B",
  "900": "#2E2605",
});

export default theme;

export const distroThemes: Record<string, any> = {
  manjaro: createTheme({
    "50": "#35bf5c",
    "100": "#35bf5c",
    "200": "#35bf5c",
    "300": "#35bf5c",
    "400": "#35bf5c",
    "500": "#35bf5c",
    "600": "#31b055",
    "700": "#289146",
    "800": "#24823e",
    "900": "#0f3519",
  }),
};
