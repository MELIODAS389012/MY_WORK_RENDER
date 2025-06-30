import React, { useState } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { aiService, ConversationContext } from '../services/aiService';

interface ChatMessage {
  sender: 'ai' | 'user';
  message: string;
  timestamp: Date;
}

const TrainingChat = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  React.useEffect(() => {
    if (!hasInitialized) {
      initializeChat();
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const getUserData = () => {
    const userData = localStorage.getItem('evolve_user');
    return userData ? JSON.parse(userData) : {};
  };

  const getConversationContext = (): ConversationContext => {
    const userData = getUserData();
    return {
      userName: userData.name,
      userAge: userData.age,
      userGoals: userData.goals,
      conversationHistory: conversationHistory,
      sessionType: 'training'
    };
  };

  const initializeChat = async () => {
    try {
      const context = getConversationContext();
      const initialMessage = await aiService.sendMessage(
        "L'utilisateur vient de commencer une session de discussion libre. Accueille-le chaleureusement et invite-le à partager ce qui lui passe par la tête.",
        context
      );
      
      setMessages([{
        sender: 'ai',
        message: initialMessage,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setMessages([{
        sender: 'ai',
        message: "Salut ! 😊 Ici c'est ton espace libre. Tu peux me parler de tout ce qui te passe par la tête. Qu'est-ce qui t'occupe l'esprit aujourd'hui ?",
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      sender: 'user',
      message: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    
    // Mettre à jour l'historique de conversation
    const newHistory = [...conversationHistory, { role: 'user' as const, content: userInput }];
    setConversationHistory(newHistory);
    
    setUserInput('');
    setIsTyping(true);

    try {
      const context = getConversationContext();
      context.conversationHistory = newHistory;
      
      const aiResponse = await aiService.sendMessage(userInput, context);
      
      setIsTyping(false);
      
      const aiMessage: ChatMessage = {
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Mettre à jour l'historique avec la réponse de l'IA
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setIsTyping(false);
      
      const fallbackMessage: ChatMessage = {
        sender: 'ai',
        message: "Je t'écoute... Continue, ça m'intéresse vraiment. 😊",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={onBack}
          className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </button>
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-4 rounded-2xl mr-4 shadow-lg">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Discussion Libre</h1>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <p className="text-sm text-gray-500">Evolve t'écoute avec intelligence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white" size={18} />
                </div>
              </div>
            )}
            <div
              className={`max-w-[80%] p-5 rounded-3xl shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-lg'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-lg'
              }`}
            >
              <p className="leading-relaxed text-base whitespace-pre-wrap">{msg.message}</p>
              <p className={`text-xs mt-3 ${
                msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={18} />
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-lg p-5 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-end space-x-4 bg-gray-50 rounded-3xl p-5">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Dis-moi tout ce qui te passe par la tête..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 resize-none max-h-32 text-base"
            rows={1}
            disabled={isTyping}
          />
          <button
            onClick={sendMessage}
            disabled={!userInput.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 text-white p-4 rounded-2xl transition-all duration-200 hover:scale-105 disabled:scale-100 shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingChat;