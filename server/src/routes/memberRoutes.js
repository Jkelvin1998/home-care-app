import { Router } from 'express';
import {
   createMember,
   deleteMember,
   listMembers,
   updateMember,
} from '../controllers/memberController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
