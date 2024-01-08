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
  FormControl,
  Alert,
  AlertIcon,
  AbsoluteCenter,
} from "@chakra-ui/react";

import { getToken, getUrl, isLoggedIn, setToken, setUrl } from "../local";
import { useEffect, useState } from "react";
import { useLogin } from "../hooks/auth";

export default function FrontPage() {
  const navigate = useNavigate();
  const [url, setUrlState] = useState(getUrl());
  const [token, setTokenState] = useState(getToken());
  const { login, errorMessage } = useLogin();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/ui");
    }
  }, []);

  return (
    // TODO: Figure out on small displays why scrolling is weird
    <Center minW="100vw" minH="100vh">
      <Box>
        <Card maxW="md" margin="1rem 0">
          <CardHeader>
            <Heading textAlign="center" as="h1" size="4xl" noOfLines={2}>
              Handheld Daemon
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Text>Welcome to the Handheld Daemon Configurator!</Text>

              <Text>
                This is a static website you can use to configure your device
                (everything is done locally and there is no server). With the
                default security settings, you need to visit this webpage from
                your device and enter a security token. This token can be found
                below. Have fun!
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
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setUrlState(e.target.value);
                    }}
                    borderRightRadius="0"
                    placeholder="URL"
                  ></Input>
                  <Button
                    w="5rem"
                    onClick={() => {
                      setUrl("");
                      setUrlState("");
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
                      setToken(e.target.value);
                      setTokenState(e.target.value);
                    }}
                    value={token}
                    borderRightRadius="0"
                    placeholder="Token (empty if disabled)"
                  ></Input>
                  <Button
                    w="5rem"
                    onClick={() => {
                      setToken("");
                      setTokenState("");
                    }}
                    borderLeftRadius="0"
                  >
                    Clear
                  </Button>
                </Flex>
                <Button
                  onClick={() => {
                    login();
                  }}
                  borderLeftRadius="0"
                >
                  Connect
                </Button>
                {errorMessage && (
                  <Alert status="error">
                    <AlertIcon />
                    {errorMessage}
                  </Alert>
                )}
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
}
