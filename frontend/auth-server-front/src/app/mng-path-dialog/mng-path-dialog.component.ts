import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { MngResDialogComponent } from '../mng-res-dialog/mng-res-dialog.component';
import { NotificationService } from '../notification.service';
import { ResBrief, UserService } from '../user.service';
import { HClient } from '../util/api-util';

export interface DialogDat {
  url: string,
  pathNo: string,
  resName: string,
  resNo: string
}

@Component({
  selector: 'app-mng-path-dialog',
  templateUrl: './mng-path-dialog.component.html',
  styleUrls: ['./mng-path-dialog.component.css']
})
export class MngPathDialogComponent implements OnInit {

  resBrief: ResBrief[] = [];
  bindToResNo = "";

  constructor(
    public dialogRef: MatDialogRef<MngResDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient,
    private userService: UserService,
    private toaster: NotificationService
  ) { }

  ngOnInit(): void {
    this._fetchRoleBriefs();
  }

  unbind() {
    this.hclient.post(environment.goauthPath, "/path/resource/unbind", {
      pathNo: this.dat.pathNo,
    }).subscribe({
      complete: () => {
        this.dialogRef.close();
      }
    });

  }

  bind() {
    if (!this.bindToResNo) {
      this.toaster.toast("Please select resource");
      return;
    }

    this.hclient.post(environment.goauthPath, "/path/resource/bind", {
      pathNo: this.dat.pathNo,
      resNo: this.bindToResNo
    }).subscribe({
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  _fetchRoleBriefs(): void {
    this.userService.fetchResBrief().subscribe({
      next: (dat) => {
        this.resBrief = [];
        if (dat.data) {
          this.resBrief = dat.data;
        }
      }
    })
  }

}
