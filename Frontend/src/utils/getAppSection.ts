export function getAppSection(pathname: string): string {
  return "/" + pathname.split("/").filter(Boolean).slice(0, 2).join("/");
}
