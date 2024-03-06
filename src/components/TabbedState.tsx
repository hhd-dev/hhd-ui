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
import {
  useShouldRenderChild,
  useShouldRenderParent,
} from "../hooks/conditionalRender";
import { useSectionNav } from "../hooks/navigation";
import { ContainerSetting } from "../model/common";
import {
  selectHasController,
  selectSectionNames,
  selectSettings,
} from "../model/slice";
import { ControllerButton } from "./Controller";
import ErrorBoundary from "./ErrorBoundary";
import ContainerComponent from "./elements/ContainerComponent";
import { CONTENT_WIDTH } from "./theme";

const TabbedSection = ({
  section,
  containers,
}: {
  section: string;
  containers: Record<string, ContainerSetting>;
}) => {
  const shouldRenderChild = useShouldRenderChild(false);

  return (
    <Box>
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
                  section={section}
                />
              </ErrorBoundary>
            </TabPanel>
          );
        })}
    </Box>
  );
};

const TabbedState = () => {
  const sectionNames = useSelector(selectSectionNames);
  const controller = useSelector(selectHasController);
  const fullSettings = useSelector(selectSettings);
  const shouldRenderParent = useShouldRenderParent(false);

  const settings = Object.fromEntries(
    Object.entries(fullSettings).filter((c) => shouldRenderParent(c[1]))
  );
  const keys = Object.keys(settings);

  const { curr, setCurr } = useSectionNav("tab");

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs
        onChange={(e) => setCurr(keys[e])}
        size="md"
        orientation="vertical"
        index={keys.indexOf(curr)}
        isLazy
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
          {Object.entries(settings).map(([section, containers]) => (
            <TabbedSection
              key={section}
              section={section}
              containers={containers}
            />
          ))}
        </TabPanels>
      </Tabs>
    </Card>
  );
};

export default TabbedState;
