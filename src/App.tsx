import { memo, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, store } from "./redux-modules/store";
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
  // const settings = useSelector(selectHhdSettings);

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
  }, []);

  if (loading) {
    return <div>Loading!</div>;
  }

  return (
    <>
      <div>
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

function AppContainer() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppContainer;
