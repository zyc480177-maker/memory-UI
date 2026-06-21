import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../../core/services/auth.service';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位'),
});

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  try {
    const { user, token } = await authService.login(parsed.data.email, parsed.data.password);
    res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status ?? 500).json({ error: e.message });
  }
});

router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const user = await authService.getUser(userId);
  if (!user) { res.status(404).json({ error: '用户不存在' }); return; }
  res.json({ user: sanitizeUser(user) });
});

router.patch('/me', requireAuth, async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const schema = z.object({
    displayName: z.string().optional(),
    avatarUrl: z.string().url().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const user = await authService.updateProfile(userId, parsed.data);
  if (!user) { res.status(404).json({ error: '用户不存在' }); return; }
  res.json({ user: sanitizeUser(user) });
});

function sanitizeUser(user: { id: string; email: string; displayName: string; avatarUrl?: string; lastLoginAt?: Date }) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    lastLoginAt: user.lastLoginAt,
  };
}

export default router;
