import express from 'express';
const router = express.Router();
import userRoutes from "../routes/user.js";
import propertyRoutes from "../routes/property.js";
import chatRouter from "../routes/chat.js";

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the API v1',
        status: 'success',
        data: {
            version: '1.0.0',
            description: 'This is the first version of our API.'
        }
    });
})

router.use('/users', userRoutes);
router.use('/property', propertyRoutes);
router.use('/chats', chatRouter);

export default router;