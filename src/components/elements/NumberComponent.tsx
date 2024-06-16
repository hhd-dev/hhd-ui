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
  useColorMode,
} from "@chakra-ui/react";
import { FC } from "react";
import { useDisabledTooltip, useSettingState } from "../../model/hooks";
import { useElementNav } from "../../model/hooks";
import { NumberSetting, SettingProps } from "../../model/common";
import { getCssColor, getFocusStyle, getHsvStyle } from "./utils";

const NumberComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  let { tags, title, min, max, unit, step, hint, type } = set as NumberSetting<
    number,
    "float" | "int"
  >;
  if (type === "int" && !step) step = 1;
  const { state, setState } = useSettingState<number>(path);
  const { ref, sel, focus, setFocus } = useElementNav<HTMLInputElement>(
    section,
    path
  );
  const { colorMode } = useColorMode();
  const isDisabled = useDisabledTooltip();
  const { state: hsv } = useSettingState<{
    hue: number;
    saturation: number;
    brightness: number;
  }>(path.substring(0, path.lastIndexOf(".")));

  let colorParams = {};
  let hasFill = true;
  let colorParamsFill = {};
  if (tags?.includes("rgb")) {
    if (tags?.includes("hue")) {
      hasFill = false;
      colorParams = {
        background: `linear-gradient(to right in hsl longer hue,${getCssColor({
          hue: 0,
          saturation: hsv?.saturation || 0,
          brightness: hsv?.brightness || 0,
        })} 0 0)`,
      };
    } else if (tags?.includes("saturation")) {
      hasFill = false;
      colorParams = {
        background: `linear-gradient(to right,${getCssColor({
          hue: hsv?.hue || 0,
          saturation: 0,
          brightness: hsv?.brightness || 0,
        })} 0 0,${getCssColor({
          hue: hsv?.hue || 0,
          saturation: 100,
          brightness: hsv?.brightness || 0,
        })} 100% 100%)`,
      };
    } else if (tags?.includes("brightness") && hsv?.hue !== undefined) {
      hasFill = false;
      colorParams = {
        background: `linear-gradient(to right,${getCssColor({
          hue: hsv?.hue || 0,
          saturation: hsv?.saturation !== undefined ? hsv?.saturation : 70,
          brightness: 15,
        })} 0 0,${getCssColor({
          hue: hsv?.hue || 0,
          saturation: hsv?.saturation || 0,
          brightness: 100,
        })} 100% 100%)`,
      };
    } else {
      if (hsv) colorParamsFill = getHsvStyle(hsv);
    }
  }

  if (tags?.includes("dropdown")) {
    return (
      <Box {...getFocusStyle(focus, colorMode)}>
        <Tooltip label={hint} isDisabled={isDisabled}>
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
      <Flex
        direction="row"
        alignItems="center"
        {...getFocusStyle(focus, colorMode)}
      >
        <Tooltip label={hint} isDisabled={isDisabled}>
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
          {...colorParams}
        >
          <SliderTrack {...colorParams}>
            {hasFill && (
              <SliderFilledTrack
                transition="all 0.2s ease"
                {...colorParamsFill}
              />
            )}
          </SliderTrack>
          <SliderThumb
            transition="all 0.2s ease"
            {...(sel && { bg: "brand.300" })}
          />
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
    <Box {...getFocusStyle(focus, colorMode)}>
      <Flex direction="row" alignItems="center">
        <Tooltip label={hint} isDisabled={isDisabled}>
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
        <SliderTrack {...colorParams}>
          {hasFill && (
            <SliderFilledTrack
              transition="all 0.2s ease"
              {...colorParamsFill}
            />
          )}
        </SliderTrack>
        <SliderThumb
          transition="all 0.2s ease"
          {...(sel && { bg: "brand.300" })}
        />
      </Slider>
    </Box>
  );
};

export default NumberComponent;
