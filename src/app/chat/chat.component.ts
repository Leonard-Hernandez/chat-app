import { Component, OnInit } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Client, IStompSocket} from '@stomp/stompjs' 
import SockJS from 'sockjs-client';
import { Message } from './models/message';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit{

  private client!: Client;

  message: Message = new Message();
  messages: Message[] = [];
  
  connected: boolean = false;

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
      this.connected = true;

      this.client.subscribe('/chat/mensajes', e => {
        let message = JSON.parse(e.body) as Message;
        this.messages.push(message);
        console.log(message);
      })
    }

    this.client.onDisconnect = (frame) => {
      console.log("status " + this.client.connected)
      console.log("Disconnected: " + frame);
      this.connected = false;
    }
  }

  connect():void{
    this.client.activate();
  }

  disconnect():void{
    this.client.deactivate();
  }

  sendMessage():void{
    this.client.publish({
      destination: '/app/mensaje',
      body: JSON.stringify(this.message)
    });
    this.message.text = '';
  }


}
