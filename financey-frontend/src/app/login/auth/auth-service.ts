import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import jwtDecode from 'jwt-decode';
import {LoginService} from "../../../generated";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIdSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {}

  userId$ = this.userIdSubject.asObservable();

  setUserId(userId: string) {
    this.userIdSubject.next(userId);
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    return decodedToken.exp < currentTime;
  }

  logout() {
    this.loginService.logout().subscribe(() => {
      console.log("logged out")
      this.userIdSubject.next(null);
      localStorage.removeItem('jwtToken');
      this.router.navigate(['/login']);
    });
  }

}
