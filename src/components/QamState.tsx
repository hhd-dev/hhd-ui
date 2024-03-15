import { ArrowLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useShouldRenderParent } from "../model/hooks";
import { useShouldRenderChild } from "../model/hooks";
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
import { useEffect, useState } from "react";

const QamState = () => {
  const sectionNames = useSelector(selectSectionNames);
  const dispatch = useDispatch();
  const controller = useSelector(selectHasController);
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);
  const fullSettings = useSelector(selectSettings);
  const shouldRenderParent = useShouldRenderParent(true);
  const shouldRenderChild = useShouldRenderChild(true);

  const settings = Object.fromEntries(
    Object.entries(fullSettings).filter((c) => shouldRenderParent(c[1]))
  );

  const isOpen = appType === "overlay" && uiType === "qam";

  const [oldOpen, setOldOpen] = useState(false);
  useEffect(() => {
    let timeoutId: number | null = null;
    timeoutId = setTimeout(
      () => {
        setOldOpen(isOpen);
      },
      isOpen ? 100 : 200
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]); // Empty dependency array ensures the effect runs only once

  if (!isOpen && !oldOpen) return <></>;
  const showClosed = (isOpen && !oldOpen) || (!isOpen && oldOpen);

  return (
    <Flex
      top="0"
      right="0"
      h="100vh"
      position="absolute"
      boxShadow="dark-lg"
      overflowY="scroll"
      overflowX="hidden"
      transition="0.075s ease-in-out"
      direction="column"
      {...(showClosed && { transform: "translateX(70px)", opacity: 0 })}
      sx={{
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Card
        width={QAM_WIDTH}
        flexGrow="1"
        margin="0"
        borderRadius="0"
        paddingBottom="2rem"
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
                    .filter(([_, s]) => shouldRenderChild(s))
                    .map(([name, settings]) => {
                      const path = `${section}.${name}`;

                      return (
                        <ErrorBoundary key={path}>
                          <ContainerComponent
                            key={path}
                            path={path}
                            settings={settings}
                            section={"qam"}
                            indent={0}
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
  );
};

export default QamState;
