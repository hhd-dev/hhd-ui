import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
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
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";
import { useDispatch } from "react-redux";
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
import slice from "../../model/slice";
import NumberComponent from "./NumberComponent";
import { getButtonStyleNested, getFocusStyle } from "./utils";
import CustomComponent from "./CustomComponent";

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
  let title, options: any[], labels;
  if (set.type === "discrete") {
    ({ title, options } = set as DiscreteSetting);
    labels = options;
  } else {
    let optionDict;
    ({ title, options: optionDict } = set as MultipleSetting);
    options = Object.keys(optionDict);
    labels = Object.values(optionDict);
  }
  const { state, setState } = useSettingState<any>(path);
  const { ref, sel, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );
  const { colorMode } = useColorMode();
  let thumbStyle = {};
  if (sel) {
    thumbStyle = {
      bg: "brand.300",
    };
  } else if (colorMode === "light") {
    thumbStyle = { bg: "gray.100" };
  }

  return (
    <Flex
      flexDirection="column"
      {...getFocusStyle(focus, colorMode)}
      marginTop="0.2rem"
      paddingTop="0.4rem"
      marginBottom="0.2rem"
      ref={ref}
    >
      <FormLabel htmlFor={path} paddingLeft={"0.5rem"}>
        {title}
      </FormLabel>
      <Box padding={"0 2.5rem"}>
        <Slider
          min={0}
          max={options.length - 1}
          step={1}
          value={state ? options.indexOf(state) : 0}
          marginTop="0.4rem"
          marginBottom="2.4rem"
          focusThumbOnChange={false}
          onFocus={setFocus}
          onChange={(value) =>
            value >= 0 && value < options.length && setState(options[value])
          }
        >
          {options.map((val, index) => (
            <SliderMark
              key={index}
              value={index}
              marginTop="1.2rem"
              textAlign="center"
              transform="translate(-50%, 0%)"
              padding={"0rem 0.5rem"}
              {...(state === val && {
                background: "brand.300",
                borderRadius: "10px",
                fontWeight: "bold",
                color: colorMode === "dark" ? "gray.800" : "white",
              })}
            >
              {labels[index]}
            </SliderMark>
          ))}
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb {...thumbStyle}></SliderThumb>
        </Slider>
      </Box>
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

  const { state: hsv } = useSettingState<{
    hue: number;
    saturation: number;
    brightness: number;
  }>(path.substring(0, path.lastIndexOf(".")));

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
          {...getButtonStyleNested(set.tags, hsv)}
        >
          {state && options[state]}
        </MenuButton>
        <MenuList zIndex={100}>
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
  const { title, tags } = set;
  let { state } = useSettingState<any>(path);
  const error = tags?.includes("error");
  const slim = tags?.includes("hhd-version-display") || tags?.includes("slim");
  const bold = tags?.includes("bold");

  if (!state) return <></>;

  if (typeof state === "string") {
    const lines = state.split("\n");
    state = lines.map((line, index) => (
      <Text key={index}>{bold ? <b>{line}</b> : line}</Text>
    ));
  } else {
    if (bold) {
      state = (
        <Text>
          <b>{state}</b>
        </Text>
      );
    }
    state = <Text>{state}</Text>;
  }

  if (slim) {
    return (
      <Code padding="1rem" margin="0.5rem 0.7rem" borderRadius="6px">
        <Flex
          justifyContent="space-between"
          {...(error && { colorScheme: "red" })}
        >
          <Text as="b">{title}:</Text>
          {state}
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
  const dispatch = useDispatch();

  const onClick = () => {
    if (set.tags?.includes("verify")) {
      dispatch(slice.actions.selectOption(path));
    } else {
      setState(1);
    }
  };

  return (
    <Flex
      {...getFocusStyle(focus, colorMode)}
      flexDirection="column"
      alignItems="stretch"
    >
      <Button
        onClick={onClick}
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
      if (props.settings.tags?.includes("ordinal")) {
        return <DiscreteComponent {...props} />;
      }
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
