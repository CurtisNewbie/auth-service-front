import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccessLogComponent } from "./access-log/access-log.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { LoginComponent } from "./login/login.component";
import { ManageTasksComponent } from "./manage-tasks/manage-tasks.component";
import { ManageTokensComponent } from "./manage-tokens/manage-tokens.component";
import { ManagerUserComponent } from "./manager-user/manager-user.component";
import { OperateHistoryComponent } from "./operate-history/operate-history.component";
import { RegisterComponent } from "./register/register.component";
import { TaskHistoryComponent } from "./task-history/task-history.component";
import { UserAppComponent } from "./user-app/user-app.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";

const routes: Routes = [
  {
    path: "manage-tokens",
    component: ManageTokensComponent
  },
  {
    path: "login-page",
    component: LoginComponent,
  },
  {
    path: "user-details",
    component: UserDetailComponent,
  },
  {
    path: "manage-user",
    component: ManagerUserComponent,
  },
  {
    path: "access-log",
    component: AccessLogComponent,
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
  },
  {
    path: "operate-history",
    component: OperateHistoryComponent,
  },
  {
    path: "manage-task",
    component: ManageTasksComponent,
  },
  {
    path: "task-history",
    component: TaskHistoryComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "user-app",
    component: UserAppComponent,
  },
  { path: "**", redirectTo: "/login-page" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
