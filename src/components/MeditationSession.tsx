import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import VoiceGuide from './VoiceGuide';
import EvolveMascot from './EvolveMascot';

const MeditationSession = ({ onBack }: { onBack: () => void }) => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes par défaut
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [isCompleted, setIsCompleted] = useState(false);

  const durations = [
    { label: '2 min', value: 2, seconds: 120 },
    { label: '5 min', value: 5, seconds: 300 },
    { label: '10 min', value: 10, seconds: 600 },
    { label: '15 min', value: 15, seconds: 900 }
  ];

  const breathingInstructions = [
    "Inspire profondément par le nez... Sens l'air qui remplit tes poumons.",
    "Retiens ton souffle quelques secondes... Laisse cette énergie circuler.",
    "Expire lentement par la bouche... Relâche toutes les tensions.",
    "Laisse ton corps se détendre complètement... Tu es en sécurité.",
    "Concentre-toi uniquement sur ta respiration... Rien d'autre n'existe.",
    "Sens l'air frais qui entre et l'air chaud qui sort... C'est parfait.",
    "Relâche tes épaules, ton visage, tes mains... Tout ton corps se détend.",
    "Tu es dans l'instant présent... Ici et maintenant, tout va bien."
  ];

  const [currentInstruction, setCurrentInstruction] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  useEffect(() => {
    if (isActive) {
      const instructionInterval = setInterval(() => {
        setCurrentInstruction(prev => (prev + 1) % breathingInstructions.length);
      }, 8000);

      return () => clearInterval(instructionInterval);
    }
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(selectedDuration * 60);
    setIsCompleted(false);
    setCurrentInstruction(0);
  };

  const handleDurationChange = (duration: typeof durations[0]) => {
    setSelectedDuration(duration.value);
    setTime(duration.seconds);
    setIsActive(false);
    setIsCompleted(false);
  };

  const getMascotMood = () => {
    if (isCompleted) return 'celebrating';
    if (isActive) return 'listening';
    return 'encouraging';
  };

  const getMascotMessage = () => {
    if (isCompleted) return "Bravo ! Tu as terminé ta méditation. Tu te sens mieux maintenant ? 🧘‍♀️";
    if (isActive) return "Je suis là avec toi... Respire calmement. 🌸";
    return "Prêt pour un moment de calme ? Choisis ta durée et on commence ensemble ! ✨";
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
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
            <h1 className="text-xl font-semibold text-gray-800">Méditation Guidée</h1>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">Entraîne ton focus et ta concentration</p>
              <VoiceGuide 
                text={isActive ? breathingInstructions[currentInstruction] : ""}
                isActive={isActive}
                voice="female"
                speed={0.8}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable avec padding bottom pour les boutons fixes */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-start p-6 space-y-8 pb-32">
          
          {/* Mascot Message */}
          <div className="w-full max-w-md animate-slide-in-up">
            <EvolveMascot 
              mood={getMascotMood()} 
              size="large" 
              animated={true}
              message={getMascotMessage()}
            />
          </div>
          
          {/* Duration Selection - En haut */}
          {!isActive && !isCompleted && (
            <div className="w-full max-w-sm animate-slide-in-up mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Choisis ta durée</h3>
              <div className="grid grid-cols-2 gap-4">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    onClick={() => handleDurationChange(duration)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 text-lg font-semibold min-h-[80px] flex items-center justify-center ${
                      selectedDuration === duration.value
                        ? 'border-green-400 bg-green-50 text-green-700 scale-105 shadow-lg'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 hover:scale-105 shadow-md'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer Circle - Au centre */}
          <div className="relative animate-scale-in mt-8">
            <div className="w-64 h-64 rounded-full border-8 border-gray-200 flex items-center justify-center relative overflow-hidden shadow-xl">
              <div 
                className="absolute inset-0 rounded-full border-8 border-green-400 transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (1 - time / (selectedDuration * 60)) - Math.PI/2)}% ${50 + 50 * Math.sin(2 * Math.PI * (1 - time / (selectedDuration * 60)) - Math.PI/2)}%, 50% 50%)`
                }}
              />
              <div className="text-center z-10 p-4">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(time)}
                </div>
                {isActive && (
                  <div className="text-sm text-gray-600 animate-pulse px-2 text-center leading-relaxed">
                    {breathingInstructions[currentInstruction]}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Breathing Animation */}
          {isActive && (
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-400 opacity-30 animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          )}

        </div>
      </div>

      {/* Fixed Controls at Bottom - Bien séparés du contenu */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 shadow-2xl">
        <div className="flex justify-center space-x-4 max-w-md mx-auto">
          {!isActive && !isCompleted && (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-3 text-lg font-semibold"
            >
              <Play size={24} />
              <span>Commencer</span>
            </button>
          )}

          {isActive && (
            <button
              onClick={handlePause}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-3 text-lg font-semibold"
            >
              <Pause size={24} />
              <span>Pause</span>
            </button>
          )}

          {(isActive || time < selectedDuration * 60) && !isCompleted && (
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-3 text-lg font-semibold"
            >
              <RotateCcw size={24} />
              <span>Reset</span>
            </button>
          )}

          {isCompleted && (
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg font-semibold text-lg"
            >
              Nouvelle session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeditationSession;