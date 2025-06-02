import express from 'express';
const router = express.Router();

import {
    getProperties,
    getMostSearchedProperty
} from '../controllers/property.js';

router.get('/all', getProperties);
router.get('/most-searched', getMostSearchedProperty);

export default router;