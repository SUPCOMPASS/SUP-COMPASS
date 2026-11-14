import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { pool } from '../../../config/database.js';

// ========================================
// 1. TYPES
// ========================================

export type UserRole = 'student' | 'admin';

export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}

export interface AuthResult {
    user: AuthenticatedUser;
    token: string;
}

// ========================================
// 2. AUTHENTICATION ERROR
// ========================================

export class AuthServiceError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);
        this.name = 'AuthServiceError';
    }
}

// ========================================
// 3. JWT CONFIGURATION
// ========================================

function getJwtConfiguration(): {
    secret: string;
    expiresIn: NonNullable<SignOptions['expiresIn']>;
} {
    const secret = process.env.JWT_SECRET;

    if (!secret || secret.length < 32) {
        throw new Error(
            'JWT_SECRET must contain at least 32 characters.'
        );
    }

    const expiresIn = (
        process.env.JWT_EXPIRES_IN ?? '1h'
    ) as NonNullable<SignOptions['expiresIn']>;

    return { secret, expiresIn };
}

// ========================================
// 4. TOKEN GENERATION
// ========================================

function generateToken(user: AuthenticatedUser): string {
    const { secret, expiresIn } = getJwtConfiguration();

    return jwt.sign(
        {
            sub: user.id,
            role: user.role
        },
        secret,
        { expiresIn }
    );
}

// ========================================
// 5. REGISTER
// ========================================

export async function register(
    input: RegisterInput
): Promise<AuthResult> {

    const { firstName, lastName, password } = input;

    const email = input.email.trim().toLowerCase();

    // Vérifier la configuration JWT avant la création du compte
    getJwtConfiguration();

    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12);

    try {

        // Enregistrer le nouvel étudiant
        const result = await pool.query(
            `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        first_name,
        last_name,
        email,
        role
      `,
            [
                firstName.trim(),
                lastName.trim(),
                email,
                passwordHash,
                'student'
            ]
        );

        const row = result.rows[0] as {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
            role: UserRole;
        };

        const user: AuthenticatedUser = {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            email: row.email,
            role: row.role
        };

        const token = generateToken(user);

        return { user, token };

    } catch (error: unknown) {

        // PostgreSQL : code 23505 = violation d'unicité
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            throw new AuthServiceError(
                'An account with this email already exists.',
                409
            );
        }

        throw error;
    }
}

// ========================================
// 6. LOGIN
// ========================================

export async function login(
    input: LoginInput
): Promise<AuthResult> {

    const email = input.email.trim().toLowerCase();

    // Récupérer l'utilisateur depuis PostgreSQL
    const result = await pool.query(
        `
    SELECT
      id,
      first_name,
      last_name,
      email,
      password_hash,
      role
    FROM users
    WHERE email = $1
    `,
        [email]
    );

    const row = result.rows[0] as {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        password_hash: string;
        role: UserRole;
    } | undefined;

    // Vérifier l'existence de l'utilisateur
    if (!row) {
        throw new AuthServiceError(
            'Invalid email or password.',
            401
        );
    }

    // Comparer le mot de passe avec son hash
    const passwordMatches = await bcrypt.compare(
        input.password,
        row.password_hash
    );

    if (!passwordMatches) {
        throw new AuthServiceError(
            'Invalid email or password.',
            401
        );
    }

    // Construire l'utilisateur authentifié
    const user: AuthenticatedUser = {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        role: row.role
    };

    // Générer le JWT
    const token = generateToken(user);

    return { user, token };
}