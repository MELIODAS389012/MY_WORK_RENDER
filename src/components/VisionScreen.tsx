import React, { useState } from 'react';
import { Brain, Heart, Code, Users, Edit3, ArrowLeft, Send, Sparkles, Video } from 'lucide-react';
import InteractiveChat from './InteractiveChat';
import { aiService, ConversationContext } from '../services/aiService';

interface ChatMessage {
  sender: 'ai' | 'user';
  message: string;
  timestamp: Date;
}

interface VisionCard {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  icon: React.ComponentType<any>;
  color: string;
  iconColor: string;
  bgGradient: string;
}

const VisionScreen = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInteractiveChat, setShowInteractiveChat] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
  const [visionCards, setVisionCards] = useState<VisionCard[]>([
    {
      id: 'mind',
      title: 'MIND',
      subtitle: 'Mental & Spirituel',
      goal: 'Clique pour commencer une conversation',
      icon: Brain,
      color: 'from-purple-100 to-purple-50',
      iconColor: 'text-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      id: 'body',
      title: 'BODY',
      subtitle: 'Physique & Santé',
      goal: 'Clique pour commencer une conversation',
      icon: Heart,
      color: 'from-green-100 to-green-50',
      iconColor: 'text-green-600',
      bgGradient: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      id: 'skills',
      title: 'SKILLS',
      subtitle: 'Compétences & Carrière',
      goal: 'Clique pour commencer une conversation',
      icon: Code,
      color: 'from-blue-100 to-blue-50',
      iconColor: 'text-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      id: 'social',
      title: 'SOCIAL',
      subtitle: 'Relations & Communication',
      goal: 'Clique pour commencer une conversation',
      icon: Users,
      color: 'from-pink-100 to-pink-50',
      iconColor: 'text-pink-600',
      bgGradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
    },
  ]);

  const getUserData = () => {
    const userData = localStorage.getItem('evolve_user');
    return userData ? JSON.parse(userData) : {};
  };

  const getConversationContext = (cardId: string): ConversationContext => {
    const userData = getUserData();
    return {
      cardType: cardId,
      userName: userData.name,
      userAge: userData.age,
      userGoals: userData.goals,
      conversationHistory: conversationHistory,
      sessionType: 'vision'
    };
  };

  const startChat = async (cardId: string) => {
    setActiveChat(cardId);
    setConversationHistory([]);
    
    try {
      const context = getConversationContext(cardId);
      const initialMessage = await aiService.getInitialMessage(context);
      
      setChatMessages([
        { sender: 'ai', message: initialMessage, timestamp: new Date() }
      ]);
    } catch (error) {
      console.error('Erreur lors du démarrage du chat:', error);
      setChatMessages([
        { sender: 'ai', message: "Salut ! Je suis là pour t'écouter. De quoi tu as envie de parler ? 😊", timestamp: new Date() }
      ]);
    }
  };

  const startInteractiveChat = (cardId: string) => {
    setActiveChat(cardId);
    setShowInteractiveChat(true);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !activeChat) return;

    const newUserMessage: ChatMessage = {
      sender: 'user',
      message: userInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    
    // Mettre à jour l'historique de conversation
    const newHistory = [...conversationHistory, { role: 'user' as const, content: userInput }];
    setConversationHistory(newHistory);
    
    setUserInput('');
    setIsTyping(true);

    try {
      const context = getConversationContext(activeChat);
      context.conversationHistory = newHistory;
      
      const aiResponse = await aiService.sendMessage(userInput, context);
      
      setIsTyping(false);
      
      const aiMessage: ChatMessage = {
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      
      // Mettre à jour l'historique avec la réponse de l'IA
      setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);

      // Mettre à jour le statut de la carte après quelques échanges
      if (newHistory.length >= 4) {
        setVisionCards(prev => prev.map(card => 
          card.id === activeChat ? { 
            ...card, 
            goal: "Conversation en cours... Clique pour continuer" 
          } : card
        ));
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setIsTyping(false);
      
      const fallbackMessage: ChatMessage = {
        sender: 'ai',
        message: "Désolé, j'ai eu un petit problème technique. Peux-tu répéter ? Je suis là pour t'écouter. 😊",
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, fallbackMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (showInteractiveChat && activeChat) {
    return <InteractiveChat onBack={() => setShowInteractiveChat(false)} cardType={activeChat} />;
  }

  if (activeChat && !showInteractiveChat) {
    const activeCard = visionCards.find(card => card.id === activeChat);
    const IconComponent = activeCard?.icon || Brain;

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={() => {
                setActiveChat(null);
                setChatMessages([]);
                setConversationHistory([]);
                setShowInteractiveChat(false);
              }}
              className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div className="flex items-center">
              <div className={`${activeCard?.bgGradient} p-4 rounded-2xl mr-4 shadow-lg`}>
                <IconComponent className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">{activeCard?.title}</h1>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-sm text-gray-500">Evolve t'écoute avec intelligence</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bouton pour passer en mode interactif */}
          <button
            onClick={() => setShowInteractiveChat(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Video size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatMessages.map((msg, index) => (
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

        {/* Chat Input */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex items-end space-x-4 bg-gray-50 rounded-3xl p-5">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écris ce que tu ressens..."
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
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center pt-12 pb-6">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={28} />
          </div>
        </div>
        <h1 className="text-3xl font-light text-gray-800 mb-3">Mon Vision Board</h1>
        <p className="text-gray-500 text-base">Tes 4 piliers de développement personnel</p>
      </div>

      {/* Vision Cards */}
      <div className="space-y-6">
        {visionCards.map((card, index) => {
          const IconComponent = card.icon;
          const hasStarted = !card.goal.includes('Clique pour commencer');
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.color} rounded-3xl p-8 border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center">
                  <div className={`${card.bgGradient} p-5 rounded-2xl shadow-lg mr-6`}>
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{card.title}</h3>
                    <p className="text-gray-600 font-medium text-lg">{card.subtitle}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startInteractiveChat(card.id)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
                  >
                    <Video className="text-white" size={20} />
                  </button>
                  <button
                    onClick={() => startChat(card.id)}
                    className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
                  >
                    <Edit3 className="text-gray-600 group-hover:text-blue-600 transition-colors" size={20} />
                  </button>
                </div>
              </div>
              
              <div className={`bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 ${
                hasStarted ? 'border-l-4 border-green-400' : 'border-l-4 border-gray-300'
              }`}>
                <div className="flex items-start justify-between">
                  <p className={`font-medium leading-relaxed text-lg ${
                    hasStarted ? 'text-gray-800' : 'text-gray-500 italic'
                  }`}>
                    {card.goal}
                  </p>
                  {hasStarted && (
                    <div className="ml-4 bg-green-100 p-3 rounded-full">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisionScreen;