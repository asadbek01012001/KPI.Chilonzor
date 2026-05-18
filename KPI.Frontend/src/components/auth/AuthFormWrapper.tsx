import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useAuthContext } from "../../api/auth/AuthApiContext";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { setToken } from "../../reducers/authReducer";
import { AnyAction } from "../../utils/ReducerUtils";

import AuthForm from "./AuthForm";

export interface LoginValues {
  email: string;
  password: string;
}

export default function AuthFormWrapper() {
  const navigate = useNavigate();

  const dispatch = useDispatch<Dispatch<AnyAction>>();

  const [initialValues] = useState<LoginValues>({
    email: "",
    password: "",
  });

  const { AuthApi } = useAuthContext();

  const onSubmit = useCallback(
    (value: any) => {
      AuthApi.loginUser(value)
        .then((res) => {
          if (res?.accessToken) {
            dispatch(setToken({ token: res?.accessToken }));
            navigate("/dashboard/statistics");
          }
        })
        .catch((e) => console.log(e))
        .finally();
    },
    [navigate, AuthApi, dispatch],
  );

  return <AuthForm initialValues={initialValues} onSubmit={onSubmit} />;
}
