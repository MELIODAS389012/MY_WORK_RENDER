import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, MicOff, Video, VideoOff, Send, Camera, Image, Paperclip, Smile } from 'lucide-react';
import EvolveMascot from './EvolveMascot';
import { aiService, ConversationContext } from '../services/aiService';

interface VoiceWaveProps {
  isActive: boolean;
  isListening?: boolean;
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isActive, isListening = false }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full transition-all duration-200 ${
            isActive 
              ? `animate-bounce h-${4 + (i % 3) * 2}` 
              : 'h-2'
          } ${isListening ? 'bg-gradient-to-t from-green-400 to-blue-500' : ''}`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            height: isActive ? `${16 + Math.sin(Date.now() / 200 + i) * 8}px` : '8px'
          }}
        />
      ))}
    </div>
  );
};

interface InteractiveChatProps {
  onBack: () => void;
  cardType: string;
}

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  type: 'text' | 'audio' | 'image';
  timestamp: Date;
}

const InteractiveChat: React.FC<InteractiveChatProps> = ({ onBack, cardType }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const emojis = ['😊', '😄', '🤔', '💪', '❤️', '👍', '🎉', '✨', '🔥', '💯', '🙏', '😌'];

  useEffect(() => {
    if (!hasInitialized) {
      initializeChat();
      setHasInitialized(true);
    }
  }, [hasInitialized, cardType]);

  const getUserData = () => {
    const userData = localStorage.getItem('evolve_user');
    return userData ? JSON.parse(userData) : {};
  };

  const getConversationContext = (): ConversationContext => {
    const userData = getUserData();
    return {
      cardType: cardType,
      userName: userData.name,
      userAge: userData.age,
      userGoals: userData.goals,
      conversationHistory: conversationHistory,
      sessionType: 'vision'
    };
  };

  const initializeChat = async () => {
    try {
      const context = getConversationContext();
      const initialMessage = await aiService.getInitialMessage(context);
      
      addMessage('ai', initialMessage, 'text');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      addMessage('ai', "Salut ! Je suis là pour t'écouter. De quoi tu as envie de parler ? 😊", 'text');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        addMessage('user', 'Message vocal envoyé', 'audio');
        
        // Simuler une transcription et envoyer à l'IA
        await handleAIResponse('L\'utilisateur a envoyé un message vocal. Réponds de manière encourageante.');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Erreur accès microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const toggleVideoCall = () => {
    setIsVideoCall(!isVideoCall);
  };

  const addMessage = (sender: 'user' | 'ai', content: string, type: 'text' | 'audio' | 'image' = 'text') => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      sender,
      content,
      type,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      const context = getConversationContext();
      context.conversationHistory = conversationHistory;
      
      setIsAISpeaking(true);
      const aiResponse = await aiService.sendMessage(userMessage, context);
      
      setTimeout(() => {
        setIsAISpeaking(false);
        addMessage('ai', aiResponse, 'text');
        
        // Mettre à jour l'historique
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: aiResponse }
        ]);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur IA:', error);
      setIsAISpeaking(false);
      addMessage('ai', "Je t'écoute avec attention... Continue, ça m'intéresse vraiment.", 'text');
    }
  };

  const sendTextMessage = async () => {
    if (inputText.trim()) {
      addMessage('user', inputText, 'text');
      const messageToSend = inputText;
      setInputText('');
      
      await handleAIResponse(messageToSend);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header avec contrôles vidéo */}
      <div className="flex items-center justify-between p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Discussion Interactive</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-500">Evolve est en ligne avec intelligence</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={toggleVideoCall}
          className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 ${
            isVideoCall 
              ? 'bg-red-100 text-red-600' 
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          }`}
        >
          {isVideoCall ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
      </div>

      {/* Zone vidéo/audio avec mascotte */}
      {isVideoCall && (
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 p-6 relative">
          <div className="flex justify-center items-center h-48 relative">
            {/* Mascotte interactive avec waves */}
            <div className="relative">
              <EvolveMascot 
                mood={isAISpeaking ? 'encouraging' : isListening ? 'listening' : 'happy'} 
                size="large" 
                animated={true}
                message={isAISpeaking ? "Je réfléchis à ta question..." : isListening ? "Je t'écoute..." : "Prêt à discuter intelligemment !"}
              />
              
              {/* Waves audio autour de la mascotte */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-32 h-32 rounded-full border-2 border-white opacity-20 animate-ping"></div>
                <div className="absolute w-40 h-40 rounded-full border border-white opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              {/* Voice waves style WhatsApp */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                  <VoiceWave isActive={isAISpeaking || isListening} isListening={isListening} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <EvolveMascot 
              mood="encouraging" 
              size="large" 
              animated={true}
              message="Salut ! Tu peux me parler en vocal, en vidéo ou par écrit. Je suis une IA intelligente prête à t'écouter ! 💙"
            />
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.sender === 'ai' && (
              <div className="flex-shrink-0 mr-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-3xl shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-lg'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-lg'
              }`}
            >
              {msg.type === 'audio' && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mic className="text-blue-600" size={16} />
                  </div>
                  <VoiceWave isActive={false} />
                  <span className="text-sm">0:05</span>
                </div>
              )}
              
              {msg.type === 'text' && (
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              )}
              
              <p className={`text-xs mt-2 ${
                msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isAISpeaking && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-lg p-4 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input zone style WhatsApp */}
      <div className="bg-white border-t border-gray-100 p-4">
        <div className="flex items-end space-x-3 bg-gray-50 rounded-3xl p-4">
          {/* Emoji picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
            >
              <Smile size={20} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-6 gap-2 z-50">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    className="text-xl hover:bg-gray-100 rounded-lg p-2 transition-all duration-200 hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <button className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
            <Paperclip size={20} />
          </button>
          
          <button className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
            <Image size={20} />
          </button>
          
          <button className="p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
            <Camera size={20} />
          </button>

          {/* Text input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écris ton message..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 resize-none max-h-32"
            rows={1}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTextMessage();
              }
            }}
          />

          {/* Voice/Send button */}
          {inputText.trim() ? (
            <button
              onClick={sendTextMessage}
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Send size={20} />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg ${
                isRecording 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>
        
        {isRecording && (
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500 animate-pulse">🎤 Enregistrement en cours... Relâche pour envoyer</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveChat;