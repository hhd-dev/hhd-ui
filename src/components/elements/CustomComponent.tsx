import { Box, Center, Flex, Progress, Text } from "@chakra-ui/react";
import { FC } from "react";
import { ProgressProps, SettingProps } from "../../model/common";
import { useSettingState } from "../../model/hooks";

const ProgressComponent: FC<SettingProps> = ({ path, settings }) => {
  let { tags } = settings;
  let { state } = useSettingState<ProgressProps | undefined>(path);
  let props = {};
  if (!state) {
    return <></>;
  } else if (state.value === undefined || state.value === null) {
    props = { isIndeterminate: true, value: 0 };
  } else {
    const max = state.max ?? 100;
    const value = state.value;
    const percent = (value / max) * 100;

    props = {
      value: percent,
    };
  }
  const slim = tags?.includes("slim");

  return (
    <Box margin="0.5rem 0.7rem">
      {!slim && (state.text || state.unit) && (
        <Center>
          <Text fontSize="sm" marginBottom="0.5rem">
            {state.text}
            {state.unit}
          </Text>
        </Center>
      )}
      <Flex>
        <Progress
          {...props}
          borderRadius="4px"
          flexDirection="row"
          width="100%"
        />
        {slim && (state.text || state.unit) && (
          <Text fontSize="sm" marginLeft="0.5rem" marginTop="-0.22rem">
            {state.text}
            {state.unit}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

const CustomComponent: FC<SettingProps> = ({
  settings: set,
  path,
  section,
}) => {
  const { tags } = set;

  if (tags?.includes("progress")) {
    return <ProgressComponent settings={set} path={path} section={section} />;
  }

  return <> </>;
};

export default CustomComponent;
