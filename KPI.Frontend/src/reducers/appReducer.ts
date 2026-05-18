import { update } from "immupdate";
import { PersistConfig } from "redux-persist";

import { AppStoreState } from "../store/RootReducer";
import {
  createReducer,
  createRootReducer,
  PerformAction,
} from "../utils/ReducerUtils";
import { AppMenuType } from "../api/AppDto";

export const appReducerPersistConfig: Partial<PersistConfig<AppReducerState>> =
  {
    whitelist: [
      "language",
      "theme",
      "menuType",
      "username",
      "totalRowCount",
      "totalPageCount",
    ],
  };

interface SwitchMenuTypeMeta {
  readonly menuType: AppMenuType;
}

interface SwitchUsernameMeta {
  readonly username: string;
}

interface SwitchTotalRowCountMeta {
  readonly totalRowCount: string;
}

interface SwitchTotalPageCountMeta {
  readonly totalPageCount: string;
}

interface SwitchLanguageMeta {
  readonly language: string;
}

interface SwitchThemeMeta {
  readonly theme: "dark" | "light";
}

enum ReducerActions {
  SwitchLanguage = "App/SwitchLanguage",
  SwitchTheme = "App/SwitchTheme",
  SwitchMenuType = "App/SwitchMenuType",
  SwitchUsername = "App/SwitchUsername",
  SwitchTotalRowCount = "App/SwitchTotalRowCount",
  SwitchTotalPageCount = "App/SwitchTotalPageCount",
}

export interface AppReducerState {
  readonly language: string;
  readonly theme: "dark" | "light";
  readonly menuType: AppMenuType;
  readonly username: string;
  readonly totalPageCount: string;
  readonly totalRowCount: string;
}

function getState(): AppReducerState {
  return {
    language: "uz",
    theme: "dark",
    menuType: AppMenuType.Opened,
    username: "",
    totalPageCount: "0",
    totalRowCount: "0",
  };
}

export const appReducer = createRootReducer<AppReducerState>(
  getState(),

  createReducer([ReducerActions.SwitchLanguage], (state, { meta }) =>
    update(state, { language: meta.language }),
  ),

  createReducer([ReducerActions.SwitchTheme], (state, { meta }) =>
    update(state, { theme: meta.theme }),
  ),

  createReducer([ReducerActions.SwitchUsername], (state, { meta }) =>
    update(state, { username: meta.username }),
  ),

  createReducer([ReducerActions.SwitchMenuType], (state, { meta }) =>
    update(state, { menuType: meta.menuType }),
  ),

  createReducer([ReducerActions.SwitchTotalPageCount], (state, { meta }) =>
    update(state, { totalPageCount: meta.totalPageCount }),
  ),

  createReducer([ReducerActions.SwitchTotalRowCount], (state, { meta }) =>
    update(state, { totalRowCount: meta.totalRowCount }),
  ),
);

// ==================
// Selectors
// ==================

export const appLanguageSelector = ({ app }: AppStoreState): string =>
  app.language;

export const appThemeSelector = ({ app }: AppStoreState): "dark" | "light" =>
  app.theme;

export const appMenuTypeSelector = ({ app }: AppStoreState): AppMenuType =>
  app.menuType;

export const appUsernameSelector = ({ app }: AppStoreState): string =>
  app.username;

export const appTotalPageCountSelector = ({ app }: AppStoreState): string =>
  app.totalPageCount;

export const appTotalRowCountSelector = ({ app }: AppStoreState): string =>
  app.totalRowCount;

// ==================
// Actions
// ==================

export function switchLanguage(
  meta: SwitchLanguageMeta,
): PerformAction<SwitchLanguageMeta> {
  return { type: ReducerActions.SwitchLanguage, meta };
}

export function switchTheme(
  meta: SwitchThemeMeta,
): PerformAction<SwitchThemeMeta> {
  return { type: ReducerActions.SwitchTheme, meta };
}

export function switchMenuType(
  meta: SwitchMenuTypeMeta,
): PerformAction<SwitchMenuTypeMeta> {
  return { type: ReducerActions.SwitchMenuType, meta };
}

export function switchUsername(
  meta: SwitchUsernameMeta,
): PerformAction<SwitchUsernameMeta> {
  return { type: ReducerActions.SwitchUsername, meta };
}

export function switchTotalPageCount(
  meta: SwitchTotalPageCountMeta,
): PerformAction<SwitchTotalPageCountMeta> {
  return { type: ReducerActions.SwitchTotalPageCount, meta };
}

export function switchTotalRowCount(
  meta: SwitchTotalRowCountMeta,
): PerformAction<SwitchTotalRowCountMeta> {
  return { type: ReducerActions.SwitchTotalRowCount, meta };
}
