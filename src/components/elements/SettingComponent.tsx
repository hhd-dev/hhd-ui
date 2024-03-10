import { ChevronDownIcon } from "@chakra-ui/icons";
import {
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
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import {
  BoolSetting,
  DiscreteSetting,
  MultipleSetting,
  SettingProps,
} from "../../model/common";
import { useElementNav, useSettingState } from "../../model/hooks";
import NumberComponent from "./NumberComponent";
import { getFocusStyle } from "./utils";

const BoolComponent: FC<SettingProps> = ({ settings: set, path, section }) => {
  const { title, hint } = set as BoolSetting;
  const { state, setState } = useSettingState<number>(path);
  const { ref, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );

  return (
    <Flex flexDirection="row" alignItems="center" {...getFocusStyle(focus)}>
      <Tooltip label={hint}>
        <FormLabel htmlFor={path} flexGrow="1" margin="0">
          {title}
        </FormLabel>
      </Tooltip>
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
    <Flex
      flexDirection="column"
      {...getFocusStyle(focus)}
      marginTop="0.2rem"
      marginBottom="0.2rem"
    >
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          ref={ref}
          onFocus={setFocus}
          marginBottom="0.35rem"
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
  const { ref, focus, setFocus } = useElementNav<HTMLButtonElement>(
    section,
    path
  );

  return (
    <Flex flexDirection="column" {...getFocusStyle(focus)} margin="0.2rem 0">
      <FormLabel htmlFor={path}>{title}</FormLabel>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          ref={ref}
          onFocus={setFocus}
          marginBottom="0.35rem"
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
    <Code padding="1rem" margin="0.5rem 0.7rem" borderRadius="6px">
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
  const { ref, focus, setFocus } = useElementNav<HTMLButtonElement>(
    section,
    path
  );

  return (
    <Flex {...getFocusStyle(focus)} flexDirection="column" alignItems="stretch">
      <Button
        onClick={() => setState(true)}
        disabled={!state}
        ref={ref}
        onFocus={setFocus}
        margin="0.3rem 0.1rem"
      >
        {title}
      </Button>
    </Flex>
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
