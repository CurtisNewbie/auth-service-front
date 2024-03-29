import { Component, OnInit } from "@angular/core";
import { UserInfo } from "src/common/user-info";
import { UserService } from "../user.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  isAdmin: boolean = false;
  userInfo: UserInfo = null;

  constructor(private userService: UserService) {}

  hasRes(code) {
    return this.userService.hasResource(code);
  }

  ngOnInit(): void {
    this.userService.userInfoObservable.subscribe({
      next: (user) => {
        this.isAdmin = user.role === "admin";
        this.userInfo = user;
      },
    });
    this.userService.isLoggedInObservable.subscribe({
      next: (isLoggedIn) => {
        if (!isLoggedIn) {
          this.isAdmin = false;
          this.userInfo = null;
        }
      },
    });
    this.userService.fetchUserInfo();
    this.userService.fetchUserResources();
  }

  /** log out current user and navigate back to login page */
  logout(): void {
    this.userService.logout();
  }
}
