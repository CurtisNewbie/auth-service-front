import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material";
import { PagingController } from "src/models/paging";
import { AppService, AppVo } from "../app.service";

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
  pagingController: PagingController = new PagingController();

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.fetchList();
  }

  fetchList() {
    this.appService
      .listAllApps({ pagingVo: this.pagingController.paging })
      .subscribe({
        next: (resp) => {
          this.apps = resp.data.payload;
          this.pagingController.updatePages(resp.data.pagingVo.total);
        },
      });
  }

  handle(e: PageEvent): void {
    this.pagingController.handle(e);
    this.fetchList();
  }
}
