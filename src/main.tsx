import { Box, ChakraProvider, useColorMode } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import FrontPage from "./components/FrontPage.tsx";
import theme from "./components/theme.tsx";
import { store } from "./redux-modules/store.tsx";

import BackgroundDark from "./assets/background_dark.svg";
import BackgroundLight from "./assets/background_light.svg";

function Wrapper() {
  const { colorMode, toggleColorMode: _ } = useColorMode();
  return (
    <Box
      bgImage={colorMode == "dark" ? BackgroundDark : BackgroundLight}
      h="100vh"
      backgroundAttachment="fixed"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundColor="black"
    >
      <HashRouter>
        <Routes>
          <Route path="/" Component={FrontPage} />
          <Route path="/ui" Component={App} />
        </Routes>
      </HashRouter>
    </Box>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Wrapper />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
