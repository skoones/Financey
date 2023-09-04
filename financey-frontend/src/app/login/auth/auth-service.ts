import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import jwtDecode from 'jwt-decode';
import {LoginService} from "../../../generated";
import {local} from "d3-selection";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {}

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    return decodedToken.exp < currentTime;
  }

  getUserId(token: string): string {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.userId;
  }

  logout() {
    this.loginService.logout().subscribe(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
    });
  }

}
