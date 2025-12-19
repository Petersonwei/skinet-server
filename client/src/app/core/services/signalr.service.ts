import { Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Order } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  orderSignal = signal<Order | null>(null);

  createHubConnection() {
    console.log('Attempting to create SignalR connection to:', this.hubUrl);

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log('SignalR connection established successfully');
      })
      .catch(error => {
        console.error('SignalR connection failed:', error);
      });

    this.hubConnection.on('OrderCompleteNotification', (order: Order) => {
      console.log('Received order notification:', order);
      this.orderSignal.set(order);
    });

    this.hubConnection.onreconnected(() => {
      console.log('SignalR reconnected');
    });

    this.hubConnection.onreconnecting(() => {
      console.log('SignalR reconnecting...');
    });

    this.hubConnection.onclose(() => {
      console.log('SignalR connection closed');
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop()
        .catch(error => console.log(error));
    }
  }
}
