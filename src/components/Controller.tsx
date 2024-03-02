import { useColorMode, Img } from "@chakra-ui/react";

import lb from "../assets/controller/xbox/xbox_lb.svg";
import rb from "../assets/controller/xbox/xbox_rb.svg";
import y from "../assets/controller/sd/steamdeck_button_y_outline.svg";
import b from "../assets/controller/sd/steamdeck_button_b_outline.svg";

export const ControllerButton = ({ button, invert, ...props }: any) => {
  let logo = null;

  const { colorMode, toggleColorMode: _ } = useColorMode();

  switch (button) {
    case "lb":
      logo = lb;
      break;
    case "rb":
      logo = rb;
      break;
    case "y":
      logo = y;
      break;
    case "b":
      logo = b;
      break;
  }

  let filter = null;
  if (colorMode === "dark" && invert) filter = "brightness(0%)";
  if (colorMode === "light" && invert) filter = "brightness(0%)";

  if (!logo) {
    console.error(`Controller button ${button} not found`);
    return <></>;
  }
  return <Img src={logo} filter={filter} {...props} />;
};
