// 生成对称密钥（前端自己要用到的 AES 密钥）
export const genSymmetric = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // 256位密钥
    },
    true, // 可导出
    ['encrypt', 'decrypt'], // 用途
  );
};

// 将非对称密钥（公钥部分）字符串转换为密钥对象（CryptoKey格式）
export const toAsymmetric = async (keyStr: string): Promise<CryptoKey> => {
  // 移除PEM头尾和换行符
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = keyStr.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');

  // Base64解码
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  // 导入公钥
  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt'],
  );
};

// 导出对称密钥为Base64字符串
export const toSymmetricStr = async (key: CryptoKey): Promise<string> => {
  const keyBuffer = await crypto.subtle.exportKey('raw', key);
  const keyArray = new Uint8Array(keyBuffer);
  return btoa(String.fromCharCode(...keyArray));
};
