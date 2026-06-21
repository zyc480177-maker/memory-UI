import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../../data/db';
import { config } from '../../config';
import { AccountUser } from '../models/domain';

function toUser(row: Record<string, unknown>): AccountUser {
  return {
    id: row.id as string,
    email: row.email as string,
    displayName: row.display_name as string,
    avatarUrl: row.avatar_url as string | undefined,
    status: row.status as AccountUser['status'],
    lastLoginAt: row.last_login_at ? new Date(row.last_login_at as string) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export const authService = {
  signToken(userId: string, email: string): string {
    return jwt.sign({ userId, email } as AuthTokenPayload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn,
    } as jwt.SignOptions);
  },

  verifyToken(token: string): AuthTokenPayload {
    return jwt.verify(token, config.auth.jwtSecret) as AuthTokenPayload;
  },

  async login(email: string, password: string): Promise<{ user: AccountUser; token: string }> {
    const row = await queryOne(
      'SELECT * FROM account_users WHERE email = $1 AND status = $2',
      [email.toLowerCase().trim(), 'active']
    );

    if (!row) throw Object.assign(new Error('邮箱或密码错误'), { status: 401 });

    const user = toUser(row);
    const hash = row.password_hash as string;

    if (!hash) throw Object.assign(new Error('账户未设置密码，请使用 Magic Link 登录'), { status: 401 });

    const valid = await bcrypt.compare(password, hash);
    if (!valid) throw Object.assign(new Error('邮箱或密码错误'), { status: 401 });

    await query('UPDATE account_users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const token = this.signToken(user.id, user.email);
    return { user, token };
  },

  async getUser(userId: string): Promise<AccountUser | null> {
    const row = await queryOne('SELECT * FROM account_users WHERE id = $1', [userId]);
    return row ? toUser(row) : null;
  },

  async updateProfile(userId: string, data: { displayName?: string; avatarUrl?: string }): Promise<AccountUser | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.displayName !== undefined) { fields.push(`display_name = $${idx++}`); values.push(data.displayName); }
    if (data.avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(data.avatarUrl); }

    if (fields.length === 0) return this.getUser(userId);

    fields.push('updated_at = NOW()');
    values.push(userId);

    const row = await queryOne(
      `UPDATE account_users SET ${fields.join(', ')} WHERE id = $${idx++} RETURNING *`,
      values
    );
    return row ? toUser(row) : null;
  },
};
