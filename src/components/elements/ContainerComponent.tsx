import { CardBody, Flex, Heading, Tooltip } from "@chakra-ui/react";
import { FC } from "react";
import { ContainerProps, ModeSetting } from "../../model/common";
import { useDisabledTooltip, useShouldRenderChild } from "../../model/hooks";
import ErrorBoundary from "../ErrorBoundary";
import ModeComponent from "./ModeComponent";
import SettingComponent from "./SettingComponent";

const ContainerComponent: FC<ContainerProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { title, children, tags, hint } = set;
  const qam = section === "qam";
  const shouldRenderChild = useShouldRenderChild(qam);
  const showTitle = !qam || !tags?.includes("hide-title");
  const isDisabled = useDisabledTooltip();

  return (
    <>
      <CardBody
        style={{ display: "flex", flexDirection: "column", padding: 0 }}
      >
        {showTitle && (
          <Tooltip label={hint} isDisabled={isDisabled}>
            <Heading as="h1" fontSize="xl" marginBottom="1rem">
              {title}
            </Heading>
          </Tooltip>
        )}
        <Flex direction="column" flexGrow="1">
          {Object.entries(children)
            .filter(([_, s]) => shouldRenderChild(s))
            .map(([childName, childSet], idx) => {
              const { type } = childSet;
              return (
                <ErrorBoundary title={title} key={idx}>
                  {type === "mode" ? (
                    <ModeComponent
                      path={`${path}.${childName}`}
                      settings={childSet as ModeSetting}
                      section={section}
                    />
                  ) : (
                    <SettingComponent
                      path={`${path}.${childName}`}
                      settings={childSet}
                      section={section}
                    />
                  )}
                </ErrorBoundary>
              );
            })}
        </Flex>
      </CardBody>
    </>
  );
};

export default ContainerComponent;
