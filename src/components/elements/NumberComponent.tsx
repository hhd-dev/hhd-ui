import {
  Box,
  Flex,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import { FC } from "react";
import { useSettingState } from "../../model/hooks";
import { useElementNav } from "../../model/hooks";
import { NumberSetting, SettingProps } from "../../model/common";
import { getFocusStyle } from "./utils";

const NumberComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { tags, title, min, max, unit, step, hint } = set as NumberSetting<
    number,
    "float" | "int"
  >;
  const { state, setState } = useSettingState<number>(path);
  const { ref, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );

  if (tags?.includes("dropdown")) {
    return (
      <Box {...getFocusStyle(focus)}>
        <Tooltip label={hint}>
          <FormLabel htmlFor={path}>{title}</FormLabel>
        </Tooltip>
        <NumberInput
          id={path}
          onChange={setState}
          min={min}
          max={max}
          step={step}
          value={state}
          ref={ref}
          onFocus={setFocus}
          marginBottom="0.4rem"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Box>
    );
  }

  if (tags?.includes("slim")) {
    // TODO: Fix style boundary
    return (
      <Flex direction="row" alignItems="center" {...getFocusStyle(focus)}>
        <Tooltip label={hint}>
          <FormLabel
            minW="2.4rem"
            htmlFor={path}
            textAlign="end"
            margin="0 0.45rem 0 0"
          >
            {title}
          </FormLabel>
        </Tooltip>
        <Slider
          min={min}
          max={max}
          onChange={setState}
          onFocus={setFocus}
          step={step}
          value={state}
          focusThumbOnChange={false}
          ref={ref}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        {state && (
          <FormLabel minW="2.7rem" textAlign="end" margin="0 0 0 0.3rem">
            {state}
            {unit || ""}
          </FormLabel>
        )}
      </Flex>
    );
  }

  return (
    <Box {...getFocusStyle(focus)}>
      <Flex direction="row" alignItems="center">
        <Tooltip label={hint}>
          <FormLabel flexGrow="1" htmlFor={path} justifySelf="stretch">
            {title}
          </FormLabel>
        </Tooltip>
        {state && (
          <FormLabel>
            {state}
            {unit || ""}
          </FormLabel>
        )}
      </Flex>
      <Slider
        min={min}
        max={max}
        value={state}
        step={step}
        onChange={setState}
        focusThumbOnChange={false}
        ref={ref}
        onFocus={setFocus}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
};

export default NumberComponent;
