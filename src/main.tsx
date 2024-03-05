import { Box, ChakraProvider, useColorMode } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Route,
  RouterProvider,
  Routes,
  createHashRouter,
} from "react-router-dom";
import App from "./App.tsx";
import FrontPage from "./components/FrontPage.tsx";
import theme from "./components/theme.tsx";
import { AppDispatch, store } from "./model/store.tsx";

import BackgroundDark from "./assets/background_dark.jpg";
import BackgroundLight from "./assets/background_light.jpg";
import { useHddRelayEffect } from "./hooks/electron.tsx";
import hhdSlice, { selectAppType, selectUiType } from "./model/slice.tsx";
import * as electronUtils from "./utils/electronUtils.tsx";

declare global {
  interface Window {
    electronUtils: any;
    electronUtilsRender: any;
  }
}

// Inject electron utils
window.electronUtils = electronUtils;

function Wrapper() {
  const { colorMode, toggleColorMode: _ } = useColorMode();
  const uiType = useSelector(selectUiType);
  const appType = useSelector(selectAppType);
  const dispatch = useDispatch<AppDispatch>();

  let background;
  if (appType === "web" || appType === "app") {
    background = "100%";
  } else if (uiType === "expanded") {
    background = "90%";
  } else {
    background = "0%";
  }

  useHddRelayEffect();

  const scrollCss =
    appType == "overlay"
      ? {
          sx: {
            "::-webkit-scrollbar": {
              display: "none",
            },
          },
        }
      : {};

  return (
    <>
      <Box
        bgImage={colorMode == "dark" ? BackgroundDark : BackgroundLight}
        h="100vh"
        w="100vw"
        backgroundAttachment="fixed"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundColor="black"
        position="absolute"
        zIndex="-1"
        transition="0.15s ease-in-out"
        opacity={background}
      ></Box>
      <Box
        h="100vh"
        w="100vw"
        overflowX="clip"
        overflowY="scroll"
        {...scrollCss}
        onClick={(e) => {
          if (e.currentTarget != e.target) return;
          dispatch(hhdSlice.actions.setUiType("closed"));
        }}
        css={colorMode == "dark" ? { scrollbarColor: "#333e52 #1a202c" } : {}}
      >
        <Routes>
          <Route path="/" Component={FrontPage} />
          <Route path="/ui" Component={App} />
        </Routes>
      </Box>
    </>
  );
}

function Main() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <Wrapper />
        </ChakraProvider>
      </Provider>
    </React.StrictMode>
  );
}

export const router = createHashRouter([{ path: "*", element: <Main /> }]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
