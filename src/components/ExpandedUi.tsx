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
import HhdTabbedState from "./TabbedState";

import { CONTENT_WIDTH, Logo, getScrollbarStyle } from "./theme";

import hhdSlice, {
  selectAppType,
  selectCurrentTheme,
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
  const distro = useSelector(selectCurrentTheme);

  const isOpen = appType !== "overlay" || uiType === "expanded";

  const [oldOpen, setOldOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    let timeoutId: number | null = null;
    timeoutId = setTimeout(
      () => {
        setOldOpen(isOpen);
      },
      isOpen ? 3 : 200
    );

    let timeoutScroll = setTimeout(
      () => {
        setShowScroll(isOpen);
      },
      isOpen ? 400 : 0
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (timeoutScroll) clearTimeout(timeoutScroll);
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
  } else if (!showScroll) {
    scrollCss = {
      sx: {
        "::-webkit-scrollbar": {
          opacity: "0",
        },
      },
    };
  } else if (colorMode === "dark") {
    scrollCss = getScrollbarStyle(distro);
  }
  scrollCss = { ...scrollCss };

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
      transition="0.07s ease-in"
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
            <Logo height="2.5rem" />
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
