import { BaseApi } from "../BaseApi";
import { CreateUserProps, UpdateUserProps } from "./UserDto";

export class UserApi extends BaseApi {
  public getAll() {
    return this.get("users");
  }

  public getMe() {
    return this.get("users/me");
  }

  public getById(id: string) {
    return this.get(`users/${id}`);
  }

  public create(json: CreateUserProps) {
    return this.post("users", { json });
  }

  public updateMe(json: UpdateUserProps) {
    return this.patch("users/me", { json });
  }

  public update(id: string, json: UpdateUserProps) {
    return this.patch(`users/${id}`, { json });
  }

  public deleteUser(id: string) {
    return this.delete(`users/${id}`);
  }
}
