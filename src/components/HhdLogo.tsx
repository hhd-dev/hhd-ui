import { FC } from "react";

type Props = {
  width: number;
};

const HhdLogo: FC<Props> = ({ width, ...otherProps }) => {
  return (
    <>
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="src/assets/logo_dark.svg"
          width={`${width}%`}
        />
        <source
          media="(prefers-color-scheme: light)"
          srcset="src/assets/logo_light.svg"
          width={`${width}%`}
        />
        <img
          alt="Handheld Daemon Logo."
          src="src/assets/logo_light.svg"
          width={`${width}%`}
          {...otherProps}
        />
      </picture>
    </>
  );
};

export default HhdLogo;
