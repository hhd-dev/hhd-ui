import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectSectionNames,
  selectHasController,
} from "../redux-modules/hhdSlice";
import HhdComponent from "./HhdComponent";
import { useSetHhdState } from "../hooks/controller";
import ErrorBoundary from "./ErrorBoundary";
import {
  Card,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Tab,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { CONTENT_WIDTH } from "./theme";
import { ControllerButton } from "./Controller";
import { useFilteredSettings } from "../hooks/conditionalRender";
import { useNavigationCounter, useSectionNav } from "../hooks/navigation";

const HhdTabbedState = () => {
  const state = useSelector(selectHhdSettingsState);

  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();
  const controller = useSelector(selectHasController);
  const settings = useFilteredSettings();

  const { currentIndex, setCurrentIndex } = useSectionNav(
    "tab",
    Object.keys(settings).length
  );

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs
        onChange={setCurrentIndex}
        size="md"
        orientation="vertical"
        index={currentIndex}
      >
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
            return (
              <Box key={topIdx}>
                {Object.keys(plugins).map((pluginName, idx) => {
                  const plugin = plugins[pluginName] as SettingsType;
                  const statePath = `${topLevelStr}.${pluginName}`;
                  const navigationCounter = useNavigationCounter();

                  return (
                    <TabPanel tabIndex={-1} key={`${statePath}${topIdx}${idx}`}>
                      <ErrorBoundary>
                        <HhdComponent
                          {...plugin}
                          state={state}
                          childName={pluginName}
                          statePath={statePath}
                          updateState={setState}
                          isQam={false}
                          navigationCounter={navigationCounter}
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
