import { memo, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./redux-modules/store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
} from "./redux-modules/hhdAsyncThunks";
import {
  selectHhdSettingsState,
  selectHhdStateLoadingStatuses,
} from "./redux-modules/hhdSlice";
import HhdState from "./components/HhdState";
import { clearLoggedIn } from "./local";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";

const App = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { stateLoading, settingsLoading } = useSelector(
    selectHhdStateLoadingStatuses
  );
  const state = useSelector(selectHhdSettingsState);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
  }, []);

  useEffect(() => {
    if (
      stateLoading === "succeeded" &&
      settingsLoading === "succeeded" &&
      !state?.hhd?.http
    ) {
      clearLoggedIn();
      navigate("/");
    }
  }, [stateLoading, settingsLoading, state]);

  if (!state || stateLoading == "pending" || settingsLoading == "pending") {
    return <div>Loading</div>;
  }

  return (
    <Flex w="100%" flexDirection="column" alignItems="center">
      <Flex margin="15px">
        <Flex
          w="800px"
          flexDirection="row"
          alignItems="start"
          justifyContent="start"
        >
          <Heading>Handheld Daemon</Heading>
          <Box flexGrow="3"></Box>
          <Button
            onClick={() => {
              clearLoggedIn();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
      <Box w="50px"></Box>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <HhdState />
      </Flex>
    </Flex>
  );
});

export default App;
