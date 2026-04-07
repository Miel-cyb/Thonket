'use client';

import { useState } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatPanel({ messages = [], onSendMessage }) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        onSendMessage?.({
            id: Date.now(),
            sender: 'driver', // or 'manager'
            text: input,
            timestamp: new Date().toLocaleTimeString(),
        });

        setInput('');
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col h-[300px]">

            {/* Header */}
            <h2 className="text-lg font-semibold mb-3">Chat</h2>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                {messages.length === 0 ? (
                    <p className="text-sm text-gray-500">No messages yet</p>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-600 text-white px-4 rounded-lg text-sm"
                >
                    Send
                </button>
            </div>

        </div>
    );
}