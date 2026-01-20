
import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { getAiResponse } from '../services/ai/providerRouter.js';

export const createChat = asyncHandler(async (req, res) => {
    const { title, mode } = req.body;

    const chat = await Chat.create({
        userId: req.user.id,
        title: title || 'New Chat',
        mode: mode || 'chat'
    });

    res.status(201).json({
        success: true,
        message: 'Chat created successfully',
        data: { chat }
    });
});

export const getChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({ userId: req.user.id }).sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { chats }
    });
});

export const getChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    res.status(200).json({
        success: true,
        data: { chat }
    });
});

export const updateChat = asyncHandler(async (req, res) => {
    const { title, mode, isPinned } = req.body;

    let chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    if (title !== undefined) chat.title = title;
    if (mode !== undefined) chat.mode = mode;
    if (isPinned !== undefined) chat.isPinned = isPinned;

    await chat.save();

    res.status(200).json({
        success: true,
        message: 'Chat updated successfully',
        data: { chat }
    });
});

export const deleteChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    if (chat.isPinned) {
        throw new ApiError(400, 'Pinned sessions cannot be purged. Unpin this session first.');
    }

    await Chat.findByIdAndDelete(req.params.id);

    await Message.deleteMany({ chatId: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Chat and messages deleted successfully'
    });
});

export const getMessages = asyncHandler(async (req, res) => {

    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    const messages = await Message.find({ chatId: req.params.id }).sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        data: { messages }
    });
});

export const addMessage = asyncHandler(async (req, res) => {
    const { role, content } = req.body;

    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    const message = await Message.create({
        chatId: chat._id,
        role,
        content
    });

    res.status(201).json({
        success: true,
        data: { message }
    });
});

export const clearMessages = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found');
    }

    await Message.deleteMany({ chatId: req.params.id });

    res.status(200).json({
        success: true,
        message: 'Messages cleared successfully'
    });
});

export const sendMessageAndGetResponse = asyncHandler(async (req, res) => {
    const { chatId, message, mode } = req.body;

    if (!chatId || !message) {
        throw new ApiError(400, 'Chat ID and message are required');
    }

    const chat = await Chat.findOne({
        _id: chatId,
        userId: req.user.id
    });

    if (!chat) {
        throw new ApiError(404, 'Chat not found or access denied');
    }

    const activeMode = mode || chat.mode || 'chat';

    try {
        const userMsg = await Message.create({
            chatId: chat._id,
            role: 'user',
            content: message
        });

        const aiContent = await getAiResponse(activeMode, message);

        const assistantMsg = await Message.create({
            chatId: chat._id,
            role: 'assistant',
            content: aiContent
        });

        if (chat.title === 'New Chat') {
            try {
                const titlePrompt = `Generate a concise, 3-5 word title for a conversation that starts with: "${message}". Avoid quotes and punctuation.`;
                const generatedTitle = await getAiResponse('chat', titlePrompt);

                const cleanTitle = generatedTitle.replace(/["']/g, '').trim();

                chat.title = cleanTitle;
                await chat.save();
            } catch (titleError) {
                console.error('Title generation failed:', titleError);
            }
        }

        res.status(200).json({
            success: true,
            data: {
                userMessage: userMsg,
                assistantMessage: assistantMsg
            }
        });

    } catch (error) {
        console.error('Chat Send Error:', error);

        if (activeMode === 'reasoning' || activeMode === 'code') {
            return res.status(502).json({
                success: false,
                message: `${activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} engine currently unresponsive.`,
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        throw new ApiError(500, error.message || 'Error processing chat message');
    }
});
