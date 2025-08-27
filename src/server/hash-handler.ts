import crypto from "crypto";

// 使用PBKDF2对密码进行哈希处理
export const toHash = (
  content: string,
  saltParam?: string
): { hash: string; salt: string } => {
  const saltValue = saltParam ?? crypto.randomBytes(4).toString("hex"); // 生成随机盐值（也就是随机字符串），建议 6 位
  const iterations = 100000; // 迭代次数
  const keyLength = 6; // 哈希长度（建议 64 为）
  const digest = "sha512"; // 哈希算法

  const hash = crypto
    .pbkdf2Sync(content, saltValue, iterations, keyLength, digest)
    .toString("hex");

  return {
    hash,
    salt: saltValue,
  };
};
