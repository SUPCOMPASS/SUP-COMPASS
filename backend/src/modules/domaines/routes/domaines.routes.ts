mport { Router } from 'express';

import {
    getDomaines,
    postDomaine,
    patchDomaine
} from '../controllers/domaines.controller.js';

const router = Router();

// GET : afficher tous les domaines
router.get('/', getDomaines);

// POST : créer un domaine
router.post('/', postDomaine);

// PATCH : modifier un domaine
router.patch('/:id', patchDomaine);