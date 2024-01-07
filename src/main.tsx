import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux-modules/store.tsx";
import TokenPrompt from "./components/TokenPrompt.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./components/theme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <HashRouter>
          <Routes>
            <Route path="/token" Component={TokenPrompt} />
            <Route path="/" Component={App} />
          </Routes>
        </HashRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
