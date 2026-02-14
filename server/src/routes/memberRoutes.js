import { Router } from 'express';
import {
   createMember,
   deleteMember,
   listMembers,
   updateMember,
} from '../controllers/memberController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(listMembers));
router.post('/', asyncHandler(createMember));
router.put('/:id', asyncHandler(updateMember));
router.delete('/:id', asyncHandler(deleteMember));

export default router;
