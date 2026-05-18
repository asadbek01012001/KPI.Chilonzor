import { useMemo } from "react";
import { useApiBase } from "../ApiContext";
import { ReportApi } from "./ReportApi";

interface Props {
  readonly ReportApi: ReportApi;
}

export function useReportContext(): Props {
  const data = useApiBase();
  const api = useMemo(() => new ReportApi(data), [data]);
  return { ReportApi: api };
}
