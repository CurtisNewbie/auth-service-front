import { Component, OnInit, ViewChild } from "@angular/core";
import { UserToken } from "src/models/tokens";
import { PagingController, Paging } from "src/models/paging";
import { HClient } from "../util/api-util";
import { MatPaginator } from "@angular/material/paginator";
import { animateElementExpanding, getExpanded, isIdEqual } from "src/animate/animate-util";
import { UserService } from "../user.service";
import { NotificationService } from "../notification.service";
import { environment } from "src/environments/environment";
import { expand } from "rxjs/operators";

@Component({
  selector: "app-manage-keys",
  templateUrl: "./manage-keys.component.html",
  styleUrls: ["./manage-keys.component.css"],
  animations: [animateElementExpanding()],
})
export class ManageKeysComponent implements OnInit {
  readonly columns: string[] = [
    "id",
    "name",
    "secretKey",
    "expirationTime",
    "createTime",
  ];
  expandedElement: UserToken = null;
  tokens: UserToken[] = [];
  pagingController: PagingController;
  query = {
    name: "",
  };
  panelDisplayed: boolean = false;
  password: string = null;
  newUserKeyName: string = null;

  @ViewChild("paginator", { static: true })
  paginator: MatPaginator;

  idEquals = isIdEqual;
  getExpandedEle = (row) => getExpanded(row, this.expandedElement);

  constructor(
    private http: HClient,
    private userService: UserService,
    private notifi: NotificationService
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.http
      .post<{ pagingVo: Paging; payload: UserToken[] }>(
        environment.authServicePath, "/user/key/list",
        {
          payload: { name: this.query.name },
          pagingVo: this.pagingController.paging,
        },
      )
      .subscribe((resp) => {
        if (resp.data) {
          this.tokens = resp.data.payload;
          this.pagingController.onTotalChanged(resp.data.pagingVo);
          if (this.panelDisplayed) this.panelDisplayed = false;
        }
      });
  }

  reset() {
    this.expandedElement = null;
    this.paginator.firstPage();
    this.query = {
      name: "",
    };
  }

  generateRandomKey() {
    if (!this.password) {
      this.notifi.toast("Please enter password");
      return;
    }
    if (!this.newUserKeyName) {
      this.notifi.toast("Please enter key name");
      return;
    }

    const pw = this.password;
    const keyName = this.newUserKeyName;

    this.password = null;

    this.http
      .post<void>(
        environment.authServicePath, "/user/key/generate",
        {
          password: pw,
          keyName: keyName,
        },
      )
      .subscribe({
        next: (resp) => {
          this.fetchList();
          this.newUserKeyName = null;
          this.panelDisplayed = false;
        },
      });
  }

  deleteUserKey(id: number) {
    this.http
      .post<void>(
        environment.authServicePath, "/user/key/delete",
        {
          userKeyId: id,
        },
      )
      .subscribe({
        complete: () => this.fetchList(),
      });
  }

  togglePanel() {
    this.panelDisplayed = !this.panelDisplayed;
    this.password = null;
  }

  copyToClipboard(t: string) {
    if (!t) return;

    // src: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
    var textarea = document.createElement("textarea");
    textarea.textContent = t;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }
}
