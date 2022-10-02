import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Resp } from "src/models/resp";
import {
  ListTaskByPageReqVo,
  ListTaskByPageRespVo,
  ListTaskHistoryReqVo,
  ListTaskHistoryRespVo,
  TriggerTaskReqVo,
  UpdateTaskReqVo,
} from "src/models/task";
import { HClient } from "./util/api-util";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HClient) { }

  /**
   * Fetch task list
   * @param param
   */
  public fetchTaskList(
    param: ListTaskByPageReqVo
  ): Observable<Resp<ListTaskByPageRespVo>> {
    return this.http.post<ListTaskByPageRespVo>(
      environment.taskServicePath, "/task/list",
      param
    );
  }

  /**
   * Update task
   * @param param
   * @returns
   */
  public updateTask(param: UpdateTaskReqVo): Observable<Resp<void>> {
    return this.http.post<void>(
      environment.taskServicePath, "/task/update",
      param,
    );
  }

  /**
   * Trigger a task
   */
  public triggerTask(param: TriggerTaskReqVo): Observable<Resp<void>> {
    return this.http.post<void>(
      environment.taskServicePath, "/task/trigger",
      param,
    );
  }

  /**
   * Fetch task history
   * @param param
   */
  public fetchTaskHistory(
    param: ListTaskHistoryReqVo
  ): Observable<Resp<ListTaskHistoryRespVo>> {
    return this.http.post<ListTaskHistoryRespVo>(
      environment.taskServicePath, "/task/history",
      param,
    );
  }
}
