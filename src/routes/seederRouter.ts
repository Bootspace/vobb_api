import express from 'express';
import { 
    seedUsers,
    seedCars,
    seedCategories,
    seedCustomers,
    assignPurchasedCarsToCustomers,
    assignManagerToCar,
    assignCategoryToCars

} from '@/controllers/seeders';

const router = express.Router();

router.post('/user', seedUsers);
router.post('/car', seedCars);
router.post('/category', seedCategories);
router.post('/customer', seedCustomers);
router.put('/assign-purchased-cars-to-customers', assignPurchasedCarsToCustomers);
router.put('/assign-manager-to-car', assignManagerToCar);
router.put('/assign-category-to-cars', assignCategoryToCars);

export { router as seederRouter };
