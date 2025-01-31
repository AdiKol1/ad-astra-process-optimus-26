import CryptoJS from 'crypto-js';

const key = 'ad-astra-secure-key-2025';

export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(text, key).toString();
}

export function decrypt(text: string) {
  const bytes = CryptoJS.AES.decrypt(text, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
