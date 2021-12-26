import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AppBriefVo, AppService } from "../app.service";
import { NotificationService } from "../notification.service";

export interface UserAppDialogData {
  userId: number;
}

export interface AppSelect {
  app: AppBriefVo;
  isSelected: boolean;
}

@Component({
  selector: "app-user-permitted-app-update",
  templateUrl: "./user-permitted-app-update.component.html",
  styleUrls: ["./user-permitted-app-update.component.css"],
})
export class UserPermittedAppUpdateComponent implements OnInit {
  apps = new Map<number, AppSelect>();

  constructor(
    public dialogRef: MatDialogRef<
      UserPermittedAppUpdateComponent,
      UserAppDialogData
    >,
    @Inject(MAT_DIALOG_DATA) public data: UserAppDialogData,
    private appService: AppService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.fetchPermittedApps();
  }

  fetchPermittedApps() {
    let selected = new Map<number, AppSelect>();
    this.appService
      .listAppsForUser({
        userId: this.data.userId,
      })
      .subscribe({
        next: (resp) => {
          for (let a of resp.data) {
            selected.set(a.id, {
              isSelected: true,
              app: a,
            });
          }
        },
        complete: () => {
          this.appService.listAllAppsBrief().subscribe({
            next: (resp) => {
              for (let a of resp.data) {
                if (!selected.has(a.id)) {
                  selected.set(a.id, {
                    isSelected: false,
                    app: a,
                  });
                }
              }

              this.apps = selected;
            },
            complete: () => {
              console.log(this.apps);
            },
          });
        },
      });
  }

  updateUserApp() {
    let selected: number[] = [];
    for (let a of this.apps.values()) {
      if (a.isSelected) selected.push(a.app.id);
    }
    this.appService
      .updateUserApps({
        userId: this.data.userId,
        appIdList: selected,
      })
      .subscribe({
        complete: () => {
          this.fetchPermittedApps();
          this.notifi.toast("User permitted apps updated");
        },
      });
  }
}
