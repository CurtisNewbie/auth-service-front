import { HttpHeaders } from "@angular/common/http";

const BASE_API = "/api";

export function buildApiPath(subPath: string): string {
  subPath = subPath.startsWith("/", 0) ? subPath : "/" + subPath;
  return BASE_API + subPath;
}

export const httpClientOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
  withCredentials: true,
};
