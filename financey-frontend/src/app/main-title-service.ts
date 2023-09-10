// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainTitleService {
  private dataSubject = new BehaviorSubject("");
  data$ = this.dataSubject.asObservable();

  emitTitle(data: string) {
    this.dataSubject.next(data);
  }

}
