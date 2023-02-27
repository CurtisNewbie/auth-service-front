import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getExpanded, isIdEqual } from 'src/animate/animate-util';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/models/paging';
import { MngPathDialogComponent } from '../mng-path-dialog/mng-path-dialog.component';
import { UserService } from '../user.service';
import { HClient } from '../util/api-util';
import { isEnterKey } from '../util/condition';

export interface WPath {
  id?: number
  pgroup?: string
  pathNo?: string
  resName?: string
  resNo?: string
  url?: string
  ptype?: string
  createTime?: Date
  createBy?: string
  updateTime?: Date
  updateBy?: string
}


@Component({
  selector: 'app-manage-paths',
  templateUrl: './manage-paths.component.html',
  styleUrls: ['./manage-paths.component.css']
})
export class ManagePathsComponent implements OnInit {

  expandedElement: WPath = null;
  pagingController: PagingController;

  readonly tabcol = ["id", "pgroup", "url", "ptype", "resName", "createBy", "createTime", "updateBy", "updateTime"];
  paths: WPath[] = [];

  idEquals = isIdEqual;
  getExpandedEle = (row) => getExpanded(row, this.expandedElement);
  isEnter = isEnterKey;

  constructor(private hclient: HClient,
    private userService: UserService,
    private dialog: MatDialog,
  ) { }


  reset() {
    this.expandedElement = null;
    this.pagingController.firstPage();
  }

  ngOnInit(): void {
    this.userService.fetchUserInfo();
  }

  openMngPathDialog(p: WPath) {
    this.dialog.open(MngPathDialogComponent, {
      width: "700px",
      data: {
        url: p.url,
        pathNo: p.pathNo,
        resName: p.resName,
        resNo: p.resNo
      },
    }).afterClosed().subscribe({
      complete: () => {
        this.fetchList();
      }
    });
  }

  fetchList() {
    this.hclient.post<any>(environment.goauthPath, '/path/list', {
      pagingVo: this.pagingController.paging
    }).subscribe({
      next: (r) => {
        this.paths = [];
        if (r.data && r.data.payload) {
          for (let ro of r.data.payload) {
            if (ro.createTime) ro.createTime = new Date(ro.createTime);
            if (ro.updateTime) ro.updateTime = new Date(ro.updateTime);
            this.paths.push(ro);
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

}
