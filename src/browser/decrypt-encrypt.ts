import { genSymmetric, toAsymmetric, toSymmetricStr } from './gen-crypto';

// 对称加密 -- 使用前端自己的AES加密
export const encryptBySymmetric = async (data: string, keyParam?: CryptoKey): Promise<string> => {
  let key = keyParam;
  if (!key) {
    key = await genSymmetric();
  }

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // 生成安全的随机12字节IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, dataBuffer);

  // 组合格式：IV(12字节) + 密文+AuthTag
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv, 0);
  combined.set(encryptedArray, iv.length);

  // 将组合后的数据转换为Base64字符串
  const base64String = btoa(String.fromCharCode(...combined));
  return base64String;
};

// 非对称加密 -- 使用后端生成的rsa公钥
export const encryptByAsymmetric = async (data: string, publicKeyParam?: CryptoKey | string): Promise<string> => {
  let publicKey: CryptoKey;
  if (typeof publicKeyParam === 'string') {
    publicKey = await toAsymmetric(publicKeyParam);
  } else if (publicKeyParam) {
    publicKey = publicKeyParam;
  } else {
    publicKey = await toAsymmetric();
  }
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, dataBuffer);
  // 将ArrayBuffer转换为Base64字符串
  const encryptedArray = new Uint8Array(encrypted);
  const base64String = btoa(String.fromCharCode(...encryptedArray));

  return base64String;
};

// 对称加密，并用非对称加密对称密钥
export const encryptAll = async (data: string) => {
  const aseKey = await genSymmetric(); // 生成AES密钥
  const aseKeyStr = await toSymmetricStr(aseKey); // 导出AES密钥为Base64字符串
  const aseKeyEncrypt = await encryptByAsymmetric(aseKeyStr); // 用RSA公钥加密AES密钥
  const contentEncrypt = await encryptBySymmetric(data, aseKey); // 用AES密钥加密内容
  return {
    contentEncrypt, // 内容被对称密钥加密过
    aseKeyEncrypt, // 对称密钥 又被 非对称密钥加密过
  };
};
