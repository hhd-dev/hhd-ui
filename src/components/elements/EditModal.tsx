import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ModeSetting, getSettingChoices } from "../../model/common";
import { useSelectedSetting, useSettingState } from "../../model/hooks";
import slice, { selectSelectedChoice } from "../../model/slice";
import { ControllerButton } from "../Controller";
import {
  getDisabledStyle,
  getHsvStyle,
  getPulseStyle,
  getRainbowStyle,
  getSpiralStyle,
} from "./utils";

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  const { state, setState } = useSettingState(
    (path || "") + (setting && setting.type === "mode" ? ".mode" : "")
  );
  const sel = useSelector(selectSelectedChoice);
  const { state: colorState } = useSettingState<
    Record<
      string,
      {
        hue: number;
        saturation: number;
        brightness: number;
      }
    >
  >(path || "");

  if (!path || !setting) return <></>;
  if (!["mode", "multiple", "discrete"].includes(setting.type)) return <></>;

  const click = (val: string) => {
    if (val !== String(state)) {
      setState(setting.type === "discrete" ? Number(val) : val);
    }
    dispatch(slice.actions.unselect());
  };
  let colorParams = {};

  const getButtonStyle = (val: string) => {
    if (setting.type !== "mode" || !colorState) return {};
    const childTags = (setting as ModeSetting).modes[val]?.tags || [];
    const hsv = colorState[val];
    if (childTags.includes("rgb")) {
      if (childTags.includes("disabled")) colorParams = getDisabledStyle();
      else if (childTags.includes("pulse")) {
        if (hsv) return getPulseStyle(hsv);
      } else {
        if (hsv) return getHsvStyle(hsv);
      }
    } else if (childTags.includes("rainbow")) {
      return getRainbowStyle();
    } else if (childTags.includes("spiral")) {
      return getSpiralStyle();
    }
    return {};
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        dispatch(slice.actions.unselect());
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex>
            <Box alignSelf="center" textAlign="center" flexGrow="1">
              {setting.title}
            </Box>
            <CloseIcon h="2rem" w="1rem" marginRight=".5rem"></CloseIcon>
            <ControllerButton h="2rem" button="b" marginRight="-0.5rem" />
          </Flex>
        </ModalHeader>

        <ModalBody textAlign="justify">
          <Flex direction="column" marginBottom="1rem">
            {Object.entries(getSettingChoices(setting)).map(([val, name]) => (
              <Button
                key={val}
                margin="0.6rem"
                padding="1.5rem 0"
                colorScheme={val === sel ? "brand" : "gray"}
                rightIcon={String(state) === val ? <CheckIcon /> : undefined}
                transition="all 0.2s ease"
                onClick={() => click(val)}
                {...getButtonStyle(val)}
                {...(val === sel ? { transform: "scale(1.06)" } : {})}
              >
                {String(name)}
              </Button>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
