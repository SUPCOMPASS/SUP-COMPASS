import type { RequestHandler } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { pool } from '../config/database.js';

import type {
    AuthenticatedUser,
    UserRole
} from '../modules/auth/services/auth.service.js';

// ========================================
// 1. JWT CONFIGURATION
// ========================================

function getJwtSecret(): string {

    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error('Invalid JWT_SECRET configuration.');
    }

    return secret;
}

// ========================================
// 2. AUTHENTICATION MIDDLEWARE
// ========================================

export const authenticateToken: RequestHandler = async (
    request,
    response,
    next
) => {

    try {

        // Récupérer le header Authorization
        const authorization = request.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            response.status(401).json({
                error: 'Authentication token is required.'
            });

            return;
        }

        // Extraire le JWT
        const token = authorization.slice(7).trim();

        if (!token) {
            response.status(401).json({
                error: 'Invalid authentication token.'
            });

            return;
        }

        // Vérifier la signature et la validité du JWT
        let decoded: string | JwtPayload;

        try {

            decoded = jwt.verify(token, getJwtSecret());

        } catch (error: unknown) {

            if (
                error instanceof jwt.TokenExpiredError ||
                error instanceof jwt.JsonWebTokenError
            ) {
                response.status(401).json({
                    error: 'Invalid or expired authentication token.'
                });

                return;
            }

            throw error;
        }

        // Vérifier le contenu du JWT
        if (
            typeof decoded === 'string' ||
            typeof decoded.sub !== 'string'
        ) {
            response.status(401).json({
                error: 'Invalid authentication token payload.'
            });

            return;
        }

        // Récupérer les informations actuelles depuis PostgreSQL
        const result = await pool.query(
            `
      SELECT
        id,
        first_name,
        last_name,
        email,
        role
      FROM users
      WHERE id = $1
      `,
            [decoded.sub]
        );

        const row = result.rows[0] as {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            role: UserRole;
        } | undefined;

        if (!row) {
            response.status(401).json({
                error: 'User account no longer exists.'
            });

            return;
        }

        // Construire l'utilisateur authentifié
        const user: AuthenticatedUser = {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            role: row.role
        };

        // Ajouter l'utilisateur à la requête Express
        request.user = user;

        // Passer au middleware ou contrôleur suivant
        next();

    } catch (error: unknown) {

        next(error);

    }
};

// ========================================
// 3. ROLE AUTHORIZATION MIDDLEWARE
// ========================================

export function authorizeRoles(
    ...allowedRoles: UserRole[]
): RequestHandler {

    return (request, response, next) => {

        // Vérifier que l'utilisateur est authentifié
        if (!request.user) {
            response.status(401).json({
                error: 'Authentication required.'
            });

            return;
        }

        // Vérifier le rôle de l'utilisateur
        if (!allowedRoles.includes(request.user.role)) {
            response.status(403).json({
                error: 'You do not have permission to access this resource.'
            });

            return;
        }

        next();
    };
}