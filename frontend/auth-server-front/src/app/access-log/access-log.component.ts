import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { AccessLog } from "src/models/access-log";
import { Paging, PagingConst, PagingController } from "src/models/paging";
import { HttpClientService } from "../http-client-service.service";

@Component({
  selector: "app-access-log",
  templateUrl: "./access-log.component.html",
  styleUrls: ["./access-log.component.css"],
})
export class AccessLogComponent implements OnInit {
  readonly COLUMNS_TO_BE_DISPLAYED: string[] = [
    "id",
    "userId",
    "user",
    "accessTime",
    "ipAddress",
    "url",
  ];
  accessLogList: AccessLog[] = [];
  pagingController: PagingController = new PagingController();

  constructor(private httpClient: HttpClientService) {}

  ngOnInit() {
    this.fetchAccessLogList();
  }

  /**
   * Fetch access log list
   */
  fetchAccessLogList(): void {
    this.httpClient
      .fetchAccessLogList({
        pagingVo: this.pagingController.paging,
      })
      .subscribe({
        next: (resp) => {
          this.accessLogList = resp.data.payload;
          let total = resp.data.pagingVo.total;
          if (total != null) {
            this.pagingController.updatePages(total);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  handle(e: PageEvent): void {
    this.pagingController.handle(e);
    this.fetchAccessLogList();
  }
}
