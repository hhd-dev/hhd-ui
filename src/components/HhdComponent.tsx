import { FC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import { get } from "lodash";
import { useUpdateHhdStatePending } from "../hooks/controller";
import HhdOptions from "./HhdOptions";
import HhdModesDropdown from "./HhdModesDropdown";

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
  updateState,
  default: defaultValue,
}) => {
  const updating = useUpdateHhdStatePending();

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
          statePath: statePath ? `${statePath}.${childName}` : `${childName}`,
        });
      });
    return;
  };

  if (type === "container") {
    // root container type
    return (
      <>
        <h1>{title}</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {renderChild && typeof renderChild === "function" && renderChildren()}
        </div>
      </>
    );
  }
  if (type === "mode" && modes && statePath) {
    // specially handle xinput child
    const value = get(state, `${statePath}.mode`, defaultValue);
    return (
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
        disabled={updating}
      />
    );
  }

  if (
    type === "int" &&
    typeof min === "number" &&
    typeof max === "number" &&
    min < max
  ) {
    const value = get(state, `${statePath}`, defaultValue);

    return (
      <div>
        <label htmlFor={`${statePath}`}>{title}</label>
        <input
          id={`${statePath}`}
          type="number"
          value={value}
          onChange={(e) => {
            return updateState(`${statePath}`, Number(e.target.value));
          }}
          min={min}
          max={max}
          disabled={updating}
        />
      </div>
    );
  }

  if (type === "bool") {
    // checkbox component
    const checked = get(state, `${statePath}`, defaultValue);
    return (
      <div>
        <label htmlFor={`${statePath}`}>{title}</label>
        <input
          id={`${statePath}`}
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(e) => {
            return updateState(`${statePath}`, e.target.checked);
          }}
          disabled={updating}
        />
      </div>
    );
  }

  if ((type === "discrete" || type === "multiple") && options) {
    // dropdown component
    const value = get(state, `${statePath}`, defaultValue);

    return (
      <div>
        <label htmlFor={`${statePath}`}>{title}</label>
        <select
          id={`${statePath}`}
          disabled={updating}
          onChange={(e) => {
            if (type === "discrete") {
              // discrete is always numeric
              return updateState(`${statePath}`, Number(e.target.value));
            }
            return updateState(`${statePath}`, e.target.value);
          }}
          value={value}
        >
          <HhdOptions type={type} options={options} />
        </select>
      </div>
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
      updateState={updateState}
      {...child}
    />
  );
};

export default HhdComponent;
