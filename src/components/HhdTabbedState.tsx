import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
  selectSectionNames,
  selectHasController,
} from "../redux-modules/hhdSlice";
import HhdComponent, { renderChild } from "./HhdComponent";
import { useSetHhdState } from "../hooks/controller";
import ErrorBoundary from "./ErrorBoundary";
import {
  Card,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { CONTENT_WIDTH } from "./theme";
import { useShouldRenderParent } from "../hooks/conditionalRender";
import { ControllerButton } from "./Controller";

const HhdTabbedState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();
  const controller = useSelector(selectHasController);

  const shouldRenderParent = useShouldRenderParent(false);

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs defaultIndex={1} size="md" orientation="vertical">
        <TabList style={{ padding: "1rem 0" }}>
          {controller && (
            <ControllerButton
              alignSelf="end"
              button="lb"
              w="2.5rem"
              margin="-0.6rem 0.5rem -0.1rem 0"
            />
          )}
          {Object.entries(settings).map(([name, plugins], idx) => {
            if (!shouldRenderParent(plugins)) {
              return null;
            }
            let label = name.split("_").map(capitalize).join("\u00a0");
            if (sectionNames && sectionNames[name]) {
              label = sectionNames[name];
            }

            return (
              <Tab justifyContent="end" key={`tablist-tab-${idx}`}>
                {label}
              </Tab>
            );
          })}
          {controller && (
            <ControllerButton
              alignSelf="end"
              button="rb"
              w="2.5rem"
              margin="-0.4rem 0.5rem -0.4rem 0"
            />
          )}
        </TabList>
        <TabPanels>
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
                    <TabPanel key={`${statePath}${topIdx}${idx}`}>
                      <ErrorBoundary>
                        <HhdComponent
                          {...plugin}
                          state={state}
                          childName={pluginName}
                          renderChild={renderChild}
                          statePath={statePath}
                          updateState={setState}
                          isQam={false}
                        />
                      </ErrorBoundary>
                    </TabPanel>
                  );
                })}
              </Box>
            );
          })}
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default HhdTabbedState;
