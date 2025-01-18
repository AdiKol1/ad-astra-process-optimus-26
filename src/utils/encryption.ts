const { subtle } = window.crypto;

// Helper function to convert between base64 and Uint8Array
const base64 = {
  encode: (buffer: ArrayBuffer): string => 
    btoa(String.fromCharCode(...new Uint8Array(buffer))),
  decode: (base64: string): Uint8Array => 
    Uint8Array.from(atob(base64), c => c.charCodeAt(0))
};

async function getKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('assessment-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(data: string, password: string): Promise<string> {
  try {
    const key = await getKey(password);
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      enc.encode(data)
    );

    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);

    return base64.encode(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: string, password: string): Promise<string> {
  try {
    const key = await getKey(password);
    const dec = new TextDecoder();
    
    const combined = base64.decode(encryptedData);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );

    return dec.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}
