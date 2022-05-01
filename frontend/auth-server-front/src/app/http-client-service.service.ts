import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Resp } from "../models/resp";
import {
  AddUserParam,
  ChangePasswordParam,
  FetchUserInfoParam,
  FetchUserInfoResp,
  RegisterUserParam,
  UserInfo,
} from "src/models/user-info";
import {
  FetchAccessLogList,
  FetchAccessLogListParam,
} from "src/models/access-log";
import { buildApiPath, buildOptions } from "./util/api-util";
import { Paging } from "src/models/paging";
import { FetchOperateLogListResp } from "src/models/operate-log";

@Injectable({
  providedIn: "root",
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch list of file info
   */
  public fetchAccessLogList(
    param: FetchAccessLogListParam
  ): Observable<Resp<FetchAccessLogList>> {
    return this.http.post<Resp<FetchAccessLogList>>(
      buildApiPath("/access/history"),
      param,
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

  /** Fetch operate_log list */
  public fetchOperateLogList(
    param: Paging
  ): Observable<Resp<FetchOperateLogListResp>> {
    return this.http.post<Resp<FetchOperateLogListResp>>(
      buildApiPath("/operate/history"),
      param,
      buildOptions()
    );
  }
}
