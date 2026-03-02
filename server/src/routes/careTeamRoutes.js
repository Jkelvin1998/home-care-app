import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
   addCollaborator,
   listCareOwners,
   listCollaborators,
   removeCollaborator,
} from '../controllers/careTeamController.js';

const router = Router();

router.use(requireAuth);
router.get('/owners', asyncHandler(listCareOwners));
router.get('/collaborators', asyncHandler(listCollaborators));
router.post('/collaborators', asyncHandler(addCollaborator));
router.delete('/collaborators/:id', asyncHandler(removeCollaborator));

export default router;
