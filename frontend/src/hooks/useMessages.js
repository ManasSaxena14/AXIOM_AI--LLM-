import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useMessages = (chatId) => {
    const queryClient = useQueryClient();


    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ['messages', chatId],
        queryFn: async () => {
            if (!chatId) return [];
            const response = await apiClient.get(`/chats/${chatId}/messages`);
            return response.data.data.messages;
        },
        enabled: !!chatId,
    });


    const sendMessageMutation = useMutation({
        mutationFn: async ({ message, mode }) => {
            const response = await apiClient.post('/chats/send', {
                chatId,
                message,
                mode
            });
            return response.data.data;
        },
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });

            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });


    const clearMessagesMutation = useMutation({
        mutationFn: async () => {
            await apiClient.delete(`/chats/${chatId}/messages`);
        },
        onSuccess: () => {
            queryClient.setQueryData(['messages', chatId], []);
        },
    });

    return {
        messages,
        isLoading,
        error,
        sendMessage: sendMessageMutation.mutateAsync,
        isSending: sendMessageMutation.isPending,
        lastMessageId: messages[messages.length - 1]?._id, // Track the last ID
        clearMessages: clearMessagesMutation.mutateAsync,
        isDeleting: clearMessagesMutation.isPending,
    };
};
