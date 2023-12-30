import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./redux-modules/store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
} from "./redux-modules/hhdAsyncThunks";
import {
  selectAllHhdSettingsLoading,
  selectHhdSettingsState,
} from "./redux-modules/hhdSlice";
import HhdState from "./components/HhdState";

const App = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAllHhdSettingsLoading);
  const state = useSelector(selectHhdSettingsState);

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
  }, []);

  if (loading) {
    return <div>Loading!</div>;
  }

  if (!loading && !state?.hhd?.http) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>
          If you're seeing this message, you most likely set an invalid HHD
          token.
        </p>
        <p>Or your hhd installation does not have it's web server enabled.</p>
        <a href="#/token">Go Here</a>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HhdState />
      </div>
    </>
  );
});

export default App;
