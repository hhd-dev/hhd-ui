import {
  ArrowRightIcon,
  CloseIcon,
  LockIcon,
  MoonIcon,
  SunIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
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

import { useEffect, useState } from "react";
import { useFilter, useIsLocal, useLogout } from "../model/hooks";
import { ControllerButton } from "./Controller";
import { HintModal } from "./elements/HintModal";

const ExpandedUi = () => {
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const controller = useSelector(selectHasController);
  const { filter, setFilter } = useFilter();
  const isLocal = useIsLocal();

  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const logout = useLogout();

  const isOpen = appType !== "overlay" || uiType === "expanded";

  const [oldOpen, setOldOpen] = useState(false);
  useEffect(() => {
    let timeoutId: number | null = null;
    timeoutId = setTimeout(
      () => {
        setOldOpen(isOpen);
      },
      isOpen ? 100 : 200
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]); // Empty dependency array ensures the effect runs only once

  const onTagClick = () => {
    const newTag = filter === "expert" ? "advanced" : "expert";
    return setFilter(newTag);
  };

  if (!isOpen && !oldOpen) return <></>;
  const showClosed = (isOpen && !oldOpen) || (!isOpen && oldOpen);

  let scrollCss;
  if (appType === "overlay") {
    scrollCss = {
      sx: {
        "::-webkit-scrollbar": {
          display: "none",
        },
      },
    };
  } else if (colorMode === "dark") {
    scrollCss = {
      css: { scrollbarColor: "#333e52 #1a202c" },
    };
  }

  return (
    <Flex
      padding="2rem 0"
      position="absolute"
      flexDirection="column"
      alignItems="center"
      overflowX="clip"
      overflowY="scroll"
      h="100vh"
      w="100vw"
      transition="0.1s ease-in"
      {...(showClosed && { transform: "scale(80%)", opacity: 0 })}
      {...scrollCss}
      onClick={(e) => {
        if (e.currentTarget != e.target) return;
        dispatch(hhdSlice.actions.setUiType("closed"));
      }}
    >
      <Flex margin="0.5rem 1rem 1.2rem 1rem">
        <Flex
          w={CONTENT_WIDTH}
          flexDirection="row"
          alignItems="start"
          justifyContent="start"
        >
          <Heading>
            <HhdLogo height="2.5rem" />
          </Heading>
          <Box flexGrow="3"></Box>

          <IconButton
            onClick={toggleColorMode}
            aria-label="Toggle Darkmode"
            icon={colorMode == "dark" ? <MoonIcon /> : <SunIcon />}
          />
          <Button
            margin="0 0 0 1rem"
            // colorScheme={filter === "expert" ? "purple" : "brand"}
            onClick={onTagClick}
          >
            {filter === "expert" ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
          {(!isLocal || appType == "web") && (
            <Button margin="0 0 0 1rem" onClick={logout}>
              <LockIcon />
            </Button>
          )}
          {appType == "app" && (
            <Button margin="0 0 0 1rem" onClick={() => window.close()}>
              <CloseIcon />
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
        <HintModal />
        <HhdTabbedState />
      </Flex>
    </Flex>
  );
};

export default ExpandedUi;
