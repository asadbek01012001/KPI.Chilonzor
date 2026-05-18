import { BaseApi } from "../BaseApi";
import { ReportQueryProps } from "./ReportDto";

export class ReportApi extends BaseApi {
  // Barcha mahallalar yoki bitta mahalla to'liq xisoboti
  public getMahallaReport(query?: ReportQueryProps) {
    return this.get("reports/mahalla", { query } as any);
  }

  public getExcelReport(query?: ReportQueryProps, fileName?: string) {
    return this.downloadExcel(
      "reports/export/excel",
      { query } as any,
      fileName,
    );
  }
}
