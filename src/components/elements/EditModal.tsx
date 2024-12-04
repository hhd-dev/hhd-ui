import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { ModeSetting, Setting, getSettingChoices } from "../../model/common";
import { useSelectedSetting, useSettingState } from "../../model/hooks";
import slice, {
  selectHasController,
  selectSelectedChoice,
} from "../../model/slice";
import { ControllerButton } from "../Controller";
import { getButtonStyle } from "./utils";
import { useEffect, useRef } from "react";

function ModalButton({
  val,
  name,
  sel,
  state,
  setting,
  colorState,
  click,
}: {
  val: string;
  name: string;
  sel: string;
  state: any;
  setting: Setting;
  colorState:
    | Record<
        string,
        {
          hue: number;
          hue2: number | undefined;
          saturation: number;
          brightness: number;
        }
      >
    | undefined;
  click: (val: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sel === val && ref.current) {
      ref.current.focus();
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [sel, val]);

  return (
    <Button
      key={val}
      ref={ref}
      margin="0.6rem"
      padding="1.5rem 0"
      colorScheme={val === sel ? "brand" : "gray"}
      rightIcon={String(state) === val ? <CheckIcon /> : undefined}
      transition="all 0.2s ease"
      onClick={() => click(val)}
      {...((setting as ModeSetting).modes &&
        getButtonStyle(
          (setting as ModeSetting).modes[val]?.tags,
          colorState ? colorState[val] : undefined
        ))}
      {...(val === sel ? { transform: "scale(1.06)" } : {})}
    >
      {String(name)}
    </Button>
  );
}

export function EditModal() {
  const { path, setting } = useSelectedSetting();
  const dispatch = useDispatch();
  const { state, setState } = useSettingState<any>(
    (path || "") + (setting && setting.type === "mode" ? ".mode" : "")
  );
  const sel = useSelector(selectSelectedChoice);
  const controller = useSelector(selectHasController);
  const { state: colorState } = useSettingState<
    Record<
      string,
      {
        hue: number;
        hue2: number | undefined;
        saturation: number;
        brightness: number;
      }
    >
  >(path || "");

  if (!path || !setting) return <></>;
  const is_custom_dropdown =
    setting.type == "custom" && setting.tags?.includes("dropdown");
  if (
    !["mode", "multiple", "action"].includes(setting.type) &&
    !is_custom_dropdown
  )
    return <></>;
  if (setting.tags?.includes("ordinal")) return <></>;
  const verify = setting.type === "action";

  const click = (val: string) => {
    if (val !== String(state)) {
      setState(setting.type === "discrete" ? Number(val) : val);
    }
    dispatch(slice.actions.unselect());
  };
  const apply = () => {
    setState(true);
    dispatch(slice.actions.unselect());
  };
  const cancel = () => {
    dispatch(slice.actions.unselect());
  };
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
            <Button
              aria-label="close modal"
              variant="transparent"
              onClick={() => dispatch(slice.actions.unselect())}
            >
              <CloseIcon h="2rem" w="1rem" marginRight=".5rem"></CloseIcon>
              {controller && (
                <ControllerButton h="2rem" button="b" marginRight="-0.5rem" />
              )}
            </Button>
          </Flex>
        </ModalHeader>

        <ModalBody textAlign="justify">
          {verify ? (
            <Flex direction="column">
              <Flex direction="row" margin="1rem">
                <Center>
                  <Divider
                    orientation="vertical"
                    marginRight="0.75rem"
                    alignSelf="stretch"
                  ></Divider>
                </Center>
                <Box>{setting.hint}</Box>
              </Flex>
              <Flex direction="row" marginBottom="1rem" justifyContent="center">
                <Button
                  margin="0.6rem"
                  w="8rem"
                  padding="1.5rem 0"
                  colorScheme={"brand"}
                  transition="all 0.2s ease"
                  onClick={apply}
                >
                  <CheckIcon />
                  {controller && (
                    <ControllerButton
                      h="2rem"
                      button="a"
                      marginLeft="1rem"
                      invert
                    />
                  )}
                </Button>
                <Button
                  margin="0.6rem"
                  w="8rem"
                  padding="1.5rem 0"
                  colorScheme={"brand"}
                  transition="all 0.2s ease"
                  onClick={cancel}
                >
                  <CloseIcon />
                  {controller && (
                    <ControllerButton
                      h="2rem"
                      button="b"
                      marginLeft="1rem"
                      invert
                    />
                  )}
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Flex direction="column" marginBottom="1rem">
              {Object.entries(getSettingChoices(setting, state)).map(([val, name]) => (
                <ModalButton
                  key={val}
                  val={val}
                  name={name as string}
                  sel={sel}
                  state={state}
                  setting={setting}
                  colorState={colorState}
                  click={click}
                />
              ))}
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
