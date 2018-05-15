
import {Injectable} from "@angular/core";
import {tap} from 'rxjs/operators/tap';
import {ReplaySubject, Observable} from "rxjs";
import {SERVER_URL} from "../../config/config";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import { Platform } from "ionic-angular";

@Injectable()
export class AuthProvider {
  private jwtTokenName = 'jwt_token';
  authUser = new ReplaySubject<any>(1);
  token:any;

  constructor(public httpClient: HttpClient,
              private storage: Storage,
              public jwtHelper: JwtHelperService,
              public platform: Platform) {
    //this.checkLogin();
  }

  checkLogin() {
    this.storage.get(this.jwtTokenName).then(jwt => {


        if (jwt && !this.jwtHelper.isTokenExpired(jwt)) {
          this.httpClient.get(`${SERVER_URL}/auth/login`)
            .subscribe(() => {
              this.authUser.next(jwt);
              console.log(jwt);

            },
              (err) => this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null)));
          // OR
          // this.authUser.next(jwt);
        }
        else {
          this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null));
        }





    });
  }

  login(values: any): Observable<any> {
    return this.httpClient.post(`${SERVER_URL}/auth/login`, values, {responseType: 'text'})
      .pipe(tap(jwt => this.handleJwtResponse(jwt)));
  }

  logout() {
    this.storage.remove(this.jwtTokenName).then(() => this.authUser.next(null));
  }

  signup(values: any): Observable<any> {
    return this.httpClient.post(`${SERVER_URL}/signup`, values, {responseType: 'text'})
      .pipe(tap(jwt => {
        if (jwt !== 'EXISTS') {
          console.log('JWT' + jwt);
          let decoded = this.jwtHelper.decodeToken(jwt);
          console.log('Decoded --- '+decoded);
          this.token = decoded['auth_token'];
          console.log('This token --- '+this.token );
          //localStorage.setItem(this.jwtTokenName, this.token);
          //localStorage.setItem(this.jwtTokenName, jwt['auth_token']);
          return this.handleJwtResponse(jwt);
        }
        return jwt;
      }));
  }

  private handleJwtResponse(jwt: string) {
    return this.storage.set(this.jwtTokenName, jwt)
      .then(() => this.authUser.next(jwt))
      .then(() => jwt);
  }

}
