import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Resp } from "src/models/resp";
import {
  ListTaskByPageReqVo,
  ListTaskByPageRespVo,
  ListTaskHistoryReqVo,
  ListTaskHistoryRespVo,
  TaskHistory,
  TriggerTaskReqVo,
  UpdateTaskReqVo,
} from "src/models/task";
import { buildApiPath, httpClientOptions } from "./util/api-util";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch task list
   * @param param
   */
  public fetchTaskList(
    param: ListTaskByPageReqVo
  ): Observable<Resp<ListTaskByPageRespVo>> {
    return this.http.post<Resp<ListTaskByPageRespVo>>(
      buildApiPath("/task/list"),
      param,
      httpClientOptions
    );
  }

  /**
   * Update task
   * @param param
   * @returns
   */
  public updateTask(param: UpdateTaskReqVo): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/task/update"),
      param,
      httpClientOptions
    );
  }

  /**
   * Trigger a task
   */
  public triggerTask(param: TriggerTaskReqVo): Observable<Resp<void>> {
    return this.http.post<Resp<void>>(
      buildApiPath("/task/trigger"),
      param,
      httpClientOptions
    );
  }

  /**
   * Fetch task history
   * @param param
   */
  public fetchTaskHistory(
    param: ListTaskHistoryReqVo
  ): Observable<Resp<ListTaskHistoryRespVo>> {
    return this.http.post<Resp<ListTaskHistoryRespVo>>(
      buildApiPath("/task/history"),
      param,
      httpClientOptions
    );
  }
}
