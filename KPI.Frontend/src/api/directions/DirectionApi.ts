import { BaseApi } from "../BaseApi";
import { CreateDirectionProps, UpdateDirectionProps } from "./DirectionDto";

export class DirectionApi extends BaseApi {
  public getAll() {
    return this.get("directions?limit=20");
  }

  public getById(id: string) {
    return this.get(`directions/${id}`);
  }

  public create(json: CreateDirectionProps) {
    return this.post("directions", { json });
  }

  public update(id: string, json: UpdateDirectionProps) {
    return this.patch(`directions/${id}`, { json });
  }

  public remove(id: string) {
    return this.delete(`directions/${id}`);
  }
}
