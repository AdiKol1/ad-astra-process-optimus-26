export const PING_INTERVAL = 15000; // 15 seconds
export const PONG_TIMEOUT = 5000;  // 5 seconds
export const CLEANUP_INTERVAL = 30000; // 30 seconds
export const MAX_CONNECTIONS_PER_CLIENT = 1;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-connection-id',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
};