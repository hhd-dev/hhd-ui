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
} from "@chakra-ui/react";
import { FC } from "react";
import { useSettingState } from "../../hooks/controller";
import ErrorBoundary from "../ErrorBoundary";
import { SettingProps, NumberSetting } from "../../model/common";
import { useElementNav, useFocusRef } from "../../hooks/navigation";

const NumberComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { tags, title, min, max, unit } = set as NumberSetting<
    number,
    "float" | "int"
  >;
  const { state, setState } = useSettingState<number>(path);
  const { focus, setFocus } = useElementNav(section, path);
  const ref = useFocusRef<HTMLInputElement>(focus);

  if (tags?.includes("dropdown")) {
    return (
      <ErrorBoundary title={title}>
        <FormLabel htmlFor={path}>{title}</FormLabel>
        <NumberInput
          id={path}
          onChange={setState}
          min={min}
          max={max}
          {...(focus && { background: "purple" })}
          ref={ref}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </ErrorBoundary>
    );
  }

  if (tags?.includes("slim")) {
    // TODO: Fix style boundary
    return (
      <ErrorBoundary title={title}>
        <Flex direction="row" alignItems="center">
          <FormLabel minW="2.4rem" htmlFor={path} textAlign="end">
            {title}
          </FormLabel>
          <Slider
            min={min}
            max={max}
            onChange={setState}
            {...(focus && { background: "purple" })}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Box w="0.6rem" />
          {state && (
            <FormLabel minW="2.7rem" textAlign="end">
              {state}
              {unit || ""}
            </FormLabel>
          )}
        </Flex>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary title={title}>
      <Flex direction="row" alignItems="center">
        <FormLabel htmlFor={path}>{title}</FormLabel>
        <Box flexGrow="1" minW="2rem" />
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
        onChange={setState}
        {...(focus && { background: "purple" })}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </ErrorBoundary>
  );
};

export default NumberComponent;
