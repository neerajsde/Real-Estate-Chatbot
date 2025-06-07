import express from 'express';
const router = express.Router();

import {
    searchMatches,
    searchMatchesMe
} from '../controllers/chat.js';
import { auth } from '../middlewares/Auth.js';

import {
    chatWithClient
} from '../controllers/chatbot.js';

router.post('/search', searchMatches);
router.post('/search/me',auth, searchMatchesMe);
router.post('/bot', chatWithClient);

export default router;