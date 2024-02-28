import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLogout } from "./hooks/auth";

import {
  LoadingStatusType,
  selectAppType,
  selectHhdSettingsState,
  selectHhdStateLoadingStatuses,
} from "./redux-modules/hhdSlice";

import QamUi from "./components/QamUi";
import ExpandedUi from "./components/ExpandedUi";
import useInitialFetch from "./hooks/useInitialFetch";

const App = memo(() => {
  useInitialFetch();
  const appType = useSelector(selectAppType);

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
