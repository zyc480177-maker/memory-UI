import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { projectRepo } from '../../data/repositories/project.repo';
import { eventRepo } from '../../data/repositories/event.repo';
import { assetRepo } from '../../data/repositories/asset.repo';

const router = Router();
router.use(requireAuth);

router.get('/projects/:projectId/events', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const events = await eventRepo.findByProject(req.params.projectId);

  const eventsWithAssets = await Promise.all(
    events.map(async (e) => ({
      ...e,
      assetIds: await eventRepo.getAssetIds(e.id),
    }))
  );

  res.json({ events: eventsWithAssets });
});

router.post('/projects/:projectId/events', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    description: z.string().optional(),
    startAt: z.string().datetime().optional(),
    timePrecision: z.enum(['year', 'month', 'day', 'range', 'unknown']).optional(),
    locationText: z.string().optional(),
    participants: z.array(z.string()).optional(),
    emotionTags: z.array(z.string()).optional(),
    assetIds: z.array(z.string()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const event = await eventRepo.create({
    projectId: req.params.projectId,
    ...parsed.data,
    startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : undefined,
    sourceType: 'manual',
  });

  if (parsed.data.assetIds?.length) {
    await eventRepo.linkAssets(event.id, parsed.data.assetIds);
  }

  res.status(201).json({ event });
});

router.get('/projects/:projectId/events/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const event = await eventRepo.findById(req.params.id);
  if (!event || event.projectId !== req.params.projectId) {
    res.status(404).json({ error: '事件不存在' }); return;
  }

  const assetIds = await eventRepo.getAssetIds(event.id);
  res.json({ event: { ...event, assetIds } });
});

router.patch('/projects/:projectId/events/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    title: z.string().min(1).optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    startAt: z.string().datetime().optional(),
    timePrecision: z.enum(['year', 'month', 'day', 'range', 'unknown']).optional(),
    locationText: z.string().optional(),
    participants: z.array(z.string()).optional(),
    emotionTags: z.array(z.string()).optional(),
    status: z.enum(['draft', 'confirmed', 'archived']).optional(),
    timelineOrderHint: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const event = await eventRepo.update(req.params.id, {
    ...parsed.data,
    startAt: parsed.data.startAt ? new Date(parsed.data.startAt) : undefined,
  });
  if (!event) { res.status(404).json({ error: '事件不存在' }); return; }

  res.json({ event });
});

export default router;
