import { Router } from 'express';
import { register, login, customerPurchase } from '@/controllers';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/create-purchase', customerPurchase);

export { router as authRouter };

