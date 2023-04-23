import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: "root"
})
export class  AuthService {

  constructor(private keycloakService: KeycloakService) { }

  public getUsername(): string {
    return this.keycloakService.getUsername();
  }

  public logout(): void {
    this.keycloakService.logout().then(() => this.keycloakService.clearToken());
  }

  public doSomething(): void {
    this.keycloakService.getKeycloakInstance().loadUserInfo().then(x => {
      console.log(x);
    })

    this.keycloakService.getKeycloakInstance().loadUserProfile().then(x => {
      console.log(x);
    })

    try {
      const userDetails = this.keycloakService.getKeycloakInstance()
        .idTokenParsed;
      console.log("UserDetails", userDetails);
      console.log("UserRoles", this.keycloakService.getUserRoles());
    } catch (e) {
      console.error("getLoggedUser Exception", e);
      return undefined;
    }


    this.keycloakService.isLoggedIn().then(x => {
      console.log(x);
    })

    this.keycloakService.getToken().then(x => {
      console.log(x);
    })

    console.log(this.keycloakService.getUserRoles())


  }

}
