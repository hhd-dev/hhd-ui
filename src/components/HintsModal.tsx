import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { FC, useState } from "react";
import HintsAccordion from "./HintsAccordion";

type Props = {
  pluginName: string;
};

const HintsModal: FC<Props> = ({ pluginName }) => {
  const [open, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Button backgroundColor="transparent" onClick={onOpen}>
        <InfoIcon />
      </Button>

      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>More Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HintsAccordion pluginName={pluginName} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HintsModal;
