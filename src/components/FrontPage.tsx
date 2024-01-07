import { useNavigate } from "react-router-dom";
import {
  Heading,
  Button,
  Input,
  Text,
  Box,
  Flex,
  Center,
  CardHeader,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Code,
} from "@chakra-ui/react";

import {
  getToken,
  getUrl,
  isLoggedIn,
  setLoggedIn,
  setToken,
  setUrl,
} from "../local";
import { useEffect, useReducer } from "react";

export default function FrontPage() {
  const navigate = useNavigate();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/ui");
    }
  }, []);

  return (
    <Center>
      <Box>
        {/* TODO: Find a way to do a proper margin for the top */}
        <Box height="50px"></Box>
        <Card maxW="md" marginTop="xl">
          <CardHeader>
            <Heading textAlign="center" as="h1" size="3xl" noOfLines={2}>
              Handheld Daemon
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Text>Welcome to the Handheld Daemon Configurator!</Text>

              <Text>
                You can configure your device from this page. For security
                reasons, you need to visit this webpage from your device, and
                enter a security token. This token can be found below. Have fun!
              </Text>

              <Code textAlign="center" padding="1rem" lang="bash">
                cat $HOME/.config/hhd/token
              </Code>

              <Text>
                Example token: <b>2f7abbc42dc7</b>
              </Text>

              <Stack spacing="2">
                <Flex>
                  <Input
                    type="text"
                    id="token-input"
                    value={getUrl()}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      forceUpdate();
                    }}
                    borderRightRadius="0"
                    placeholder="URL"
                  ></Input>
                  <Button
                    onClick={() => {
                      setUrl("");
                      forceUpdate();
                    }}
                    borderLeftRadius="0"
                  >
                    Reset
                  </Button>
                </Flex>

                <Flex>
                  <Input
                    type="text"
                    display="Token"
                    id="token-input"
                    onChange={(e) => {
                      setToken(e.target.value), forceUpdate();
                    }}
                    value={getToken()}
                    borderRightRadius="0"
                    placeholder="Token (empty if disabled)"
                  ></Input>
                  <Button
                    onClick={() => {
                      setLoggedIn();
                      navigate("/ui");
                    }}
                    borderLeftRadius="0"
                  >
                    Login
                  </Button>
                </Flex>
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
}
