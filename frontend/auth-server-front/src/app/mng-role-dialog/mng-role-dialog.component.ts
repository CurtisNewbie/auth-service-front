import { ListRange } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/models/paging';
import { NotificationService } from '../notification.service';
import { ResBrief, UserService } from '../user.service';
import { HClient } from '../util/api-util';

export interface DialogDat {
  roleNo: string
}

export interface ListedRoleRes {
  id?: number
  resNo?: string
  resName?: string
  createTime?: Date
  createBy?: string
}

@Component({
  selector: 'app-mng-role-dialog',
  templateUrl: './mng-role-dialog.component.html',
  styleUrls: ['./mng-role-dialog.component.css']
})
export class MngRoleDialogComponent implements OnInit {

  readonly tabcol = ['id', 'resNo', 'resName', 'createTime', 'createBy', 'operation'];
  pagingController: PagingController = null;
  roleRes: ListedRoleRes[] = [];
  resBriefs: ResBrief[] = [];
  addResNo: string = null;

  constructor(
    public dialogRef: MatDialogRef<MngRoleDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient,
    private userService: UserService,
    private toaster: NotificationService,
  ) { }

  ngOnInit(): void {
    this.fetchResourceCandidates();
  }

  fetchResourceCandidates() {
    this.hclient.get<any>(environment.goauthPath, `/resource/brief/candidates?roleNo=${this.dat.roleNo}`)
      .subscribe({
        next: (res) => {
          this.resBriefs = res.data;
          this.resBriefs.sort((a, b) => a.name.localeCompare(b.name));
        }
      })
  }

  addResource() {
    if (!this.addResNo) {
      this.toaster.toast("Please select resource to add")
      return;
    }

    this.hclient.post<any>(environment.goauthPath, "/role/resource/add", {
      roleNo: this.dat.roleNo,
      resNo: this.addResNo
    }).subscribe({
      next: res => {
        this.addResNo = null;
        this.listResources();
        this.fetchResourceCandidates();
      }
    });
  }

  listResources() {
    this.hclient.post<any>(environment.goauthPath, "/role/resource/list", {
      roleNo: this.dat.roleNo,
      pagingVo: this.pagingController.paging
    }).subscribe({
      next: (res) => {
        this.roleRes = [];
        if (res.data && res.data.payload) {
          for (let r of res.data.payload) {
            if (r.createTime) r.createTime = new Date(r.createTime);
            this.roleRes.push(r);
          }
          this.pagingController.onTotalChanged(res.data.pagingVo);
        }
      }
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.listResources();
    this.listResources();
  }

  delRes(roleRes: ListedRoleRes) {
    this.hclient.post<any>(environment.goauthPath, "/role/resource/remove", {
      roleNo: this.dat.roleNo,
      resNo: roleRes.resNo
    }).subscribe({
      next: (res) => {
        this.listResources();
        this.fetchResourceCandidates();
      }
    })
  }
}
