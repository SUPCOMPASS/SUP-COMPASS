import { pool } from '../../../config/database.js';

export interface Domaine {
    id: number;
    nom: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

// 1. Récupérer tous les domaines
export async function getAllDomaines(): Promise<Domaine[]> {

    const result = await pool.query(
        `SELECT *
         FROM api_demo_domaines
         ORDER BY id ASC`
    );

    return result.rows;
}

// 2. Ajouter un domaine
export async function createDomaine(
    nom: string,
    description: string
): Promise<Domaine> {

    const result = await pool.query(
        `INSERT INTO api_demo_domaines (nom, description)
         VALUES ($1, $2)
         RETURNING *`,
        [nom, description]
    );

    return result.rows[0];
}

// 3. Modifier un domaine
export async function updateDomaine(
    id: number,
    nom: string,
    description: string
): Promise<Domaine | null> {

    const result = await pool.query(
        `UPDATE api_demo_domaines
         SET nom = $1,
             description = $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [nom, description, id]
    );

    return result.rows[0] ?? null;
}