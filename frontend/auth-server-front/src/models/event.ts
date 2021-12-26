import { Paging } from "./paging";
import { UserRoleEnum } from "./user-info";

export interface FindEventHandlingByPageReqVo {
  /** type of event, 1-registration */
  type: number;

  /** status of event, 0-no need to handle, 1-to be handled, 2-handled */
  status: EventHandlingStatus;

  /** handle result */
  handleResult: HandleResult;

  pagingVo: Paging;
}

export interface FindEventHandlingByPageRespVo {
  list: EventHandling[];
  pagingVo: Paging;
}

export interface EventHandling {
  /** primary key */
  id: number;

  /** type of event, 1-registration */
  type: number;

  /** status of event, 0-no need to handle, 1-to be handled, 2-handled */
  status: number;

  /** handle result */
  handleResult: number;

  /** id of user who handled the event */
  handlerId: number;

  /** when the event is handled */
  handleTime: string;

  /**
   * A description of the event
   */
  description: string;
}

export interface HandleEventReqVo {
  /** primary key */
  id: number;

  /** handling result */
  result: number;

  /** user role */
  extra: UserRoleEnum;
}

export enum EventHandlingType {
  REGISTRATION = 1,
}

export enum EventHandlingStatus {
  NO_NEED_TO_HANDLE = 0,
  TO_BE_HANDLED = 1,
  HANDLED = 2,
}

export enum HandleResult {
  /**
   * Accept
   */
  ACCEPT = 1,

  /**
   * Reject
   */
  REJECT = 2,
}
