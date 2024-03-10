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

export function HintModal() {
  const show = useSelector(selectShowHint);
  const settings = useSelector(selectFocusedSetting, shallowEqual);
  const dispatch = useDispatch();
  const onClose = () => dispatch(slice.actions.setShowHint(false));

  if (!settings) return <></>;
  const setting = settings[settings.length - 1];
  const context = settings.slice(
    Math.max(settings.length - 3, 0),
    Math.max(settings.length - 1, 0)
  );
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
          <Flex direction="row" marginBottom="1rem">
            <Center>
              <Divider
                orientation="vertical"
                margin="0 0.75rem 0 0.2rem"
                alignSelf="stretch"
              ></Divider>
            </Center>
            <Box color="gray.500">
              {context.reverse().map((s, i) => (
                <Fragment key={i}>
                  <Heading
                    size="sm"
                    marginTop="0.7rem"
                    marginBottom="0.3rem"
                    marginLeft={`${0.5 * i}rem`}
                  >
                    {s.title}
                  </Heading>
                  <Text marginBottom="0.3rem" marginLeft={`${0.5 * i}rem`}>
                    {s.hint}
                  </Text>
                </Fragment>
              ))}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
