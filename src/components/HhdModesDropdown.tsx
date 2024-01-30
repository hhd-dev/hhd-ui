import {
  Box,
  Center,
  Divider,
  Flex,
  FormLabel,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FC } from "react";

type DropdownProps = {
  modes: { [value: string]: any };
  defaultValue: string;
  selectedValue: string;
  title: string;
  depth: number;
  state: any;
  statePath: string;
  updateState: any;
  hint?: string;
  renderChild: any;
  updating: boolean;
};

const HhdModesDropdown: FC<DropdownProps> = ({
  modes,
  defaultValue,
  selectedValue,
  title,
  hint,
  depth,
  state,
  statePath,
  updateState,
  renderChild,
  updating,
}) => {
  const currentMode = modes[selectedValue];
  const type = currentMode ? currentMode.type : null;
  const children = currentMode ? Object.entries(currentMode.children) : [];

  return (
    <>
      <Box>
        <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
        <Select
          id={`${statePath}`}
          onChange={(e) => {
            if (updating) {
              return;
            }
            return updateState(`${statePath}.mode`, e.target.value);
          }}
          value={selectedValue}
        >
          {Object.entries(modes).map(
            ([value, { title: label }], idx: number) => {
              return (
                <option key={idx} value={value}>
                  {label as string}
                </option>
              );
            }
          )}
        </Select>
      </Box>
      <Flex direction="row">
        <Center>
          <Divider
            orientation="vertical"
            marginRight="0.75rem"
            alignSelf="stretch"
          ></Divider>
        </Center>
        <Stack flexGrow="1">
          {children &&
            children.length > 0 &&
            children.map(([childName, child], idx) => {
              return renderChild({
                childName,
                child,
                childOrder: idx,
                depth: depth + 1,
                parentType: type,
                state,
                updateState,
                statePath: `${statePath}.${selectedValue}.${childName}`,
              });
            })}
        </Stack>
      </Flex>
    </>
  );
};

export default HhdModesDropdown;
