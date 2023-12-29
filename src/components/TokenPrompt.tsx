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

      <p>
        Example token:
        b21da0899ef4f33a81756cb21b4cb01177e59699f00040e7413d794d0ea6e118
      </p>

      <p>Save the token into the text input and save it</p>
      <textarea
        id="token-input"
        onChange={(e) => setToken(e.target.value)}
        value={token}
        cols={50}
        rows={3}
      ></textarea>
      <button
        onClick={() => {
          window.localStorage.setItem("hhdToken", token);
          navigate("/app");
        }}
      >
        Save Token
      </button>

      <p>
        Already saved the token? Go to the app <a href="#/app">Here</a>
      </p>
    </div>
  );
};

export default TokenPrompt;
