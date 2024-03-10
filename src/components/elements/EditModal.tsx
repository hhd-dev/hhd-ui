import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Fragment } from "react";
import { ModeSetting } from "../../model/common";
import { useSelectedSetting } from "../../model/hooks";
import { useDispatch } from "react-redux";
import slice from "../../model/slice";
import { ControllerButton } from "../Controller";
import { CloseIcon } from "@chakra-ui/icons";

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  if (!path || !setting) return <></>;

  if (!["mode", "multiple", "discrete"].includes(setting.type)) return <></>;

  return (
    <Modal
      isOpen={true}
      onClose={() => {
        dispatch(slice.actions.goOut());
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex>
            {setting.title}
            <Box flexGrow="1"></Box>
            <CloseIcon h="2rem" w="1rem" marginRight=".5rem"></CloseIcon>
            <ControllerButton h="2rem" button="b" marginRight="-0.5rem" />
          </Flex>
        </ModalHeader>

        <ModalBody textAlign="justify">
          <Text margin="-0.5rem 0 1rem 0">{setting.hint}</Text>
          {setting.type == "mode" &&
            Object.values((setting as ModeSetting).modes).some(
              (s) => s.hint
            ) && (
              <>
                <Heading size="md" marginTop="0.7rem" marginBottom="0.7rem">
                  Modes
                </Heading>
                <Flex direction="row" marginBottom="1rem">
                  <Center>
                    <Divider
                      orientation="vertical"
                      margin="0 0.75rem 0 0.2rem"
                      alignSelf="stretch"
                    ></Divider>
                  </Center>
                  <Box>
                    {Object.values((setting as ModeSetting).modes).map(
                      (s, i) => (
                        <Fragment key={i}>
                          <Heading
                            size="sm"
                            marginTop="0.7rem"
                            marginBottom="0.3rem"
                          >
                            {s.title}
                          </Heading>
                          <Text marginBottom="0.3rem">{s.hint || "..."}</Text>
                        </Fragment>
                      )
                    )}
                  </Box>
                </Flex>
              </>
            )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
