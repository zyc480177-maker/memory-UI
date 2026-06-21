import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { projectRepo } from '../../data/repositories/project.repo';
import { chapterService } from '../../core/services/chapter.service';

const router = Router();
router.use(requireAuth);

// ─── Projects ─────────────────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const projects = await projectRepo.findByOwner(userId);
  res.json({ projects });
});

router.post('/', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const schema = z.object({
    title: z.string().min(1, '项目标题不能为空').max(100),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    defaultNarrativeVoice: z.enum(['first_person', 'third_person']).optional(),
    targetAudience: z.enum(['self', 'family', 'public_reserved']).optional(),
    subject: z.object({
      fullName: z.string().min(1, '主人公姓名不能为空'),
      displayName: z.string().optional(),
      relationshipToOwner: z.enum(['self', 'parent', 'grandparent', 'spouse', 'child', 'other']).optional(),
      gender: z.enum(['unknown', 'male', 'female', 'other']).optional(),
      birthYear: z.number().int().min(1800).max(2100).optional(),
      lifeSummary: z.string().optional(),
    }).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const project = await projectRepo.create({ ownerUserId: userId, ...parsed.data });

  let subject = null;
  if (parsed.data.subject) {
    subject = await projectRepo.createSubject({ projectId: project.id, ...parsed.data.subject });
    await projectRepo.update(project.id, userId, { primarySubjectId: subject.id });
  }

  res.status(201).json({ project: { ...project, primarySubjectId: subject?.id }, subject });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.id, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const subject = project.primarySubjectId
    ? await projectRepo.findSubject(project.id)
    : null;

  res.json({ project, subject });
});

router.patch('/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const schema = z.object({
    title: z.string().min(1).max(100).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    phase: z.enum(['collecting', 'organizing', 'writing', 'exporting']).optional(),
    status: z.enum(['draft', 'active', 'archived']).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const project = await projectRepo.update(req.params.id, userId, parsed.data);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }
  res.json({ project });
});

// ─── Subject ──────────────────────────────────────────────────────────────────

router.get('/:id/subject', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.id, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const subject = await projectRepo.findSubject(req.params.id);
  res.json({ subject });
});

router.put('/:id/subject', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.id, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    fullName: z.string().min(1),
    displayName: z.string().optional(),
    relationshipToOwner: z.enum(['self', 'parent', 'grandparent', 'spouse', 'child', 'other']).optional(),
    gender: z.enum(['unknown', 'male', 'female', 'other']).optional(),
    birthYear: z.number().int().optional(),
    lifeSummary: z.string().optional(),
    narrativeVoicePreference: z.enum(['first_person', 'third_person']).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  let subject = await projectRepo.findSubject(req.params.id);
  if (subject) {
    subject = await projectRepo.updateSubject(subject.id, parsed.data) ?? subject;
  } else {
    subject = await projectRepo.createSubject({ projectId: req.params.id, ...parsed.data });
    await projectRepo.update(req.params.id, userId, { primarySubjectId: subject.id });
  }

  res.json({ subject });
});

// ─── Export ───────────────────────────────────────────────────────────────────

router.post('/:id/export', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.id, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const html = await chapterService.exportHtml(project.id, project.title);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(project.title)}.html"`);
  res.send(html);
});

export default router;
