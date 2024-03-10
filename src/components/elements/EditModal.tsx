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
import {
  DiscreteSetting,
  ModeSetting,
  MultipleSetting,
} from "../../model/common";
import { useSelectedSetting, useSettingState } from "../../model/hooks";
import slice, { selectSelectedChoice } from "../../model/slice";
import { ControllerButton } from "../Controller";

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  const { state } = useSettingState(
    (path || "") + (setting && setting.type === "mode" ? ".mode" : "")
  );
  const sel = useSelector(selectSelectedChoice);
  if (!path || !setting) return <></>;

  if (!["mode", "multiple", "discrete"].includes(setting.type)) return <></>;

  let choices = {};
  switch (setting.type) {
    case "mode":
      choices = Object.fromEntries(
        Object.entries((setting as ModeSetting).modes).map(([n, v]) => [
          n,
          v.title,
        ])
      );
      break;
    case "multiple":
      choices = (setting as MultipleSetting).options;
      break;
    case "discrete":
      choices = Object.fromEntries(
        (setting as DiscreteSetting).options.map((v) => [v, `${v}`])
      );
      break;
  }

  console.log(state, sel);
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
            {Object.entries(choices).map(([val, name]) => (
              <Button
                key={val}
                margin="0.6rem"
                padding="1.5rem 0"
                colorScheme={val === sel ? "brand" : "gray"}
                rightIcon={state === val ? <CheckIcon /> : undefined}
                transition="all 0.2s ease"
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
