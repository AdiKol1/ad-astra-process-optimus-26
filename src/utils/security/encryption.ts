import CryptoJS from 'crypto-js';
import { logger } from '@/utils/logger';

// Use the correct encryption key that was working before
const ENCRYPTION_KEY = 'ad-astra-secure-key-2025';

export function encrypt(value: string): string {
  try {
    if (!value) throw new Error('Cannot encrypt empty value');
    
    // First convert the value to a JSON string if it isn't already
    const stringToEncrypt = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Encrypt the string
    const encrypted = CryptoJS.AES.encrypt(stringToEncrypt, ENCRYPTION_KEY).toString();
    
    return encrypted;
  } catch (error) {
    logger.error('Encryption failed:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export function decrypt(encryptedValue: string): string {
  try {
    if (!encryptedValue) throw new Error('Cannot decrypt empty value');
    
    // Decrypt the string
    const decrypted = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_KEY);
    
    // Convert to UTF8 string
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Decryption resulted in empty string');
    }
    
    // Validate that the decrypted string is valid JSON
    JSON.parse(decryptedString);
    
    return decryptedString;
  } catch (error) {
    logger.error('Decryption failed:', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    // Clear the corrupted store
    localStorage.clear();
    throw error;
  }
}
