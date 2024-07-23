import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";
import { ModeProps, ModeSetting } from "../../model/common";
import {
  useDisabledTooltip,
  useElementNav,
  useSettingState,
  useShouldRenderChild,
} from "../../model/hooks";
import ErrorBoundary from "../ErrorBoundary";
import SettingComponent from "./SettingComponent";
import { getButtonStyle, getFocusStyle } from "./utils";

const ModeComponent: FC<ModeProps> = ({ settings: set, path, section }) => {
  const { state, setState } = useSettingState<string>(`${path}.mode`);
  const { title, modes, hint } = set;
  const shouldRenderChild = useShouldRenderChild(section === "qam");
  const { ref, focus, setFocus } = useElementNav(section, path);
  const { colorMode } = useColorMode();
  const isDisabled = useDisabledTooltip();
  // const dispatch = useDispatch();

  const mode = state ? set.modes[state] : null;

  const { state: colorState } = useSettingState<
    Record<
      string,
      {
        hue: number;
        hue2: number | undefined;
        saturation: number;
        brightness: number;
      }
    >
  >(path || "");
  return (
    <>
      <Box {...getFocusStyle(focus, colorMode)}>
        <Tooltip label={hint} isDisabled={isDisabled}>
          <FormLabel htmlFor={path}>{title}</FormLabel>
        </Tooltip>
        <Menu>
          <Tooltip label={mode?.hint} isDisabled={isDisabled}>
            <MenuButton
              as={Button}
              width="100%"
              ref={ref}
              onFocus={setFocus}
              rightIcon={<ChevronDownIcon />}
              marginBottom="0.3rem"
              // onClick={() => dispatch(dispatch(slice.actions.select()))}
              {...getButtonStyle(
                state ? (set as ModeSetting).modes[state]?.tags : undefined,
                colorState && state ? colorState[state] : undefined
              )}
            >
              {`${mode?.title}${mode?.unit ? ` (${mode.unit})` : ""}`}
            </MenuButton>
          </Tooltip>
          <MenuList zIndex={100}>
            <MenuOptionGroup type="radio" value={state}>
              {Object.entries(modes).map(
                ([value, { title: label, unit }], idx: number) => {
                  const btnStyle = getButtonStyle(
                    value ? (set as ModeSetting).modes[value]?.tags : undefined,
                    colorState ? colorState[value] : undefined
                  );
                  let extraStyles = {};

                  if (Object.keys(btnStyle).length > 0)
                    extraStyles = {
                      // textAlign: "center",
                      paddingLeft: "3.3rem",
                      borderRadius: "8px",
                      width: "calc(100% - 0.45rem - 4px)",
                      margin: "0.45rem 0.25rem 0 0.35rem",
                      marginBottom: "0",
                    };

                  if (idx == 0) {
                    extraStyles = {
                      ...extraStyles,
                      marginTop: "0rem",
                    };
                  }

                  let suffix = unit ? ` (${unit})` : "";

                  return (
                    <MenuItemOption
                      key={idx}
                      value={value}
                      onClick={() => setState(value)}
                      {...btnStyle}
                      {...extraStyles}
                    >
                      {`${label}${suffix}`}
                    </MenuItemOption>
                  );
                }
              )}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Box>
      <Flex direction="row" margin="0.2rem 0.1rem 0.4rem 0.3rem">
        <Center>
          <Divider
            orientation="vertical"
            marginRight="0.75rem"
            alignSelf="stretch"
          ></Divider>
        </Center>
        <Flex direction="column" flexGrow="1">
          {mode &&
            shouldRenderChild(mode) &&
            Object.entries(mode.children)
              .filter((c) => shouldRenderChild(c[1]))
              .map(([childName, childSet], idx) => {
                return (
                  <ErrorBoundary title={title} key={idx}>
                    {childSet.type == "mode" ? (
                      <ModeComponent
                        path={`${path}.${state}.${childName}`}
                        settings={childSet as ModeSetting}
                        section={section}
                      ></ModeComponent>
                    ) : (
                      <SettingComponent
                        path={`${path}.${state}.${childName}`}
                        settings={childSet}
                        section={section}
                      />
                    )}
                  </ErrorBoundary>
                );
              })}
        </Flex>
      </Flex>
    </>
  );
};

export default ModeComponent;
