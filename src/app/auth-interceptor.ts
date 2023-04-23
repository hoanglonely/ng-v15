import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { ExcludedUrlRegex } from "keycloak-angular/lib/core/interfaces/keycloak-options";
import { Observable, catchError, mergeMap, throwError } from "rxjs";

@Injectable()
export class KeycloakBearerInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('On Intercept');
    const { enableBearerInterceptor, excludedUrls } = this.keycloak;
    if (!enableBearerInterceptor) {
      return next.handle(req);
    }

    const shallPass: boolean =
      excludedUrls.findIndex((item) => this.isUrlExcluded(req, item)) > -1;
    if (shallPass) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError(err => {
        console.log(err);
        // CHECK IF ERROR CODE IS NOT UNAUTHORIZED THEN THROW ERROR
        return throwError(() => new Error('Error'));
      })
    );
    // return combineLatest([
    //   this.conditionallyUpdateToken(req),
    //   this.keycloak.isLoggedIn(),
    // ]).pipe(
    //   mergeMap(([_, isLoggedIn]) =>
    //     isLoggedIn
    //       ? this.handleRequestWithTokenHeader(req, next)
    //       : next.handle(req).pipe(
    //         catchError(err => {
    //           console.log("OnError" + err);
    //           return throwError(err);
    //         })
    //       )
    //   )
    // );
  }

  private async conditionallyUpdateToken(
    req: HttpRequest<unknown>
  ): Promise<boolean> {
    if (this.keycloak.shouldUpdateToken(req)) {
      return await this.keycloak.updateToken();
    }

    return true;
  }

  private isUrlExcluded(
    { method, url }: HttpRequest<any>,
    { urlPattern, httpMethods }: ExcludedUrlRegex
  ): boolean {
    let httpTest =
      !httpMethods ||
      httpMethods?.length === 0 ||
      httpMethods.join().indexOf(method.toUpperCase()) > -1;

    let urlTest = urlPattern.test(url);

    return httpTest && urlTest;
  }

  private handleRequestWithTokenHeader(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    req.headers.set(
      'TENANT_ID',
      this.keycloak.getKeycloakInstance().realm ?? ''
    );
    return this.keycloak.addTokenToHeader(req.headers).pipe(
      mergeMap((headersWithBearer) => {
        const kcReq = req.clone({ headers: headersWithBearer });
        return next.handle(kcReq);
      })
    );
  }
}
