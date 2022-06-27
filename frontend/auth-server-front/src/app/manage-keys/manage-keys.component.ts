import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Resp } from "src/models/resp";
import { UserToken } from "src/models/tokens";
import { PagingController, Paging } from "src/models/paging";
import { buildApiPath, buildOptions } from "../util/api-util";
import { MatPaginator } from "@angular/material/paginator";
import { animateElementExpanding } from "src/animate/animate-util";
import { UserService } from "../user.service";
import { ThrowStmt } from "@angular/compiler";
import { NotificationService } from "../notification.service";

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
  pagingController: PagingController = new PagingController();
  query = {
    name: "",
  };
  panelDisplayed: boolean = false;
  password: string = null;
  newUserKeyName: string = null;

  @ViewChild("paginator", { static: true })
  paginator: MatPaginator;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.fetchList();
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.http
      .post<Resp<{ pagingVo: Paging; payload: UserToken[] }>>(
        buildApiPath("/user/key/list"),
        {
          payload: { name: this.query.name },
          pagingVo: this.pagingController.paging,
        },
        buildOptions()
      )
      .subscribe((resp) => {
        if (resp.data) {
          this.tokens = resp.data.payload;
          this.pagingController.updatePages(resp.data.pagingVo.total);
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

  idEquals(tl: UserToken, tr: UserToken): boolean {
    if (tl == null || tr == null) return false;
    return tl.id === tr.id;
  }

  setExpandedElement(row: UserToken) {
    if (this.idEquals(row, this.expandedElement)) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = this.copy(row);
  }

  copy(obj: UserToken): UserToken {
    if (obj == null) return null;
    return { ...obj };
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
      .post<Resp<void>>(
        buildApiPath("/user/key/generate"),
        {
          password: pw,
          keyName: keyName,
        },
        buildOptions()
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
      .post<Resp<void>>(
        buildApiPath("/user/key/delete"),
        {
          userKeyId: id,
        },
        buildOptions()
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
}
