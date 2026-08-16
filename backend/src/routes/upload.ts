import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'));
  },
});

router.post('/', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni.' });
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'mon_projet_images' }, 
    (error, result) => {
      if (error) return res.status(500).json({ error });
      res.status(200).json({ url: result?.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

export default router;