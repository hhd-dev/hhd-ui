import { InfoIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { get } from "lodash";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { selectHhdSettings } from "../redux-modules/hhdSlice";

type PropType = {
  settings: { [key: string]: any };
};

const SettingsAccordion: FC<PropType> = ({ settings }) => {
  const { hint, children } = settings;
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <Flex direction="column">
        <Box paddingBottom="0.5rem">{hint}</Box>
        {Object.values(children).map((child, idx) => {
          if (child) {
            return renderChild(child, idx);
          }
          return null;
        })}
      </Flex>
    </Accordion>
  );
};

function renderChild(child: any, key: number) {
  const { title, hint, children, modes } = child;

  if (!children && !modes && !hint) {
    return (
      <AccordionItem key={key}>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {title}
          </Box>
        </AccordionButton>
      </AccordionItem>
    );
  }

  return (
    <AccordionItem key={key}>
      <Heading as="h4">
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        <Box paddingBottom="0.5rem">{hint}</Box>
        {children &&
          Object.values(children).map((child, idx) => {
            return renderChild(child, idx);
          })}
        {modes &&
          Object.values(modes).map((child, idx) => {
            return renderChild(child, idx);
          })}
      </AccordionPanel>
    </AccordionItem>
  );
}

type ContainerProps = {
  path: string;
};

const HintsAccordion: FC<ContainerProps> = ({ path }) => {
  const settings = useSelector(selectHhdSettings);
  const [open, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const data = get(settings, path, null);

  if (!data) {
    return <></>;
  }

  if (!data.children && !data.hint) {
    return;
  }

  return (
    <>
      <Button backgroundColor="transparent" onClick={onOpen}>
        <InfoIcon />
      </Button>
      <Modal isOpen={open} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{data.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SettingsAccordion settings={data} />
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

export default HintsAccordion;
