import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Code,
  Flex,
  FormLabel,
  Heading,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";
import {
  BoolSetting,
  DiscreteSetting,
  MultipleSetting,
  SettingProps,
} from "../../model/common";
import {
  useDisabledTooltip,
  useElementNav,
  useSettingState,
} from "../../model/hooks";
import NumberComponent from "./NumberComponent";
import { getFocusStyle } from "./utils";

const BoolComponent: FC<SettingProps> = ({ settings: set, path, section }) => {
  const { title, hint } = set as BoolSetting;
  const { state, setState } = useSettingState<number>(path);
  const { ref, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );
  const { colorMode } = useColorMode();
  const isDisabled = useDisabledTooltip();

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      {...getFocusStyle(focus, colorMode)}
    >
      <Tooltip label={hint} isDisabled={isDisabled}>
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
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexDirection="column"
      {...getFocusStyle(focus, colorMode)}
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
  const { colorMode } = useColorMode();

  return (
    <Flex
      flexDirection="column"
      {...getFocusStyle(focus, colorMode)}
      margin="0.2rem 0"
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

const CustomComponent: FC<SettingProps> = () => {
  // if (props.settings.tags?.includes("theme-selector")) {
  //   return <ThemeSelector {...props} />;
  // }

  return <></>;
};

const DisplayComponent: FC<SettingProps> = ({ settings: set, path }) => {
  const { title, tags } = set;
  const { state } = useSettingState<number>(path);
  const error = tags?.includes("error");
  const slim = tags?.includes("hhd-version-display") || tags?.includes("slim");

  if (!state) return <></>;

  if (slim) {
    return (
      <Code padding="1rem" margin="0.5rem 0.7rem" borderRadius="6px">
        <Flex
          justifyContent="space-between"
          {...(error && { colorScheme: "red" })}
        >
          <Text as="b">{title}:</Text>
          <Text>{state}</Text>
        </Flex>
      </Code>
    );
  }

  return (
    <Code
      padding="1rem"
      margin="0.5rem 0.7rem"
      borderRadius="6px"
      textAlign="center"
      {...(error && { colorScheme: "red" })}
    >
      <Heading size="md" textAlign="center" paddingBottom="0.5rem">
        {title}
      </Heading>
      {state}
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
  const { colorMode } = useColorMode();

  return (
    <Flex
      {...getFocusStyle(focus, colorMode)}
      flexDirection="column"
      alignItems="stretch"
    >
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
    case "custom":
      return <CustomComponent {...props} />;
  }
  return <> </>;
};

export default SettingComponent;
