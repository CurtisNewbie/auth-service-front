import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  constructor(private router: Router) {}

  /** Navigate to using Router*/
  public navigateTo(nt: NavType, extra?: any[]): void {
    let arr: any[] = [nt];
    if (extra != null) arr = arr.concat(extra);
    this.router.navigate(arr);
  }
}

/** Navigation Type (Where we are navigating to) */
export enum NavType {
  USER_DETAILS = "user-details",
  LOGIN_PAGE = "login-page",
  MANAGE_USER = "manage-user",
  ACCESS_LOG = "access-log",
  CHANGE_PASSWORD = "change-password",
  OPERATE_HISTORY = "operate-history",
  MANAGE_TASKS = "manage-task",
  REGISTER_PAGE = "register",
  TASK_HISTORY = "task-history",
  USER_APP = "user-app",
  MANAGE_TOKENS = "manage-tokens",
}
