import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useShouldRenderParent } from "../hooks/conditionalRender";
import { useSetHhdState } from "../hooks/controller";
import hhdSlice, {
  SettingsType,
  selectHhdSettings,
  selectHhdSettingsState,
  selectSectionNames,
} from "../redux-modules/hhdSlice";
import ErrorBoundary from "./ErrorBoundary";
import HhdComponent, { renderChild } from "./HhdComponent";
import { QAM_WIDTH } from "./theme";
import HhdLogo from "./HhdLogo";

const HhdQamState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);
  const setState = useSetHhdState();
  const shouldRenderParent = useShouldRenderParent();
  const dispatch = useDispatch();

  return (
    <Card width={QAM_WIDTH}>
      <CardHeader>
        <Flex>
          <Heading>
            <HhdLogo width="7rem" />
          </Heading>
          <Box flexGrow="3"></Box>
          <Button
            margin="0 0 0 1rem"
            onClick={() => dispatch(hhdSlice.actions.setUiType("expanded"))}
          >
            Expand
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
          if (!shouldRenderParent(plugins)) {
            return null;
          }
          return (
            <Box key={topIdx}>
              {Object.keys(plugins).map((pluginName, idx) => {
                const plugin = plugins[pluginName] as SettingsType;
                const statePath = `${topLevelStr}.${pluginName}`;

                return (
                  <ErrorBoundary key={`${statePath}${topIdx}${idx}`}>
                    <HhdComponent
                      {...plugin}
                      state={state}
                      childName={pluginName}
                      renderChild={renderChild}
                      statePath={statePath}
                      updateState={setState}
                    />
                  </ErrorBoundary>
                );
              })}
            </Box>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default HhdQamState;
