import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import BackgroundDark from "../assets/background_dark.jpg";
import BackgroundLight from "../assets/background_light.jpg";
import BackgroundMonoDark from "../assets/background_dark_mono.jpg";
import BackgroundMonoLight from "../assets/background_light_mono.jpg";
export const CONTENT_WIDTH = "500px";
export const QAM_WIDTH = "300px";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const createTheme = (colors: any) => {
  const theme = extendTheme(
    {
      config,
      colors: colors,
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
});

export default theme;

export const distroThemes: Record<string, any> = {
  manjaro: createTheme({
    brand: {
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
    },
    gray: {
      "50": "#EEF7F1",
      "100": "#CFE8D7",
      "200": "#B0D9BD",
      "300": "#91CAA3",
      "400": "#72BB8A",
      "500": "#54AB70",
      "600": "#438959",
      "700": "#19251d",
      "800": "#19251d",
      "900": "#112216",
    },
  }),
  bazzite: createTheme({
    brand: {
      "50": "#EBE8FD",
      "100": "#816BF0",
      "200": "#816BF0",
      "300": "#816BF0",
      "400": "#5E42EB",
      "500": "#3A18E7",
      "600": "#2F13B9",
      "700": "#230F8A",
      "800": "#170A5C",
      "900": "#0C052E",
    },
    gray: {
      "50": "#ECE6FE",
      "100": "#C9BAFC",
      "200": "#A68EFB",
      "300": "#8362F9",
      "400": "#4a25cf",
      "500": "#4a25cf",
      "600": "#3e1fad",
      "700": "#0C0231",
      "800": "#0C0231",
      "900": "#0C0231",
    },
  }),
};

export const getScrollbarStyle = (distro: string | null) => {
  let colors = "#333e52 #1a202c";

  switch (distro) {
    case "manjaro":
      colors = "#438959 #19251d";
  }

  return {
    css: { scrollbarColor: colors },
  };
};

export const getBackground = (colorMode: string, distro: string | null) => {
  switch (distro) {
    case "manjaro":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(0.7) hue-rotate(85deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.3) hue-rotate(85deg)",
        };
      }
    case "bazzite":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(4) hue-rotate(200deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.5) saturate(1) hue-rotate(202deg)",
        };
      }
  }

  return {
    bgImage: colorMode == "dark" ? BackgroundDark : BackgroundLight,
  };
};
