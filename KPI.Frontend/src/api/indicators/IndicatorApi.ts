import { BaseApi } from "../BaseApi";
import {
  CreateIndicatorProps,
  UpdateIndicatorProps,
  IndicatorQueryProps,
} from "./IndicatorDto";

export class IndicatorApi extends BaseApi {
  public getAll(query?: IndicatorQueryProps) {
    return this.get("indicators", { query });
  }

  public getFlatList(directionId: string): Promise<any[]> {
    return this.get(`indicators/flat?direction_id=${directionId}`);
  }

  public getById(id: string) {
    return this.get(`indicators/${id}`);
  }

  public create(json: CreateIndicatorProps) {
    return this.post("indicators", { json });
  }

  public update(id: string, json: UpdateIndicatorProps) {
    return this.patch(`indicators/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`indicators/${id}`);
  }
}
