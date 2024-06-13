export const getFocusStyle = (f: boolean, mode: string) =>
  f
    ? {
        border: "2px",
        borderColor: mode === "dark" ? "gray.500" : "gray.300",
        borderStyle: "solid",
        borderRadius: "8px",
        transform: "scale(1.05)",
        padding: "0.25rem 0.6rem",
        margin: "0 0.15rem",
        bg: mode === "dark" ? "gray.600" : "gray.100",
        transition: "all 0.1s ease-in-out",
        zIndex: "dropdown",
      }
    : {
        border: "2px",
        borderColor: "transparent",
        borderStyle: "solid",
        padding: "0.25rem 0.6rem",
        transition: "all 0.1s ease-in-out",
      };

export const hsvToRgb = (h: number, s: number, v: number) => {
  if (h >= 360) {
    h = 359;
  }
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let rgb;
  if (h < 60) {
    rgb = [c, x, 0];
  } else if (h < 120) {
    rgb = [x, c, 0];
  } else if (h < 180) {
    rgb = [0, c, x];
  } else if (h < 240) {
    rgb = [0, x, c];
  } else if (h < 300) {
    rgb = [x, 0, c];
  } else {
    rgb = [c, 0, x];
  }
  return rgb.map((value) => Math.round((value + m) * 255));
};

export const getCssColor = ({
  hue,
  saturation,
  brightness,
}: {
  hue: number;
  saturation: number;
  brightness: number;
}) =>
  `rgb(${hsvToRgb(
    hue,
    Math.max(Math.min(saturation, 100), 0),
    Math.max(Math.min(brightness, 100), 0)
  ).join(",")})`;

export const getHsvStyle = ({
  hue,
  saturation,
  brightness,
}: {
  hue: number;
  saturation: number;
  brightness: number;
}) => {
  if (hue >= 360) {
    hue = 359;
  }
  const params: any = {
    backgroundColor: getCssColor({ hue, saturation, brightness }),
    _hover: {},
    _active: {
      backgroundColor: getCssColor({
        hue,
        saturation: saturation + 15,
        brightness: brightness - 20,
      }),
      transition: "all 0.5s ease",
    },
    _focus: {},
  };
  if ((brightness > 70 && saturation < 30) || brightness > 50) {
    params.color = "black";
  } else {
    params.color = "white";
  }
  return params;
};

const linGrad = (br: number) => ({
  background: `linear-gradient(to right, hsl(0, 100%, ${br}%), hsl(60, 100%, ${br}%), hsl(120, 100%,${br}%), hsl(180, 100%,${br}%), hsl(240, 100%,${br}%), hsl(300, 100%,${br}%), hsl(0, 100%,${br}%))`,
});

export const getRainbowStyle = () => ({
  ...linGrad(45),
  color: "#ffffff",
  textShadow: "0 0 8px #111111",
  _hover: {},
  _active: { ...linGrad(40), transition: "all 0.5s ease" },
  _focus: {},
});

const spinGrad = (br: number) => ({
  background: `conic-gradient(hsl(0, 100%, ${br}%), hsl(60, 100%, ${br}%), hsl(120, 100%,${br}%), hsl(180, 100%,${br}%), hsl(240, 100%,${br}%), hsl(300, 100%,${br}%), hsl(0, 100%,${br}%))`,
});

export const getSpiralStyle = () => ({
  ...spinGrad(45),
  color: "#ffffff",
  textShadow: "0 0 8px #111111",
  _hover: {},
  _active: { ...spinGrad(40), transition: "all 0.5s ease" },
  _focus: {},
});
