import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import {
  ChangePasswordParam,
  FetchUserInfoParam,
  FetchUserInfoResp as FetchUserInfoResp,
  UpdateUserInfoParam,
  UserInfo,
} from "src/models/user-info";
import { NavigationService, NavType } from "./navigation.service";
import { NotificationService } from "./notification.service";
import {
  buildApiPath,
  buildOptions,
  setToken,
  getToken,
  onEmptyToken,
} from "./util/api-util";
import { Resp } from "src/models/resp";
import { timer } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private roleSubject = new Subject<string>();
  private isLoggedInSubject = new Subject<boolean>();
  private userInfoSubject = new Subject<UserInfo>();

  // refreshed every 5min
  private tokenRefresher: Subscription = timer(60_000, 360_000).subscribe(
    () => {
      let t = getToken();
      if (t != null) {
        this.exchangeToken(t).subscribe({
          next: (resp) => {
            console.log("token refreshed");
            setToken(resp.data);
          },
        });
      }
    }
  );

  userInfoObservable: Observable<UserInfo> =
    this.userInfoSubject.asObservable();
  roleObservable: Observable<string> = this.roleSubject.asObservable();
  isLoggedInObservable: Observable<boolean> =
    this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private nav: NavigationService,
    private notifi: NotificationService
  ) {
    onEmptyToken(() => this.logout());
  }

  /**
   * Attempt to sign-in
   * @param username
   * @param password
   */
  public login(username: string, password: string): Observable<Resp<any>> {
    return this.http.post<Resp<any>>(
      buildApiPath("/user/login"),
      {
        username: username,
        password: password,
        appName: "auth-service",
      },
      {
        withCredentials: true,
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
   * Add user, only admin is allowed to add user
   * @param username
   * @param password
   * @returns
   */
  public addUser(
    username: string,
    password: string,
    userRole: string
  ): Observable<Resp<any>> {
    return this.http.post<Resp<any>>(
      buildApiPath("/user/add"),
      { username, password, userRole },
      buildOptions()
    );
  }

  /**
   * Register user
   * @param username
   * @param password
   * @returns
   */
  public register(username: string, password: string): Observable<Resp<any>> {
    return this.http.post<Resp<any>>(
      buildApiPath("/user/register/request"),
      { username, password },
      buildOptions()
    );
  }

  /**
   * Fetch user info
   */
  public fetchUserInfo(callback = null): void {
    this.http
      .get<Resp<UserInfo>>(buildApiPath("/user/info"), buildOptions())
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
    console.log('Fetched UserInfo:', userInfo);
    this._notifyRole(userInfo.role);
    this._notifyLoginStatus(true);
    this._notifyUserInfo(userInfo);
  }

  private _notifyUserInfo(userInfo: UserInfo): void {
    this.userInfoSubject.next(userInfo);
  }

  /** Notify the role of the user via observable */
  private _notifyRole(role: string): void {
    this.roleSubject.next(role);
  }

  /** Notify the login status of the user via observable */
  private _notifyLoginStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

  /**
   * Fetch list of user infos (only admin is allowed)
   */
  public fetchUserList(
    param: FetchUserInfoParam
  ): Observable<Resp<FetchUserInfoResp>> {
    return this.http.post<Resp<FetchUserInfoResp>>(
      buildApiPath("/user/list"),
      param,
      buildOptions()
    );
  }

  /**
   * Update user info (only admin is allowed)
   */
  public updateUserInfo(param: UpdateUserInfoParam): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/user/info/update"),
      param,
      buildOptions()
    );
  }

  /**
   * Delete a disabled user (only admin is allowed)
   */
  public deleteDisabledUser(param: { id: number }): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/user/delete"),
      param,
      buildOptions()
    );
  }

  /**
   * Fetch user details
   */
  public fetchUserDetails(): Observable<
    Resp<{
      id;
      username;
      role;
      registerDate;
    }>
  > {
    return this.http.get<Resp<any>>(
      buildApiPath("/user/detail"),
      buildOptions()
    );
  }

  /**
   * Change password
   */
  public changePassword(param: ChangePasswordParam): Observable<Resp<any>> {
    return this.http.post<Resp<any>>(
      buildApiPath("/user/password/update"),
      param,
      buildOptions()
    );
  }

  /**
   * Exchange Token
   */
  private exchangeToken(token: string): Observable<Resp<string>> {
    return this.http.post<Resp<any>>(
      buildApiPath("/token/exchange"),
      { token: token },
      buildOptions()
    );
  }

  public reviewUserRegistration(param): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/user/registration/review"),
      param,
      buildOptions()
    );
  }
}
