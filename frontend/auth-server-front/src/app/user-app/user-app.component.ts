import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { PagingController } from "src/models/paging";
import { AppService, AppVo } from "../app.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-app",
  templateUrl: "./user-app.component.html",
  styleUrls: ["./user-app.component.css"],
})
export class UserAppComponent implements OnInit {
  readonly COLUMNS_TO_BE_DISPLAYED = [
    "id",
    "name",
    "createTime",
    "createBy",
    "updateTime",
    "updateBy",
  ];
  apps: AppVo[] = [];
  pagingController: PagingController;

  constructor(
    private appService: AppService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.appService
      .listAllApps({ pagingVo: this.pagingController.paging })
      .subscribe({
        next: (resp) => {
          this.apps = resp.data.payload;
          this.pagingController.onTotalChanged(resp.data.pagingVo);
        },
      });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

}
