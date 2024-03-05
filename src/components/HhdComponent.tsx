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
  Stack,
} from "@chakra-ui/react";
import { get, isEqual } from "lodash";
import { FC, useRef, memo } from "react";
import { useUpdateHhdStatePending } from "../hooks/controller";
import {
  SettingType,
  SettingsType,
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
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  updateState: any;
  // statePath is the path to set/get the currently set value from state
  // e.g.such as lodash.get(state, 'xinput.ds5e.led_support')
  statePath?: string;
  isQam: boolean;
  navigationCounter: () => number;
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
    modes,
    depth = 0,
    state,
    min,
    max,
    unit,
    tags,
    updateState,
    isQam,
    navigationCounter,
    default: defaultValue,
  }) => {
    const updating = useUpdateHhdStatePending();
    const componentRef = useRef<HTMLInputElement>(null);

    const shouldRenderChild = useShouldRenderChild(isQam);
    const showModals = useSelector(selectShowHintModal);

    // useEffect(() => {
    //   if (componentRef.current) {
    //     registerHhdElement(componentRef.current);
    //   }
    //   if (depth == 0 && type === "container") {
    //     focusCurrentHhdElement();
    //   }
    //   return () => {
    //     if (depth === 0 && type === "container") {
    //       resetHhdElements();
    //     }
    //   };
    // }, []);

    if (tags && !shouldRenderChild(tags)) {
      return null;
    }

    const showTitle = !isQam || !tags?.includes("hide-title");

    const renderChildren = () => {
      if (children)
        return Object.entries(children).map(([childName, child], idx) => {
          return (
            <HhdComponent
              key={idx}
              childName={childName}
              depth={depth + 1}
              parentType={parentType}
              statePath={
                statePath ? `${statePath}.${childName}` : `${childName}`
              }
              state={state}
              tags={tags}
              updateState={updateState}
              isQam={isQam}
              navigationCounter={navigationCounter}
              {...child}
            />
          );
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
              <ErrorBoundary title={title}>{renderChildren()}</ErrorBoundary>
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
            updating={updating}
            isQam={isQam}
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
              <MenuButton
                ref={componentRef}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
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
          <Button
            // ref={componentRef}
            onClick={() => updateState(`${statePath}`, true)}
          >
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

export default HhdComponent;
