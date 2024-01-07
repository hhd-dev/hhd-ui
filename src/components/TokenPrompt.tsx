import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Text } from "@chakra-ui/react";

const TokenPrompt = () => {
  const [token, setToken] = useState(
    window.localStorage.getItem("hhdToken") || ""
  );
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text fontSize="2xl">Input HHD Token</Text>
      <p>You can get the token by running the following in terminal:</p>

      <pre>cat $HOME/.config/hhd/token</pre>

      <p>Example token: 2f7abbc42dc7</p>

      <p>Save the token into the text input and save it</p>
      <Input
        type="text"
        id="token-input"
        width="20rem"
        onChange={(e) => setToken(e.target.value)}
        value={token}
      ></Input>
      <Button
        style={{ margin: "1rem" }}
        onClick={() => {
          window.localStorage.setItem("hhdToken", token);
          navigate("/");
        }}
      >
        Save Token
      </Button>

      <p>
        Already saved the token? Go to the app <a href="#/">Here</a>
      </p>
    </div>
  );
};

export default TokenPrompt;
