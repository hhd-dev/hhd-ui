export const getFocusStyle = (f: boolean) =>
  f
    ? {
        border: "2px",
        borderColor: "brand.700",
        borderStyle: "solid",
        borderRadius: "3px",
        transform: "scale(1.05)",
        padding: "0.25rem 0.6rem",
        margin: "0 0.15rem",
        transition: "all 0.1s ease-in-out",
      }
    : {
        border: "2px",
        borderColor: "transparent",
        borderStyle: "solid",
        padding: "0.25rem 0.6rem",
        transition: "all 0.1s ease-in-out",
      };
