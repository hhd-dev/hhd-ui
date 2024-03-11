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
import { getSettingChoices } from "../../model/common";
import { useSelectedSetting, useSettingState } from "../../model/hooks";
import slice, { selectSelectedChoice } from "../../model/slice";
import { ControllerButton } from "../Controller";

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  const state = String(
    useSettingState(
      (path || "") + (setting && setting.type === "mode" ? ".mode" : "")
    ).state
  );
  const sel = useSelector(selectSelectedChoice);
  if (!path || !setting) return <></>;

  if (!["mode", "multiple", "discrete"].includes(setting.type)) return <></>;

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
