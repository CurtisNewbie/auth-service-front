import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PagingController } from 'src/common/paging';
import { environment } from 'src/environments/environment';
import { HClient } from '../../common/api-util';
import { ConfirmDialogComponent } from '../dialog/confirm/confirm-dialog.component';
import { WPath } from '../manage-paths/manage-paths.component';
import { WRes } from '../manage-resources/manage-resources.component';

// TODO impl this 

export interface DialogDat {
  res: WRes;
}

@Component({
  selector: 'app-mng-res-dialog',
  templateUrl: './mng-res-dialog.component.html',
  styleUrls: ['./mng-res-dialog.component.css']
})
export class MngResDialogComponent implements OnInit {

  readonly tabcol = ["id", "pgroup", "url", "ptype", "desc"];
  paths: WPath[] = [];
  pagingController: PagingController = null;

  constructor(
    public dialogRef: MatDialogRef<MngResDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  listPathsBound() {
    this.hclient.post<any>(environment.goauthPath, '/path/list', {
      pagingVo: this.pagingController.paging,
      resCode: this.dat.res.code
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

  removeResource() {
    const dialogRef: MatDialogRef<ConfirmDialogComponent, boolean> =
      this.dialog.open(ConfirmDialogComponent, {
        width: "500px",
        data: {
          title: "Remove Resource",
          msg: [
            `You sure you want to delete resource '${this.dat.res.name}'`,
          ],
        },
      });

    dialogRef.afterClosed().subscribe((confirm) => {
      console.log(confirm);
      if (confirm) {
        this.hclient.post(environment.goauthPath, "/resource/remove", {
          resCode: this.dat.res.code
        }).subscribe({
          next: (r) => {
            this.dialogRef.close();
          }
        })
      }
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.listPathsBound();
    this.listPathsBound();
  }
}
