import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
  selectSectionNames,
} from "../redux-modules/hhdSlice";
import HhdComponent, { renderChild, shouldRenderChild } from "./HhdComponent";
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
import { CONTENT_WIDTH } from "./theme";

const HhdState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);

  const setState = useSetHhdState();

  return (
    <Card width={CONTENT_WIDTH}>
      <Tabs defaultIndex={0} size="md" orientation="vertical">
        <TabList style={{ padding: "1rem 0" }}>
          {Object.entries(settings).map(([name, plugins], idx) => {
            if (shouldNotRenderParent(plugins)) {
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
            if (shouldNotRenderParent(plugins)) {
              return null;
            }
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

const shouldNotRenderParent = (plugins: { [key: string]: SettingsType }) => {
  const shouldRenderChildrenValues = Object.values(plugins).map((p) => {
    const children = p.children;

    if (!children) {
      return false;
    }

    const res = Object.values(children).map((c) => {
      const { tags } = c;
      if (!tags) {
        return true;
      }
      return shouldRenderChild(tags);
    });

    // if there's any true values
    // this means there is a child that should be rendered
    return res.indexOf(true) >= 0;
  });
  if (shouldRenderChildrenValues.indexOf(true) == -1) {
    // if there's no `true` value, that means all children should not be rendered
    // so don't render the parent either
    return true;
  }
  return false;
};

export default HhdState;
