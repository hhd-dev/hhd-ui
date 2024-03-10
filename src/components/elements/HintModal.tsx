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
import { shallowEqual, useSelector } from "react-redux";
import { ModeSetting } from "../../model/common";
import { selectFocusedSetting, selectShowHint } from "../../model/slice";

export function HintModal() {
  const show = useSelector(selectShowHint);
  const settings = useSelector(selectFocusedSetting, shallowEqual);

  if (!show || !settings) return <></>;
  const setting = settings[settings.length - 1];
  if (!setting || !setting.hint) return <></>;

  return (
    <Modal isOpen={true} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{setting.title}</ModalHeader>
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
