import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },
        title: {
            type: String,
            default: 'New Chat',
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        mode: {
            type: String,
            enum: ['groq', 'cerebras', 'chat', 'code', 'reasoning'],
            default: 'chat'
        },
        isPinned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

chatSchema.index({ userId: 1, createdAt: -1 });

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
