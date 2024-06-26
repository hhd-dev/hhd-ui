import {
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
import { useSelector } from "react-redux";
import HhdTabbedState from "./TabbedState";

import { Logo, getScrollbarStyle } from "./theme";

import { selectCurrentTheme } from "../model/slice";

import { useFilter, useIsLocal, useLogout } from "../model/hooks";
import { HintModal } from "./elements/HintModal";

const AppUi = () => {
  const { filter, setFilter } = useFilter();

  const { colorMode, toggleColorMode } = useColorMode();
  const distro = useSelector(selectCurrentTheme);
  const isLocal = useIsLocal();
  const logout = useLogout();

  const onTagClick = () => {
    const newTag = filter === "expert" ? "advanced" : "expert";
    return setFilter(newTag);
  };

  return (
    <Flex h="100vh" w="100vw" transition="0.07s ease-in" flexDirection="column">
      <Box
        position="absolute"
        w="100%"
        h="100%"
        zIndex="-1"
        bgGradient={`linear(95deg, ${
          colorMode == "dark" ? "gray.800" : "white"
        } 65%, #00000000 95% 100%)`}
        opacity={colorMode == "dark" ? "0.6" : "0.8"}
      ></Box>
      <Flex
        padding="1rem 1.5rem 1rem 1.4rem"
        flexDirection="row"
        alignItems="start"
        justifyContent="stretch"
      >
        <Heading marginTop="0.1rem">
          <Logo height="2.5rem" zIndex="3" />
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

        {!isLocal && (
          <Button margin="0 0 0 1rem" onClick={logout}>
            <LockIcon />
          </Button>
        )}
      </Flex>
      <Flex
        {...getScrollbarStyle(distro, colorMode)}
        flexDirection="column"
        alignItems="stretch"
        overflowX="clip"
        overflowY="scroll"
        paddingRight="0.5rem"
        flexGrow="2"
      >
        <HintModal />
        <HhdTabbedState />
      </Flex>
    </Flex>
  );
};

export default AppUi;
