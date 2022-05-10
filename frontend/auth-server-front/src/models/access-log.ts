import { Paging } from "./paging";

/** Access log response vo*/
export interface AccessLog {
  id: number;

  /** when the user signed in */
  accessTime: string;

  /** ip address */
  ipAddress: string;

  /** username */
  username: string;

  /** primary key of user */
  userId: number;

  /** url */
  url: string;
}

export interface FetchAccessLogList {
  /** list of access log */
  payload: AccessLog[];

  /** paging */
  pagingVo: Paging;
}

/**
 * Parameters for fetching list of access log
 */
export interface FetchAccessLogListParam {
  pagingVo: Paging;
}
