import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import VoiceGuide from './VoiceGuide';
import EvolveMascot from './EvolveMascot';

const PhysicalExercise = ({ onBack }: { onBack: () => void }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(30);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState(0);

  const exercises = [
    {
      name: "Pompes",
      description: "Position planche, descends et remonte",
      duration: 30,
      rest: 15,
      tips: "Garde le dos droit, respire régulièrement",
      voiceInstructions: [
        "Allez, on commence les pompes ! Position planche, bras tendus.",
        "Descends lentement en gardant le dos bien droit.",
        "Remonte en poussant fort ! Tu peux le faire !",
        "Continue, respire bien ! Tu es en train de devenir plus fort !"
      ]
    },
    {
      name: "Squats",
      description: "Pieds écartés, descends comme pour t'asseoir",
      duration: 30,
      rest: 15,
      tips: "Genoux alignés avec les pieds, poids sur les talons",
      voiceInstructions: [
        "C'est parti pour les squats ! Pieds écartés, bien stable.",
        "Descends comme si tu t'asseyais sur une chaise invisible.",
        "Remonte en poussant sur tes talons ! Excellent !",
        "Garde le rythme, tu brûles des calories là !"
      ]
    },
    {
      name: "Planche",
      description: "Position pompe, tiens la position",
      duration: 30,
      rest: 15,
      tips: "Corps aligné, respire calmement",
      voiceInstructions: [
        "Position planche ! Corps bien aligné de la tête aux pieds.",
        "Tiens bon, respire calmement. Tu renforces tout ton corps !",
        "Excellent ! Continue à tenir, tu es plus fort que tu le penses.",
        "Presque fini ! Garde cette position parfaite !"
      ]
    },
    {
      name: "Jumping Jacks",
      description: "Saute en écartant bras et jambes",
      duration: 30,
      rest: 15,
      tips: "Rythme régulier, atterris en souplesse",
      voiceInstructions: [
        "Jumping Jacks ! Saute en écartant bras et jambes !",
        "Garde un bon rythme, atterris en souplesse !",
        "Parfait ! Tu fais monter ton rythme cardiaque !",
        "Continue ! Chaque saut te rend plus endurant !"
      ]
    },
    {
      name: "Mountain Climbers",
      description: "Position planche, ramène les genoux alternativement",
      duration: 30,
      rest: 15,
      tips: "Garde les hanches stables, rythme soutenu",
      voiceInstructions: [
        "Mountain Climbers ! Position planche, on alterne les genoux !",
        "Plus vite ! Ramène tes genoux vers ta poitrine !",
        "Garde les hanches stables ! Tu es un champion !",
        "Dernière ligne droite ! Donne tout ce que tu as !"
      ]
    }
  ];

  const [currentVoiceInstruction, setCurrentVoiceInstruction] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0 && isActive) {
      if (isResting) {
        // Fin du repos, passer à l'exercice suivant
        setIsResting(false);
        setCurrentExercise(prev => prev + 1);
        setCompletedExercises(prev => prev + 1);
        setTime(exercises[currentExercise + 1]?.duration || 0);
        setCurrentVoiceInstruction(0);
        
        if (currentExercise + 1 >= exercises.length) {
          setIsActive(false);
        }
      } else {
        // Fin de l'exercice, commencer le repos
        if (currentExercise < exercises.length - 1) {
          setIsResting(true);
          setTime(exercises[currentExercise].rest);
        } else {
          setIsActive(false);
          setCompletedExercises(exercises.length);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isResting, currentExercise]);

  useEffect(() => {
    if (isActive && !isResting) {
      const instructionInterval = setInterval(() => {
        setCurrentVoiceInstruction(prev => 
          (prev + 1) % exercises[currentExercise].voiceInstructions.length
        );
      }, 7000);

      return () => clearInterval(instructionInterval);
    }
  }, [isActive, isResting, currentExercise]);

  const handleStart = () => {
    setIsActive(true);
    setTime(exercises[currentExercise].duration);
    setCurrentVoiceInstruction(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentExercise(0);
    setTime(exercises[0].duration);
    setIsResting(false);
    setCompletedExercises(0);
    setCurrentVoiceInstruction(0);
  };

  const isCompleted = completedExercises >= exercises.length;

  const getMascotMood = () => {
    if (isCompleted) return 'celebrating';
    if (isActive) return 'encouraging';
    return 'happy';
  };

  const getMascotMessage = () => {
    if (isCompleted) return "Incroyable ! Tu as terminé tout le circuit ! Tu es un vrai warrior ! 💪🔥";
    if (isActive && isResting) return "Repos bien mérité ! Prépare-toi pour le prochain exercice ! 😤";
    if (isActive) return `Allez ${exercises[currentExercise]?.name} ! Tu peux le faire ! 🔥`;
    return "Prêt pour un circuit training qui va te faire transpirer ? Let's go ! 💪";
  };

  const getCurrentVoiceText = () => {
    if (isResting) return "Repos ! Respire bien et prépare-toi pour le prochain exercice.";
    if (isActive && exercises[currentExercise]) {
      return exercises[currentExercise].voiceInstructions[currentVoiceInstruction];
    }
    return "";
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={onBack}
          className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </button>
        <div className="flex items-center">
          <EvolveMascot mood={getMascotMood()} size="medium" animated={true} />
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-800">Exercice Physique</h1>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">Circuit training de 5 exercices</p>
              <VoiceGuide 
                text={getCurrentVoiceText()}
                isActive={isActive}
                voice="male"
                speed={1.1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Mascot Message */}
        <div className="w-full max-w-md animate-slide-in-up">
          <EvolveMascot 
            mood={getMascotMood()} 
            size="large" 
            animated={true}
            message={getMascotMessage()}
          />
        </div>

        {/* Progress */}
        <div className="w-full max-w-sm animate-slide-in-up">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Exercice {Math.min(currentExercise + 1, exercises.length)}/{exercises.length}</span>
            <span>{completedExercises}/{exercises.length} terminés</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedExercises / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {!isCompleted ? (
          <>
            {/* Current Exercise */}
            <div className="text-center animate-scale-in">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
                isResting ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <div className="text-4xl font-bold text-gray-800">
                  {time}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isResting ? "Repos" : exercises[currentExercise]?.name}
              </h2>
              
              {!isResting && (
                <>
                  <p className="text-gray-600 mb-4 text-lg">
                    {exercises[currentExercise]?.description}
                  </p>
                  <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                    <p className="text-sm text-gray-700">
                      💡 {exercises[currentExercise]?.tips}
                    </p>
                  </div>
                </>
              )}
              
              {isResting && (
                <p className="text-gray-600 text-lg">
                  Prépare-toi pour : {exercises[currentExercise + 1]?.name}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex space-x-4 animate-slide-in-up">
              {!isActive && (
                <button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Play size={24} />
                  <span className="font-semibold">Commencer</span>
                </button>
              )}

              {isActive && (
                <button
                  onClick={handlePause}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <Pause size={24} />
                  <span className="font-semibold">Pause</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white p-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <RotateCcw size={24} />
                <span className="font-semibold">Reset</span>
              </button>
            </div>
          </>
        ) : (
          /* Completion */
          <div className="text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellent travail ! 💪</h3>
            <p className="text-gray-600 mb-6">Tu as terminé tous les exercices</p>
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
            >
              Nouveau circuit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicalExercise;