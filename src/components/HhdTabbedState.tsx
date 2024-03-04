import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
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
  TabPanel,
  Box,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { CONTENT_WIDTH } from "./theme";
import { ControllerButton } from "./Controller";
import SectionButton from "./SectionButton";
import { useEffect, useState } from "react";
import { useFilteredSettings } from "../hooks/conditionalRender";
import { resetSectionElements } from "../controller/sectionsNavigation";

const HhdTabbedState = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const state = useSelector(selectHhdSettingsState);

  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();
  const controller = useSelector(selectHasController);

  const settings = useFilteredSettings();

  useEffect(() => {
    return () => {
      resetSectionElements();
    };
  }, []);

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs
        onChange={(index) => setTabIndex(index)}
        size="md"
        orientation="vertical"
        isLazy
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
              <SectionButton
                label={label}
                justifyContent="end"
                key={`tablist-tab-${idx}`}
              />
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

                  return (
                    <TabPanel key={`${idx}${tabIndex}`}>
                      {topIdx === tabIndex ? (
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
                      ) : null}
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
