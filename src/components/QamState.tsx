import { ArrowLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SlideFade,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useShouldRenderParent } from "../hooks/conditionalRender";
import hhdSlice, {
  selectAppType,
  selectHasController,
  selectSectionNames,
  selectSettings,
  selectUiType,
} from "../model/slice";
import { ControllerButton } from "./Controller";
import ErrorBoundary from "./ErrorBoundary";
import HhdLogo from "./Logo";
import ContainerComponent from "./elements/ContainerComponent";
import { QAM_WIDTH } from "./theme";

const QamState = () => {
  const sectionNames = useSelector(selectSectionNames);
  const dispatch = useDispatch();
  const controller = useSelector(selectHasController);
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const settings = useSelector(selectSettings);
  const shouldRenderParent = useShouldRenderParent(true);

  const isOpen = appType === "overlay" && uiType === "qam";

  return (
    <SlideFade in={isOpen} offsetX="100px" unmountOnExit>
      <Flex
        top="0"
        right="0"
        height="100vh"
        position="absolute"
        overflowY="scroll"
        boxShadow="dark-lg"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Card
          width={QAM_WIDTH}
          minH="100vh"
          h="fit-content"
          margin="0"
          borderRadius="0"
        >
          <CardHeader>
            <Flex>
              <Heading>
                <HhdLogo width="9rem" />
              </Heading>
              <Box flexGrow="3"></Box>
              <Button
                margin="0 0 0 1rem"
                onClick={() => dispatch(hhdSlice.actions.setUiType("expanded"))}
              >
                <ArrowLeftIcon h="1.7rem" />
                {controller && (
                  <ControllerButton
                    button="y"
                    margin="0 0 0 0.3rem"
                    h="1.7rem"
                    invert
                  />
                )}
              </Button>
              <Button
                margin="0 0 0 1rem"
                onClick={() => dispatch(hhdSlice.actions.setUiType("closed"))}
              >
                <CloseIcon h="1.7rem" />{" "}
                {controller && (
                  <ControllerButton
                    button="b"
                    margin="0 0 0 0.3rem"
                    h="1.7rem"
                    invert
                  />
                )}
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              {Object.entries(settings).map(([section, containers]) => {
                if (!shouldRenderParent(containers)) {
                  return null;
                }

                let label = section.split("_").map(capitalize).join("\u00a0");
                if (sectionNames && sectionNames[section]) {
                  label = sectionNames[section];
                }

                return (
                  <Box key={section}>
                    <Heading
                      size="md"
                      color="brand.700"
                      textTransform="uppercase"
                      marginLeft="0.1rem"
                      marginBottom="0.7rem"
                    >
                      {label}
                    </Heading>
                    {Object.entries(containers)
                      .filter(([_, s]) => s.type === "container")
                      .map(([name, settings]) => {
                        const path = `${section}.${name}`;

                        return (
                          <ErrorBoundary key={path}>
                            <ContainerComponent
                              key={path}
                              path={path}
                              settings={settings}
                              qam={true}
                            />
                          </ErrorBoundary>
                        );
                      })}
                  </Box>
                );
              })}
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </SlideFade>
  );
};

export default QamState;
