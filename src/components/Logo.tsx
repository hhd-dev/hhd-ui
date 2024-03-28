import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";
import MonoLight from "../assets/mono_light.svg";
import MonoDark from "../assets/mono_dark.svg";
import Manjaro from "../assets/distro/manjaro.svg";
import { useColorMode, Img, Flex } from "@chakra-ui/react";
import { selectCurrentDistro } from "../model/slice";
import { useSelector } from "react-redux";

const HhdLogo = ({height, qam}: any) => {
  const { colorMode } = useColorMode();
  const distro = useSelector(selectCurrentDistro);

  switch (distro) {
    case "manjaro":
      return (
        <Flex direction="row" alignItems="center">
          <Img src={Manjaro} height={height} />
          {!qam && (
            <Img
              src={colorMode == "dark" ? MonoDark : MonoLight}
              marginLeft="0.8rem"
              height={height}
            />
          )}
        </Flex>
      );
  }

  return (
    <Img src={colorMode == "dark" ? LogoDark : LogoLight} height={height} />
  );
};

export default HhdLogo;
