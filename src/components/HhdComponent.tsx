import { FC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
// import HhdSlider from "./HhdSlider";
import { get } from "lodash";
// import HhdDropdown from "./HhdDropdown";
// import HhdModesDropdown from "./HhdModesDropdown";
import { useUpdateControllerStateIsLoading } from "../hooks/controller";
import HhdOptions from "./HhdOptions";

interface HhdComponentType extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  updateState: any;
  // e.g. path in state to set/get the currently set value,
  // such as lodash.get(state, 'xinput.ds5e.led_support')
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
  updateState,
  default: defaultValue,
}) => {
  const updating = useUpdateControllerStateIsLoading();

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

  if (depth === 0 && type === "container") {
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
  if (type === "mode" && childName === "xinput" && modes && statePath) {
    // specially handle xinput child
    // const value = get(state, `${statePath}.mode`, defaultValue);
    // const onChange = ({ value }: { value: number }) => {
    //   return updateState(`${statePath}.mode`, value);
    // };
    // return (
    //   <HhdModesDropdown
    //     modes={modes}
    //     defaultValue={defaultValue}
    //     selectedValue={value}
    //     title={title}
    //     depth={depth}
    //     state={state}
    //     statePath={statePath}
    //     updateState={updateState}
    //     onChange={onChange}
    //     hint={hint}
    //     renderChild={renderChild}
    //     disabled={updating}
    //   />
    // );
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
