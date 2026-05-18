import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { Emergency102Api } from "./Emergency102Api";

interface Props {
  readonly Emergency102Api: Emergency102Api;
}

export function useEmergency102Context(): Props {
  const data = useApiBase();
  const api = useMemo(() => new Emergency102Api(data), [data]);
  return { Emergency102Api: api };
}
