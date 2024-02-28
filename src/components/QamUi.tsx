import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import hhdSlice, {
  selectAppType,
  selectUiType,
} from "../redux-modules/hhdSlice";
import { Flex, Slide, useColorMode } from "@chakra-ui/react";
import HhdQamState from "./HhdQamState";

const QamUi: FC = () => {
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);

  const isOpen = appType !== "overlay" || uiType === "qam";
  const { colorMode, toggleColorMode: _ } = useColorMode();
  const dispatch = useDispatch();

  return (
    <Slide
      in={isOpen}
      onClick={(e) => {
        if (e.currentTarget != e.target) return;
        dispatch(hhdSlice.actions.setUiType("closed"));
      }}
    >
      <Flex
        top="0"
        right="0"
        height="100vh"
        position="absolute"
        overflowY="scroll"
        css={colorMode == "dark" ? { scrollbarColor: "#333e52 #1a202c" } : {}}
        boxShadow="2xl"
      >
        <HhdQamState />
      </Flex>
    </Slide>
  );
};

export default QamUi;
