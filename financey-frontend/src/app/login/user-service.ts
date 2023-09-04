import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId?: number;

  setUserId(id: number) {
    this.userId = id;
    localStorage.setItem('userId', id.toString());
  }

  getUserId(): number {
    return this.userId || parseInt(localStorage.getItem('userId') || "");
  }

}
