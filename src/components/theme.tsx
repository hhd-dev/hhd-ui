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

const theme = extendTheme(
  {
    config,
    colors: {
      brand: {
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
      },
    },
    styles: {
      global: {
        // styles for the `body`
        body: {
          bg: "transparent",
          overflow: "hidden",
          // color: "transparent",
        },
        ":focus": {
          // remove ugly focus outline on modal
          outline: "0 !important",
          // boxShadow: "0 0 0 0 rgba(0, 0, 0, 0) !important",
        },
      },
    },
    shadows: {
      outline: "0 0 0 3px var(--chakra-colors-brand-500)",
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default theme;
