import { FC } from "react";
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
};

const HhdInt: FC<Props> = ({
  value,
  title,
  statePath,
  onChange,
  tags,
  min,
  max,
}) => {
  const valueProp = value ? { value } : {};

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

  return (
    <div>
      <ErrorBoundary title={title}>
        <Flex direction="row" alignItems="center">
          <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
          <Box flexGrow="1" minW="2rem" />
          {value && <FormLabel>{value}</FormLabel>}
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
