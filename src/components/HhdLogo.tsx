import { FC } from "react";
import LogoLight from "../assets/logo_light.svg";
import LogoDark from "../assets/logo_dark.svg";

type Props = {
  width: number;
};

const HhdLogo: FC<Props> = ({ width, ...otherProps }) => {
  return (
    <>
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcSet={LogoDark}
          width={`${width}%`}
        />
        <source
          media="(prefers-color-scheme: light)"
          srcSet={LogoLight}
          width={`${width}%`}
        />
        <img
          alt="Handheld Daemon Logo."
          src={LogoLight}
          width={`${width}%`}
          {...otherProps}
        />
      </picture>
    </>
  );
};

export default HhdLogo;
