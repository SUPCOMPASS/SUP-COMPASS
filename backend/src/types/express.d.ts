import type {
    AuthenticatedUser
} from '../modules/auth/services/auth.service.js';

// ========================================
// EXPRESS TYPE EXTENSION
// ========================================

declare global {

    namespace Express {

        interface Request {

            user?: AuthenticatedUser;

        }

    }

}

export { };