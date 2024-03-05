import {
  Box,
  Card,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { useSectionNav } from "../hooks/navigation";
import {
  selectHasController,
  selectSectionNames,
  selectSettings,
} from "../model/slice";
import { ControllerButton } from "./Controller";
import ErrorBoundary from "./ErrorBoundary";
import ContainerComponent from "./elements/ContainerComponent";
import { CONTENT_WIDTH } from "./theme";
import {
  useShouldRenderChild,
  useShouldRenderParent,
} from "../hooks/conditionalRender";

const TabbedState = () => {
  const sectionNames = useSelector(selectSectionNames);
  const controller = useSelector(selectHasController);
  const fullSettings = useSelector(selectSettings);
  const shouldRenderParent = useShouldRenderParent(false);
  const shouldRenderChild = useShouldRenderChild(false);

  const settings = Object.fromEntries(
    Object.entries(fullSettings).filter((c) => shouldRenderParent(c[1]))
  );

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
        <TabList padding="1rem 0">
          {controller && (
            <ControllerButton
              alignSelf="end"
              button="lb"
              w="2.5rem"
              margin="-0.6rem 0.5rem -0.1rem 0"
            />
          )}
          {Object.keys(settings).map((name, idx) => {
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
        <TabPanels padding="0.5rem 0">
          {Object.entries(settings).map(([section, containers]) => {
            return (
              <Box key={section}>
                {Object.entries(containers)
                  .filter(([_, s]) => s.type === "container")
                  .filter(([_, s]) => shouldRenderChild(s))
                  .map(([name, settings]) => {
                    // const navigationCounter = useNavigationCounter();
                    const path = `${section}.${name}`;

                    return (
                      <TabPanel tabIndex={-1} key={path}>
                        <ErrorBoundary>
                          <ContainerComponent
                            path={path}
                            settings={settings}
                            qam={false}
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

export default TabbedState;
