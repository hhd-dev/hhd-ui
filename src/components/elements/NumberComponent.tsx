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
import { useElementNav } from "../../hooks/navigation";
import { NumberSetting, SettingProps } from "../../model/common";

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
  const { ref, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );

  if (tags?.includes("dropdown")) {
    return (
      <>
        <FormLabel htmlFor={path}>{title}</FormLabel>
        <NumberInput
          id={path}
          onChange={setState}
          min={min}
          max={max}
          {...(focus && { background: "purple" })}
          ref={ref}
          onFocus={setFocus}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </>
    );
  }

  ref.current?.focus()

  if (tags?.includes("slim")) {
    // TODO: Fix style boundary
    return (
      <Flex direction="row" alignItems="center">
        <FormLabel minW="2.4rem" htmlFor={path} textAlign="end">
          {title}
        </FormLabel>
        <Slider
          min={min}
          max={max}
          onChange={setState}
          {...(focus && { background: "purple" })}
          onFocus={setFocus}
          focusThumbOnChange={false}
          ref={ref}
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
    );
  }

  return (
    <>
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
        ref={ref}
        onFocus={setFocus}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </>
  );
};

export default NumberComponent;
