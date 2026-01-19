
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: [true, 'Chat ID is required'],
            index: true
        },
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: [true, 'Role is required']
        },
        content: {
            type: String,
            required: [true, 'Content is required']
        }
    },
    {
        timestamps: true
    }
);


messageSchema.index({ chatId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
