import type { RequestHandler } from 'express';
import { z } from 'zod';

import {
    register,
    login
} from '../services/auth.service.js';

// ========================================
// 1. VALIDATION SCHEMAS
// ========================================

const registerSchema = z.object({
    firstName: z.string().trim().min(2).max(100),

    lastName: z.string().trim().min(2).max(100),

    email: z.string().trim().email().max(255),

    password: z.string().min(8).max(72)
});

const loginSchema = z.object({
    email: z.string().trim().email().max(255),

    password: z.string().min(1).max(72)
});

// ========================================
// 2. REGISTER CONTROLLER
// ========================================

export const registerController: RequestHandler = async (
    request,
    response,
    next
) => {

    // Validation des données reçues
    const validation = registerSchema.safeParse(request.body);

    if (!validation.success) {
        response.status(400).json({
            error: 'Invalid registration data.',
            details: validation.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });

        return;
    }

    try {

        // Appel du service d'inscription
        const result = await register(validation.data);

        response.status(201).json({
            message: 'Account created successfully.',
            user: result.user,
            token: result.token
        });

    } catch (error: unknown) {

        next(error);

    }
};

// ========================================
// 3. LOGIN CONTROLLER
// ========================================

export const loginController: RequestHandler = async (
    request,
    response,
    next
) => {

    // Validation des données reçues
    const validation = loginSchema.safeParse(request.body);

    if (!validation.success) {
        response.status(400).json({
            error: 'Invalid login data.',
            details: validation.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });

        return;
    }

    try {

        // Appel du service de connexion
        const result = await login(validation.data);

        response.status(200).json({
            message: 'Login successful.',
            user: result.user,
            token: result.token
        });

    } catch (error: unknown) {

        next(error);

    }
};