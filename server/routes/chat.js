import express from 'express';
const router = express.Router();

import {
    searchMatches,
    searchMatchesMe
} from '../controllers/chat.js';
import { auth } from '../middlewares/Auth.js';

router.post('/search', searchMatches);
router.post('/search/me',auth, searchMatchesMe);

export default router;