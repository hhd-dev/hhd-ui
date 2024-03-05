import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "./hooks/auth";

import {
  selectHasState,
  selectSettingsLoading,
  selectSettingsStateLoading,
} from "./model/slice";

import ExpandedUi from "./components/ExpandedUi";
import HhdQamState from "./components/QamState";
import { setupGamepadEventListener } from "./controller/controllerListener";
import useInitialFetch from "./hooks/useInitialFetch";

setupGamepadEventListener();

const App = memo(() => {
  useInitialFetch();

  const settingsLoading = useSelector(selectSettingsLoading);
  const stateLoading = useSelector(selectSettingsStateLoading);
  const hasState = useSelector(selectHasState);

  const logout = useLogout();

  useEffect(() => {
    if (
      stateLoading === "succeeded" &&
      settingsLoading === "succeeded" &&
      !hasState
    ) {
      logout(
        "Error while verifying your token. Either the token is incorrect, or Handheld Daemon is not running."
      );
    }
  }, [stateLoading, settingsLoading, hasState]);

  if (!hasState || stateLoading == "pending" || settingsLoading == "pending") {
    return null; // TODO: Implement spinner
  }

  // Otherwise QAM is correct
  return (
    <>
      <HhdQamState />
      <ExpandedUi />
    </>
  );
});

export default App;
