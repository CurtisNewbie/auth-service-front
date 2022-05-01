import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paging } from "src/models/paging";
import { Resp } from "src/models/resp";
import { buildApiPath, buildOptions } from "./util/api-util";

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
  createTime: string;

  /** who created this record */
  createBy: string;

  /** when the record is updated */
  updateTime: string;

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
  constructor(private http: HttpClient) {}

  /**
   * List app information
   */
  public listAllApps(
    param: ListAllAppReqVo
  ): Observable<Resp<ListAllAppRespVo>> {
    return this.http.post<Resp<ListAllAppRespVo>>(
      buildApiPath("/app/list/all"),
      param,
      buildOptions()
    );
  }

  /**
   * List permitted apps for user
   */
  public listAppsForUser(
    param: ListAppsForUserReqVo
  ): Observable<Resp<AppBriefVo[]>> {
    return this.http.post<Resp<AppBriefVo[]>>(
      buildApiPath("/app/list/user"),
      param,
      buildOptions()
    );
  }

  /**
   * Update user's permitted apps
   */
  public updateUserApps(param: UpdateUserAppsReqVo): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/app/user/update"),
      param,
      buildOptions()
    );
  }

  /**
   * Get all app brief info
   */
  public listAllAppsBrief() {
    return this.http.get<Resp<AppBriefVo[]>>(
      buildApiPath("/app/list/brief/all"),
      buildOptions()
    );
  }
}
