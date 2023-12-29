import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./redux-modules/store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
} from "./redux-modules/hhdAsyncThunks";
import {
  selectAllHhdSettingsLoading,
  selectAllHhdSettings,
} from "./redux-modules/hhdSlice";
import HhdComponent, { renderChild } from "./components/HhdComponent";
// import AdvancedOptions from "./components/AdvancedOptions";
import { useSetControllerInfo } from "./hooks/controller";

const App = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAllHhdSettingsLoading);
  const state = useSelector(selectAllHhdSettings);
  const updateState = useSetControllerInfo();

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
  }, []);

  if (loading) {
    return <div>Loading!</div>;
  }

  if (!loading && !state?.controller?.state) {
    return (
      <div>
        <p>
          If you're seeing this message, you most likely set an invalid HHD
          token
        </p>
        <a href="#/">Go Back</a>
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
        <HhdComponent
          {...state.controller.settings}
          state={state.controller.state}
          renderChild={renderChild}
          updateState={updateState}
        />
        {/* <AdvancedOptions updateState={updateState} /> */}
      </div>
    </>
  );
});

export default App;
