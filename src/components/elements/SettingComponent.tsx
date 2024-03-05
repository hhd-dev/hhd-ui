import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  Code,
  Flex,
  FormLabel,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { FC } from "react";
import { useSettingState } from "../../hooks/controller";
import NumberComponent from "./NumberComponent";
import {
  BoolSetting,
  DiscreteSetting,
  MultipleSetting,
  SettingProps,
} from "../../model/common";

const BoolComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title } = set as BoolSetting;
  const { state, setState } = useSettingState<number>(path);

  return (
    <Flex flexDirection="row" alignItems="center">
      <FormLabel htmlFor={path} margin="0.3rem 0">
        {title}
      </FormLabel>
      <Box flexGrow="1"></Box>
      <Checkbox
        id={path}
        isChecked={Boolean(state)}
        onChange={(e) => setState(e.target.checked)}
      />
    </Flex>
  );
};

const DiscreteComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title, options } = set as DiscreteSetting;
  const { state, setState } = useSettingState<number>(path);

  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {state}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup type="radio">
            {options.map((value) => {
              return (
                <MenuItemOption key={value} onClick={() => setState(value)}>
                  {value}
                </MenuItemOption>
              );
            })}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const MultipleComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title, options } = set as MultipleSetting;
  const { state, setState } = useSettingState<number>(path);

  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {state && options[state]}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup type="radio">
            {Object.entries(options).map(([value, label], idx: number) => {
              return (
                <MenuItemOption
                  key={idx}
                  value={value}
                  onClick={() => setState(value)}
                >
                  {label}
                </MenuItemOption>
              );
            })}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const DisplayComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title } = set as MultipleSetting;
  const { state, setState: _ } = useSettingState<number>(path);

  if (!state) return <></>;

  return (
    <Code padding="1rem">
      {title} - {state}
    </Code>
  );
};

const ActionComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title } = set as MultipleSetting;
  const { state, setState } = useSettingState<number>(path);

  return (
    <Button onClick={() => setState(true)} disabled={!state}>
      {title}
    </Button>
  );
};

const SettingComponent: FC<SettingProps> = ({ settings, path }) => {
  const { type } = settings;

  switch (type) {
    case "number":
      return <NumberComponent path={path} settings={settings} />;
    case "bool":
      return <BoolComponent path={path} settings={settings} />;
    case "discrete":
      return <DiscreteComponent path={path} settings={settings} />;
    case "multiple":
      return <MultipleComponent path={path} settings={settings} />;
    case "display":
      return <DisplayComponent path={path} settings={settings} />;
    case "action":
      return <ActionComponent path={path} settings={settings} />;
  }
  return <> </>;
};

export default SettingComponent;
