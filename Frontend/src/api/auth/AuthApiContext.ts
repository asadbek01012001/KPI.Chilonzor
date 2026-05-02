import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useApiBase } from "../ApiContext";
import { AuthApi } from "./AuthApi";
import { resetToken, setToken } from "../../reducers/authReducer";
import { Dispatch } from "redux";
import { AnyAction } from "../../utils/ReducerUtils";

interface Props {
  readonly AuthApi: AuthApi;
  readonly logout: () => void;
  readonly setToken: (token: string) => void;
}

export function useAuthContext(): Props {
  const dispatch = useDispatch<Dispatch<AnyAction>>();
  const data = useApiBase();

  const api = useMemo(() => new AuthApi(data), [data]);

  const logoutHandler = useCallback(() => {
    dispatch(resetToken());
  }, [dispatch]);

  const setTokenHandler = useCallback(
    (token: string) => {
      dispatch(setToken({ token }));
    },
    [dispatch],
  );

  return {
    AuthApi: api,
    logout: logoutHandler,
    setToken: setTokenHandler,
  };
}
