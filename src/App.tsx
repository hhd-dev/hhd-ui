import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  ScaleFade,
  useColorMode,
} from "@chakra-ui/react";
import { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HhdLogo from "./components/HhdLogo";
import HhdTabbedState from "./components/HhdTabbedState";
import TagFilterDropdown, {
  TAG_FILTER_CACHE_KEY,
  TagFilterType,
  TagFilters,
} from "./components/TagFilterDropdown";
import { CONTENT_WIDTH } from "./components/theme";
import { useLogout } from "./hooks/auth";
import { getUrl, isLoggedIn } from "./local";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchSectionNames,
} from "./redux-modules/hhdAsyncThunks";
import hhdSlice, {
  LoadingStatusType,
  selectAppType,
  selectHhdSettingsState,
  selectHhdStateLoadingStatuses,
  selectUiType,
} from "./redux-modules/hhdSlice";
import { hhdPollingInterval } from "./redux-modules/polling";
import { AppDispatch } from "./redux-modules/store";
import QamUi from "./components/QamUi";

let clearHhdInterval: any;

document.addEventListener("visibilitychange", () => {
  clearHhdInterval && clearHhdInterval();
  clearHhdInterval = undefined;

  if (!document.hidden && isLoggedIn()) {
    clearHhdInterval = hhdPollingInterval();
  }
});

const ExpandedUi = () => {
  const logout = useLogout();
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);

  const isLocalhost = getUrl().includes("localhost");
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();

  const isOpen = appType !== "overlay" || uiType === "expanded";
  const shouldFadeOpen = appType === "overlay";

  const component = (
    <Flex
      padding="2rem 0"
      w="fit-content"
      flexDirection="column"
      alignItems="center"
    >
      <Flex margin="0.5rem 1rem 1.2rem 1rem">
        <Flex
          w={CONTENT_WIDTH}
          flexDirection="row"
          alignItems="start"
          justifyContent="start"
        >
          <Heading>
            <HhdLogo width="7rem" />
          </Heading>
          <Box flexGrow="3"></Box>

          <IconButton
            onClick={toggleColorMode}
            aria-label="Toggle Darkmode"
            icon={colorMode == "dark" ? <MoonIcon /> : <SunIcon />}
          />
          <TagFilterDropdown />
          {(!isLocalhost || appType == "web") && (
            <Button margin="0 0 0 1rem" onClick={() => logout()}>
              Disconnect
            </Button>
          )}
          {appType == "app" && (
            <Button margin="0 0 0 1rem" onClick={() => window.close()}>
              Exit
            </Button>
          )}
          {appType == "overlay" && (
            <Button
              margin="0 0 0 1rem"
              onClick={() => dispatch(hhdSlice.actions.setUiType("qam"))}
            >
              Quick Menu
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
        <HhdTabbedState />
      </Flex>
    </Flex>
  );

  if (shouldFadeOpen) {
    return (
      <Box w="fit-content" margin="0 auto">
        <ScaleFade initialScale={0.7} in={isOpen}>
          {component}
        </ScaleFade>
      </Box>
    );
  } else {
    return (
      <Box w="fit-content" margin="0 auto">
        {component}
      </Box>
    );
  }
};

const App = memo(() => {
  useInitialFetch();
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);

  const shouldRenderQam = appType === "overlay";

  const { stateLoading, settingsLoading } = useSelector(
    selectHhdStateLoadingStatuses
  );
  const state = useSelector(selectHhdSettingsState);

  useVerifyTokenRedirect(stateLoading, settingsLoading, state);

  if (!state || stateLoading == "pending" || settingsLoading == "pending") {
    return null;
  }

  return (
    <>
      {shouldRenderQam ? <QamUi /> : null}
      <ExpandedUi />
    </>
  );
});

function useInitialFetch() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const tagFilter = window.localStorage.getItem(
      TAG_FILTER_CACHE_KEY
    ) as TagFilterType | null;

    if (tagFilter && TagFilters[tagFilter]) {
      dispatch(hhdSlice.actions.setTagFilter(tagFilter));
    }

    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
    dispatch(fetchSectionNames());
    clearHhdInterval = hhdPollingInterval();

    return () => {
      if (clearHhdInterval) {
        clearHhdInterval();
        clearHhdInterval = undefined;
      }
    };
  }, []);
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
