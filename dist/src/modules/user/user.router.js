import { Router } from 'express';
import auth, { UserRole } from '../../middlewares/auth';
import { userController } from './user.controller';
const router = Router();
router.get('/', auth(UserRole.ADMIN), userController.listUsers);
router.patch('/profile', auth(), userController.updateProfile);
router.patch('/:id', auth(UserRole.ADMIN), userController.updateUser);
export const userRouter = router;
//# sourceMappingURL=user.router.js.map