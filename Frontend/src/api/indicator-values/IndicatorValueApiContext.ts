import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { IndicatorValueApi } from "./IndicatorValueApi";

interface Props {
  readonly IndicatorValueApi: IndicatorValueApi;
}

export function useIndicatorValueContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new IndicatorValueApi(data), [data]);
  return { IndicatorValueApi: api };
}
