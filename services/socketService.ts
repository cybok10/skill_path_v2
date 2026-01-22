import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

class SocketService {
  private client: Client | null = null;

  connect(token: string, onMessageReceived: (message: any) => void) {
    if (this.client && this.client.active) {
      console.log('WebSocket client already connected.');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log('WebSocket Connected');
        this.client?.subscribe('/user/queue/metrics', (message) => {
          onMessageReceived(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
       onWebSocketError: (error) => {
        console.error('WebSocket Error', error);
      },
      reconnectDelay: 5000,
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.client.active) {
      this.client.deactivate();
      this.client = null;
      console.log('WebSocket Disconnected');
    }
  }
}

export const socketService = new SocketService();
