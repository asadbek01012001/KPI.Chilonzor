import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { DashboardApi } from "./DashboardApi";

interface Props {
  readonly DashboardApi: DashboardApi;
}

export function useDashboardContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new DashboardApi(data), [data]);
  return { DashboardApi: api };
}
