import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { CrimeApi } from "./CrimeApi";

interface Props {
  readonly CrimeApi: CrimeApi;
}

export function useCrimeContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new CrimeApi(data), [data]);
  return { CrimeApi: api };
}
