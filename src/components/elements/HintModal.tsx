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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import slice, { selectFocusedSetting, selectShowHint } from "../../model/slice";
import { ModeSetting } from "../../model/common";

export function HintModal() {
  const show = useSelector(selectShowHint);
  const settings = useSelector(selectFocusedSetting, shallowEqual);
  const dispatch = useDispatch();
  const onClose = () => dispatch(slice.actions.setShowHint(false));

  if (!settings) return <></>;
  const setting = settings[settings.length - 1];
  if (!setting) return <></>;

  return (
    <Modal
      isOpen={Boolean(show && settings && setting.hint)}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{setting.title}</ModalHeader>
        <ModalBody textAlign="justify">
          <Text margin="-0.5rem 0 1rem 0">{setting.hint}</Text>
          {/* <Heading size="md" marginBottom="1rem">
            Part Of
          </Heading> */}
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
