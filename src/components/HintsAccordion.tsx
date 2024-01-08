import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectHints } from "../redux-modules/hhdSlice";
import { FC } from "react";

type PropType = {
  hints: { [key: string]: any };
};

const HintsAccordion: FC<PropType> = ({ hints }) => {
  return (
    <Accordion allowToggle allowMultiple>
      {Object.keys(hints).map((topLevelStr, idx) => {
        const { hint, children } = hints[topLevelStr];
        return (
          <AccordionItem key={idx}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {topLevelStr}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              {hint}
              {Object.entries(children).map(([childName, child], idx) => {
                return renderChild(childName, child, idx);
              })}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

function renderChild(childName: string, child: any, key: number) {
  if (typeof child === "string") {
    return (
      <AccordionItem key={key}>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {childName}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{child}</AccordionPanel>
      </AccordionItem>
    );
  } else {
    const { children, modes, hint } = child;

    return (
      <AccordionItem key={key}>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              {childName}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {hint}
          {children &&
            Object.entries(children).map(([childName, child], idx) => {
              return renderChild(childName, child, idx);
            })}
          {modes &&
            Object.entries(modes).map(([childName, child], idx) => {
              return renderChild(childName, child, idx);
            })}
        </AccordionPanel>
      </AccordionItem>
    );
  }
}

const HintsAccordionContainer = () => {
  const hints = useSelector(selectHints);

  return <HintsAccordion hints={hints} />;
};

export default HintsAccordionContainer;
