import { ArrowRightIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
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

import { useIsLocal } from "../model/hooks";
import { ControllerButton } from "./Controller";

const ExpandedUi = () => {
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const controller = useSelector(selectHasController);
  const isLocal = useIsLocal();

  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();

  const isOpen = appType !== "overlay" || uiType === "expanded";

  const scrollCss =
    appType === "overlay"
      ? {
          sx: {
            "::-webkit-scrollbar": {
              display: "none",
            },
          },
        }
      : {};

  return (
    <Box margin="0 auto" position="absolute">
      <Flex
        padding="2rem 0"
        flexDirection="column"
        alignItems="center"
        overflowX="clip"
        overflowY="scroll"
        h="100vh"
        w="100vw"
        transition="0.1s ease-in"
        {...(!isOpen && { transform: "scale(80%)", opacity: 0 })}
        {...scrollCss}
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
    </Box>
  );
};

export default ExpandedUi;
