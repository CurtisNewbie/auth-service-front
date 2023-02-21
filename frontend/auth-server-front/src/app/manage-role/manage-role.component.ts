import { Component, OnInit } from '@angular/core';
import { animateElementExpanding, getExpanded, isIdEqual } from 'src/animate/animate-util';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/models/paging';
import { UserService } from '../user.service';
import { HClient } from '../util/api-util';
import { isEnterKey } from '../util/condition';


export interface ERole {
  id?: number
  roleNo?: String
  name?: String
  createTime?: Date
  createBy?: String
  updateTime?: Date
  updateBy?: String
}

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css'],
  animations: [animateElementExpanding()],
})
export class ManageRoleComponent implements OnInit {

  expandedElement: ERole = null;
  pagingController: PagingController;

  readonly tabcol = ["id", "name", "roleNo", "createBy", "createTime", "updateBy", "updateTime"];
  roles: ERole[] = [];

  idEquals = isIdEqual;
  getExpandedEle = (row) => getExpanded(row, this.expandedElement);
  isEnter = isEnterKey;

  constructor(private hclient: HClient, private userService: UserService) { }

  reset() {
    this.expandedElement = null;
    this.pagingController.firstPage();
  }

  ngOnInit(): void {
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.hclient.post<any>(environment.goauthPath, '/role/list', {
      pagingVo: this.pagingController.paging
    }).subscribe({
      next: (r) => {
        this.roles = [];
        if (r.data && r.data.payload) {
          for (let ro of r.data.payload) {
            if (ro.createTime) ro.createTime = new Date(ro.createTime);
            if (ro.updateTime) ro.updateTime = new Date(ro.updateTime);
            this.roles.push(ro);
          }
        }
        this.pagingController.onTotalChanged(r.data.pagingVo);
      }
    });
  }

  onPagingControllerReady(pc) {
    this.pagingController = pc;
    this.pagingController.onPageChanged = () => this.fetchList();
    this.fetchList();
  }


}
