import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Divider,
  Flex,
  FormLabel,
  MenuItemOption,
  MenuOptionGroup,
  MenuList,
  MenuButton,
  Menu,
  Stack,
  Button,
} from "@chakra-ui/react";
import { FC, useEffect, useRef } from "react";
import { useShouldRenderChild } from "../hooks/conditionalRender";
import { registerHhdElement } from "../controller/hhdComponentsNavigation";

type DropdownProps = {
  modes: { [value: string]: any };
  defaultValue: string;
  selectedValue: string;
  title: string;
  depth: number;
  state: any;
  statePath: string;
  updateState: any;
  hint?: string;
  renderChild: any;
  updating: boolean;
  isQam: boolean;
};

const HhdModesDropdown: FC<DropdownProps> = ({
  modes,
  defaultValue,
  selectedValue,
  title,
  hint,
  depth,
  state,
  statePath,
  updateState,
  renderChild,
  updating,
  isQam,
}) => {
  const ref = useRef<HTMLElement>(null);
  const currentMode = modes[selectedValue];
  const modeTags = currentMode ? currentMode.tags : null;
  const type = currentMode ? currentMode.type : null;
  const children = currentMode ? Object.entries(currentMode.children) : [];
  const shouldRenderChild = useShouldRenderChild(isQam);

  useEffect(() => {
    if (ref.current) {
      registerHhdElement(ref.current);
    }
  }, []);

  const createClickHandler = (value: any) => () => {
    if (updating) {
      return;
    }
    return updateState(`${statePath}.mode`, value);
  };

  return (
    <>
      <Box>
        <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
        <Menu>
          <MenuButton
            ref={ref}
            as={Button}
            width="100%"
            rightIcon={<ChevronDownIcon />}
          >
            {currentMode?.title}
          </MenuButton>
          <MenuList>
            <MenuOptionGroup type="radio" defaultValue={selectedValue}>
              {Object.entries(modes).map(
                ([value, { title: label }], idx: number) => {
                  return (
                    <MenuItemOption
                      key={idx}
                      value={value}
                      onClick={createClickHandler(value)}
                    >
                      {label as string}
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
          {shouldRenderChild(modeTags, null, children) &&
            children &&
            children.length > 0 &&
            children.map(([childName, child], idx) => {
              return renderChild({
                childName,
                child,
                childOrder: idx,
                depth: depth + 1,
                parentType: type,
                state,
                updateState,
                statePath: `${statePath}.${selectedValue}.${childName}`,
              });
            })}
        </Stack>
      </Flex>
    </>
  );
};

export default HhdModesDropdown;
