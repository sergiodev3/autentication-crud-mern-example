import { Router } from 'express';

import { login, register } from '../controllers/authController.js';
import authRateLimiter from '../middlewares/authRateLimiter.js';
import validate from '../middlewares/validate.js';
import { loginValidation, registerValidation } from '../validators/authValidators.js';

const router = Router();

router.post('/register', authRateLimiter, registerValidation, validate, register);
router.post('/login', authRateLimiter, loginValidation, validate, login);

export default router;
