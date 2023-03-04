import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { HClient } from '../../common/api-util';
import { ConfirmDialogComponent } from '../dialog/confirm/confirm-dialog.component';
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

  constructor(
    public dialogRef: MatDialogRef<MngResDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

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
}
