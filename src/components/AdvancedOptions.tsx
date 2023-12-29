import { useState, FC } from "react";
import {
  selectAllHhdSettings,
  selectAllHhdSettingsLoading,
} from "../redux-modules/hhdSlice";
import HhdComponent, { renderChild } from "./HhdComponent";
import { useSelector } from "react-redux";

type Props = {
  updateState: any;
};

const AdvancedOptions: FC<Props> = ({ updateState }) => {
  const loading = useSelector(selectAllHhdSettingsLoading);
  const { advanced } = useSelector(selectAllHhdSettings);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  if (loading) {
    return null;
  }

  return (
    <>
      <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
        Advanced Options
      </button>
      {showAdvancedOptions && advanced.settings && advanced.state && (
        <HhdComponent
          {...advanced.settings}
          updateState={updateState}
          renderChild={renderChild}
          state={advanced.state}
        />
      )}
    </>
  );
};

export default AdvancedOptions;
