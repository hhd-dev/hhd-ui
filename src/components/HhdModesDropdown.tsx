import { FormLabel, Select } from "@chakra-ui/react";
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
  disabled: boolean;
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
  disabled,
}) => {
  const currentMode = modes[selectedValue];
  const { type } = currentMode;

  const children = Object.entries(currentMode.children);

  return (
    <>
      <div>
        <FormLabel htmlFor={`${statePath}`}>{title}</FormLabel>
        <Select
          id={`${statePath}`}
          disabled={disabled}
          onChange={(e) => {
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
      </div>
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
    </>
  );
};

export default HhdModesDropdown;
