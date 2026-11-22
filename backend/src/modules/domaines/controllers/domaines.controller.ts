import type { Request, Response, NextFunction } from 'express';

import {
    getAllDomaines,
    createDomaine,
    updateDomaine
} from '../services/domaines.service.js';

// GET : récupérer les domaines
export async function getDomaines(
    _request: Request,
    response: Response,
    next: NextFunction
) {
    try {

        const domaines = await getAllDomaines();

        response.status(200).json(domaines);

    } catch (error) {
        next(error);
    }
}

// POST : ajouter un domaine
export async function postDomaine(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {

        const { nom, description } = request.body;

        if (
            typeof nom !== 'string' ||
            !nom.trim() ||
            typeof description !== 'string'
        ) {
            response.status(400).json({
                error: 'Nom et description sont obligatoires.'
            });

            return;
        }

        const domaine = await createDomaine(
            nom.trim(),
            description.trim()
        );

        response.status(201).json(domaine);

    } catch (error) {
        next(error);
    }
}

// PATCH : modifier un domaine
export async function patchDomaine(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {

        const id = Number(request.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            response.status(400).json({
                error: 'Identifiant invalide.'
            });

            return;
        }

        const { nom, description } = request.body;

        if (
            typeof nom !== 'string' ||
            !nom.trim() ||
            typeof description !== 'string'
        ) {
            response.status(400).json({
                error: 'Nom et description sont obligatoires.'
            });

            return;
        }

        const domaine = await updateDomaine(
            id,
            nom.trim(),
            description.trim()
        );

        if (!domaine) {
            response.status(404).json({
                error: 'Domaine introuvable.'
            });

            return;
        }

        response.status(200).json(domaine);

    } catch (error) {
        next(error);
    }
}