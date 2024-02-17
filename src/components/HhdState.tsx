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
} from "@chakra-ui/react";
import { capitalize } from "lodash";

const HhdState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();

  return (
    <Card width={"800px"}>
      <Tabs defaultIndex={0} size="md" orientation="vertical">
        <TabList style={{ padding: "1rem 0" }}>
          {Object.keys(settings).map((name, idx) => {
            let label = name.split("_").map(capitalize).join("\u00a0");
            if (sectionNames && sectionNames[name]) {
              label = sectionNames[name];
            }

            return <Tab key={`tablist-tab-${idx}`}>{label}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
            return (
              <div key={topIdx}>
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
              </div>
            );
          })}
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default HhdState;
