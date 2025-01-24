import { Component, OnInit } from '@angular/core';
import { Client, IStompSocket } from '@stomp/stompjs' 
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  private client!: Client;

  constructor() {}

  ngOnInit(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      const socket = new SockJS("http://localhost:8080/chat-websocket");
      return socket as IStompSocket
    }

    this.client.onConnect = (frame) => {
      console.log("status " + this.client.connected)
      console.log("Connected: " + frame);
    }
    this.client.activate();
  }


}
