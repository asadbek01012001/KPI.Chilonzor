import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { RegionApi } from "./RegionApi";

interface Props {
  readonly RegionApi: RegionApi;
}

export function useRegionContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new RegionApi(data), [data]);
  return { RegionApi: api };
}
