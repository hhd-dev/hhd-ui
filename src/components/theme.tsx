import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools';
export const CONTENT_WIDTH = "500px";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme(
  { config },
  {
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
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default theme;
