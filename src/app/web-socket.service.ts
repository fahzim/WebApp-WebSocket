import { state } from '@angular/animations';
import { EventEmitter, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY, throwError, retry, delay, retryWhen, of, finalize, map, Subject, Observable, count, connect, observeOn } from 'rxjs';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig  } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})

export class WebSocketService {
  
  public readonly URLServer = "ws://localhost:5297/ws?appOrigin=Web";
  
  wsResponseHistory: string[] = [];
  
  private webSocketSubj: WebSocketSubject<any> = webSocket({
    url: this.URLServer,
    openObserver: {
      next: () => { this.setConnText("Connected!") }
    },
    closeObserver: {
      next: () => { }
    }
  });
  
  connText: Subject<string> = new Subject<string>();

  constructor() { 
    this.setConnText("Waiting...");
    this.connect();
  }

  getWsHistory() : string [] {
    return this.wsResponseHistory;
  }

  anyToString(msg: any) : string {
    return msg.toString();
  }

  public getConnText(): Observable<string> {
    return this.connText.asObservable();
  }
  public setConnText(text: string) {
    this.connText.next(text);
  }
  
  connect() {
      let i = 1;
      this.setConnText("Trying to connect... " + i + " of 5");
      this.webSocketSubj
      .pipe(
        catchError((error) => {
          this.setConnText("Trying to connect... " + i + " of 5");
          i++;
          return throwError(() => new Error(error));
        }),
        retry({ count: 5, delay: 2000 }),
      ).subscribe(
        {
          next: msg => {
            console.log(msg)
            this.wsResponseHistory.push(this.anyToString(msg.text));
          },
          error: err => { 
            this.setConnText("Unable to Connect! Check Server Ip, Port, or Reload Page to Try Again!");
          },
          complete: () => {
            this.setConnText("Disconnected!");
          }
         })
}

  sendMessage(msg: String) {
    this.webSocketSubj.next(msg);
  }

  disconnect() {
      this.webSocketSubj.complete();
  }
}
