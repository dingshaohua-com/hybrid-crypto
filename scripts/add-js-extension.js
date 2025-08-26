#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function addJsExtension(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 递归处理子目录
      addJsExtension(filePath);
    } else if (file.endsWith('.js')) {
      // 处理 .js 文件
      let content = fs.readFileSync(filePath, 'utf8');
      
      // 匹配相对导入路径，但不包含已有扩展名的
      const importRegex = /from\s+['"](\.[^'"]*?)(?<!\.js)['"];?/g;
      const exportRegex = /export\s+.*?\s+from\s+['"](\.[^'"]*?)(?<!\.js)['"];?/g;
      
      // 替换 import 语句
      content = content.replace(importRegex, (match, importPath) => {
        return match.replace(importPath, importPath + '.js');
      });
      
      // 替换 export from 语句
      content = content.replace(exportRegex, (match, exportPath) => {
        return match.replace(exportPath, exportPath + '.js');
      });
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Processed: ${filePath}`);
    }
  });
}

// 获取命令行参数
const targetDir = process.argv[2] || 'dist';

if (!fs.existsSync(targetDir)) {
  console.error(`Directory ${targetDir} does not exist`);
  process.exit(1);
}

console.log(`Adding .js extensions to imports in ${targetDir}`);
addJsExtension(targetDir);
console.log('Done!');
