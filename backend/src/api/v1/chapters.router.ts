import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { projectRepo } from '../../data/repositories/project.repo';
import { chapterRepo } from '../../data/repositories/chapter.repo';
import { chapterService } from '../../core/services/chapter.service';

const router = Router();
router.use(requireAuth);

router.get('/projects/:projectId/chapters', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const chapters = await chapterRepo.findByProject(req.params.projectId);
  res.json({ chapters });
});

router.post('/projects/:projectId/chapters', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    title: z.string().min(1),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    narrativeVoice: z.enum(['first_person', 'third_person']).optional(),
    eventIds: z.array(z.string()).optional(),
    generateContent: z.boolean().default(false),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  let chapter;
  if (parsed.data.generateContent && parsed.data.eventIds?.length) {
    const subject = await projectRepo.findSubject(project.id);
    chapter = await chapterService.generateFromEvents({
      projectId: project.id,
      title: parsed.data.title,
      eventIds: parsed.data.eventIds,
      narrativeVoice: parsed.data.narrativeVoice,
      subjectName: subject?.displayName ?? subject?.fullName,
    });
  } else {
    chapter = await chapterRepo.create({
      projectId: project.id,
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      summary: parsed.data.summary,
      narrativeVoice: parsed.data.narrativeVoice,
    });

    if (parsed.data.eventIds?.length) {
      await chapterRepo.linkEvents(chapter.id, parsed.data.eventIds);
    }
  }

  res.status(201).json({ chapter });
});

router.get('/projects/:projectId/chapters/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const chapter = await chapterRepo.findById(req.params.id);
  if (!chapter || chapter.projectId !== req.params.projectId) {
    res.status(404).json({ error: '章节不存在' }); return;
  }

  const eventIds = await chapterRepo.getEventIds(chapter.id);
  res.json({ chapter: { ...chapter, eventIds } });
});

router.patch('/projects/:projectId/chapters/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    title: z.string().min(1).optional(),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    status: z.enum(['outline', 'ai_draft', 'owner_editing', 'finalized']).optional(),
    editedContent: z.string().optional(),
    narrativeVoice: z.enum(['first_person', 'third_person']).optional(),
    sortOrder: z.number().int().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const chapter = await chapterRepo.update(req.params.id, parsed.data);
  if (!chapter) { res.status(404).json({ error: '章节不存在' }); return; }

  res.json({ chapter });
});

// Regenerate chapter content from its events
router.post('/projects/:projectId/chapters/:id/regenerate', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const chapter = await chapterRepo.findById(req.params.id);
  if (!chapter || chapter.projectId !== req.params.projectId) {
    res.status(404).json({ error: '章节不存在' }); return;
  }

  const eventIds = await chapterRepo.getEventIds(chapter.id);
  const subject = await projectRepo.findSubject(project.id);

  const newChapter = await chapterService.generateFromEvents({
    projectId: project.id,
    title: chapter.title,
    eventIds,
    narrativeVoice: chapter.narrativeVoice,
    subjectName: subject?.displayName ?? subject?.fullName,
  });

  // Update the existing chapter with new draft content
  const updated = await chapterRepo.update(chapter.id, {
    draftContent: newChapter.draftContent,
    status: 'ai_draft',
  });

  res.json({ chapter: updated });
});

export default router;
