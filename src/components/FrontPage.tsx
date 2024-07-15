import {
  Alert,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Flex,
  Input,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { useError, useLogin, useToken, useUrl } from "../model/hooks";
import { selectAppType } from "../model/slice";
import { Logo } from "./theme";

export default function FrontPage() {
  const { url, setUrl } = useUrl();
  const { token, setToken } = useToken();
  const { error } = useError();
  const login = useLogin();
  const appType = useSelector(selectAppType);
  const isWeb = appType === "web";

  return (
    // TODO: Figure out on small displays why scrolling is weird
    <Flex minH="100%" alignItems="center" justifyContent="center">
      <Card maxW="md" margin="1rem 0" height="fit-content">
        <CardHeader>
          <Flex width="100%" margin="1rem 0 0 0" justifyContent="center">
            <Logo width="70%" />
          </Flex>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="3">
            <Text textAlign="center">
              Welcome to the Handheld Daemon configurator!
            </Text>

            <Text>
              This is {isWeb ? "a static website" : "an app"} you can use to
              configure your device
              {isWeb && "(everything is done locally and there is no server)"}.
              With default settings, you need to
              {isWeb && "visit this webpage from your device and"} enter a
              security token. This token can be found below. Have fun!
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
    </Flex>
  );
}
