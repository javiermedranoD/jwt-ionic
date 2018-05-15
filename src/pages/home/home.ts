import {Component} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {SERVER_URL} from "../../config/config";
import {AuthProvider} from "../../providers/auth/auth";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user_name: string;
  message: string;

  constructor(private readonly authProvider: AuthProvider,
              jwtHelper: JwtHelperService,
              private readonly httpClient: HttpClient) {

    this.authProvider.authUser.subscribe(jwt => {
      if (jwt) {
        const decoded = jwtHelper.decodeToken(jwt);
        console.log(decoded);
        this.user_name = decoded['user_name'];
      }
      else {
        this.user_name = null;
      }
    });

  }

  ionViewWillEnter() {
    // this.httpClient.get(`${SERVER_URL}/secret`, {responseType: 'text'}).subscribe(
    //   text => this.message = text,
    //   err => console.log(err)
    // );
  }

  logout() {
    this.authProvider.logout();
  }

}
