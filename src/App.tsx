import { useState, useEffect } from 'react';
import { Home, Target, BookOpen, User, Dumbbell } from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import VisionScreen from './components/VisionScreen';
import JournalScreen from './components/JournalScreen';
import ProfileScreen from './components/ProfileScreen';
import TrainingScreen from './components/TrainingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import BoltBadge from './components/BoltBadge';

type TabType = 'home' | 'vision' | 'journal' | 'training' | 'profile';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà configuré son compte
    const userData = localStorage.getItem('evolve_user');
    if (!userData) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return;
    
    setIsTransitioning(true);
    
    // Delay to allow fade out animation
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'vision':
        return <VisionScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'training':
        return <TrainingScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  if (showWelcome) {
    return (
      <>
        <WelcomeScreen onComplete={handleWelcomeComplete} />
        <BoltBadge />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20 relative">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isTransitioning 
              ? 'opacity-0 transform translate-y-4 scale-[0.98]' 
              : 'opacity-100 transform translate-y-0 scale-100'
          }`}
        >
          {renderScreen()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-gray-100/50 px-2 py-2 shadow-2xl">
        <div className="flex justify-around items-center">
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 transform ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 scale-110 shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <Home size={20} className={`transition-all duration-300 ${
              activeTab === 'home' ? 'animate-bounce' : ''
            }`} />
            <span className="text-xs mt-1 font-medium">Accueil</span>
          </button>

          <button
            onClick={() => handleTabChange('vision')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 transform ${
              activeTab === 'vision'
                ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-600 scale-110 shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <Target size={20} className={`transition-all duration-300 ${
              activeTab === 'vision' ? 'animate-pulse' : ''
            }`} />
            <span className="text-xs mt-1 font-medium">Vision</span>
          </button>

          <button
            onClick={() => handleTabChange('training')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 transform ${
              activeTab === 'training'
                ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 scale-110 shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <Dumbbell size={20} className={`transition-all duration-300 ${
              activeTab === 'training' ? 'animate-bounce' : ''
            }`} />
            <span className="text-xs mt-1 font-medium">Training</span>
          </button>

          <button
            onClick={() => handleTabChange('journal')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 transform ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-600 scale-110 shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <BookOpen size={20} className={`transition-all duration-300 ${
              activeTab === 'journal' ? 'animate-bounce' : ''
            }`} />
            <span className="text-xs mt-1 font-medium">Journal</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 transform ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-pink-100 to-pink-50 text-pink-600 scale-110 shadow-lg'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <User size={20} className={`transition-all duration-300 ${
              activeTab === 'profile' ? 'animate-pulse' : ''
            }`} />
            <span className="text-xs mt-1 font-medium">Profil</span>
          </button>
        </div>
      </div>

      {/* Badge Bolt.new */}
      <BoltBadge />
    </div>
  );
}

export default App;