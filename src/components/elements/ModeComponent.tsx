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
import { ModeProps } from "../../model/common";
import {
  useElementNav,
  useSettingState,
  useShouldRenderChild,
} from "../../model/hooks";
import ErrorBoundary from "../ErrorBoundary";
import SettingComponent from "./SettingComponent";
import { getFocusStyle } from "./utils";

const ModeComponent: FC<ModeProps> = ({ settings: set, path, section }) => {
  const { state, setState } = useSettingState<string>(`${path}.mode`);
  const { title, modes, hint } = set;
  const shouldRenderChild = useShouldRenderChild(section === "qam");
  const { ref, focus, setFocus } = useElementNav(section, path);
  const { colorMode } = useColorMode();

  const mode = state ? set.modes[state] : null;

  return (
    <>
      <Box {...getFocusStyle(focus, colorMode)}>
        <Tooltip label={hint}>
          <FormLabel htmlFor={path}>{title}</FormLabel>
        </Tooltip>
        <Menu>
          <Tooltip label={mode?.hint}>
            <MenuButton
              as={Button}
              width="100%"
              ref={ref}
              onFocus={setFocus}
              rightIcon={<ChevronDownIcon />}
              marginBottom="0.3rem"
            >
              {mode?.title}
            </MenuButton>
          </Tooltip>
          <MenuList zIndex="5">
            <MenuOptionGroup type="radio" value={state}>
              {Object.entries(modes).map(
                ([value, { title: label }], idx: number) => {
                  return (
                    <MenuItemOption
                      key={idx}
                      value={value}
                      onClick={() => setState(value)}
                    >
                      {label}
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
                    <SettingComponent
                      path={`${path}.${state}.${childName}`}
                      settings={childSet}
                      section={section}
                    />
                  </ErrorBoundary>
                );
              })}
        </Flex>
      </Flex>
    </>
  );
};

export default ModeComponent;
