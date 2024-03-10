import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Code,
  Flex,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

import { useError, useLogin } from "../model/hooks";
import HhdLogo from "./Logo";
import { useToken } from "../model/hooks";
import { useUrl } from "../model/hooks";

export default function FrontPage() {
  const { url, setUrl } = useUrl();
  const { token, setToken } = useToken();
  const { error } = useError();
  const login = useLogin();

  return (
    // TODO: Figure out on small displays why scrolling is weird
    <Center minW="100vw" minH="100vh">
      <Box>
        <Card maxW="md" margin="1rem 0">
          <CardHeader>
            <HhdLogo width="65%" style={{ margin: "1rem auto 0.5rem auto" }} />
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
                    }}
                    borderRightRadius="0"
                    placeholder="URL"
                  ></Input>
                  <Button
                    w="5rem"
                    onClick={() => {
                      setUrl(null);
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
                    }}
                    value={token}
                    borderRightRadius="0"
                    placeholder="Token (empty if disabled)"
                  ></Input>
                  <Button
                    w="5rem"
                    onClick={() => {
                      setToken("");
                    }}
                    borderLeftRadius="0"
                  >
                    Clear
                  </Button>
                </Flex>
                <Button onClick={login}>Connect</Button>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
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
