import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";
import { useColorMode, Img } from "@chakra-ui/react";

const HhdLogo = (props: any) => {
  const { colorMode, toggleColorMode: _ } = useColorMode();

  return <Img src={colorMode == "dark" ? LogoDark : LogoLight} {...props} />;
};

export default HhdLogo;
