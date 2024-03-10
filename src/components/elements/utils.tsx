export const getFocusStyle = (f: boolean, mode: string) =>
  f
    ? {
        border: "2px",
        borderColor: mode === "dark" ? "gray.500" : "gray.300",
        borderStyle: "solid",
        borderRadius: "8px",
        transform: "scale(1.05)",
        padding: "0.25rem 0.6rem",
        margin: "0 0.15rem",
        bg: mode === "dark" ? "gray.600" : "gray.100",
        transition: "all 0.1s ease-in-out",
      }
    : {
        border: "2px",
        borderColor: "transparent",
        borderStyle: "solid",
        padding: "0.25rem 0.6rem",
        transition: "all 0.1s ease-in-out",
      };
