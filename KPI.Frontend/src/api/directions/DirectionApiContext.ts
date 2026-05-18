import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { DirectionApi } from "./DirectionApi";

interface Props {
  readonly DirectionApi: DirectionApi;
}

export function useDirectionContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new DirectionApi(data), [data]);
  return { DirectionApi: api };
}
