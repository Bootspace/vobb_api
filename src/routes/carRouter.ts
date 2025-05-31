import { Router } from 'express';
import {
  createCar,
  getCars,
  updateCar,
  deleteCar,
} from '@/controllers';
import { authenticate } from '@/middlewares';

const router = Router();

router.post('/', authenticate, createCar);
router.get('/', getCars);
router.put('/:id', authenticate, updateCar);
router.delete('/:id', authenticate, deleteCar);

export { router as carRouter };

