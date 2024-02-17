import {
  Box,
  Button,
  CardBody,
  Checkbox,
  Code,
  Flex,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react";
import { get } from "lodash";
import { FC, useRef } from "react";
import { useUpdateHhdStatePending } from "../hooks/controller";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import HhdModesDropdown from "./HhdModesDropdown";
import HhdOptions from "./HhdOptions";
import HintsAccordion from "./HintsAccordion";
import ErrorBoundary from "./ErrorBoundary";
import HhdInt from "./HhdInt";

interface HhdComponentType extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  updateState: any;
  // statePath is the path to set/get the currently set value from state
  // e.g.such as lodash.get(state, 'xinput.ds5e.led_support')
  statePath?: string;
}

const HhdComponent: FC<HhdComponentType> = ({
  type,
  title,
  childName,
  hint,
  parentType,
  statePath,
  children,
  options,
  renderChild,
  modes,
  depth = 0,
  state,
  min,
  max,
  tags,
  updateState,
  default: defaultValue,
}) => {
  const updating = useUpdateHhdStatePending();
  const componentRef = useRef<HTMLInputElement>(null);

  if (tags)
    if (
      tags.indexOf("hhd-update-decky") >= 0 ||
      tags.indexOf("hhd-version-display-decky") >= 0
    ) {
      return null;
    }

  const renderChildren = () => {
    if (children)
      return Object.entries(children).map(([childName, child], idx) => {
        return renderChild({
          childName,
          child,
          childOrder: idx,
          depth: depth + 1,
          parentType: type,
          state,
          updateState,
          tags,
          statePath: statePath ? `${statePath}.${childName}` : `${childName}`,
        });
      });
    return;
  };

  if (type === "container") {
    // root container type
    return (
      <>
        <CardBody
          style={{ display: "flex", flexDirection: "column", padding: 0 }}
        >
          <Flex direction="row" marginBottom="1rem" alignItems="center">
            <Heading as="h1" fontSize="xl">
              {title}
            </Heading>
            <Box flexGrow="1" minW="2rem"></Box>
            <HintsAccordion path={`${statePath}`} />
          </Flex>
          <Stack spacing="3">
            <ErrorBoundary title={title}>
              {renderChild &&
                typeof renderChild === "function" &&
                renderChildren()}
            </ErrorBoundary>
          </Stack>
        </CardBody>
      </>
    );
  }
  if (type === "mode" && modes && statePath) {
    // specially handle xinput child
    const value = get(state, `${statePath}.mode`, defaultValue);
    return (
      <ErrorBoundary title={title}>
        <HhdModesDropdown
          modes={modes}
          defaultValue={defaultValue}
          selectedValue={value}
          title={title}
          depth={depth}
          state={state}
          statePath={statePath}
          updateState={updateState}
          hint={hint}
          renderChild={renderChild}
          updating={updating}
        />
      </ErrorBoundary>
    );
  }

  if (
    type === "int" &&
    typeof min === "number" &&
    typeof max === "number" &&
    min < max
  ) {
    const value = get(state, `${statePath}`, defaultValue);

    const onChange = (value: string) => {
      if (updating) {
        return;
      }
      return updateState(`${statePath}`, Number(value));
    };

    return (
      <HhdInt
        value={value}
        onChange={onChange}
        tags={tags || []}
        title={title}
        statePath={`${statePath}`}
        min={min}
        max={max}
      />
    );
  }

  if (type === "bool") {
    // checkbox component
    const checked = get(state, `${statePath}`, defaultValue);
    return (
      <Flex flexDirection="row">
        <ErrorBoundary title={title}>
          <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
          <Box flexGrow="1"></Box>
          <Checkbox
            id={`${statePath}`}
            ref={componentRef}
            isChecked={Boolean(checked)}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                if (updating) {
                  return;
                }
                return updateState(
                  `${statePath}`,
                  !Boolean(componentRef.current?.checked)
                );
              }
            }}
            onChange={(e) => {
              if (updating) {
                return;
              }
              return updateState(`${statePath}`, e.target.checked);
            }}
          />
        </ErrorBoundary>
      </Flex>
    );
  }

  if ((type === "discrete" || type === "multiple") && options) {
    // dropdown component
    const value = get(state, `${statePath}`, defaultValue);

    return (
      <Flex flexDirection="column">
        <ErrorBoundary title={title}>
          <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
          <Select
            id={`${statePath}`}
            onChange={(e) => {
              if (updating) {
                return;
              }
              if (type === "discrete") {
                // discrete is always numeric
                return updateState(`${statePath}`, Number(e.target.value));
              }
              return updateState(`${statePath}`, e.target.value);
            }}
            value={value}
          >
            <HhdOptions type={type} options={options} />
          </Select>
        </ErrorBoundary>
      </Flex>
    );
  }

  if (type === "display" && title) {
    // show info, shouldn't be interactive
    const value = get(state, `${statePath}`);

    if (!value) {
      return null;
    }

    return (
      <ErrorBoundary title={title}>
        <Code padding="1rem">
          {title} - {value}
        </Code>
      </ErrorBoundary>
    );
  }

  if (type === "action" && title) {
    return (
      <ErrorBoundary title={title}>
        <Button onClick={() => updateState(`${statePath}`, true)}>
          {title}
        </Button>
      </ErrorBoundary>
    );
  }

  return null;
};

interface HhdChildComponentType extends HhdComponentType {
  child: SettingsType;
  childOrder: number;
}

export const renderChild = ({
  childName,
  child,
  childOrder,
  parentType,
  statePath,
  state,
  tags,
  updateState,
  depth,
}: HhdChildComponentType) => {
  return (
    <HhdComponent
      key={childOrder}
      childName={childName}
      renderChild={renderChild}
      depth={depth}
      parentType={parentType}
      statePath={statePath}
      state={state}
      tags={tags}
      updateState={updateState}
      {...child}
    />
  );
};

export default HhdComponent;