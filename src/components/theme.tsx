import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import BackgroundMonoDark from "../assets/background_dark_mono.jpg";
import BackgroundMonoLight from "../assets/background_light_mono.jpg";
export const CONTENT_WIDTH = "500px";
export const QAM_WIDTH = "300px";

import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";
import MonoDark from "../assets/mono_dark.svg";
import MonoLight from "../assets/mono_light.svg";
import Manjaro from "../assets/distro/manjaro.svg";
import Bazzite from "../assets/distro/bazzite.svg";
import { useColorMode, Img, Flex } from "@chakra-ui/react";
import { selectCurrentTheme } from "../model/slice";
import { useSelector } from "react-redux";

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

// Use the following to generate swatches
// https://themera.vercel.app
// https://smart-swatch.netlify.app

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
  gray: {
    "50": "#F5F2EF",
    "100": "#E3DBD3",
    "200": "#D1C3B7",
    "300": "#BFAC9B",
    "400": "#AD957F",
    "500": "#7C6450",
    "600": "#645141",
    "700": "#1d1916",
    "800": "#1d1916",
    "900": "#1d1916",
  },
});

export default theme;

export const distroThemes: Record<string, any> = {
  vapor: createTheme({
    brand: {
      "50": "#E7F5FD",
      "100": "#66c0f4",
      "200": "#66c0f4",
      "300": "#66c0f4",
      "400": "#66c0f4",
      "500": "#119DEE",
      "600": "#0E7EBE",
      "700": "#0A5E8F",
      "800": "#073F5F",
      "900": "#031F30",
    },
    gray: {
      "50": "#F0F1F5",
      "100": "#D5D9E2",
      "200": "#BAC0CF",
      "300": "#9FA8BC",
      "400": "#2d404d",
      "500": "#2d404d",
      "600": "#2d404d",
      "700": "#171a21",
      "800": "#171a21",
      "900": "#171a21",
    },
  }),
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
  blood_orange: createTheme({
    brand: {
      "50": "#FDECE7",
      "100": "#f06429",
      "200": "#f06429",
      "300": "#f06429",
      "400": "#f06429",
      "500": "#f06429",
      "600": "#8F270A",
      "700": "#8F270A",
      "800": "#5F1A07",
      "900": "#300D03",
    },
    gray: {
      "50": "#fde8de",
      "100": "#fde8de",
      "200": "#f06226",
      "300": "#ef5514",
      "400": "#e14d0f",
      "500": "#742807",
      "600": "#4f1b05",
      "700": "#030100",
      "800": "#030100",
      "900": "#030100",
    },
  }),
  red_gold: createTheme({
    brand: {
      "50": "#FDECE7",
      "100": "#FDAA31",
      "200": "#FDAA31",
      "300": "#FDAA31",
      "400": "#FDAA31",
      "500": "#FDAA31",
      "600": "#f19002",
      "700": "#f19002",
      "800": "#905601",
      "900": "#905601",
    },
    gray: {
      "50": "#fce0dd",
      "100": "#fce0dd",
      "200": "#f38c84",
      "300": "#f38c84",
      "400": "#c72013",
      "500": "#b51d11",
      "600": "#a31a10",
      "700": "#7f140c",
      "800": "#080100",
      "900": "#080100",
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
      "700": "#6d49b6",
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
      "700": "#0e0b3c",
      "800": "#0e0b3c",
      "900": "#0e0b3c",
    },
  }),
  ocean: createTheme({
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
    gray: {
      "50": "#E9F0FB",
      "100": "#C3D4F4",
      "200": "#9CB8ED",
      "300": "#759CE6",
      "400": "#4E80DF",
      "500": "#2764D8",
      "600": "#1F50AD",
      "700": "#183C81",
      "800": "#102856",
      "900": "#08142B",
    },
  }),
};

export const cleanDistroName = (distro: string | null) => {
  return distro ? distro.replace("_ba", "") : null;
};

export const getDistroTheme = (distro: string | null) => {
  let main = theme;
  let controller = controllerTheme;
  distro = cleanDistroName(distro);

  if (distro && distroThemes[distro]) {
    main = distroThemes[distro].theme;
    controller = distroThemes[distro].controllerTheme;
  }

  return { theme: main, controllerTheme: controller };
};

