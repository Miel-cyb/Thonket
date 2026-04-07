'use client';

export default function ChatMessage({ message }) {
    const isDriver = message.sender === 'driver';

    return (
        <div className={`flex ${isDriver ? 'justify-end' : 'justify-start'}`}>

            <div
                className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${isDriver
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
            >
                <p>{message.text}</p>
                <span className="block text-xs opacity-70 mt-1">
                    {message.timestamp}
                </span>
            </div>

        </div>
    );
}