import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "./hooks/auth";

import {
  LoadingStatusType,
  selectAppType,
  selectHhdSettingsLoading,
  selectHhdSettingsState,
  selectHhdSettingsStateLoading,
  selectPrevUiType,
  selectUiType,
} from "./redux-modules/hhdSlice";

import ExpandedUi from "./components/ExpandedUi";
import useInitialFetch from "./hooks/useInitialFetch";
import HhdQamState from "./components/HhdQamState";
import { setupGamepadEventListener } from "./controller/controllerListener";

setupGamepadEventListener();

const App = memo(() => {
  useInitialFetch();
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const prevUiType = useSelector(selectPrevUiType);

  const settingsLoading = useSelector(selectHhdSettingsLoading);
  const stateLoading = useSelector(selectHhdSettingsStateLoading);
  const state = useSelector(selectHhdSettingsState);

  useVerifyTokenRedirect(stateLoading, settingsLoading, state);

  if (!state || stateLoading == "pending" || settingsLoading == "pending") {
    return null; // TODO: Implement spinner
  }

  if (
    // Non-overlay apps always show expanded ui
    appType !== "overlay" ||
    // Expanded ui should show expanded
    uiType === "expanded" ||
    // When closing the ui expanded, show expanded UI too
    (prevUiType === "expanded" && uiType === "closed")
  )
    return <ExpandedUi />;

  // Otherwise QAM is correct
  return <HhdQamState />;
});

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
