import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { IndicatorApi } from "./IndicatorApi";

interface Props {
  readonly IndicatorApi: IndicatorApi;
}

export function useIndicatorContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new IndicatorApi(data), [data]);
  return { IndicatorApi: api };
}
