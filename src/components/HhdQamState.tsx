import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Button,
  Flex,
  Stack,
  StackDivider,
  useColorMode,
  Slide,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useShouldRenderParent } from "../hooks/conditionalRender";
import { useSetHhdState } from "../hooks/controller";
import hhdSlice, {
  SettingsType,
  selectAppType,
  selectHasController,
  selectHhdSettings,
  selectHhdSettingsState,
  selectSectionNames,
  selectUiType,
} from "../redux-modules/hhdSlice";
import ErrorBoundary from "./ErrorBoundary";
import HhdComponent, { renderChild } from "./HhdComponent";
import { QAM_WIDTH } from "./theme";
import HhdLogo from "./HhdLogo";
import { capitalize } from "lodash";
import { CloseIcon, ArrowLeftIcon } from "@chakra-ui/icons";
import { ControllerButton } from "./Controller";

const HhdQamState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);
  const sectionNames = useSelector(selectSectionNames);
  const setState = useSetHhdState();
  const shouldRenderParent = useShouldRenderParent();
  const dispatch = useDispatch();
  const controller = useSelector(selectHasController);
  const appType = useSelector(selectAppType);
  const uiType = useSelector(selectUiType);

  const isOpen = appType !== "overlay" || uiType === "qam";
  const { colorMode, toggleColorMode: _ } = useColorMode();

  return (
    <Slide
      in={isOpen}
      onClick={(e) => {
        if (e.currentTarget != e.target) return;
        dispatch(hhdSlice.actions.setUiType("closed"));
      }}
    >
      <Flex
        top="0"
        right="0"
        height="100vh"
        position="absolute"
        overflowY="scroll"
        css={colorMode == "dark" ? { scrollbarColor: "#333e52 #1a202c" } : {}}
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
              {Object.entries(settings).map(
                ([topLevelStr, plugins], topIdx) => {
                  if (!shouldRenderParent(plugins)) {
                    return null;
                  }
                  let label = topLevelStr
                    .split("_")
                    .map(capitalize)
                    .join("\u00a0");
                  if (sectionNames && sectionNames[topLevelStr]) {
                    label = sectionNames[topLevelStr];
                  }
                  return (
                    <Box key={topIdx}>
                      <Heading
                        size="md"
                        color="brand.700"
                        textTransform="uppercase"
                        marginLeft="0.1rem"
                        marginBottom="0.7rem"
                      >
                        {label}
                      </Heading>
                      {Object.keys(plugins).map((pluginName, idx) => {
                        const plugin = plugins[pluginName] as SettingsType;
                        const statePath = `${topLevelStr}.${pluginName}`;

                        return (
                          <ErrorBoundary key={`${statePath}${topIdx}${idx}`}>
                            <HhdComponent
                              {...plugin}
                              state={state}
                              childName={pluginName}
                              renderChild={renderChild}
                              statePath={statePath}
                              updateState={setState}
                            />
                          </ErrorBoundary>
                        );
                      })}
                    </Box>
                  );
                }
              )}
            </Stack>
          </CardBody>
        </Card>
      </Flex>
    </Slide>
  );
};

export default HhdQamState;
