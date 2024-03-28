import {
  Box,
  ChakraProvider,
  Flex,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import FrontPage from "./components/FrontPage.tsx";
import defaultTheme, {
  controllerTheme as defaultControllerTheme,
  distroThemes,
  getBackground,
} from "./components/theme.tsx";

import { PersistGate } from "redux-persist/integration/react";
import ExpandedUi from "./components/ExpandedUi.tsx";
import QamState from "./components/QamState.tsx";
import { EditModal } from "./components/elements/EditModal.tsx";
import { setupGamepadEventListener } from "./model/controller.tsx";
import * as electronUtils from "./model/electron.tsx";
import {
  useInitialLogin,
  useRelayEffect,
  useUpdateFilter,
} from "./model/hooks.tsx";
import hhdSlice, {
  selectAppType,
  selectCurrentDistro,
  selectHasController,
  selectIsLoading,
  selectIsLoggedIn,
  selectPrevUiType,
  selectUiType,
} from "./model/slice.tsx";
import { persistor, store } from "./model/store.tsx";

declare global {
  interface Window {
    electronUtils: any;
    electronUtilsRender: any;
  }
}

// Inject electron utils
window.electronUtils = electronUtils;

// Setup gamepad listener
setupGamepadEventListener();

function App() {
  const { colorMode } = useColorMode();
  const distro = useSelector(selectCurrentDistro);
  const uiType = useSelector(selectUiType);
  const appType = useSelector(selectAppType);
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const loggedIn = useSelector(selectIsLoggedIn);
  const prevType = useSelector(selectPrevUiType);

  let background;
  if (appType === "web" || appType === "app") {
    background = "100%";
  } else if (uiType === "expanded") {
    background = "90%";
  } else {
    background = "0%";
  }

  useRelayEffect();
  useUpdateFilter();
  useInitialLogin();

  let body = null;

  if (loading) {
    body = (
      <Flex direction="column" alignItems="center" h="100vh" w="100vw">
        <Spinner
          size="xl"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          marginTop="15rem"
          marginBottom="1rem"
        />
      </Flex>
    );
    // TODO: Implement spinner
  } else if (loggedIn) {
    body = (
      <>
        <EditModal />
        <QamState />
        <ExpandedUi />
      </>
    );
  } else {
    body = <FrontPage />;
  }

  // Prevent showing background on init
  // TODO: Remove this by finding why it happens
  if (appType === "overlay" && prevType === "init") return <></>;

  return (
    <Fragment>
      <Box
        h="100vh"
        w="100vw"
        {...getBackground(colorMode, distro)}
        backgroundAttachment="fixed"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundColor="black"
        position="absolute"
        zIndex="-1"
        transition="0.2s ease-in-out"
        opacity={background}
      ></Box>
      <Box
        h="100vh"
        w="100vw"
        onClick={(e) => {
          if (e.currentTarget != e.target) return;
          dispatch(hhdSlice.actions.setUiType("closed"));
        }}
      >
        <PersistGate loading={null} persistor={persistor}>
          {body}
        </PersistGate>
      </Box>
    </Fragment>
  );
}

function ThemeSet() {
  const controller = useSelector(selectHasController);
  const distro = useSelector(selectCurrentDistro);
  let theme = defaultTheme;
  let controllerTheme = defaultControllerTheme;

  if (distro && distroThemes[distro]) {
    theme = distroThemes[distro].theme;
    controllerTheme = distroThemes[distro].controllerTheme;
  }

  return (
    <ChakraProvider theme={controller ? controllerTheme : theme}>
      <App />
    </ChakraProvider>
  );
}

function Main() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeSet />
      </Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Main />);
