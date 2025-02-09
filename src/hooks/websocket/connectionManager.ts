import { WebSocketState, ConnectionConfig } from './types';
import { logWebSocketEvent } from '@/utils/websocket/diagnostics';

export class ConnectionManager {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private pingInterval: number | null = null;
  private sessionId: string;
  private MAX_RECONNECT_ATTEMPTS = 5;
  private PING_INTERVAL = 15000;
  private INITIAL_BACKOFF_DELAY = 1000;
  private MAX_BACKOFF_DELAY = 30000;

  constructor(
    private config: ConnectionConfig,
    private onStateChange: (state: WebSocketState) => void,
    private onMessage: (data: any) => void
  ) {
    this.sessionId = crypto.randomUUID();
  }

  connect() {
    this.cleanup();
    this.onStateChange({ status: 'connecting', error: null });

    try {
      console.log('Connecting to:', this.config.url);
      logWebSocketEvent('connection_attempt', { 
        url: this.config.url,
        sessionId: this.sessionId,
        attempt: this.reconnectAttempts 
      });

      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Setup error:', error);
      this.handleError('Failed to setup connection');
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected successfully');
      this.onStateChange({ status: 'connected', error: null });
      this.reconnectAttempts = 0;
      this.setupPingInterval();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessage(data);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleError('Connection error occurred');
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
      this.onStateChange({ status: 'disconnected', error: null });
      this.cleanupPingInterval();
      
      if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
        this.scheduleReconnect();
      }
    };
  }

  private setupPingInterval() {
    this.cleanupPingInterval();
    this.pingInterval = window.setInterval(() => {
      this.sendPing();
    }, this.PING_INTERVAL);
  }

  private sendPing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'ping',
        timestamp: Date.now(),
        sessionId: this.sessionId
      }));
    }
  }

  private handleError(message: string) {
    console.error(message);
    this.onStateChange({
      status: 'error',
      error: message
    });
  }

  private scheduleReconnect() {
    const delay = Math.min(
      this.INITIAL_BACKOFF_DELAY * Math.pow(2, this.reconnectAttempts),
      this.MAX_BACKOFF_DELAY
    );
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  private cleanupPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private cleanup() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.cleanupPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      console.log('Sending message:', message);
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  disconnect() {
    this.cleanup();
  }
}