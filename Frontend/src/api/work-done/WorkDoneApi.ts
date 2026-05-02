import { BaseApi } from "../BaseApi";
import { WorkDoneQueryProps } from "./WorkDoneDto";

export class WorkDoneApi extends BaseApi {
  public getByDirection(directionId: string, query?: WorkDoneQueryProps) {
    return this.get(`work-done/${directionId}`, { query });
  }

  public getByDirectionAndIndicator(
    directionId: string,
    indicatorId: string,
    params?: WorkDoneQueryProps,
  ) {
    return this.get(`work-done/${directionId}/indicators/${indicatorId}`, params as any);
  }

  // Hozirgi yo'nalish uchun Excel yuklab olish
  public exportExcel(directionId: string, query?: WorkDoneQueryProps): Promise<void> {
    const fileName = `bajarilgan-ishlar-${query?.from ?? ''}-${query?.to ?? ''}.xlsx`;
    return this.downloadBlob(`work-done/${directionId}/export`, fileName, query);
  }
}
