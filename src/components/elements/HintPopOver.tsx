import {
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import slice, { selectFocusedSetting, selectShowHint } from "../../model/slice";

export function HintModal() {
  const show = useSelector(selectShowHint);
  const setting = useSelector(selectFocusedSetting);
  const dispatch = useDispatch();
  const onClose = () => dispatch(slice.actions.setShowHint(false));

  if (!setting) return <></>;

  return (
    <Modal isOpen={Boolean(show && setting && setting.hint)} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{setting.title}</ModalHeader>
        <ModalBody textAlign="justify">
          <Text margin="-0.5rem 0 1rem 0">{setting.hint}</Text>
          {/* <Heading size="md" marginBottom="1rem">
            Part Of
          </Heading> */}
          <Flex direction="row" marginBottom="1rem">
            <Center>
              <Divider
                orientation="vertical"
                margin="0 0.75rem 0 0.2rem"
                alignSelf="stretch"
              ></Divider>
            </Center>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
