import { logger } from './logger';

const ALLOWED_ORIGINS = [
  'http://localhost:8081',
  'http://localhost:3000',
  'https://app.adastra.ai'
];

export const postMessageToParent = (data: any) => {
  try {
    const parentOrigin = window.parent.location.origin;
    
    if (!ALLOWED_ORIGINS.includes(parentOrigin)) {
      logger.error('Invalid parent origin', { parentOrigin });
      return;
    }

    window.parent.postMessage(data, parentOrigin);
    logger.info('Message posted to parent', { data });
  } catch (error) {
    logger.error('Error posting message to parent', { error });
  }
};

export const receiveMessage = (event: MessageEvent) => {
  try {
    if (!ALLOWED_ORIGINS.includes(event.origin)) {
      logger.error('Invalid message origin', { origin: event.origin });
      return;
    }

    logger.info('Message received from parent', { data: event.data });
    return event.data;
  } catch (error) {
    logger.error('Error processing received message', { error });
    return null;
  }
};
