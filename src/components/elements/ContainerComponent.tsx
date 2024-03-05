import { CardBody, Flex, Heading, Stack } from "@chakra-ui/react";
import { FC } from "react";
import { useShouldRenderChild } from "../../hooks/conditionalRender";
import ErrorBoundary from "../ErrorBoundary";
import SettingComponent from "./SettingComponent";
import { ContainerProps } from "../../model/common";

const ContainerComponent: FC<ContainerProps> = ({
  settings: set,
  path,
  qam,
}) => {
  const { title, children, tags } = set;
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
          {shouldRenderChild(set) &&
            Object.entries(children).map(([childName, childSet], idx) => {
              return (
                <ErrorBoundary title={title} key={idx}>
                  <SettingComponent
                    path={`${path}.${childName}`}
                    settings={childSet}
                  />
                </ErrorBoundary>
              );
            })}
        </Stack>
      </CardBody>
    </>
  );
};

export default ContainerComponent;
