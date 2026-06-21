import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../middleware/auth.middleware';
import { projectRepo } from '../../data/repositories/project.repo';
import { assetRepo } from '../../data/repositories/asset.repo';
import { assetService } from '../../core/services/asset.service';
import { storage } from '../../external/storage/storage';
import path from 'path';
import fs from 'fs';
import { config } from '../../config';

const router = Router();
router.use(requireAuth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = /image\/(jpeg|png|gif|webp)|audio\/(mpeg|wav|m4a|ogg)|text\/(plain)/;
    cb(null, allowed.test(file.mimetype));
  },
});

// ─── List assets ──────────────────────────────────────────────────────────────

router.get('/projects/:projectId/assets', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const assets = await assetRepo.findByProject(req.params.projectId);
  const assetsWithUrls = assets.map((a) => ({
    ...a,
    url: a.storageKey ? assetService.getFileUrl(a.storageKey) : null,
  }));

  res.json({ assets: assetsWithUrls });
});

// ─── Upload file ──────────────────────────────────────────────────────────────

router.post(
  '/projects/:projectId/assets/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    const { userId } = req as AuthRequest;
    const project = await projectRepo.findById(req.params.projectId, userId);
    if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

    if (!req.file) { res.status(400).json({ error: '请选择要上传的文件' }); return; }

    const asset = await assetService.uploadFile({
      projectId: req.params.projectId,
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      byteSize: req.file.size,
      notes: req.body.notes,
      captureTime: req.body.captureTime ? new Date(req.body.captureTime) : undefined,
    });

    res.status(201).json({
      asset: { ...asset, url: asset.storageKey ? assetService.getFileUrl(asset.storageKey) : null },
    });
  }
);

// ─── Create text asset ────────────────────────────────────────────────────────

router.post('/projects/:projectId/assets/text', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const schema = z.object({
    title: z.string().min(1),
    content: z.string().min(1, '文字内容不能为空'),
    notes: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.errors[0].message }); return; }

  const asset = await assetService.createTextAsset({
    projectId: req.params.projectId,
    ...parsed.data,
  });

  res.status(201).json({ asset });
});

// ─── Get single asset ─────────────────────────────────────────────────────────

router.get('/projects/:projectId/assets/:id', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const asset = await assetRepo.findById(req.params.id);
  if (!asset || asset.projectId !== req.params.projectId) {
    res.status(404).json({ error: '素材不存在' }); return;
  }

  const analysis = await assetRepo.getLatestAnalysis(asset.id);

  res.json({
    asset: { ...asset, url: asset.storageKey ? assetService.getFileUrl(asset.storageKey) : null },
    analysis,
  });
});

// ─── Retrigger analysis ───────────────────────────────────────────────────────

router.post('/projects/:projectId/assets/:id/analyze', async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const project = await projectRepo.findById(req.params.projectId, userId);
  if (!project) { res.status(404).json({ error: '项目不存在' }); return; }

  const asset = await assetRepo.findById(req.params.id);
  if (!asset || asset.projectId !== req.params.projectId) {
    res.status(404).json({ error: '素材不存在' }); return;
  }

  // Fire and forget
  assetService.analyzeAsset(asset).catch((err) =>
    console.error(`[Assets] Re-analysis failed for ${asset.id}:`, err.message)
  );

  res.json({ message: '分析已重新触发，请稍后查看结果' });
});

// ─── Serve local files ────────────────────────────────────────────────────────

router.get('/files/projects/:projectId/assets/:filename', async (req: Request, res: Response) => {
  const filePath = path.join(
    config.storage.uploadDir,
    'projects',
    req.params.projectId,
    'assets',
    req.params.filename
  );

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: '文件不存在' }); return;
  }

  res.sendFile(filePath);
});

export default router;
