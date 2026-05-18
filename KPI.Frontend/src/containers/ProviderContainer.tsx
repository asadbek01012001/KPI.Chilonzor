import { SWRConfig } from "swr";
import { ReactNode, useMemo } from "react";

import { useShallowEqualSelector } from "../hooks/useShallowSelector";
import { ApiProvider } from "../api/ApiContext";
import { tokenSelector, userIdSelector } from "../reducers/authReducer";
import { useAuthContext } from "../api/auth/AuthApiContext";

interface Props {
  readonly children: ReactNode;
}

export function ProviderContainer({ children }: Props) {
  const token = useShallowEqualSelector(tokenSelector);
  const refreshToken = useShallowEqualSelector(tokenSelector);
  const userId = useShallowEqualSelector(userIdSelector);

  const { logout, setToken } = useAuthContext();

  const data = useMemo(
    () => ({ token, refreshToken, userId, logout, setToken }),
    [token, refreshToken, userId],
  );

  return (
    <ApiProvider data={data}>
      <SWRConfig value={{ revalidateOnFocus: false }}>{children}</SWRConfig>
    </ApiProvider>
  );
}
