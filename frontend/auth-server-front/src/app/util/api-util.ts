import { HttpHeaders } from "@angular/common/http";
import { environment } from '../../environments/environment'

const BASE_API = environment.isThroughGateway ? "auth-service/open/api" : "/open/api";
const TOKEN = "token";
let emptyTokenCallback = null;

export function onEmptyToken(callback) {
  emptyTokenCallback = callback;
}

export function buildApiPath(subPath: string): string {
  subPath = subPath.startsWith("/", 0) ? subPath : "/" + subPath;
  return BASE_API + subPath;
}

export function buildOptions() {
  let token = getToken();
  if (!token && emptyTokenCallback) {
    console.log("No token found, invoking registered onEmptyToken callback");
    emptyTokenCallback();
    return;
  }
  return {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: token,
    }),
    withCredentials: true,
  };
}

export function setToken(token: string) {
  if (token === null) localStorage.removeItem(TOKEN);
  else localStorage.setItem(TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN);
}
