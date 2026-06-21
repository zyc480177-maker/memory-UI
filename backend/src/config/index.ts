import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const config = {
  port: parseInt(optional('PORT', '4000')),
  nodeEnv: optional('NODE_ENV', 'development'),
  isDev: optional('NODE_ENV', 'development') === 'development',

  db: {
    url: required('DATABASE_URL'),
  },

  auth: {
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
    ownerEmail: optional('OWNER_EMAIL', 'owner@example.com'),
    ownerPassword: optional('OWNER_PASSWORD', 'changeme123'),
  },

  ai: {
    geminiApiKey: optional('GEMINI_API_KEY'),
    openaiApiKey: optional('OPENAI_API_KEY'),
    claudeApiKey: optional('CLAUDE_API_KEY'),
    defaultProvider: optional('AI_DEFAULT_PROVIDER', 'gemini'),
  },

  storage: {
    type: optional('STORAGE_TYPE', 'local') as 'local' | 'oss',
    uploadDir: path.resolve(__dirname, '../../', optional('UPLOAD_DIR', './uploads')),
    oss: {
      bucket: optional('OSS_BUCKET'),
      region: optional('OSS_REGION'),
      accessKeyId: optional('OSS_ACCESS_KEY_ID'),
      accessKeySecret: optional('OSS_ACCESS_KEY_SECRET'),
    },
  },

  email: {
    host: optional('SMTP_HOST'),
    port: parseInt(optional('SMTP_PORT', '587')),
    user: optional('SMTP_USER'),
    pass: optional('SMTP_PASS'),
    from: optional('SMTP_FROM', 'noreply@memoirs.app'),
  },

  frontendUrl: optional('FRONTEND_URL', 'http://localhost:3000'),
} as const;
