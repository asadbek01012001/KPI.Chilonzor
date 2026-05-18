import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { WorkDoneApi } from "./WorkDoneApi";

interface Props {
  readonly WorkDoneApi: WorkDoneApi;
}

export function useWorkDoneContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new WorkDoneApi(data), [data]);
  return { WorkDoneApi: api };
}
