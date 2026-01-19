import User from '../models/User.model.js';
import Chat from '../models/Chat.model.js';
import Message from '../models/Message.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total User Count
    const totalUsers = await User.countDocuments();

    // 2. Chat Statistics
    const totalChats = await Chat.countDocuments();
    
    // Group chats by mode for chart data
    const chatsByMode = await Chat.aggregate([
        {
            $group: {
                _id: '$mode',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                name: '$_id',
                value: '$count'
            }
        }
    ]);

    // 3. Message Statistics
    const totalMessages = await Message.countDocuments();

    // Optional: Messages over time (last 7 days) if strictly needed, 
    // but for now keeping it simple as requested to avoid errors.
    
    res.status(200).json({
        success: true,
        data: {
            users: {
                total: totalUsers
            },
            chats: {
                total: totalChats,
                byMode: chatsByMode
            },
            messages: {
                total: totalMessages
            }
        }
    });
});
