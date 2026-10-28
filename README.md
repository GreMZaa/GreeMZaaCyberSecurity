# 🛡️ GreeMZaaКиберБезопасность (/audit)

[![Antigravity Skill](https://img.shields.io/badge/Antigravity-Skill%20%2Faudit-blueviolet?style=for-the-badge)](https://github.com/GreMZaa/GreeMZaaCyberSecurity)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Zero-Trust](https://img.shields.io/badge/Security-Zero--Trust-red?style=for-the-badge)](references/checklist-50.md)

**GreeMZaaКиберБезопасность** — профессиональный глобальный скилл для Google Antigravity и автономных AI-агентов.  
Проводит комплексный предаудит безопасности, отказоустойчивости и надежности (Production Readiness) любого веб-приложения по чек-листу из **50 пунктов**.

---

## ⚡ Быстрый старт

Просто вызовите команду в чате Antigravity в любом открытом проекте:

```text
/audit
```

или напишите:
> *"Проведи аудит безопасности"* / *"Сделай аудит по чек-листу GreeMZaa"*

Агент в автономном режиме:
1. 🔍 Проведет разведку архитектуры (стек, база, авторизация, платежи, ИИ-интеграции, переменные окружения).
2. 📋 Проверит проект по всем 50 пунктам чек-листа с выставлением статусов (`✅ в порядке`, `⚠️ риск`, `❌ дыра`, `⚪ не про мой проект`).
3. 🎯 Для каждой проблемы укажет **файл и строку**, **живой пример атаки/сбоя** и **точный рецепт исправления**.
4. 🏆 Сформирует **ТОП-5 критических задач**, которые нужно устранить до запуска в продакшен.
5. 🔒 **Код не изменяется**, пока вы явно не дадите команду `«чини»`.

---

## 🧭 Чек-лист из 50 проверок

| Часть | Направление | Ключевые проверки |
|---|---|---|
| **Часть 1** | **Данные и деньги (01–06)** | RLS (Row-Level Security), Race Conditions, Idempotency Keys, Server-Side Validation, DB Transactions, Secret Exposure |
| **Часть 2** | **Доступ и атаки (07–12)** | Authorization Bypass (RBAC), Webhook Verification (HMAC), Dependency Vulnerabilities (CVE), Prompt Injection, Rate Limiting, Load Testing |
| **Часть 3** | **Скорость и масштабирование (13–18)** | Database Indexing, N+1 Queries, Connection Pooling, Cache Invalidation, Safe Retry Logic, Exponential Backoff & Jitter |
| **Часть 4** | **Когда что-то падает (19–24)** | Background Jobs, HTTP/DB Timeouts, Error Monitoring, Structured Logging, Dead Letter Queues (DLQ), Zero-Downtime DB Migrations |
| **Часть 5** | **План Б и отказоустойчивость (25–30)** | Rollback Strategies, Automated Backups, Dry-run Restore Testing, Feature Flags, Health Checks (`/health`), Alerting (Telegram/Slack) |
| **Часть 6** | **Дыры, которые ищут первыми (31–36)** | IDOR (BOLA), XSS, CSRF, SSRF, File Upload Magic Bytes Validation, Private S3 Signed URLs |
| **Часть 7** | **Доступы и безопасность среды (37–42)** | Session Expiration & Invalidation, Least Privilege (IAM/DB), Immutable Audit Logs, Security Headers (CSP, HSTS), E2E Testing, API Contract Testing |
| **Часть 8** | **Перед релизом (43–48)** | Payment Webhook Testing (сбои/дубли), Accessibility (a11y), Mobile Browser Testing, Staging Environments, Zero-Downtime Deployments, Data Retention Policies |
| **Часть 9** | **Вспоминают, когда уже горит (49–50)** | Disaster Recovery Plan (RTO/RPO), Cost Monitoring & Hard Budget Caps (OpenAI, Cloud, DB) |

👉 Полное руководство с примерами уязвимого и исправленного кода: [references/checklist-50.md](references/checklist-50.md).

---

## 🛠️ Установка глобально в систему

### Автоматическая установка в Antigravity:
Скилл уже зарегистрирован в вашей глобальной конфигурации по пути:
```
C:\Users\Admin\.gemini\config\skills\audit\SKILL.md
```
а также
```
C:\Users\Admin\.gemini\config\skills\GreeMZaaКиберБезопасность\SKILL.md
```

### Ручная установка на любой машине:
1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/GreMZaa/GreeMZaaCyberSecurity.git
   ```
2. Скопируйте папку в вашу директорию скиллов Antigravity:
   - **Windows:** `%USERPROFILE%\.gemini\config\skills\audit`
   - **macOS / Linux:** `~/.gemini/config/skills/audit`

---

## 🖥️ Автономный CLI-сканер

В состав репозитория входит быстрый статический сканер исходников:

```bash
# Сканировать текущий проект:
node scripts/quick-audit.mjs

# Или указать путь к проекту:
node scripts/quick-audit.mjs /path/to/project
```

Проверяет:
- Утечки секретов в коде и бандлах
- Исключение `.env` в `.gitignore`
- Опасные конструкции XSS (`dangerouslySetInnerHTML`, `eval`)
- Наличие маршрутов проверки здоровья (`/health`)
- Заголовки безопасности в конфигурации сервера

---

## 📜 Лицензия

Распространяется под лицензией [MIT](LICENSE). Разработано для сообщества разработчиков и проектов под управлением **GreeMZaa**.
