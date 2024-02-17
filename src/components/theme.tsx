import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

export const CONTENT_WIDTH = "500px";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme({ config });

export default theme;
