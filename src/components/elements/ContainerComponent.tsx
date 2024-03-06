import { CardBody, Flex, Heading, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { useShouldRenderChild } from "../../model/hooks";
import ErrorBoundary from "../ErrorBoundary";
import SettingComponent from "./SettingComponent";
import { ContainerProps, ModeSetting } from "../../model/common";
import ModeComponent from "./ModeComponent";

const ContainerComponent: FC<ContainerProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { title, children, tags } = set;
  const qam = section === "qam";
  const shouldRenderChild = useShouldRenderChild(qam);
  const showTitle = !qam || !tags?.includes("hide-title");

  return (
    <>
      <CardBody
        style={{ display: "flex", flexDirection: "column", padding: 0 }}
      >
        {showTitle && (
          <Flex direction="row" marginBottom="1rem" alignItems="center">
            <Heading as="h1" fontSize="xl">
              {title}
            </Heading>
          </Flex>
        )}
        <Stack spacing="3">
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
        </Stack>
      </CardBody>
    </>
  );
};

export default ContainerComponent;
