import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { animateElementExpanding } from "src/animate/animate-util";
import { environment } from "src/environments/environment";
import { PagingController } from "src/models/paging";
import {
  emptyFetchUserInfoParam,
  FetchUserInfoParam,
  FetchUserInfoResp,
  UserInfo,
  UserIsDisabledEnum,
  UserRoleEnum,
  USER_IS_DISABLED_OPTIONS,
  USER_ROLE_OPTIONS,
} from "src/models/user-info";
import { ConfirmDialogComponent } from "../dialog/confirm/confirm-dialog.component";
import { NotificationService } from "../notification.service";
import { UserPermittedAppUpdateComponent } from "../user-permitted-app-update/user-permitted-app-update.component";
import { UserService } from "../user.service";
import { HClient } from "../util/api-util";

@Component({
  selector: "app-manager-user",
  templateUrl: "./manager-user.component.html",
  styleUrls: ["./manager-user.component.css"],
  animations: [animateElementExpanding()],
})
export class ManagerUserComponent implements OnInit {
  readonly USER_IS_NORMAL = UserIsDisabledEnum.NORMAL;
  readonly USER_IS_DISABLED = UserIsDisabledEnum.IS_DISABLED;
  readonly COLUMNS_TO_BE_DISPLAYED = [
    "id",
    "name",
    "role",
    "status",
    "reviewStatus",
    "createBy",
    "createTime",
    "updateBy",
    "updateTime",
  ];
  readonly USER_IS_DISABLED_OPTS = USER_IS_DISABLED_OPTIONS;
  readonly USER_ROLE_OPTS = USER_ROLE_OPTIONS;

  usernameToBeAdded: string = null;
  passswordToBeAdded: string = null;
  userRoleOfAddedUser: string = UserRoleEnum.GUEST;
  userInfoList: UserInfo[] = [];
  addUserPanelDisplayed: boolean = false;
  expandedElement: UserInfo = null;
  searchParam: FetchUserInfoParam = emptyFetchUserInfoParam();
  pagingController: PagingController;
  expandedIsDisabled: boolean = false;

  constructor(
    private notifi: NotificationService,
    private dialog: MatDialog,
    private http: HClient
  ) { }

  ngOnInit() {
  }

  /**
   * add user (only admin is allowed)
   */
  addUser(): void {
    if (!this.usernameToBeAdded || !this.passswordToBeAdded) {
      this.notifi.toast("Please enter username and password");
      return;
    }

    this.http.post<any>(
      environment.authServicePath, "/user/add",
      { username: this.usernameToBeAdded, password: this.passswordToBeAdded, userRole: this.userRoleOfAddedUser },
    ).subscribe({
      complete: () => {
        this.userRoleOfAddedUser = UserRoleEnum.GUEST;
        this.usernameToBeAdded = null;
        this.passswordToBeAdded = null;
        this.addUserPanelDisplayed = false;
        this.fetchUserInfoList();
      },
    });
  }

  fetchUserInfoList(): void {
    this.searchParam.pagingVo = this.pagingController.paging;
    this.http.post<FetchUserInfoResp>(
      environment.authServicePath, "/user/list",
      this.searchParam,
    ).subscribe({
      next: (resp) => {
        this.userInfoList = resp.data.list;
        this.pagingController.onTotalChanged(resp.data.pagingVo);
      },
    });
  }

  searchNameInputKeyPressed(event: any): void {
    if (event.key === "Enter") {
      this.fetchUserInfoList();
    }
  }

  resetSearchParam(): void {
    this.searchParam.isDisabled = null;
    this.searchParam.role = null;
    this.pagingController.firstPage();
  }

  /**
   * Update user info (only admin is allowed)
   */
  updateUserInfo(): void {
    this.http.post<void>(
      environment.authServicePath, "/user/info/update",
      {
        id: this.expandedElement.id,
        role: this.expandedElement.role,
        isDisabled: this.expandedElement.isDisabled,
      },
    ).subscribe({
      complete: () => {
        this.fetchUserInfoList();
        this.expandedElement = null;
      },
    });
  }

  /**
   * Delete disabled user
   * @param id
   */
  deleteUser(): void {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> =
      this.dialog.open(ConfirmDialogComponent, {
        width: "500px",
        data: {
          msg: [
            `You sure you want to delete user '${this.expandedElement.username}'`,
          ],
        },
      });

    dialogRef.afterClosed().subscribe((confirm) => {
      console.log(confirm);
      if (confirm) {
        this.http.post<void>(
          environment.authServicePath, "/user/delete",
          { id: this.expandedElement.id },
        ).subscribe({
          complete: () => {
            this.expandedElement = null;
            this.fetchUserInfoList();
          },
        });
      }
    });
  }

  /**
   * Open dialog to show permitted apps for user
   */
  openDialogForUserApp(): void {
    const dialogRef: MatDialogRef<UserPermittedAppUpdateComponent, void> =
      this.dialog.open(UserPermittedAppUpdateComponent, {
        width: "900px",
        data: {
          userId: this.expandedElement.id,
        },
      });

    dialogRef.afterClosed().subscribe();
  }

  idEquals(tl: UserInfo, tr: UserInfo): boolean {
    if (tl == null || tr == null) return false;
    return tl.id === tr.id;
  }

  setExpandedElement(row: UserInfo) {
    if (this.idEquals(row, this.expandedElement)) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = this.copy(row);
    this.expandedIsDisabled =
      this.expandedElement.isDisabled === this.USER_IS_DISABLED;
  }

  copy(obj: UserInfo): UserInfo {
    if (obj == null) return null;
    return { ...obj };
  }

  reviewRegistration(userId: number, reviewStatus: string) {
    this.http.post<void>(
      environment.authServicePath, "/user/registration/review",
      {
        userId: userId,
        reviewStatus: reviewStatus,
      },
    ).subscribe({
      complete: () => {
        this.fetchUserInfoList();
        this.expandedElement = null;
      },
    });
  }

  approveRegistration(userId: number) {
    this.reviewRegistration(userId, "APPROVED");
  }

  rejectRegistration(userId: number) {
    this.reviewRegistration(userId, "REJECTED");
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchUserInfoList();
    this.fetchUserInfoList();
  }
}
