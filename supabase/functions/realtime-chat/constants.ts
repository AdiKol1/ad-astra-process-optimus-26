export const PING_INTERVAL = 30000; // 30 seconds (increased from 15)
export const PONG_TIMEOUT = 10000;  // 10 seconds (increased from 5)
export const CLEANUP_INTERVAL = 30000; // 30 seconds
export const MAX_CONNECTIONS_PER_CLIENT = 1;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-connection-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};