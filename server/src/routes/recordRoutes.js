import { Router } from 'express';
import {
   createRecord,
   deleteRecord,
   listRecords,
   updateRecord,
} from '../controllers/recordController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listRecords);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

export default router;
