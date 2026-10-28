#!/usr/bin/env node

/**
 * 🛡️ GreeMZaaКиберБезопасность — Quick Static Security Scanner
 * Автоматизированный статический сканер базовых уязвимостей и настроек проекта.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log('\n======================================================');
console.log('🛡️  GreeMZaaКиберБезопасность — Static Code Scanner');
console.log(`📁 Целевой каталог: ${targetDir}`);
console.log('======================================================\n');

const findings = {
  passed: [],
  warnings: [],
  failures: [],
};

// 1. Проверка .gitignore
const gitignorePath = path.join(targetDir, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const envIgnored = /\.env/i.test(content);
  if (envIgnored) {
    findings.passed.push('.gitignore: переменные .env корректно добавлены в исключения');
  } else {
    findings.failures.push('.gitignore: .env файлы НЕ исключены из git! Риск утечки ключей.');
  }
} else {
  findings.warnings.push('.gitignore: файл не найден в корне проекта');
}

// 2. Проверка утечки секретов в исходниках
const srcDir = fs.existsSync(path.join(targetDir, 'src')) 
  ? path.join(targetDir, 'src') 
  : targetDir;

function scanFiles(dir, fileCallback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next' || entry.name === 'dist') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(fullPath, fileCallback);
    } else if (/\.(js|ts|jsx|tsx|json|mjs)$/i.test(entry.name)) {
      fileCallback(fullPath);
    }
  }
}

let dangerousDomCount = 0;
let hardcodedSecretsCount = 0;

scanFiles(srcDir, (filePath) => {
  const code = fs.readFileSync(filePath, 'utf8');
  
  // Проверка dangerouslySetInnerHTML
  if (code.includes('dangerouslySetInnerHTML')) {
    dangerousDomCount++;
    findings.warnings.push(`XSS риск: обнаружен dangerouslySetInnerHTML в ${path.relative(targetDir, filePath)}`);
  }

  // Проверка eval
  if (/\beval\s*\(/.test(code)) {
    findings.failures.push(`RCE риск: использование eval() в ${path.relative(targetDir, filePath)}`);
  }

  // Поиск захардкоженных токенов
  if (/(eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}|ghp_[a-zA-Z0-9]{20,}|sk_live_[a-zA-Z0-9]{20,})/g.test(code)) {
    hardcodedSecretsCount++;
    findings.failures.push(`Утечка секрета: обнаружен возможный hardcoded токен в ${path.relative(targetDir, filePath)}`);
  }
});

if (dangerousDomCount === 0) {
  findings.passed.push('XSS: опасные конструкции dangerouslySetInnerHTML не обнаружены');
}
if (hardcodedSecretsCount === 0) {
  findings.passed.push('Секреты: жестко захардкоженные API-ключи в коде не найдены');
}

// 3. Проверка эндпоинта /health
const healthRoutes = [
  path.join(targetDir, 'src', 'app', 'api', 'health', 'route.ts'),
  path.join(targetDir, 'src', 'app', 'api', 'health', 'route.js'),
  path.join(targetDir, 'pages', 'api', 'health.ts'),
  path.join(targetDir, 'pages', 'api', 'health.js'),
  path.join(targetDir, 'src', 'health.ts'),
];

const hasHealthRoute = healthRoutes.some((p) => fs.existsSync(p));
if (hasHealthRoute) {
  findings.passed.push('Health Check: эндпоинт проверки здоровья сервиса найден');
} else {
  findings.warnings.push('Health Check: эндпоинт /health или /api/health не найден');
}

// 4. Проверка заголовков безопасности в next.config.*
const nextConfigPaths = [
  path.join(targetDir, 'next.config.mjs'),
  path.join(targetDir, 'next.config.js'),
  path.join(targetDir, 'next.config.ts'),
];
const nextConfigFile = nextConfigPaths.find((p) => fs.existsSync(p));
if (nextConfigFile) {
  const configContent = fs.readFileSync(nextConfigFile, 'utf8');
  if (configContent.includes('headers') && (configContent.includes('X-Frame-Options') || configContent.includes('Content-Security-Policy'))) {
    findings.passed.push('Security Headers: конфигурация заголовков найдена в Next.js config');
  } else {
    findings.warnings.push('Security Headers: в Next.js config не настроены явные заголовки безопасности (HSTS, CSP, X-Frame-Options)');
  }
}

// 5. Итоги
console.log('📊 РЕЗУЛЬТАТЫ СТАТИЧЕСКОГО СКАНИРОВАНИЯ:\n');

if (findings.passed.length > 0) {
  console.log('✅ В ПОРЯДКЕ:');
  findings.passed.forEach((msg) => console.log(`   + ${msg}`));
  console.log('');
}

if (findings.warnings.length > 0) {
  console.log('⚠️  ПРЕДУПРЕЖДЕНИЯ (ТРЕБУЕТ ВНИМАНИЯ):');
  findings.warnings.forEach((msg) => console.log(`   ! ${msg}`));
  console.log('');
}

if (findings.failures.length > 0) {
  console.log('❌ КРИТИЧЕСКИЕ ДЫРЫ:');
  findings.failures.forEach((msg) => console.log(`   x ${msg}`));
  console.log('');
}

console.log('------------------------------------------------------');
console.log(`Итого: ${findings.passed.length} ✅ | ${findings.warnings.length} ⚠️ | ${findings.failures.length} ❌`);
console.log('Для полного аудита по 50 пунктам используйте команду /audit в Antigravity.');
console.log('======================================================\n');
