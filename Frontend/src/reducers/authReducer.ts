import { PersistConfig } from "redux-persist";
import { jwtDecode } from "jwt-decode";
import { AppStoreState } from "../store/RootReducer";
import {
  createReducer,
  createRootReducer,
  PerformAction,
} from "../utils/ReducerUtils";
import { DELETE, update } from "immupdate";
import { Action } from "redux";

export const authReducerPersistConfig: Partial<
  PersistConfig<AuthReducerState>
> = {
  whitelist: ["token", "userId"],
};

export interface Profile {
  readonly role: string;
  readonly Organization: string;
  readonly OrganId: string;
  readonly Position: string;
  readonly PhoneNumber: string;
  readonly FullName: string;
  readonly Services: string;
  readonly UserId: string;
  readonly Username: string;
  readonly RegionId: string;
}

interface SetTokenMeta {
  readonly token: string;
}

interface SetUserIdMeta {
  readonly userId: string;
}

enum ReducerActions {
  SetToken = "Auth/SetToken",
  ResetToken = "Auth/ResetToken",
  SetUserId = "Auth/SetUserId",
}

export interface AuthReducerState {
  readonly token?: string;
  readonly userId?: string;
}

function getState(): AuthReducerState {
  return {
    token: "",
    userId: "",
  };
}

export const authReducer = createRootReducer<AuthReducerState>(
  getState(),

  createReducer([ReducerActions.SetUserId], (state, { meta }) =>
    update(state, { userId: meta.userId }),
  ),

  createReducer([ReducerActions.SetToken], (state, { meta }) =>
    update(state, { token: meta.token }),
  ),

  createReducer([ReducerActions.ResetToken], (state) =>
    update(state, { token: DELETE }),
  ),
);

// ==================
// Selectors
// ==================

export function userIdSelector(state: AppStoreState): string | undefined {
  return state.auth.userId;
}

export function tokenSelector(state: AppStoreState): string | undefined {
  return state.auth.token;
}

export function profileSelector(state: AppStoreState): Profile | undefined {
  if (state.auth.token) {
    const profile: Profile = jwtDecode(state?.auth?.token);
    return profile;
  }
  return;
}

// ==================
// Actions
// ==================

export function SetUserId(meta: SetUserIdMeta): PerformAction<SetUserIdMeta> {
  return { meta, type: ReducerActions.SetUserId };
}

export function setToken(meta: SetTokenMeta): PerformAction<SetTokenMeta> {
  return {
    type: ReducerActions.SetToken,
    meta,
  };
}

export function resetToken(): Action {
  return { type: ReducerActions.ResetToken };
}
