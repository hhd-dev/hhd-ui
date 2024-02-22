import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./redux-modules/store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
} from "./redux-modules/hhdAsyncThunks";
import {
  LoadingStatusType,
  selectHhdSettingsState,
  selectHhdStateLoadingStatuses,
} from "./redux-modules/hhdSlice";
import HhdState from "./components/HhdState";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useLogout } from "./hooks/auth";
import HhdLogo from "./components/HhdLogo";
import { CONTENT_WIDTH } from "./components/theme";
import { hhdPollingInterval } from "./redux-modules/polling";

let clearHhdInterval: any;

document.addEventListener("visibilitychange", () => {
  clearHhdInterval && clearHhdInterval();
  clearHhdInterval = undefined;

  if (!document.hidden) {
    clearHhdInterval = hhdPollingInterval();
  }
});

const App = memo(() => {
  const logout = useLogout();
  const isElectron = useIsElectron();

  const hhdUrl = window.localStorage.getItem("hhd_url");
  const isLocalhost = !hhdUrl || hhdUrl.includes("localhost");

  useInitialFetch();

  const { stateLoading, settingsLoading } = useSelector(
    selectHhdStateLoadingStatuses
  );
  const state = useSelector(selectHhdSettingsState);

  useVerifyTokenRedirect(stateLoading, settingsLoading, state);

  if (!state || stateLoading == "pending" || settingsLoading == "pending") {
    return null;
  }

  return (
    <Flex w="100%" flexDirection="column" alignItems="center">
      <Flex margin="2rem 1rem 1.2rem 1rem">
        <Flex
          w={CONTENT_WIDTH}
          flexDirection="row"
          alignItems="start"
          justifyContent="start"
        >
          <Heading>
            <HhdLogo width={30} />
          </Heading>
          <Box flexGrow="3"></Box>
          {(!isLocalhost || !isElectron) && (
            <Button margin="0 1rem 0 0" onClick={() => logout()}>
              Disconnect
            </Button>
          )}
          {isElectron && <Button onClick={() => window.close()}>Exit</Button>}
        </Flex>
      </Flex>
      <Box w="50px"></Box>
      <Flex
        w={CONTENT_WIDTH}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <HhdState />
      </Flex>
    </Flex>
  );
});

function useInitialFetch() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
    dispatch(fetchSectionNames());
    clearHhdInterval = hhdPollingInterval();
  }, []);
}

function useIsElectron() {
  const isElectron = useMemo(
    () => window.localStorage.getItem("hhd_electron") === "true",
    []
  );
  return isElectron;
}

function useVerifyTokenRedirect(
  stateLoading: LoadingStatusType,
  settingsLoading: LoadingStatusType,
  state: any
) {
  const logout = useLogout();

  useEffect(() => {
    if (
      stateLoading === "succeeded" &&
      settingsLoading === "succeeded" &&
      !state?.hhd?.http
    ) {
      logout(
        "Error while verifying your token. Either the token is incorrect, or the web server is not working."
      );
    }
  }, [stateLoading, settingsLoading, state]);
}

export default App;
