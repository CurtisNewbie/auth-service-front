import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { environment } from "src/environments/environment";
import { FetchOperateLogListResp, OperateLog } from "src/models/operate-log";
import { PagingController } from "src/models/paging";
import { UserService } from "../user.service";
import { HClient } from "../util/api-util";

@Component({
  selector: "app-operate-history",
  templateUrl: "./operate-history.component.html",
  styleUrls: ["./operate-history.component.css"],
})
export class OperateHistoryComponent implements OnInit {
  operateLogList: OperateLog[] = [];
  pagingController: PagingController;
  COLUMNS_TO_BE_DISPLAYED = [
    "id",
    "user",
    "operateName",
    "operateDesc",
    "operateTime",
    "operateParam",
  ];

  constructor(
    private http: HClient,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
  }

  fetchOperateLogList(): void {
    this.http.post<FetchOperateLogListResp>(
      environment.authServicePath, "/operate/history",
      this.pagingController.paging
    ).subscribe({
      next: (resp) => {
        this.operateLogList = resp.data.operateLogVoList;
        this.pagingController.onTotalChanged(resp.data.pagingVo);
      },
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchOperateLogList();
    this.fetchOperateLogList();
  }

}
