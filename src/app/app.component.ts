import { Component, EventEmitter, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {WebSocketService} from '../app/web-socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    MatCardModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public interval: number = 1;
     
  wsResponseHistory: string[] = [];
  connectionStatus: string = "Waiting...";

  connectButton = "Connect";
  randomNumber = Math.floor(100000 * Math.random());
  machineName = "Web" + this.randomNumber;

  constructor(private webSocketService: WebSocketService) {
    this.wsResponseHistory = webSocketService.getWsHistory();
    this.webSocketService.getConnText().subscribe(
      text => {
        this.connectionStatus = text;
        console.log(text)
      }
    );
  }

  send(message: any)
    {
      //optional i can log what i send too
      //this.wsResponseHistory.push("(" + this.machineName + "): " + message);
      this.webSocketService.sendMessage("(" + this.machineName + "): " + message);
    }
}