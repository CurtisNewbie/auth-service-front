import { Component, OnInit } from '@angular/core';
import { getExpanded, isIdEqual } from 'src/animate/animate-util';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/common/paging';
import { NotificationService } from '../notification.service';
import { UserService } from '../user.service';
import { HClient } from '../../common/api-util';
import { isEnterKey } from '../../common/condition';
import { MngResDialogComponent } from '../mng-res-dialog/mng-res-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface WRes {
  id?: number;
  code?: string;
  name?: string;
  createTime?: Date;
  createBy?: string;
  updateTime?: Date;
  updateBy?: string;
}

@Component({
  selector: 'app-manage-resources',
  templateUrl: './manage-resources.component.html',
  styleUrls: ['./manage-resources.component.css']
})
export class ManageResourcesComponent implements OnInit {
  newResDialog = false;
  newResName = null;
  newResCode = null;

  expandedElement: WRes = null;
  pagingController: PagingController;

  readonly tabcol = ["id", "name", "code", "createBy", "createTime", "updateBy", "updateTime"];
  resources: WRes[] = [];

  idEquals = isIdEqual;
  getExpandedEle = (row) => getExpanded(row, this.expandedElement);
  isEnter = isEnterKey;

  constructor(
    private hclient: HClient,
    private userService: UserService,
    private toaster: NotificationService,
    private dialog: MatDialog,
  ) { }

  reset() {
    this.expandedElement = null;
    this.newResDialog = false;
    this.newResName = null;
    this.newResCode = null;
    this.pagingController.firstPage();
  }

  ngOnInit(): void {
    this.userService.fetchUserResources();
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.hclient.post<any>(environment.goauthPath, '/resource/list', {
      pagingVo: this.pagingController.paging
    }).subscribe({
      next: (r) => {
        this.resources = [];
        if (r.data && r.data.payload) {
          for (let ro of r.data.payload) {
            if (ro.createTime) ro.createTime = new Date(ro.createTime);
            if (ro.updateTime) ro.updateTime = new Date(ro.updateTime);
            this.resources.push(ro);
          }
        }
        this.pagingController.onTotalChanged(r.data.pagingVo);
      }
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }

  createNewRes() {
    if (!this.newResName) {
      this.toaster.toast("Please enter new resource name");
      return;
    }
    if (!this.newResCode) {
      this.toaster.toast("Please enter new resource code");
      return;
    }

    this.hclient.post(environment.goauthPath, "/resource/add", {
      name: this.newResName,
      code: this.newResCode
    }).subscribe({
      next: (r) => {
        this.newResDialog = false;
        this.newResName = null;
        this.newResCode = null;
        this.fetchList();
      }
    });
  }

  openMngResDialog(r: WRes) {
    this.dialog.open(MngResDialogComponent, {
      width: "700px",
      data: {
        res: { ...r }
      },
    }).afterClosed().subscribe({
      complete: () => {
        this.fetchList();
      }
    });
  }
}
