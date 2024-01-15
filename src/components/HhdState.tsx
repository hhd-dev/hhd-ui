import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
} from "../redux-modules/hhdSlice";
import HhdComponent, { renderChild } from "./HhdComponent";
import { useSetHhdState } from "../hooks/controller";
import { Card } from "@chakra-ui/react";
import ErrorBoundary from "./ErrorBoundary";

const HhdState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);

  const setState = useSetHhdState();

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      backgroundColor={"white.50"}
    >
      <ErrorBoundary>
        {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
          return (
            <div key={topIdx}>
              {Object.keys(plugins).map((pluginName, idx) => {
                const plugin = plugins[pluginName] as SettingsType;
                const statePath = `${topLevelStr}.${pluginName}`;

                return (
                  <HhdComponent
                    key={`${statePath}${topIdx}${idx}`}
                    {...plugin}
                    state={state}
                    childName={pluginName}
                    renderChild={renderChild}
                    statePath={statePath}
                    updateState={setState}
                  />
                );
              })}
            </div>
          );
        })}
      </ErrorBoundary>
    </Card>
  );
};

export default HhdState;
