import { FC, useEffect, useRef } from "react";
import ErrorBoundary from "./ErrorBoundary";
import {
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Box,
} from "@chakra-ui/react";

type Props = {
  value?: number;
  tags: string[];
  statePath: string;
  title: string;
  onChange: (args: any) => any;
  min: number;
  max: number;
  unit?: string;
};

const HhdInt: FC<Props> = ({
  value,
  title,
  statePath,
  onChange,
  tags,
  min,
  max,
  unit,
}) => {
  const valueProp = value ? { value } : {};
  const ref = useRef<HTMLElement>(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     registerHhdElement(ref.current);
  //   }
  // }, []);

  if (tags?.includes("dropdown")) {
    return (
      <div>
        <ErrorBoundary title={title}>
          <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
          <NumberInput
            id={`${statePath}`}
            {...valueProp}
            onChange={onChange}
            min={min}
            max={max}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </ErrorBoundary>
      </div>
    );
  }

  if (tags?.includes("slim")) {
    // TODO: Fix style boundary
    return (
      <div>
        <ErrorBoundary title={title}>
          <Flex direction="row" alignItems="center">
            <FormLabel minW="2.4rem" htmlFor={`${statePath}`} textAlign="end">
              {title}
            </FormLabel>
            <Slider min={min} max={max} {...valueProp} onChange={onChange}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Box w="0.6rem" />
            {value && (
              <FormLabel minW="2.7rem" textAlign="end">
                {value}
                {unit || ""}
              </FormLabel>
            )}
          </Flex>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div>
      <ErrorBoundary title={title}>
        <Flex direction="row" alignItems="center">
          <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
          <Box flexGrow="1" minW="2rem" />
          {value && (
            <FormLabel>
              {value}
              {unit || ""}
            </FormLabel>
          )}
        </Flex>
        <Slider min={min} max={max} {...valueProp} onChange={onChange}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </ErrorBoundary>
    </div>
  );
};

export default HhdInt;
