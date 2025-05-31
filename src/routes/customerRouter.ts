import { Router } from 'express';
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from '@/controllers';
import { authenticate } from '@/middlewares';

const router = Router();

router.post('/', authenticate, createCustomer);
router.get('/', getCustomers);
router.put('/:id', authenticate, updateCustomer);
router.delete('/:id', authenticate, deleteCustomer);

export { router as customerRouter };
