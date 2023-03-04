import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { WPath } from '../manage-paths/manage-paths.component';
import { MngResDialogComponent } from '../mng-res-dialog/mng-res-dialog.component';
import { NotificationService } from '../notification.service';
import { ResBrief, UserService } from '../user.service';
import { HClient } from '../../common/api-util';

export interface DialogDat {
  path: WPath;
}

@Component({
  selector: 'app-mng-path-dialog',
  templateUrl: './mng-path-dialog.component.html',
  styleUrls: ['./mng-path-dialog.component.css']
})
export class MngPathDialogComponent implements OnInit {

  resBrief: ResBrief[] = [];
  bindToResCode = "";
  PATH_TYPES = [
    { val: 'PROTECTED', name: 'Protected' },
    { val: 'PUBLIC', name: "Public" }
  ];

  constructor(
    public dialogRef: MatDialogRef<MngResDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient,
    private userService: UserService,
    private toaster: NotificationService
  ) { }

  ngOnInit(): void {
    this._fetchRoleBriefs();
  }

  update() {
    this.hclient.post(environment.goauthPath, "/path/update", {
      type: this.dat.path.ptype,
      pathNo: this.dat.path.pathNo,
      group: this.dat.path.pgroup
    }).subscribe({
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  unbind() {
    this.hclient.post(environment.goauthPath, "/path/resource/unbind", {
      pathNo: this.dat.path.pathNo,
    }).subscribe({
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  bind() {
    if (!this.bindToResCode) {
      this.toaster.toast("Please select resource");
      return;
    }

    this.hclient.post(environment.goauthPath, "/path/resource/bind", {
      pathNo: this.dat.path.pathNo,
      resCode: this.bindToResCode
    }).subscribe({
      complete: () => {
        this.dialogRef.close();
      }
    });
  }

  _fetchRoleBriefs(): void {
    this.userService.fetchAllResBrief().subscribe({
      next: (dat) => {
        this.resBrief = [];
        if (dat.data) {
          this.resBrief = dat.data;
        }
      }
    })
  }

}
