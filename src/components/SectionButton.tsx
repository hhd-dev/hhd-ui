import { Tab } from "@chakra-ui/react";
import { FC, useEffect, useRef } from "react";
import SectionHandler from "../controller/SectionHandler";

type Props = {
  label: string;
  [p: string]: any;
};

const SectionButton: FC<Props> = ({ label, ...otherProps }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      SectionHandler.register(ref.current);
    }
  }, []);

  return (
    <Tab ref={ref} {...otherProps}>
      {label}
    </Tab>
  );
};

export default SectionButton;
