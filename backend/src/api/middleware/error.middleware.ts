import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction): void {
  const status = err.status ?? 500;
  const message = status < 500 ? err.message : '服务器内部错误';

  if (status >= 500) {
    console.error('[Error]', err);
  }

  res.status(status).json({ error: message });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: '接口不存在' });
}
