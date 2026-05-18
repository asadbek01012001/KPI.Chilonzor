import { BaseApi } from "../BaseApi";
import { CreateIndicatorValueProps, UpdateIndicatorValueProps, IndicatorValueQueryProps } from "./IndicatorValueDto";

export class IndicatorValueApi extends BaseApi {
  public getAll(params?: IndicatorValueQueryProps) {
    return this.get("indicator-values", params as any);
  }

  public getById(id: string) {
    return this.get(`indicator-values/${id}`);
  }

  public create(json: CreateIndicatorValueProps) {
    return this.post("indicator-values", { json });
  }

  public bulkCreate(items: CreateIndicatorValueProps[]) {
    return this.post("indicator-values/bulk", { json: { items } });
  }

  public update(id: string, json: UpdateIndicatorValueProps) {
    return this.patch(`indicator-values/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`indicator-values/${id}`);
  }

  public removeByDate(date: string) {
    return this.delete(`indicator-values/by-date?date=${date}`);
  }
}
