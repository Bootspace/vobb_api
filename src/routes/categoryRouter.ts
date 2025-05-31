import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from '@/controllers';
import { authenticate } from '@/middlewares';

const router = Router();

router.post('/', authenticate, createCategory);
router.get('/', getCategories);
router.put('/:id', authenticate, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export { router as categoryRouter };

