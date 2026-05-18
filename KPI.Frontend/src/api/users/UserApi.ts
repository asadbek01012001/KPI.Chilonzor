import { BaseApi } from "../BaseApi";
import { CreateUserProps, GetUsersParams, PaginatedUsersResponse, UpdateUserProps } from "./UserDto";

export class UserApi extends BaseApi {
  public getAllPaginated(params?: GetUsersParams): Promise<PaginatedUsersResponse> {
    const query: Record<string, any> = {};
    if (params?.page)   query.page   = params.page;
    if (params?.limit)  query.limit  = params.limit;
    if (params?.search) query.search = params.search;
    if (params?.role)   query.role   = params.role;
    return this.getWithMeta("users", { query });
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
