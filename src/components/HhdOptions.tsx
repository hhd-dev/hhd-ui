import { FC } from "react";

type Props = {
  type: string;
  options: any;
};
const HhdOptions: FC<Props> = ({ type, options }) => {
  if (type === "discrete") {
    return (
      <>
        {options.map((o: any, idx: number) => {
          return (
            <option key={idx} value={o}>
              {o}
            </option>
          );
        })}
      </>
    );
  }

  if (type === "multiple") {
    return (
      <>
        {Object.entries(options).map(([value, label], idx: number) => {
          return (
            <option key={idx} value={value}>
              {label as string}
            </option>
          );
        })}
      </>
    );
  }

  return null;
};

export default HhdOptions;
