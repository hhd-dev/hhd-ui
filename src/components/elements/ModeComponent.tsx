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
  Stack,
} from "@chakra-ui/react";
import { FC } from "react";
import { useShouldRenderChild } from "../../hooks/conditionalRender";
import { useSettingState } from "../../hooks/controller";
import ErrorBoundary from "../ErrorBoundary";
import SettingComponent from "./SettingComponent";
import { ModeProps } from "../../model/common";

const ModeComponent: FC<ModeProps> = ({ settings: set, path, qam }) => {
  const { state, setState } = useSettingState<string>(`${path}.mode`);
  const { title, modes } = set;
  const shouldRenderChild = useShouldRenderChild(qam);

  const mode = state ? set.modes[state] : null;

  return (
    <>
      <Box>
        <FormLabel htmlFor={path}>{title}</FormLabel>
        <Menu>
          <MenuButton as={Button} width="100%" rightIcon={<ChevronDownIcon />}>
            {mode?.title}
          </MenuButton>
          <MenuList>
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
      <Flex direction="row">
        <Center>
          <Divider
            orientation="vertical"
            marginRight="0.75rem"
            alignSelf="stretch"
          ></Divider>
        </Center>
        <Stack flexGrow="1">
          {mode &&
            shouldRenderChild(mode) &&
            Object.entries(mode.children).map(([childName, childSet], idx) => {
              return (
                <ErrorBoundary title={title} key={idx}>
                  <SettingComponent
                    path={`${path}.${state}.${childName}`}
                    settings={childSet}
                  />
                </ErrorBoundary>
              );
            })}
        </Stack>
      </Flex>
    </>
  );
};

export default ModeComponent;
