import { Box, ChakraProvider, useColorMode } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  RouterProvider,
  Route,
  Routes,
  createHashRouter,
  useSearchParams,
} from "react-router-dom";
import App from "./App.tsx";
import FrontPage from "./components/FrontPage.tsx";
import theme from "./components/theme.tsx";
import { store } from "./redux-modules/store.tsx";

import BackgroundDark from "./assets/background_dark.svg";
import BackgroundLight from "./assets/background_light.svg";
import {
  login,
  logout,
  setUiType,
  clearUiType,
} from "./utils/electronUtils.tsx";

export const router = createHashRouter([{ path: "*", element: <Main /> }]);

// @ts-ignore
if (!window.hhdElectronUtils) {
  // @ts-ignore
  window["hhdElectronUtils"] = {
    login,
    logout,
    setUiType,
    clearUiType,
  };
}

function Wrapper() {
  const { colorMode, toggleColorMode: _ } = useColorMode();

  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams);
  const isQam = searchParams.get("qam");

  return (
    <>
      {!isQam && (
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
        ></Box>
      )}

      <Box
        h="100vh"
        w="100vw"
        overflowX="clip"
        overflowY="scroll"
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
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Wrapper />
      </ChakraProvider>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
