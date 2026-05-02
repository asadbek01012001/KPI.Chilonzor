export const IS_DEV = process.env.NODE_ENV !== "production";

export const API_HOST =
  (process.env.REACT_APP_API_URL_HOST as string) ||
  "https://localhost:44316/api/";
