import { Component, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { animateElementExpanding } from "src/animate/animate-util";
import {
  EventHandling,
  EventHandlingStatus,
  EventHandlingType,
  HandleResult,
} from "src/models/event";
import { PagingController } from "src/models/paging";
import { Option } from "src/models/select-util";
import { UserRoleEnum, USER_ROLE_OPTIONS } from "src/models/user-info";
import { EventHandlingService } from "../event-handling.service";

@Component({
  selector: "app-event",
  templateUrl: "./event.component.html",
  styleUrls: ["./event.component.css"],
  animations: [animateElementExpanding()],
})
export class EventComponent implements OnInit {
  readonly REGISTRATION_EVENT = EventHandlingType.REGISTRATION;
  readonly NO_NEED_TO_HANDLE_STATUS = EventHandlingStatus.NO_NEED_TO_HANDLE;
  readonly TO_BE_HANDLED_STATUS = EventHandlingStatus.TO_BE_HANDLED;
  readonly HANDLED_STATUS = EventHandlingStatus.HANDLED;
  readonly COLUMNS_TO_BE_DISPLAYED = [
    "id",
    "type",
    "status",
    "description",
    "handleResult",
    "handlerId",
    "handleTime",
  ];
  readonly ACCEPT_RESULT = HandleResult.ACCEPT;
  readonly REJECT_RESULT = HandleResult.REJECT;
  readonly HANDLE_STATUS_OPTIONS: Option<EventHandlingStatus>[] = [
    { name: "To Be Handled", value: EventHandlingStatus.TO_BE_HANDLED },
    { name: "Handled", value: EventHandlingStatus.HANDLED },
    { name: "No Need To Handle", value: EventHandlingStatus.NO_NEED_TO_HANDLE },
  ];
  readonly HANDLE_TYPE_OPTIONS: Option<EventHandlingType>[] = [
    { name: "Registration", value: EventHandlingType.REGISTRATION },
  ];
  readonly HANDLE_RESULT_OPTIONS: Option<HandleResult>[] = [
    { name: "Accepted", value: HandleResult.ACCEPT },
    { name: "Rejected", value: HandleResult.REJECT },
  ];
  readonly HANDLE_USER_ROLE_OPTIONS: Option<UserRoleEnum>[] = USER_ROLE_OPTIONS;

  events: EventHandling[] = [];
  pagingController: PagingController = new PagingController();
  searchStatus: EventHandlingStatus;
  searchType: EventHandlingType;
  searchHandleResult: HandleResult;
  expandedElement: EventHandling;
  handleRole: UserRoleEnum = UserRoleEnum.GUEST;

  constructor(private eventHandlingService: EventHandlingService) {}

  ngOnInit() {
    this.fetchEventList();
  }

  fetchEventList() {
    this.eventHandlingService
      .findByPage({
        type: this.searchType,
        status: this.searchStatus,
        handleResult: this.searchHandleResult,
        pagingVo: this.pagingController.paging,
      })
      .subscribe({
        next: (resp) => {
          this.expandedElement = null;
          this.events = resp.data.list;
          this.pagingController.updatePages(resp.data.pagingVo.total);
        },
      });
  }

  handle(e: PageEvent): void {
    this.pagingController.handle(e);
    this.fetchEventList();
  }

  idEquals(tl: EventHandling, tr: EventHandling): boolean {
    if (tl == null || tr == null) return false;
    return tl.id === tr.id;
  }

  setExpandedElement(row: EventHandling) {
    if (this.idEquals(row, this.expandedElement)) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = this.copy(row);
  }

  copy(obj: EventHandling): EventHandling {
    if (obj == null) return null;
    return { ...obj };
  }

  handleEvent(e: EventHandling, res: HandleResult): void {
    this.eventHandlingService
      .handle({
        id: e.id,
        result: res,
        extra: this.handleRole,
      })
      .subscribe({
        complete: () => {
          this.expandedElement = null;
          this.handleRole = UserRoleEnum.GUEST;
          this.fetchEventList();
        },
      });
  }
}
