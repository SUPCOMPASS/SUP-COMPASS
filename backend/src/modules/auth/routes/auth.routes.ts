import { Router } from 'express';

import {
    registerController,
    loginController
} from '../controllers/auth.controller.js';

// ========================================
// 1. AUTH ROUTER
// ========================================

const router = Router();

// ========================================
// 2. REGISTRATION
// ========================================

router.post('/register', registerController);

// ========================================
// 3. LOGIN
// ========================================

router.post('/login', loginController);

// ========================================
// 4. EXPORT ROUTER
// ========================================

export default router;