import { Component, OnInit } from "@angular/core";
import { NavigationService, NavType } from "../navigation.service";
import { UserService } from "../user.service";

@Component({
  selector: "app-user-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"],
})
export class UserDetailComponent implements OnInit {
  userDetail = {
    id: "",
    username: "",
    role: "",
    registerDate: "",
  };
  constructor(
    private userService: UserService,
    private nav: NavigationService
  ) {}

  ngOnInit() {
    this.userService.fetchUserInfo();
    this.userService.fetchUserDetails().subscribe({
      next: (resp) => {
        this.userDetail = resp.data;
      },
    });
  }

  navToChangePassword() {
    this.nav.navigateTo(NavType.CHANGE_PASSWORD);
  }
}
