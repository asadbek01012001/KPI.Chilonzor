import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { UserApi } from "./UserApi";

interface Props {
  readonly UserApi: UserApi;
}

export function useUserContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new UserApi(data), [data]);
  return { UserApi: api };
}
