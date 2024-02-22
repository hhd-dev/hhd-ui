import { MenuItemOption } from "@chakra-ui/react";
import { FC } from "react";

type Props = {
  type: string;
  options: any;
  onClick: any;
};
const HhdOptions: FC<Props> = ({ type, options, onClick }) => {
  const createClickHandler = (value: any) => () => {
    return onClick(value);
  };

  if (type === "discrete") {
    return (
      <>
        {options.map((o: any, idx: number) => {
          return (
            <MenuItemOption key={idx} value={o} onClick={createClickHandler(o)}>
              {o}
            </MenuItemOption>
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
            <MenuItemOption
              key={idx}
              value={value}
              onClick={createClickHandler(value)}
            >
              {label as string}
            </MenuItemOption>
          );
        })}
      </>
    );
  }

  return null;
};

export default HhdOptions;
