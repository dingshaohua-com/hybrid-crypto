# Hybrid Crypto

[English](./README.md)

一个为浏览器和 Node.js 环境提供混合加密功能的 TypeScript 库。它结合了非对称加密（RSA）的安全性和对称加密（AES）的性能优势。

## 特性

- 🔐 **混合加密**：结合 RSA 和 AES 加密，实现最佳的安全性和性能
- 🌐 **跨平台**：同时支持浏览器和 Node.js 环境
- 🔑 **密钥管理**：生成和管理 RSA 密钥对和 AES 密钥
- 📦 **TypeScript 支持**：完整的 TypeScript 支持和类型定义
- 🚀 **现代 API**：浏览器中使用 Web Crypto API，服务器端使用 Node.js crypto 模块

## 安装

```bash
npm install "@dingshaohua.com/hybrid-crypto"
```

## 使用方法

### 浏览器环境

```typescript
import {
  genSymmetric,
  toAsymmetric,
  encryptBySymmetric,
  encryptByAsymmetric,
  encryptAll
} from 'hybrid-crypto/browser';

// 生成 AES 密钥
const aesKey = await genSymmetric();

// 将 RSA 公钥字符串转换为 CryptoKey
const publicKey = await toAsymmetric(publicKeyPem);

// 对称加密
const encryptedData = await encryptBySymmetric('Hello World', aesKey);

// 非对称加密
const encryptedData2 = await encryptByAsymmetric('Hello World', publicKey);

// 混合加密（推荐）
const result = await encryptAll('Hello World', publicKey);
console.log(result.contentEncrypt); // AES 加密的内容
console.log(result.aseKeyEncrypt);   // RSA 加密的 AES 密钥
```

### 服务器环境

```typescript
import {
  genAsymmetric,
  genSymmetric,
  decryptByAsymmetric,
  decryptBySymmetric
} from 'hybrid-crypto/server';

// 生成 RSA 密钥对（保存到文件）
genAsymmetric();

// 生成 AES 密钥（保存到文件）
genSymmetric();

// 使用 RSA 私钥解密
const decryptedKey = decryptByAsymmetric(encryptedAesKey, privateKeyPem);

// 使用 AES 密钥解密
const decryptedContent = decryptBySymmetric(encryptedContent, aesKey);
```

## API 参考

### 浏览器 API

#### 密钥生成
- `genSymmetric(): Promise<CryptoKey>` - 生成 AES-256-GCM 密钥
- `toAsymmetric(keyStr: string): Promise<CryptoKey>` - 将 PEM 公钥转换为 CryptoKey
- `toSymmetricStr(key: CryptoKey): Promise<string>` - 将 AES 密钥导出为 Base64 字符串

#### 加密
- `encryptBySymmetric(data: string, key?: CryptoKey): Promise<string>` - AES 加密
- `encryptByAsymmetric(data: string, publicKey: CryptoKey | string): Promise<string>` - RSA 加密
- `encryptAll(data: string, publicKey: CryptoKey | string): Promise<{contentEncrypt: string, aseKeyEncrypt: string}>` - 混合加密

### 服务器 API

#### 密钥生成
- `genAsymmetric(): void` - 生成 RSA 密钥对并保存到文件
- `genSymmetric(): void` - 生成 AES 密钥并保存到文件
- `toSymmetric(keyStr: string): KeyObject` - 将密钥字符串转换为 KeyObject

#### 解密
- `decryptByAsymmetric(content: string, privateKey: KeyObject | string): string` - RSA 解密
- `decryptBySymmetric(content: string, aesKey: KeyObject | string): string` - AES 解密

## 项目结构

```
hybrid-crypto/
├── src/
│   ├── browser/          # 浏览器特定实现
│   │   ├── gen-crypto.ts
│   │   ├── decrypt-encrypt.ts
│   │   └── index.ts
│   └── server/           # Node.js 特定实现
│       ├── gen-crypto.ts
│       ├── decrypt-encrypt.ts
│       └── index.ts
├── dist/                 # 编译后的 JavaScript
├── types/                # TypeScript 声明文件
└── key-pair/            # 生成的密钥文件（服务器端）
```

## 开发

```bash
# 安装依赖
pnpm install

# 构建两个环境的版本
pnpm run build

# 仅构建浏览器版本
pnpm run build:browser

# 仅构建服务器版本
pnpm run build:server
```

## 许可证

ISC
