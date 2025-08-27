import * as crypto from "crypto";
import type { KeyObject } from "crypto";
import { toSymmetric } from "./gen-crypto";

// 解密--非对称密钥（rsa）
export const decryptByAsymmetric = (
  content: string,
  privateKeyParam: KeyObject | string
) => {
  let privateKey: KeyObject;
  if (typeof privateKeyParam === "string") {
    // 将PEM格式的私钥字符串转换为KeyObject
    privateKey = crypto.createPrivateKey(privateKeyParam);
  } else {
    privateKey = privateKeyParam;
  }

  // 开始解密 - 指定与前端相同的填充方式和哈希算法
  const buffer = Buffer.from(content, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256", // 与前端的SHA-256保持一致
    },
    buffer
  );
  return decrypted.toString("utf8");
};

// 解密--对称密钥（aes）
export const decryptBySymmetric = (
  content: string,
  aesKeyParam: KeyObject | string
) => {
  let aesKey: KeyObject;
  if (typeof aesKeyParam === "string") {
    // 将PEM格式的私钥字符串转换为KeyObject
    aesKey = toSymmetric(aesKeyParam);
  } else {
    aesKey = aesKeyParam;
  }

  // 将Base64编码的加密数据转换为Buffer
  const encryptedBuffer = Buffer.from(content, "base64");

  console.log("加密数据总长度:", encryptedBuffer.length);

  // 前端使用的AES-GCM格式：IV(12字节) + 密文 + AuthTag(16字节)
  const iv = encryptedBuffer.subarray(0, 12); // 前12字节是IV
  const encryptedData = encryptedBuffer.subarray(12); // 剩余部分是密文+AuthTag
  const authTag = encryptedData.subarray(-16); // 最后16字节是认证标签
  const cipherText = encryptedData.subarray(0, -16); // 除了最后16字节都是密文

  console.log(
    "IV长度:",
    iv.length,
    "AuthTag长度:",
    authTag.length,
    "密文长度:",
    cipherText.length
  );
  // 从KeyObject中提取原始密钥Buffer
  const keyBuffer = aesKey.export();

  // 创建解密器
  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv);
  decipher.setAuthTag(authTag);
  // 解密数据
  let decrypted = decipher.update(cipherText, undefined, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};


/**
 * 混合加密数据结构
 * 包含经过AES加密的内容和经过RSA加密的AES密钥
 */
type ContentAndKey = {
  /** 使用AES对称加密算法加密后的内容，Base64编码格式 */
  contentEncrypt: string;
  /** 使用RSA非对称加密算法加密后的AES密钥，Base64编码格式 */
  aseKeyEncrypt: string;
};

// 非对称解密，并用解密后的对称密钥 去解密密文
export const decryptAll = (
  contentAndKey: ContentAndKey,
  privateKeyParam: KeyObject | string
) => {
  const aseKey = decryptByAsymmetric(
    contentAndKey.aseKeyEncrypt,
    privateKeyParam
  ); // 用RSA私钥解密AES密钥

  const content = decryptBySymmetric(contentAndKey.contentEncrypt, aseKey); // 生成AES密钥
  return content;
};
