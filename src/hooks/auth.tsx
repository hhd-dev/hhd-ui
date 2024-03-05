import { useDispatch } from "react-redux";
import { AppDispatch } from "../model/store";
import hhdSlice, { ErrorStates } from "../model/slice";
import { useNavigate } from "react-router-dom";
import { clearLoggedIn, setLoggedIn } from "../local";
import { useSelector } from "react-redux";
import { selectLoginErrorMessage } from "../model/slice";

export const useResetHhdState = () => {
  const dispatch = useDispatch<AppDispatch>();

  return () => dispatch(hhdSlice.actions.resetHhdState());
};

export const useSetLoginErrorMessage = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (errorMessage: string) =>
    dispatch(
      hhdSlice.actions.setError({
        errorName: ErrorStates.LoginFailed,
        errorMessage,
      })
    );
};

export const useLogout = () => {
  const setLoginErrorMessage = useSetLoginErrorMessage();
  const navigate = useNavigate();
  const resetHhdState = useResetHhdState();

  const logout = (errorMessage?: string) => {
    clearLoggedIn();
    if (errorMessage) {
      setLoginErrorMessage(errorMessage);
    }
    resetHhdState();
    navigate("/");
  };
  return logout;
};

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = () => {
    setLoggedIn();
    dispatch(hhdSlice.actions.resetHhdState());
    dispatch(hhdSlice.actions.clearError(ErrorStates.LoginFailed));
    navigate("/ui");
  };

  const errorMessage = useSelector(selectLoginErrorMessage);

  return { login, errorMessage };
};
