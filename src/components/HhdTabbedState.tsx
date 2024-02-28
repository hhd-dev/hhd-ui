import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
  selectSectionNames,
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

const HhdTabbedState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();

  const shouldRenderParent = useShouldRenderParent();

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs defaultIndex={0} size="md" orientation="vertical">
        <TabList style={{ padding: "1rem 0" }}>
          {Object.entries(settings).map(([name, plugins], idx) => {
            if (!shouldRenderParent(plugins)) {
              return null;
            }
            let label = name.split("_").map(capitalize).join("\u00a0");
            if (sectionNames && sectionNames[name]) {
              label = sectionNames[name];
            }

            return <Tab key={`tablist-tab-${idx}`}>{label}</Tab>;
          })}
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
