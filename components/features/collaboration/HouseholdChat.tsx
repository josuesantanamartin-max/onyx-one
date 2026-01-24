import React, { useState, useEffect, useRef } from 'react';
import { useHouseholdStore } from '../../../store/useHouseholdStore';
import { householdService } from '../../../services/householdService';
import { Send, MessageSquare } from 'lucide-react';

export const HouseholdChat: React.FC = () => {
    const { activeHouseholdId } = useHouseholdStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Polling interval
    useEffect(() => {
        if (!activeHouseholdId) return;

        const loadMessages = async () => {
            try {
                // @ts-ignore
                const msgs = await householdService.getMessages(activeHouseholdId);
                setMessages(msgs || []);
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        };

        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Poll every 5s

        return () => clearInterval(interval);
    }, [activeHouseholdId]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeHouseholdId) return;

        const tempMsg = {
            id: Date.now().toString(), // Optimalistic UI
            content: newMessage,
            user_id: 'me', // placeholder
            created_at: new Date().toISOString(),
            user: { email: 'Yo' }
        };

        // Optimistic update
        setMessages(prev => [tempMsg, ...prev]);
        setNewMessage('');
        setIsLoading(true);

        try {
            await householdService.sendMessage(activeHouseholdId, tempMsg.content);
            // Re-fetch to get real ID/server time
            // @ts-ignore
            const msgs = await householdService.getMessages(activeHouseholdId);
            setMessages(msgs || []);
        } catch (e) {
            console.error("Failed to send", e);
            // Rollback in real app
        } finally {
            setIsLoading(false);
        }
    };

    if (!activeHouseholdId) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-gray-800 dark:text-white">Chat Familiar</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-10">No hay mensajes aún. ¡Di hola!</p>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === 'me' || false; // Ideally check against current User ID form auth store
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                    {!isMe && <p className="text-xs opacity-50 mb-1">{msg.user?.email?.split('@')[0]}</p>}
                                    <p>{msg.content}</p>
                                    <p className="text-[10px] opacity-70 mt-1 text-right">
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || isLoading}
                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};
