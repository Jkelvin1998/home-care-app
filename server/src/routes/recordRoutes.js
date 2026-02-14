import { Router } from 'express';
import {
   createRecord,
   deleteRecord,
   listRecords,
   updateRecord,
} from '../controllers/recordController.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(listRecords));
router.post('/', asyncHandler(createRecord));
router.put('/:id', asyncHandler(updateRecord));
router.delete('/:id', asyncHandler(deleteRecord));

export default router;
