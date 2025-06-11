import { useState } from 'react';
import { MessageCircle, X, Send, Lightbulb, TrendingUp, CloudRain, Leaf, LucideIcon, RotateCcw } from 'lucide-react';

interface QuickQuestion {
  id: string;
  text: string;
  icon: LucideIcon;
  category: string;
}

const quickQuestions: QuickQuestion[] = [
  {
    id: 'weather-impact',
    text: 'How will this week\'s weather affect my crops?',
    icon: CloudRain,
    category: 'Weather'
  },
  {
    id: 'yield-forecast',
    text: 'What\'s my expected yield for wheat this season?',
    icon: TrendingUp,
    category: 'Yield'
  },
  {
    id: 'fertilizer-timing',
    text: 'When should I apply nitrogen to my corn?',
    icon: Leaf,
    category: 'Inputs'
  },
  {
    id: 'pest-prevention',
    text: 'Any pest risks for my field this month?',
    icon: Lightbulb,
    category: 'Protection'
  }
];

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'ai'; timestamp: Date }>>([]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClearChat = () => {
    setMessages([]);
    setMessage('');
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (in real app, this would call your AI service)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're asking about "${text}". Based on your farm data and current conditions, here's what I recommend... (This is a simulated response)`,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  const handleQuickQuestion = (question: QuickQuestion) => {
    handleSendMessage(question.text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className={`md:hidden fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 transform rotate-45' 
            : 'bg-yagro-brand hover:bg-yagro-brand-dark transform hover:scale-110'
        }`}
        style={{
          // Ensure it's above bottom navigation but respects safe area
          marginBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={handleToggle}
          />
          
          {/* Chat Window */}
          <div className="md:hidden fixed bottom-20 right-4 left-4 bg-white rounded-2xl shadow-2xl z-50 flex flex-col h-[500px] border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-50 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yagro-brand rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-yagro-brand">Field-optimized help</p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200 group"
                  title="Clear chat and return to quick questions"
                >
                  <RotateCcw size={16} className="text-yagro-brand group-hover:text-yagro-brand-dark" />
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircle size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Ask me anything about your farm!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-yagro-brand text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Questions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question) => {
                    const Icon = question.icon;
                    return (
                      <button
                        key={question.id}
                        onClick={() => handleQuickQuestion(question)}
                        className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon size={12} className="text-yagro-brand" />
                          <span className="text-xs font-medium text-yagro-brand">{question.category}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-tight">{question.text}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about your farm..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yagro-brand focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 bg-yagro-brand hover:bg-yagro-brand-dark disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Send size={16} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
