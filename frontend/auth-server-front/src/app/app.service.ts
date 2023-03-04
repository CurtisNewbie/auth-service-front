import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Paging } from "src/common/paging";
import { Resp } from "src/common/resp";
import { HClient } from "../common/api-util";

export interface ListAllAppReqVo {
  pagingVo: Paging;
}

export interface ListAllAppRespVo {
  payload: AppVo[];
  pagingVo: Paging;
}

export interface AppVo {
  /** primary key */
  id: number;

  /** name of the application */
  name: string;

  /** when the record is created */
  createTime: Date;

  /** who created this record */
  createBy: string;

  /** when the record is updated */
  updateTime: Date;

  /** who updated this record */
  updateBy: string;
}

export interface ListAppsForUserReqVo {
  /** user's id */
  userId: number;
}

export interface AppBriefVo {
  /** primary key */
  id: number;

  /** name of the application */
  name: string;
}

export interface UpdateUserAppsReqVo {
  /** user's id */
  userId: number;

  /** list of app id */
  appIdList: number[];
}

@Injectable({
  providedIn: "root",
})
export class AppService {
  constructor(private http: HClient) { }

  /**
   * List app information
   */
  public listAllApps(
    param: ListAllAppReqVo
  ): Observable<any> {
    return this.http.post<any>(
      environment.authServicePath, "/app/list/all",
      param,
    );
  }

  /**
   * List permitted apps for user
   */
  public listAppsForUser(
    param: ListAppsForUserReqVo
  ): Observable<Resp<AppBriefVo[]>> {
    return this.http.post<AppBriefVo[]>(
      environment.authServicePath, "/app/list/user",
      param,
    );
  }

  /**
   * Update user's permitted apps
   */
  public updateUserApps(param: UpdateUserAppsReqVo): Observable<Resp<void>> {
    return this.http.post<void>(
      environment.authServicePath, "/app/user/update",
      param,
    );
  }

  /**
   * Get all app brief info
   */
  public listAllAppsBrief() {
    return this.http.get<AppBriefVo[]>(
      environment.authServicePath, "/app/list/brief/all",
    );
  }
}
