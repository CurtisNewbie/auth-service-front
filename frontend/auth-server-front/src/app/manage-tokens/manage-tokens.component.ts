import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Resp } from 'src/models/resp';
import { UserToken } from 'src/models/tokens';
import { PagingController, Paging } from 'src/models/paging'
import { buildApiPath, buildOptions } from '../util/api-util';
import { MatPaginator } from '@angular/material/paginator';
import { animateElementExpanding } from 'src/animate/animate-util';
import { UserService } from '../user.service';

@Component({
  selector: 'app-manage-tokens',
  templateUrl: './manage-tokens.component.html',
  styleUrls: ['./manage-tokens.component.css'],
  animations: [animateElementExpanding()],
})
export class ManageTokensComponent implements OnInit {

  readonly columns: string[] = ['id', 'name', 'secretKey', 'expirationTime', 'createTime'];
  expandedElement: UserToken = null;
  tokens: UserToken[] = [];
  pagingController: PagingController = new PagingController();
  query = {
    name: ''
  };

  @ViewChild("paginator", { static: true })
  paginator: MatPaginator;

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
    this.fetchList();
    this.userService.fetchUserInfo();
  }

  fetchList() {
    this.http.post<Resp<{ pagingVo: Paging, payload: UserToken[] }>>(buildApiPath('/user/key/list'), {
      payload: { name: this.query.name },
      pagingVo: this.pagingController.paging
    }, buildOptions())
      .subscribe(resp => {
        if (resp.data) {
          this.tokens = resp.data.payload;
          this.pagingController.updatePages(resp.data.pagingVo.total);
        }
      });
  }

  reset() {
    this.expandedElement = null;
    this.paginator.firstPage();
    this.query = {
      name: ''
    };
  }

  idEquals(tl: UserToken, tr: UserToken): boolean {
    if (tl == null || tr == null) return false;
    return tl.id === tr.id;
  }

  setExpandedElement(row: UserToken) {
    if (this.idEquals(row, this.expandedElement)) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = this.copy(row);
  }

  copy(obj: UserToken): UserToken {
    if (obj == null) return null;
    return { ...obj };
  }

  deleteUserKey(id: number) {
    this.http.post<Resp<void>>(buildApiPath('/user/key/delete'), {
      userKeyId: id
    }, buildOptions()).subscribe();
  }

}
