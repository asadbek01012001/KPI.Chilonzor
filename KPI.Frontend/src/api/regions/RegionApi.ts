import { BaseApi } from "../BaseApi";
import { CreateRegionProps, UpdateRegionProps } from "./RegionDto";

export class RegionApi extends BaseApi {
  public getAll() {
    return this.get("regions?limit=100");
  }

  public getById(id: string) {
    return this.get(`regions/${id}`);
  }

  public create(json: CreateRegionProps) {
    return this.post("regions", { json });
  }

  public update(id: string, json: UpdateRegionProps) {
    return this.patch(`regions/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`regions/${id}`);
  }
}
