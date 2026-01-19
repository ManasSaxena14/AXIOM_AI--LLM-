import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useChats = () => {
    const queryClient = useQueryClient();


    const { data: chats = [], isLoading, error } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const response = await apiClient.get('/chats');
            return response.data.data.chats;
        },
    });


    const createChatMutation = useMutation({
        mutationFn: async ({ title, mode }) => {
            const response = await apiClient.post('/chats', { title, mode });
            return response.data.data.chat;
        },
        onSuccess: (newChat) => {

            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });


    const deleteChatMutation = useMutation({
        mutationFn: async (chatId) => {
            await apiClient.delete(`/chats/${chatId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });


    const updateChatMutation = useMutation({
        mutationFn: async ({ chatId, updates }) => {
            const response = await apiClient.patch(`/chats/${chatId}`, updates);
            return response.data.data.chat;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chats'] });
        },
    });

    return {
        chats,
        isLoading,
        error,
        createChat: createChatMutation.mutateAsync,
        isCreating: createChatMutation.isPending,
        deleteChat: deleteChatMutation.mutateAsync,
        isDeleting: deleteChatMutation.isPending,
        updateChat: updateChatMutation.mutateAsync,
        isUpdating: updateChatMutation.isPending,
    };
};
