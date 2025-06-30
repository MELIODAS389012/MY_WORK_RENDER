import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, Brain, Target, Users } from 'lucide-react';
import EvolveMascot from './EvolveMascot';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      title: "Bienvenue dans Evolve ! 🌟",
      subtitle: "Ton compagnon IA pour une transformation personnelle authentique",
      component: "welcome"
    },
    {
      title: "Faisons connaissance ! 😊",
      subtitle: "Comment aimerais-tu que je t'appelle ?",
      component: "name"
    },
    {
      title: "Parfait, " + userName + " ! 🎯",
      subtitle: "Quel âge as-tu ? (optionnel)",
      component: "age"
    },
    {
      title: "Super ! 💪",
      subtitle: "Quels sont tes objectifs principaux ?",
      component: "goals"
    },
    {
      title: "Prêt à commencer ! 🚀",
      subtitle: "Ton parcours de transformation commence maintenant",
      component: "ready"
    }
  ];

  const goalOptions = [
    { id: 'mind', label: 'Développer mon mental', icon: Brain, color: 'from-purple-400 to-purple-600' },
    { id: 'body', label: 'Améliorer ma forme physique', icon: Heart, color: 'from-green-400 to-green-600' },
    { id: 'skills', label: 'Apprendre de nouvelles compétences', icon: Target, color: 'from-blue-400 to-blue-600' },
    { id: 'social', label: 'Améliorer mes relations', icon: Users, color: 'from-pink-400 to-pink-600' }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      // Sauvegarder les données utilisateur
      localStorage.setItem('evolve_user', JSON.stringify({
        name: userName,
        age: userAge,
        goals: userGoals,
        createdAt: new Date().toISOString()
      }));
      onComplete();
    }
  };

  const toggleGoal = (goalId: string) => {
    setUserGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return userName.trim().length > 0;
      case 3: return userGoals.length > 0;
      default: return true;
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.component) {
      case 'welcome':
        return (
          <div className="text-center space-y-8">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Transformation personnelle"
                className="w-80 h-80 object-cover rounded-3xl shadow-2xl mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <EvolveMascot 
                  mood="celebrating" 
                  size="large" 
                  animated={true}
                  message="Salut ! Je suis Evolve, ton coach IA personnel ! 🌟"
                />
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Transforme ta vie avec l'IA la plus empathique
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Je suis là pour t'accompagner dans ton développement personnel avec bienveillance, 
                sans jugement, et avec une approche 100% personnalisée.
              </p>
            </div>
          </div>
        );

      case 'name':
        return (
          <div className="text-center space-y-8">
            <EvolveMascot 
              mood="happy" 
              size="large" 
              animated={true}
              message="Comment aimerais-tu que je t'appelle ? 😊"
            />
            
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ton prénom..."
                className="w-full text-2xl text-center bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                autoFocus
              />
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="text-center space-y-8">
            <EvolveMascot 
              mood="thinking" 
              size="large" 
              animated={true}
              message={`Enchanté ${userName} ! Quel âge as-tu ? 🤔`}
            />
            
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <input
                type="number"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                placeholder="Ton âge (optionnel)"
                className="w-full text-2xl text-center bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                min="13"
                max="100"
              />
              <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="text-center space-y-8">
            <EvolveMascot 
              mood="encouraging" 
              size="large" 
              animated={true}
              message="Super ! Maintenant, dis-moi tes objectifs ! 🎯"
            />
            
            <div className="grid grid-cols-1 gap-4">
              {goalOptions.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = userGoals.includes(goal.id);
                
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-6 rounded-3xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-r ${goal.color} p-4 rounded-2xl shadow-lg`}>
                        <IconComponent className="text-white" size={24} />
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{goal.label}</span>
                      {isSelected && (
                        <div className="ml-auto bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'ready':
        return (
          <div className="text-center space-y-8">
            <EvolveMascot 
              mood="celebrating" 
              size="large" 
              animated={true}
              message={`Parfait ${userName} ! Ton parcours commence maintenant ! 🚀`}
            />
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Récapitulatif</h3>
              <div className="space-y-3 text-left">
                <p><span className="font-semibold">Nom :</span> {userName}</p>
                {userAge && <p><span className="font-semibold">Âge :</span> {userAge} ans</p>}
                <p><span className="font-semibold">Objectifs :</span></p>
                <div className="grid grid-cols-1 gap-2 ml-4">
                  {userGoals.map(goalId => {
                    const goal = goalOptions.find(g => g.id === goalId);
                    return goal ? (
                      <div key={goalId} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{goal.label}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-white/50 backdrop-blur-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Étape {currentStep + 1}</span>
            <span>{steps.length} étapes</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className={`text-center mb-12 transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {/* Step content */}
          <div className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
          }`}>
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === steps.length - 1 ? 'Commencer mon parcours' : 'Continuer'}</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;