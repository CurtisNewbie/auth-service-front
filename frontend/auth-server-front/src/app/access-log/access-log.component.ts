import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { AccessLog, FetchAccessLogList } from "src/models/access-log";
import { PagingController } from "src/models/paging";
import { UserService } from "../user.service";
import { HClient } from "../util/api-util";

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
  pagingController: PagingController;

  constructor(private http: HClient, private userService: UserService) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
  }

  /**
   * Fetch access log list
   */
  fetchAccessLogList(): void {
    this.http.post<FetchAccessLogList>(
      environment.authServicePath, "/access/history",
      {
        pagingVo: this.pagingController.paging,
      }
    ).subscribe({
      next: (resp) => {
        this.accessLogList = resp.data.payload;
        this.pagingController.onTotalChanged(resp.data.pagingVo);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchAccessLogList();
    this.fetchAccessLogList();
  }
}
