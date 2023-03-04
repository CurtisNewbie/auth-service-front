import { Component, OnInit } from "@angular/core";
import { NavigationService, NavType } from "../navigation.service";
import { NotificationService } from "../notification.service";
import { UserService } from "../user.service";
import { setToken } from "../../common/api-util";
import { isEnterKey } from "../../common/condition";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usernameInput: string = "";
  passwordInput: string = "";
  isEnter = isEnterKey;

  constructor(
    private userService: UserService,
    private nav: NavigationService,
    private notifi: NotificationService
  ) { }

  ngOnInit() {
    this.userService.fetchUserInfo(() =>
      this.nav.navigateTo(NavType.USER_DETAILS)
    );
  }

  /**
   * login request
   */
  public login(): void {
    if (!this.usernameInput || !this.passwordInput) {
      this.notifi.toast("Please enter username and password");
      return;
    }
    this.userService.login(this.usernameInput, this.passwordInput).subscribe({
      next: (resp) => {
        setToken(resp.data);
        this.userService.fetchUserResources();
        this.nav.navigateTo(NavType.USER_DETAILS);
      },
      complete: () => {
        this.passwordInput = "";
      },
    });
  }

  goToRegisterPage(): void {
    this.nav.navigateTo(NavType.REGISTER_PAGE);
  }
}
