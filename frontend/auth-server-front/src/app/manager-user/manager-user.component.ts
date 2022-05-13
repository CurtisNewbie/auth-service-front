import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { PageEvent } from "@angular/material/paginator";
import { animateElementExpanding } from "src/animate/animate-util";
import { PagingController } from "src/models/paging";
import {
  emptyFetchUserInfoParam,
  FetchUserInfoParam,
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
  pagingController: PagingController = new PagingController();

  constructor(
    private userService: UserService,
    private notifi: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchUserInfoList();
  }

  /**
   * add user (only admin is allowed)
   */
  addUser(): void {
    if (!this.usernameToBeAdded || !this.passswordToBeAdded) {
      this.notifi.toast("Please enter username and password");
      return;
    }
    this.userService
      .addUser(
        this.usernameToBeAdded,
        this.passswordToBeAdded,
        this.userRoleOfAddedUser
      )
      .subscribe({
        next: (resp) => {
          console.log("Successfully added guest:", this.usernameToBeAdded);
        },
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
    this.userService.fetchUserList(this.searchParam).subscribe({
      next: (resp) => {
        this.userInfoList = resp.data.list;
        this.pagingController.updatePages(resp.data.pagingVo.total);
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
  }

  handle(e: PageEvent): void {
    this.pagingController.handle(e);
    this.fetchUserInfoList();
  }

  /**
   * Update user info (only admin is allowed)
   */
  updateUserInfo(): void {
    this.userService
      .updateUserInfo({
        id: this.expandedElement.id,
        role: this.expandedElement.role,
        isDisabled: this.expandedElement.isDisabled,
      })
      .subscribe({
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
        this.userService
          .deleteDisabledUser({ id: this.expandedElement.id })
          .subscribe({
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
  }

  copy(obj: UserInfo): UserInfo {
    if (obj == null) return null;
    return { ...obj };
  }

  reviewRegistration(userId: number, reviewStatus: string) {
    this.userService
      .reviewUserRegistration({
        userId: userId,
        reviewStatus: reviewStatus,
      })
      .subscribe({
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
}
