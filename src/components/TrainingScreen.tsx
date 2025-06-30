import { useState } from 'react';
import { Brain, MessageCircle, Focus, Dumbbell, Users, ArrowLeft, Play, Music } from 'lucide-react';
import TrainingChat from './TrainingChat';
import MeditationSession from './MeditationSession';
import PhysicalExercise from './PhysicalExercise';
import SocialTraining from './SocialTraining';
import MusicSession from './MusicSession';
import EvolveMascot from './EvolveMascot';

type TrainingMode = 'menu' | 'revision' | 'chat' | 'focus' | 'physical' | 'social' | 'music';

const TrainingScreen = () => {
  const [activeMode, setActiveMode] = useState<TrainingMode>('menu');

  const trainingOptions = [
    {
      id: 'revision',
      title: 'Révision',
      subtitle: 'Revoir tes objectifs et progrès',
      icon: Brain,
      color: 'from-purple-100 to-purple-50',
      iconColor: 'text-purple-600',
      bgGradient: 'bg-gradient-to-br from-purple-400 to-purple-600',
      description: 'Fais le point sur tes apprentissages et consolide tes acquis'
    },
    {
      id: 'chat',
      title: 'Discussion Libre',
      subtitle: 'Parle ouvertement avec Evolve',
      icon: MessageCircle,
      color: 'from-blue-100 to-blue-50',
      iconColor: 'text-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-400 to-blue-600',
      description: 'Une conversation sans limites pour explorer tes pensées'
    },
    {
      id: 'focus',
      title: 'Entraînement Focus',
      subtitle: 'Méditation et concentration',
      icon: Focus,
      color: 'from-green-100 to-green-50',
      iconColor: 'text-green-600',
      bgGradient: 'bg-gradient-to-br from-green-400 to-green-600',
      description: 'Développe ta concentration avec des exercices guidés'
    },
    {
      id: 'physical',
      title: 'Exercice Physique',
      subtitle: 'Bouge ton corps, libère ton esprit',
      icon: Dumbbell,
      color: 'from-orange-100 to-orange-50',
      iconColor: 'text-orange-600',
      bgGradient: 'bg-gradient-to-br from-orange-400 to-orange-600',
      description: 'Des exercices adaptés pour ton bien-être physique'
    },
    {
      id: 'social',
      title: 'Entraînement Social',
      subtitle: 'Améliore tes relations',
      icon: Users,
      color: 'from-pink-100 to-pink-50',
      iconColor: 'text-pink-600',
      bgGradient: 'bg-gradient-to-br from-pink-400 to-pink-600',
      description: 'Pratique tes compétences sociales et relationnelles'
    },
    {
      id: 'music',
      title: 'Session Musique',
      subtitle: 'Playlists et ambiances sonores',
      icon: Music,
      color: 'from-indigo-100 to-purple-50',
      iconColor: 'text-indigo-600',
      bgGradient: 'bg-gradient-to-br from-indigo-400 to-purple-600',
      description: 'Crée tes playlists et trouve ton rythme parfait'
    }
  ];

  const renderTrainingMode = () => {
    switch (activeMode) {
      case 'revision':
        return <RevisionMode onBack={() => setActiveMode('menu')} />;
      case 'chat':
        return <TrainingChat onBack={() => setActiveMode('menu')} />;
      case 'focus':
        return <MeditationSession onBack={() => setActiveMode('menu')} />;
      case 'physical':
        return <PhysicalExercise onBack={() => setActiveMode('menu')} />;
      case 'social':
        return <SocialTraining onBack={() => setActiveMode('menu')} />;
      case 'music':
        return <MusicSession onBack={() => setActiveMode('menu')} />;
      default:
        return null;
    }
  };

  if (activeMode !== 'menu') {
    return renderTrainingMode();
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header avec Mascotte */}
      <div className="text-center pt-12 pb-6 animate-slide-in-up">
        <div className="mb-6">
          <EvolveMascot 
            mood="encouraging" 
            size="large" 
            animated={true}
            message="Prêt pour ton entraînement ? Choisis ce qui te fait vibrer aujourd'hui ! 💪"
          />
        </div>
        <h1 className="text-3xl font-light text-gray-800 mb-3 animate-fade-in">Session Training</h1>
        <p className="text-gray-500 text-base animate-fade-in animate-stagger-1">Choisis ton mode d'entraînement</p>
      </div>

      {/* Training Options */}
      <div className="space-y-6">
        {trainingOptions.map((option, index) => {
          const IconComponent = option.icon;
          
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${option.color} rounded-3xl p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-scale-in cursor-pointer`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setActiveMode(option.id as TrainingMode)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`${option.bgGradient} p-4 rounded-2xl shadow-lg mr-4`}>
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{option.title}</h3>
                    <p className="text-gray-600 font-medium">{option.subtitle}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                  <Play className="text-gray-600" size={20} />
                </div>
              </div>
              
              <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-gray-300">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Revision Mode Component
const RevisionMode = ({ onBack }: { onBack: () => void }) => {
  const [currentTopic, setCurrentTopic] = useState(0);
  
  const revisionTopics = [
    {
      title: "Tes Objectifs MIND",
      content: "Tu travailles sur la méditation quotidienne. Comment ça se passe ?",
      progress: 65
    },
    {
      title: "Tes Objectifs BODY", 
      content: "L'exercice physique était dans tes plans. Où en es-tu ?",
      progress: 40
    },
    {
      title: "Tes Objectifs SKILLS",
      content: "Python et développement personnel. Quels sont tes derniers apprentissages ?",
      progress: 80
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={onBack}
          className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </button>
        <div className="flex items-center">
          <EvolveMascot mood="thinking" size="medium" animated={true} />
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-800">Session Révision</h1>
            <p className="text-sm text-gray-500">Fais le point sur tes progrès</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {revisionTopics.map((topic, index) => (
          <div
            key={index}
            className={`bg-white rounded-3xl p-6 shadow-lg border border-gray-100 transition-all duration-300 ${
              currentTopic === index ? 'ring-2 ring-purple-400 scale-[1.02]' : 'hover:shadow-xl'
            }`}
            onClick={() => setCurrentTopic(index)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{topic.title}</h3>
              <div className="text-purple-600 font-bold">{topic.progress}%</div>
            </div>
            <p className="text-gray-600 mb-4">{topic.content}</p>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingScreen;