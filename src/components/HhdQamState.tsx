import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  Flex,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { QAM_FILTERS, useShouldRenderParent } from "../hooks/conditionalRender";
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
import { capitalize } from "lodash";

const HhdQamState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);
  const setState = useSetHhdState();
  const shouldRenderParent = useShouldRenderParent(QAM_FILTERS);
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
        <Stack divider={<StackDivider />} spacing="4">
          {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
            if (!shouldRenderParent(plugins)) {
              return null;
            }
            let label = topLevelStr.split("_").map(capitalize).join("\u00a0");
            if (sectionNames && sectionNames[topLevelStr]) {
              label = sectionNames[topLevelStr];
            }
            return (
              <Box key={topIdx}>
                <Heading size="md" color="brand.700" textTransform="uppercase" marginLeft="0.1rem" marginBottom="0.3rem">
                  {label}
                </Heading>
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
        </Stack>
      </CardBody>
    </Card>
  );
};

export default HhdQamState;
