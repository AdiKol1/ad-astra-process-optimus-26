/**
 * Encryption utilities for secure data handling
 */

import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-dev-key';

/**
 * Encrypts data using AES encryption
 */
export const encryptData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypts AES encrypted data
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};
