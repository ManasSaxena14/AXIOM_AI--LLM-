import express from 'express';
import {
    createChat,
    getChats,
    getChat,
    updateChat,
    deleteChat,
    getMessages,
    addMessage,
    clearMessages,
    sendMessageAndGetResponse
} from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.use(protect);

router.post('/send', sendMessageAndGetResponse);


router.route('/')
    .post(createChat)
    .get(getChats);

router.route('/:id')
    .get(getChat)
    .patch(updateChat)
    .delete(deleteChat);


router.route('/:id/messages')
    .get(getMessages)
    .post(addMessage)
    .delete(clearMessages);

export default router;
