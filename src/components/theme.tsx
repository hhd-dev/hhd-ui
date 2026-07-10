import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
import BackgroundMonoDark from "../assets/background_dark_mono.jpg";
import BackgroundMonoLight from "../assets/background_light_mono.jpg";
import BackgroundAnataseDark from "../assets/background_anatase_dark.png";
import BackgroundAnataseLight from "../assets/background_anatase_light.png";
export const CONTENT_WIDTH = "500px";
export const QAM_WIDTH = "300px";

import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";
import MonoDark from "../assets/mono_dark.svg";
import MonoLight from "../assets/mono_light.svg";
import AnataseDark from "../assets/distro/anatase_dark.svg";
import AnataseLight from "../assets/distro/anatase_light.svg";
import { useColorMode, Img } from "@chakra-ui/react";
import { selectCurrentDistro, selectCurrentTheme } from "../model/slice";
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
  anatase: createTheme({
    brand: {
      "50": "#f4e451",
      "100": "#ead94b",
      "200": "#dfcd40",
      "300": "#d5c137",
      "400": "#cfb831",
      "500": "#cfb831",
      "600": "#bea628",
      "700": "#9e8a30",
      "800": "#605320",
      "900": "#322b12",
    },
    gray: {
      "50": "#f2f2f2",
      "100": "#e3e3e3",
      "200": "#c7c7c7",
      "300": "#ababab",
      "400": "#5e5e5e",
      "500": "#474747",
      "600": "#303030",
      "700": "#1f1f1f",
      "800": "#161818",
      "900": "#0e0e0f",
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
  return distro?.endsWith("_an") ? distro.slice(0, -3) : distro;
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
    case "anatase":
      colors = ["#f8dd0b", "#22232330"];
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

const getThemeBackground = (colorMode: string, theme: string | null) => {
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
    case "anatase":
      return {
        bgImage:
          colorMode === "dark"
            ? BackgroundAnataseDark
            : BackgroundAnataseLight,
      };
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

export const getBackground = (
  colorMode: string,
  theme: string | null,
  distro: string | null = theme
) => {
  const selected = getThemeBackground(colorMode, theme);
  const anatase = distro === "anatase" || distro?.endsWith("_an");

  if (!anatase || cleanDistroName(theme) === "anatase") return selected;

  const branded = getThemeBackground(colorMode, "anatase");
  return "filter" in selected
    ? { ...branded, filter: selected.filter }
    : branded;
};

const getLogoFilter = (theme: string | null, colorMode: string) => {
  switch (cleanDistroName(theme)) {
    case "vapor":
      return "sepia(1) saturate(2.5) hue-rotate(145deg)";
    case "ocean":
      return "sepia(1) saturate(2.5) hue-rotate(10deg)";
    case "blood_orange":
      return colorMode === "dark"
        ? "sepia(0.8) saturate(4) hue-rotate(338deg)"
        : "sepia(1) saturate(2) hue-rotate(320deg)";
    case "red_gold":
      return colorMode === "dark"
        ? "sepia(0.8) saturate(6) hue-rotate(360deg)"
        : "sepia(1) saturate(2) hue-rotate(360deg)";
    default:
      return colorMode === "dark"
        ? "sepia(0.8) saturate(2.5) hue-rotate(335deg)"
        : "sepia(0.6) saturate(1.5) hue-rotate(335deg)";
  }
};

export const Logo = ({ height, width }: any) => {
  const { colorMode } = useColorMode();
  const theme = useSelector(selectCurrentTheme);
  const distro = useSelector(selectCurrentDistro);
  const clean = cleanDistroName(theme);
  const anatase =
    distro === "anatase" ||
    distro?.endsWith("_an") ||
    theme === "anatase" ||
    theme?.endsWith("_an");
  const anataseLogo = colorMode === "dark" ? AnataseDark : AnataseLight;

  if (anatase)
    return (
      <Img
        src={anataseLogo}
        height={height}
        filter={clean === "anatase" ? undefined : getLogoFilter(theme, colorMode)}
      />
    );

  switch (clean) {
    case "vapor":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter={getLogoFilter(theme, colorMode)}
        />
      );

    case "ocean":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter={getLogoFilter(theme, colorMode)}
        />
      );

    case "blood_orange":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter={getLogoFilter(theme, colorMode)}
        />
      );
    case "red_gold":
      return (
        <Img
          src={colorMode == "dark" ? MonoDark : MonoLight}
          height={height}
          filter={getLogoFilter(theme, colorMode)}
        />
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
