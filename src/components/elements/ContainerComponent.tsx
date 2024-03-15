import { Flex, Heading, Tooltip } from "@chakra-ui/react";
import { FC } from "react";
import {
  ContainerProps,
  ContainerSetting,
  ModeSetting,
  Setting,
} from "../../model/common";
import { useDisabledTooltip, useShouldRenderChild } from "../../model/hooks";
import ErrorBoundary from "../ErrorBoundary";
import ModeComponent from "./ModeComponent";
import SettingComponent from "./SettingComponent";

const ContainerComponent: FC<ContainerProps> = ({
  settings: set,
  path,
  section,
  indent,
}) => {
  const { title, children, tags, hint } = set;
  const qam = section === "qam";
  const shouldRenderChild = useShouldRenderChild(qam);
  const showTitle = !qam || !tags?.includes("hide-title");
  const isDisabled = useDisabledTooltip();

  if (indent === undefined) indent = 0;

  const chooseComponent = (childName: string, childSet: Setting) => {
    const { type } = childSet;
    switch (type) {
      case "mode":
        return (
          <ModeComponent
            path={`${path}.${childName}`}
            settings={childSet as ModeSetting}
            section={section}
          />
        );
      case "container":
        return (
          <ContainerComponent
            path={`${path}.${childName}`}
            settings={childSet as ContainerSetting}
            section={section}
            indent={indent + 1}
          />
        );
      default:
        return (
          <SettingComponent
            path={`${path}.${childName}`}
            settings={childSet}
            section={section}
          />
        );
    }
  };

  return (
    <Flex
      direction="column"
      padding="0"
      marginTop={indent ? "0.5rem" : "0"}
      marginLeft={`${indent * 1}rem`}
    >
      {showTitle && (
        <Tooltip label={hint} isDisabled={isDisabled}>
          <Heading as="h1" fontSize={indent ? "lg" : "xl"} marginBottom="1rem">
            {title}
          </Heading>
        </Tooltip>
      )}
      <Flex direction="column" flexGrow="1">
        {Object.entries(children)
          .filter(([_, s]) => shouldRenderChild(s))
          .map(([childName, childSet], idx) => {
            return (
              <ErrorBoundary title={title} key={idx}>
                {chooseComponent(childName, childSet)}
              </ErrorBoundary>
            );
          })}
      </Flex>
    </Flex>
  );
};

export default ContainerComponent;
