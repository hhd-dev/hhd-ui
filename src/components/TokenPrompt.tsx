import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <h1>Input HHD Token</h1>
      <p>You can get the token by running the following in terminal:</p>

      <pre>cat $HOME/.config/hhd/token</pre>

      <p>Example token: 2f7abbc42dc7</p>

      <p>Save the token into the text input and save it</p>
      <input
        type="text"
        id="token-input"
        onChange={(e) => setToken(e.target.value)}
        value={token}
      ></input>
      <button
        onClick={() => {
          window.localStorage.setItem("hhdToken", token);
          navigate("/");
        }}
      >
        Save Token
      </button>

      <p>
        Already saved the token? Go to the app <a href="#/">Here</a>
      </p>
    </div>
  );
};

export default TokenPrompt;
