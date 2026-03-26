import { Router } from 'express';

import { login, register } from '../controllers/authController.js';
import validate from '../middlewares/validate.js';
import { loginValidation, registerValidation } from '../validators/authValidators.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

export default router;
