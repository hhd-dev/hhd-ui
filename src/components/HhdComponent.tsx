import {
  Box,
  Button,
  CardBody,
  Checkbox,
  Code,
  Flex,
  FormLabel,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  Select,
  Stack,
} from "@chakra-ui/react";
import { get, isEqual } from "lodash";
import { FC, useRef, memo } from "react";
import { useUpdateHhdStatePending } from "../hooks/controller";
import {
  SettingType,
  SettingsType,
  selectIsQam,
  selectShowHintModal,
} from "../redux-modules/hhdSlice";
import HhdModesDropdown from "./HhdModesDropdown";
import HhdOptions from "./HhdOptions";
import HintsAccordion from "./HintsAccordion";
import ErrorBoundary from "./ErrorBoundary";
import HhdInt from "./HhdInt";
import { useShouldRenderChild } from "../hooks/conditionalRender";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";

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

const HhdComponent: FC<HhdComponentType> = memo(
  ({
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
    unit,
    tags,
    updateState,
    default: defaultValue,
  }) => {
    const updating = useUpdateHhdStatePending();
    const componentRef = useRef<HTMLInputElement>(null);

    const shouldRenderChild = useShouldRenderChild();
    const showModals = useSelector(selectShowHintModal);
    const isQam = useSelector(selectIsQam);

    if (tags && !shouldRenderChild(tags)) {
      return null;
    }

    const showTitle = !isQam || !tags?.includes("hide-title");

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
            {showTitle && (
              <Flex direction="row" marginBottom="1rem" alignItems="center">
                <Heading as="h1" fontSize="xl">
                  {title}
                </Heading>
                {showModals && (
                  <>
                    <Box flexGrow="1" minW="2rem"></Box>
                    <HintsAccordion path={`${statePath}`} />
                  </>
                )}
              </Flex>
            )}
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
          unit={unit}
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

      const onClick = (value: string) => {
        if (updating) {
          return;
        }
        if (type === "discrete") {
          // discrete is always numeric
          return updateState(`${statePath}`, Number(value));
        }
        return updateState(`${statePath}`, value);
      };

      return (
        <Flex flexDirection="column">
          <ErrorBoundary title={title}>
            <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {type === "multiple" ? options[value] : value}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type="radio" defaultValue={value}>
                  <HhdOptions type={type} options={options} onClick={onClick} />
                </MenuOptionGroup>
              </MenuList>
            </Menu>
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
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

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
