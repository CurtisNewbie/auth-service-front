import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HClient } from '../util/api-util';

// TODO impl this 

export interface DialogDat {
  resource: string
}

@Component({
  selector: 'app-mng-res-dialog',
  templateUrl: './mng-res-dialog.component.html',
  styleUrls: ['./mng-res-dialog.component.css']
})
export class MngResDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MngResDialogComponent, DialogDat>, @Inject(MAT_DIALOG_DATA) public dat: DialogDat,
    private hclient: HClient
  ) { }

  ngOnInit(): void {

  }

  updateResource() {

  }
}