export const getScrollbarStyle = (distro: string | null, colorMode: string) => {
  let colors;
  distro = cleanDistroName(distro);

  switch (distro) {
    case "vapor":
      colors = ["#66c0f4", "#171a2130"];
      break;
    case "manjaro":
      colors = ["#438959", "#19251d30"];
      break;
    case "bazzite":
      colors = ["#6d49b6", "#0e0b3c30"];
      break;
    case "ocean":
      colors = ["#E4BC1B", "#183C8130"];
      break;
    case "blood_orange":
      colors = ["#f06429", "#1d191630"];
      break;
    case "red_gold":
      colors = ["#FDAA31", "#1d191630"];
      break;
    default:
      colors = ["#B69616", "#1d191630"];
      break;
  }

  if (colorMode === "light") {
    colors[1] = "#dddddd60";
  }

  return {
    css: {
      scrollbarColor: `${colors[0]} ${colors[1]}`,
    },
  };
};

export const getBackground = (colorMode: string, theme: string | null) => {
  theme = cleanDistroName(theme);

  switch (theme) {
    // Rotation is target color hue -50
    case "vapor":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(0.4) hue-rotate(155deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.3) hue-rotate(145deg)",
        };
      }
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
    case "red_gold":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(3) hue-rotate(315deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.5) saturate(0.2) hue-rotate(315deg)",
        };
      }
    case "blood_orange":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(0.4) hue-rotate(320deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.5) saturate(0.2) hue-rotate(320deg)",
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
    case "ocean":
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(1) saturate(4) hue-rotate(180deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
          filter: "sepia(0.5) saturate(2.3) hue-rotate(180deg)",
        };
      }

    default:
      if (colorMode === "dark") {
        return {
          bgImage: BackgroundMonoDark,
          filter: "sepia(0.4) saturate(0.5) hue-rotate(335deg)",
        };
      } else {
        return {
          bgImage: BackgroundMonoLight,
        };
      }
  }
};

export const Logo = ({ height, width, qam }: any) => {
  const { colorMode } = useColorMode();
  const theme = useSelector(selectCurrentTheme);
  const clean = cleanDistroName(theme);

  switch (clean) {
    case "vapor":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter="sepia(1) saturate(2.5) hue-rotate(145deg)"
        />
      );

    case "ocean":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter="sepia(1) saturate(2.5) hue-rotate(10deg)"
        />
      );

    case "manjaro":
      return (
        <Flex direction="row" alignItems="center">
          <Img src={Manjaro} height={height} />
          {!qam && (
            <Img
              src={colorMode == "dark" ? MonoDark : MonoLight}
              marginLeft="0.8rem"
              height={height}
              filter="sepia(1) saturate(2.5) hue-rotate(85deg)"
            />
          )}
        </Flex>
      );
    case "bazzite":
      return (
        <Flex direction="row" alignItems="center">
          <Img src={Bazzite} height={height} />
          {!qam && (
            <Img
              src={colorMode == "dark" ? MonoDark : MonoLight}
              marginLeft="0.8rem"
              height={height}
              filter="sepia(1) saturate(2.5) hue-rotate(210deg)"
            />
          )}
        </Flex>
      );
    case "blood_orange":
      return (
        <Flex direction="row" alignItems="center">
          {theme?.includes("_ba") && (
            <Img
              src={Bazzite}
              height={height}
              filter={
                colorMode == "dark"
                  ? "sepia(1) saturate(4.5) hue-rotate(320deg)"
                  : "sepia(1) saturate(4) hue-rotate(320deg)"
              }
            />
          )}
          {(!qam || !theme?.includes("_ba")) && (
            <Img
              src={colorMode == "dark" ? MonoDark : MonoLight}
              marginLeft="0.8rem"
              height={height}
              filter={
                colorMode == "dark"
                  ? "sepia(0.8) saturate(4) hue-rotate(338deg)"
                  : "sepia(1) saturate(2) hue-rotate(320deg)"
              }
            />
          )}
        </Flex>
      );
    case "red_gold":
      return (
        <Flex direction="row" alignItems="center">
          {theme?.includes("_ba") && (
            <Img
              src={Bazzite}
              height={height}
              filter={
                colorMode == "dark"
                  ? "sepia(1) saturate(5) hue-rotate(350deg)"
                  : "sepia(1) saturate(4) hue-rotate(330deg)"
              }
            />
          )}
          {(!qam || !theme?.includes("_ba")) && (
            <Img
              src={colorMode == "dark" ? MonoDark : MonoLight}
              marginLeft="0.8rem"
              height={height}
              filter={
                colorMode == "dark"
                  ? "sepia(0.8) saturate(6) hue-rotate(360deg)"
                  : "sepia(1) saturate(2) hue-rotate(360deg)"
              }
            />
          )}
        </Flex>
      );
  }

  return (
    <Img
      src={colorMode == "dark" ? LogoDark : LogoLight}
      height={height}
      width={width}
    />
  );
};
