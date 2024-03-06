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
import { useElementNav } from "../../hooks/navigation";

const BoolComponent: FC<SettingProps> = ({ settings: set, path, section }) => {
  const { title } = set as BoolSetting;
  const { state, setState } = useSettingState<number>(path);
  const {
    ref,
    focus,
    setFocus,
  } = useElementNav<HTMLInputElement>(section, path);

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      {...(focus && { background: "purple" })}
    >
      <FormLabel htmlFor={path} margin="0.3rem 0">
        {title}
      </FormLabel>
      <Box flexGrow="1"></Box>
      <Checkbox
        id={path}
        isChecked={Boolean(state)}
        onChange={(e) => setState(e.target.checked)}
        ref={ref}
        onFocus={setFocus}
      />
    </Flex>
  );
};

const DiscreteComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { title, options } = set as DiscreteSetting;
  const { state, setState } = useSettingState<number>(path);
  const { ref, focus, setFocus } = useElementNav(section, path);

  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          {...(focus && { background: "purple" })}
          ref={ref}
          onFocus={setFocus}
        >
          {state}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup type="radio" value={String(state)}>
            {options.map((value) => {
              return (
                <MenuItemOption
                  key={value}
                  value={String(value)}
                  onClick={() => setState(value)}
                >
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

const MultipleComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { title, options } = set as MultipleSetting;
  const { state, setState } = useSettingState<string>(path);
  const {
    ref,
    focus,
    setFocus: _,
  } = useElementNav<HTMLButtonElement>(section, path);

  return (
    <Flex flexDirection="column">
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          {...(focus && { background: "purple" })}
          ref={ref}
        >
          {state && options[state]}
        </MenuButton>
        <MenuList>
          <MenuOptionGroup type="radio" value={state}>
            {Object.entries(options).map(([value, label]) => {
              return (
                <MenuItemOption
                  key={value}
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
  const { title } = set;
  const { state, setState: _ } = useSettingState<number>(path);

  if (!state) return <></>;

  return (
    <Code padding="1rem">
      {title} - {state}
    </Code>
  );
};

const ActionComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { title } = set;
  const { state, setState } = useSettingState<number>(path);
  const {
    ref,
    focus,
    setFocus: _,
  } = useElementNav<HTMLButtonElement>(section, path);

  return (
    <Button
      onClick={() => setState(true)}
      disabled={!state}
      {...(focus && { background: "purple" })}
      ref={ref}
    >
      {title}
    </Button>
  );
};

const SettingComponent: FC<SettingProps> = (props) => {
  const type = props.settings.type;

  switch (type) {
    case "float":
    case "int":
      return <NumberComponent {...props} />;
    case "bool":
      return <BoolComponent {...props} />;
    case "discrete":
      return <DiscreteComponent {...props} />;
    case "multiple":
      return <MultipleComponent {...props} />;
    case "display":
      return <DisplayComponent {...props} />;
    case "action":
      return <ActionComponent {...props} />;
  }
  return <> </>;
};

export default SettingComponent;
