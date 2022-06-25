import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { buildApiPath } from "../util/api-util";
import { environment } from "src/environments/environment";
import { mockRespOf } from '../../models/resp';

/**
 * Mock Interceptor 
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (environment.shouldMockResp && httpRequest.url) {

      const url = httpRequest.url;

      // don't mock login
      // 
      // if (url.indexOf(buildApiPath("/user/login")) > -1) {
      //   console.log(`Intercepted: ${url}`);
      //   return of(new HttpResponse({ status: 200, body: mockRespOf(environment.mockData.authToken) }));
      // }

      if (url.indexOf(buildApiPath("/user/info")) > -1) {
        return of(new HttpResponse({ status: 200, body: mockRespOf(environment.mockData.userInfo) }));
      }

      if (url.indexOf(buildApiPath("/user/detail")) > -1 ){
        return of(new HttpResponse({ status: 200, body: mockRespOf(environment.mockData.userInfo) }));
      }

    }
    return next.handle(httpRequest)
  }
}
