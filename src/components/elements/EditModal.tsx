import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
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
import slice, {
  selectHasController,
  selectSelectedChoice,
} from "../../model/slice";
import { ControllerButton } from "../Controller";
import { getButtonStyle } from "./utils";

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  const { state, setState } = useSettingState(
    (path || "") + (setting && setting.type === "mode" ? ".mode" : "")
  );
  const sel = useSelector(selectSelectedChoice);
  const controller = useSelector(selectHasController);
  const { state: colorState } = useSettingState<
    Record<
      string,
      {
        hue: number;
        hue2: number | undefined;
        saturation: number;
        brightness: number;
      }
    >
  >(path || "");

  if (!path || !setting) return <></>;
  if (!["mode", "multiple", "action"].includes(setting.type)) return <></>;
  if (setting.tags?.includes("ordinal")) return <></>;
  const verify = setting.type === "action";

  const click = (val: string) => {
    if (val !== String(state)) {
      setState(setting.type === "discrete" ? Number(val) : val);
    }
    dispatch(slice.actions.unselect());
  };
  const apply = () => {
    setState(true);
    dispatch(slice.actions.unselect());
  };
  const cancel = () => {
    dispatch(slice.actions.unselect());
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
            <Button
              aria-label="close modal"
              variant="transparent"
              onClick={() => dispatch(slice.actions.unselect())}
            >
              <CloseIcon h="2rem" w="1rem" marginRight=".5rem"></CloseIcon>
              {controller && (
                <ControllerButton h="2rem" button="b" marginRight="-0.5rem" />
              )}
            </Button>
          </Flex>
        </ModalHeader>

        <ModalBody textAlign="justify">
          {verify ? (
            <Flex direction="column">
              <Flex direction="row" margin="1rem">
                <Center>
                  <Divider
                    orientation="vertical"
                    marginRight="0.75rem"
                    alignSelf="stretch"
                  ></Divider>
                </Center>
                <Box>{setting.hint}</Box>
              </Flex>
              <Flex direction="row" marginBottom="1rem" justifyContent="center">
                <Button
                  margin="0.6rem"
                  w="8rem"
                  padding="1.5rem 0"
                  colorScheme={"brand"}
                  transition="all 0.2s ease"
                  onClick={apply}
                >
                  <CheckIcon />
                  {controller && (
                    <ControllerButton
                      h="2rem"
                      button="a"
                      marginLeft="1rem"
                      invert
                    />
                  )}
                </Button>
                <Button
                  margin="0.6rem"
                  w="8rem"
                  padding="1.5rem 0"
                  colorScheme={"brand"}
                  transition="all 0.2s ease"
                  onClick={cancel}
                >
                  <CloseIcon />
                  {controller && (
                    <ControllerButton
                      h="2rem"
                      button="b"
                      marginLeft="1rem"
                      invert
                    />
                  )}
                </Button>
              </Flex>
            </Flex>
          ) : (
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
                  {...((setting as ModeSetting).modes &&
                    getButtonStyle(
                      (setting as ModeSetting).modes[val]?.tags,
                      colorState ? colorState[val] : undefined
                    ))}
                  {...(val === sel ? { transform: "scale(1.06)" } : {})}
                >
                  {String(name)}
                </Button>
              ))}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
