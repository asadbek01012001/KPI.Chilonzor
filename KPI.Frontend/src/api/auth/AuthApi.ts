import { BaseApi } from "../BaseApi";
import { LoginProps, RegisterProps, RefreshTokenProps } from "./AuthDto";

export class AuthApi extends BaseApi {
  public loginUser(json: LoginProps) {
    return this.post("auth/login", { json });
  }

  public register(json: RegisterProps) {
    return this.post("auth/register", { json });
  }

  public refresh(json: RefreshTokenProps) {
    return this.post("auth/refresh", { json });
  }

  public logoutUser(json: RefreshTokenProps) {
    return this.post("auth/logout", { json });
  }
}
