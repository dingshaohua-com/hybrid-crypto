# Hybrid Crypto

[中文文档](./README.zh-CN.md)

A TypeScript library that provides hybrid encryption functionality for both browser and Node.js environments. It combines the security of asymmetric encryption (RSA) with the performance of symmetric encryption (AES).

## Features

- 🔐 **Hybrid Encryption**: Combines RSA and AES encryption for optimal security and performance
- 🌐 **Cross-Platform**: Works in both browser and Node.js environments
- 🔑 **Key Management**: Generate and manage RSA key pairs and AES keys
- 📦 **TypeScript Support**: Full TypeScript support with type definitions
- 🚀 **Modern APIs**: Uses Web Crypto API in browsers and Node.js crypto module on server

## Installation

```bash
npm install "@dingshaohua.com/hybrid-crypto"
```

## Usage

### Browser Environment

```typescript
import {
  genSymmetric,
  toAsymmetric,
  encryptBySymmetric,
  encryptByAsymmetric,
  encryptAll
} from 'hybrid-crypto/browser';

// Generate AES key
const aesKey = await genSymmetric();

// Convert RSA public key string to CryptoKey
const publicKey = await toAsymmetric(publicKeyPem);

// Symmetric encryption
const encryptedData = await encryptBySymmetric('Hello World', aesKey);

// Asymmetric encryption
const encryptedData2 = await encryptByAsymmetric('Hello World', publicKey);

// Hybrid encryption (recommended)
const result = await encryptAll('Hello World', publicKey);
console.log(result.contentEncrypt); // AES encrypted content
console.log(result.aseKeyEncrypt);   // RSA encrypted AES key
```

### Server Environment

```typescript
import {
  genAsymmetric,
  genSymmetric,
  decryptByAsymmetric,
  decryptBySymmetric
} from 'hybrid-crypto/server';

// Generate RSA key pair (saves to files)
genAsymmetric();

// Generate AES key (saves to file)
genSymmetric();

// Decrypt with RSA private key
const decryptedKey = decryptByAsymmetric(encryptedAesKey, privateKeyPem);

// Decrypt with AES key
const decryptedContent = decryptBySymmetric(encryptedContent, aesKey);
```

## API Reference

### Browser APIs

#### Key Generation
- `genSymmetric(): Promise<CryptoKey>` - Generate AES-256-GCM key
- `toAsymmetric(keyStr: string): Promise<CryptoKey>` - Convert PEM public key to CryptoKey
- `toSymmetricStr(key: CryptoKey): Promise<string>` - Export AES key as Base64 string

#### Encryption
- `encryptBySymmetric(data: string, key?: CryptoKey): Promise<string>` - AES encryption
- `encryptByAsymmetric(data: string, publicKey: CryptoKey | string): Promise<string>` - RSA encryption
- `encryptAll(data: string, publicKey: CryptoKey | string): Promise<{contentEncrypt: string, aseKeyEncrypt: string}>` - Hybrid encryption

### Server APIs

#### Key Generation
- `genAsymmetric(): void` - Generate RSA key pair and save to files
- `genSymmetric(): void` - Generate AES key and save to file
- `toSymmetric(keyStr: string): KeyObject` - Convert key string to KeyObject

#### Decryption
- `decryptByAsymmetric(content: string, privateKey: KeyObject | string): string` - RSA decryption
- `decryptBySymmetric(content: string, aesKey: KeyObject | string): string` - AES decryption

## Project Structure

```
hybrid-crypto/
├── src/
│   ├── browser/          # Browser-specific implementations
│   │   ├── gen-crypto.ts
│   │   ├── decrypt-encrypt.ts
│   │   └── index.ts
│   └── server/           # Node.js-specific implementations
│       ├── gen-crypto.ts
│       ├── decrypt-encrypt.ts
│       └── index.ts
├── dist/                 # Compiled JavaScript
├── types/                # TypeScript declarations
└── key-pair/            # Generated key files (server)
```

## Development

```bash
# Install dependencies
pnpm install

# Build for both environments
pnpm run build

# Build browser version only
pnpm run build:browser

# Build server version only
pnpm run build:server
```

## License

ISC