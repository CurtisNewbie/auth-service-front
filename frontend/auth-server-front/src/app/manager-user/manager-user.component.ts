import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { animateElementExpanding, getExpanded, isIdEqual } from "src/animate/animate-util";
import { environment } from "src/environments/environment";
import { PagingController } from "src/common/paging";
import {
  FetchUserInfoParam,
  UserInfo,
  UserIsDisabledEnum,
  USER_IS_DISABLED_OPTIONS,
} from "src/common/user-info";
import { ConfirmDialogComponent } from "../dialog/confirm/confirm-dialog.component";
import { NotificationService } from "../notification.service";
import { RoleBrief, UserService } from "../user.service";
import { HClient } from "../../common/api-util";
import { isEnterKey } from "../../common/condition";

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

  usernameToBeAdded: string = null;
  passswordToBeAdded: string = null;
  userRoleOfAddedUser: string = null;
  userInfoList: UserInfo[] = [];
  addUserPanelDisplayed: boolean = false;
  expandedElement: UserInfo = null;
  searchParam: FetchUserInfoParam = {};
  pagingController: PagingController;
  expandedIsDisabled: boolean = false;
  roleBriefs: RoleBrief[] = [];

  idEquals = isIdEqual;
  getExpandedEle = (row) => getExpanded(row, this.expandedElement);
  isEnter = isEnterKey;

  constructor(
    private notifi: NotificationService,
    private dialog: MatDialog,
    private http: HClient,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchRoleBriefs();
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
      { username: this.usernameToBeAdded, password: this.passswordToBeAdded, roleNo: this.userRoleOfAddedUser },
    ).subscribe({
      complete: () => {
        this.userRoleOfAddedUser = null;
        this.usernameToBeAdded = null;
        this.passswordToBeAdded = null;
        this.addUserPanelDisplayed = false;
        this.fetchUserInfoList();
      },
    });
  }

  fetchRoleBriefs(): void {
    this.userService.fetchRoleBriefs().subscribe({
      next: (dat) => {
        this.roleBriefs = [];
        if (dat.data) {
          this.roleBriefs = dat.data;
        }
      }
    })
  }

  fetchUserInfoList(): void {
    this.searchParam.pagingVo = this.pagingController.paging;
    this.http.post<any>(
      environment.authServicePath, "/user/list",
      this.searchParam,
    ).subscribe({
      next: (resp) => {
        this.userInfoList = [];
        if (resp.data.payload) {
          for (let r of resp.data.payload) {
            if (r.createTime) r.createTime = new Date(r.createTime);
            if (r.updateTime) r.updateTime = new Date(r.updateTime);
            this.userInfoList.push(r);
          }
        }
        this.pagingController.onTotalChanged(resp.data.pagingVo);
      },
    });
  }

  resetSearchParam(): void {
    this.searchParam = {}
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
        roleNo: this.expandedElement.roleNo,
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
          title: "Delete User",
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
  // openDialogForUserApp(): void {
  //   const dialogRef: MatDialogRef<UserPermittedAppUpdateComponent, void> =
  //     this.dialog.open(UserPermittedAppUpdateComponent, {
  //       width: "900px",
  //       data: {
  //         userId: this.expandedElement.id,
  //       },
  //     });

  //   dialogRef.afterClosed().subscribe();
  // }

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
