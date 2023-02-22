import { Component, OnInit } from '@angular/core';
import { getExpanded, isIdEqual } from 'src/animate/animate-util';
import { environment } from 'src/environments/environment';
import { PagingController } from 'src/models/paging';
import { UserService } from '../user.service';
import { HClient } from '../util/api-util';
import { isEnterKey } from '../util/condition';

export interface WRes {
  id?: number
  resNo?: string
  name?: string
  createTime?: Date
  createBy?: string
  updateTime?: Date
  updateBy?: string
}

@Component({
  selector: 'app-manage-resources',
  templateUrl: './manage-resources.component.html',
  styleUrls: ['./manage-resources.component.css']
})
export class ManageResourcesComponent implements OnInit {

  expandedElement: WRes = null;
  pagingController: PagingController;

  readonly tabcol = ["id", "resNo", "name", "createBy", "createTime", "updateBy", "updateTime"];
  resources: WRes[] = [];

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
    this.hclient.post<any>(environment.goauthPath, '/resource/list', {
      pagingVo: this.pagingController.paging
    }).subscribe({
      next: (r) => {
        this.resources = [];
        if (r.data && r.data.payload) {
          for (let ro of r.data.payload) {
            if (ro.createTime) ro.createTime = new Date(ro.createTime);
            if (ro.updateTime) ro.updateTime = new Date(ro.updateTime);
            this.resources.push(ro);
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
