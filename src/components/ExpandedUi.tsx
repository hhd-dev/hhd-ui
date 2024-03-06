import { ArrowRightIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  ScaleFade,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import HhdLogo from "./Logo";
import HhdTabbedState from "./TabbedState";

import { CONTENT_WIDTH } from "./theme";

import hhdSlice, {
  selectAppType,
  selectHasController,
  selectUiType,
} from "../model/slice";
import TagFilterDropdown from "./TagFilterDropdown";

import { FC } from "react";
import { ControllerButton } from "./Controller";
import { useIsLocal } from "../model/hooks";

type Props = {
  shouldFadeOpen: boolean;
  isOpen: boolean;
  children: any;
};

const FadeBox: FC<Props> = ({ shouldFadeOpen, isOpen, children }) => {
  if (shouldFadeOpen) {
    return (
      <Box w="fit-content" margin="0 auto">
        <ScaleFade initialScale={0.7} in={isOpen} unmountOnExit>
          {children}
        </ScaleFade>
      </Box>
    );
  } else {
    return (
      <Box w="fit-content" margin="0 auto">
        {children}
      </Box>
    );
  }
};

const ExpandedUi = () => {
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const controller = useSelector(selectHasController);
  const isLocal = useIsLocal();

  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();

  const isOpen = appType !== "overlay" || uiType === "expanded";
  const shouldFadeOpen = appType === "overlay";

  return (
    <FadeBox shouldFadeOpen={shouldFadeOpen} isOpen={isOpen}>
      <Flex
        padding="2rem 0"
        w="fit-content"
        flexDirection="column"
        alignItems="center"
      >
        <Flex margin="0.5rem 1rem 1.2rem 1rem">
          <Flex
            w={CONTENT_WIDTH}
            flexDirection="row"
            alignItems="start"
            justifyContent="start"
          >
            <Heading>
              <HhdLogo width="7rem" />
            </Heading>
            <Box flexGrow="3"></Box>

            <IconButton
              onClick={toggleColorMode}
              aria-label="Toggle Darkmode"
              icon={colorMode == "dark" ? <MoonIcon /> : <SunIcon />}
            />
            <TagFilterDropdown />
            {(!isLocal || appType == "web") && (
              <Button margin="0 0 0 1rem">Disconnect</Button>
            )}
            {appType == "app" && (
              <Button margin="0 0 0 1rem" onClick={() => window.close()}>
                Exit
              </Button>
            )}
            {appType == "overlay" && (
              <Button
                margin="0 0 0 1rem"
                onClick={() => dispatch(hhdSlice.actions.setUiType("qam"))}
              >
                {controller && (
                  <ControllerButton
                    button="y"
                    margin="0 0.3rem 0 0"
                    h="1.7rem"
                    invert
                  />
                )}
                <ArrowRightIcon h="1.7rem" />
              </Button>
            )}
          </Flex>
        </Flex>
        <Flex
          w={CONTENT_WIDTH}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <HhdTabbedState />
        </Flex>
      </Flex>
    </FadeBox>
  );
};

export default ExpandedUi;
