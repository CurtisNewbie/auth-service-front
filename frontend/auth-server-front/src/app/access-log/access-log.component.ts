import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { AccessLog } from "src/common/access-log";
import { PagingController } from "src/common/paging";
import { UserService } from "../user.service";
import { HClient } from "../../common/api-util";

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
    "userAgent",
    "url"
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
    this.http.post<any>(
      environment.authServicePath, "/access/history",
      {
        pagingVo: this.pagingController.paging,
      }
    ).subscribe({
      next: (resp) => {
        this.accessLogList = []; 
        if (resp.data.payload) {
          for (let r of resp.data.payload) {
              if (r.accessTime) r.accessTime = new Date(r.accessTime);
              this.accessLogList.push(r);
          }
        }
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
