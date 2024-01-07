import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux-modules/store.tsx";
import FrontPage from "./components/FrontPage.tsx";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <HashRouter>
          <Routes>
            <Route path="/" Component={FrontPage} />
            <Route path="/ui" Component={App} />
          </Routes>
        </HashRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
