import fs from 'fs-extra';
import * as crypto from 'crypto';
import type { KeyObject } from 'crypto';


// 生成非对称密钥对
export const genAsymmetric = () => {
  // 生成密钥对
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 1024,
  });

  // 将密钥对导出为PEM格式的字符串
  const publicKeyStr = keyPair.publicKey.export({ type: 'spki', format: 'pem' }).toString();
  const privateKeyStr = keyPair.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

  // 将密钥对字符串保存到文件中
  fs.outputFileSync('key-pair/publicKey.pem', publicKeyStr);
  fs.outputFileSync('key-pair/privateKey.pem', privateKeyStr);
};

// 生成对称密钥对
export const genSymmetric = () => {
  const key = crypto.randomBytes(32).toString('hex');
  fs.outputFileSync('key-pair/symmetricKey.txt', key);
};

// 将对称密钥字符串转换为密钥对象（支持hex和base64格式）
export const toSymmetric = (keyStr: string): KeyObject => {
  let aesKeyBuffer: Buffer;

  // 判断是base64还是hex格式
  if (keyStr.length === 44 && keyStr.endsWith('=')) {
    // Base64格式（44个字符，通常以=结尾）
    aesKeyBuffer = Buffer.from(keyStr, 'base64');
  } else if (keyStr.length === 64 && /^[0-9a-fA-F]+$/.test(keyStr)) {
    // Hex格式（64个字符，全是十六进制）
    aesKeyBuffer = Buffer.from(keyStr, 'hex');
  } else {
    throw new Error(`不支持的密钥格式。密钥长度: ${keyStr.length}, 内容: ${keyStr.substring(0, 20)}...`);
  }

  // 验证密钥长度（AES-256需要32字节）
  if (aesKeyBuffer.length !== 32) {
    throw new Error(`AES-256密钥必须是32字节，当前长度: ${aesKeyBuffer.length}字节`);
  }

  // 创建对称密钥对象
  const keyObject = crypto.createSecretKey(aesKeyBuffer);

  return keyObject;
};
