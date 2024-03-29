import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import {
  ChangePasswordParam,
  UserInfo,
} from "src/common/user-info";
import { NavigationService, NavType } from "./navigation.service";
import { NotificationService } from "./notification.service";
import {
  setToken,
  getToken,
  onEmptyToken,
  HClient,
} from "../common/api-util";
import { Resp } from "src/common/resp";
import { timer } from "rxjs";
import { environment } from "src/environments/environment";

export interface RoleBrief {
  roleNo?: string;
  name?: string;
  code?: string;
}

export interface ResBrief {
  code?: string;
  name?: string;
}

@Injectable({
  providedIn: "root",
})
export class UserService implements OnDestroy {

  private isLoggedInSubject = new Subject<boolean>();
  private userInfoSubject = new Subject<UserInfo>();
  private resources: Set<string> = null;

  private tokenRefresher: Subscription = timer(60_000, 360_000).subscribe(
    () => {
      let t = getToken();
      if (t != null) {
        this.exchangeToken(t).subscribe({
          next: (resp) => {
            // console.log("token refreshed");
            setToken(resp.data);
          },
        });
      }
    }
  );

  userInfoObservable: Observable<UserInfo> = this.userInfoSubject.asObservable();
  isLoggedInObservable: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HClient,
    private nav: NavigationService,
    private notifi: NotificationService
  ) {
    onEmptyToken(() => this.logout());
  }

  ngOnDestroy(): void {
    this.tokenRefresher.unsubscribe();
  }

  hasResource(code): boolean {
    if (this.resources == null) return false;
    return this.resources.has(code);
  }

  /**
   * Attempt to sign-in
   * @param username
   * @param password
   */
  public login(username: string, password: string): Observable<Resp<any>> {
    return this.http.post<any>(
      environment.authServicePath, "/user/login",
      {
        username: username,
        password: password,
        appName: "auth-service",
      }
    );
  }

  /**
   * Logout current user
   */
  public logout(): void {
    setToken(null);
    this._notifyLoginStatus(false);
    this.nav.navigateTo(NavType.LOGIN_PAGE);
  }

  /**
   * Register user
   * @param username
   * @param password
   * @returns
   */
  public register(username: string, password: string): Observable<Resp<any>> {
    return this.http.post<any>(
      environment.authServicePath, "/user/register/request",
      { username, password },
    );
  }

  public fetchRoleBriefs(): Observable<Resp<any>> {
    return this.http.get<any>(environment.goauthPath, "/role/brief/all");
  }

  public fetchAllResBrief(): Observable<Resp<any>> {
    return this.http.get<any>(environment.goauthPath, "/resource/brief/all");
  }

  public fetchUserResources() {
    this.http.get<any>(environment.goauthPath, "/resource/brief/user").subscribe({
      next: (res) => {
        this.resources = new Set();
        if (res.data) {
          for (let r of res.data) {
            this.resources.add(r.code);
          }
        }
      }
    })
  }

  /**
   * Fetch user info
   */
  public fetchUserInfo(callback = null): void {
    this.http
      .get<UserInfo>(environment.authServicePath, "/user/info")
      .subscribe({
        next: (resp) => {
          if (resp.data) {
            this.onUserInfoFetched(resp.data)
            if (callback) callback();
          } else {
            this.notifi.toast("Please login first");
            setToken(null);
            this.nav.navigateTo(NavType.LOGIN_PAGE);
            this._notifyLoginStatus(false);
          }
        },
      });
  }

  private onUserInfoFetched(userInfo: UserInfo): void {
    this._notifyLoginStatus(true);
    this._notifyUserInfo(userInfo);
  }

  private _notifyUserInfo(userInfo: UserInfo): void {
    this.userInfoSubject.next(userInfo);
  }

  /** Notify the login status of the user via observable */
  private _notifyLoginStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  /**
   * Change password
   */
  public changePassword(param: ChangePasswordParam): Observable<Resp<any>> {
    return this.http.post<any>(
      environment.authServicePath, "/user/password/update",
      param,
    );
  }

  /**
   * Exchange Token
   */
  private exchangeToken(token: string): Observable<Resp<string>> {
    return this.http.post<any>(
      environment.authServicePath, "/token/exchange",
      { token: token },
    );
  }

}
