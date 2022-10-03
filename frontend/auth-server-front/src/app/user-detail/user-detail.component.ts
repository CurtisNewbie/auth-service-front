import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { NavigationService, NavType } from "../navigation.service";
import { UserService } from "../user.service";
import { HClient } from "../util/api-util";

export interface UserDetail {
  id?: string;
  username?: string;
  role?: string;
  registerDate?: string;
}

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"],
})
export class UserDetailComponent implements OnInit {
  userDetail: UserDetail = {};
  constructor(
    private userService: UserService,
    private nav: NavigationService,
    private http: HClient
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo();
    this.http.get<UserDetail>(
      environment.authServicePath, "/user/detail",
    ).subscribe({
      next: (resp) => {
        this.userDetail = resp.data;
      },
    });
  }

  navToChangePassword() {
    this.nav.navigateTo(NavType.CHANGE_PASSWORD);
  }
}
