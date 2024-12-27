import { useState, useCallback } from 'react';
import { SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';
import { useConnectionManager } from './websocket/connectionManager';
import { useMessageHandler } from './websocket/messageHandler';
import type { WebSocketMessage } from './websocket/types';

export const useWebSocketConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const { 
    wsRef, 
    reconnectAttemptsRef,
    cleanup, 
    setupPingInterval,
    getReconnectDelay,
    WS_MAX_RECONNECT_ATTEMPTS,
    toast
  } = useConnectionManager();
  const { handleIncomingMessage } = useMessageHandler();

  const setupWebSocket = useCallback(() => {
    cleanup();

    if (reconnectAttemptsRef.current >= WS_MAX_RECONNECT_ATTEMPTS) {
      console.log('Max reconnection attempts reached');
      setIsReconnecting(false);
      toast({
        title: "Connection Failed",
        description: "Unable to establish connection after multiple attempts",
        variant: "destructive"
      });
      return;
    }

    console.log('Setting up new WebSocket connection...');
    
    try {
      if (!SUPABASE_PUBLISHABLE_KEY) {
        throw new Error('Supabase anon key is not configured');
      }

      const wsUrl = `wss://gjkagdysjgljjbnagoib.supabase.co/realtime/v1/websocket?apikey=${encodeURIComponent(SUPABASE_PUBLISHABLE_KEY)}`;
      console.log('Attempting to connect to:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;

        setupPingInterval(ws);

        ws.send(JSON.stringify({
          type: 'auth',
          token: SUPABASE_PUBLISHABLE_KEY
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleIncomingMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);
        
        if (!event.wasClean && reconnectAttemptsRef.current < WS_MAX_RECONNECT_ATTEMPTS) {
          setIsReconnecting(true);
          reconnectAttemptsRef.current++;
          
          const delay = getReconnectDelay();
          console.log(`Scheduling reconnection attempt in ${delay}ms`);
          
          setTimeout(() => {
            if (!isConnected) {
              setupWebSocket();
            }
          }, delay);
        } else {
          setIsReconnecting(false);
        }
      };

    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat service",
        variant: "destructive"
      });
    }
  }, [cleanup, setupPingInterval, getReconnectDelay, handleIncomingMessage, isConnected, toast]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not ready, message not sent:', message);
      return false;
    }

    try {
      wsRef.current.send(message);
      console.log('Message sent:', message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, []);

  return {
    isConnected,
    isReconnecting,
    wsRef,
    setupWebSocket,
    cleanup,
    sendMessage
  };
};