import { useState } from 'react';
import { ArrowLeft, Users, MessageCircle, Heart, Smile } from 'lucide-react';

const SocialTraining = ({ onBack }: { onBack: () => void }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const scenarios = [
    {
      situation: "Tu croises un collègue dans le couloir qui semble stressé",
      context: "Il a l'air préoccupé et marche rapidement",
      responses: [
        { text: "Tu l'ignores pour ne pas le déranger", score: 1, feedback: "Respectueux mais tu rates une occasion de connexion" },
        { text: "Tu lui demandes : 'Ça va ? Tu as l'air préoccupé'", score: 3, feedback: "Parfait ! Tu montres de l'empathie et de l'attention" },
        { text: "Tu dis juste 'Salut' en passant", score: 2, feedback: "Poli mais tu pourrais être plus attentif aux signaux" }
      ]
    },
    {
      situation: "Quelqu'un te fait un compliment sur ton travail",
      context: "Ton manager te félicite devant l'équipe",
      responses: [
        { text: "Tu dis 'C'était rien' et tu changes de sujet", score: 1, feedback: "Tu minimises tes efforts, apprends à accepter les compliments" },
        { text: "Tu réponds 'Merci, j'ai vraiment pris plaisir à ce projet'", score: 3, feedback: "Excellent ! Tu acceptes gracieusement et partages ton ressenti" },
        { text: "Tu dis 'Merci' rapidement et tu rougis", score: 2, feedback: "Bien mais tu peux être plus à l'aise avec les compliments" }
      ]
    },
    {
      situation: "Tu veux rejoindre une conversation de groupe",
      context: "Tes collègues discutent pendant la pause",
      responses: [
        { text: "Tu attends qu'il y ait une pause et tu dis 'De quoi vous parlez ?'", score: 3, feedback: "Parfait ! Tu respectes le flow et montres ton intérêt" },
        { text: "Tu restes à côté sans rien dire", score: 1, feedback: "Tu rates l'occasion de participer, ose te manifester" },
        { text: "Tu interromps pour dire 'Salut tout le monde !'", score: 2, feedback: "Amical mais attention à ne pas couper la conversation" }
      ]
    },
    {
      situation: "Quelqu'un partage une difficulté personnelle avec toi",
      context: "Un ami te confie qu'il traverse une période difficile",
      responses: [
        { text: "Tu donnes immédiatement des conseils pour résoudre le problème", score: 2, feedback: "Bien intentionné mais parfois il faut juste écouter" },
        { text: "Tu écoutes et tu dis 'Ça doit être dur, tu veux en parler ?'", score: 3, feedback: "Excellent ! Tu offres ton écoute sans juger ni conseiller" },
        { text: "Tu changes de sujet pour le distraire", score: 1, feedback: "Tu évites le malaise mais tu ne l'aides pas vraiment" }
      ]
    },
    {
      situation: "Tu dois exprimer un désaccord en réunion",
      context: "Une décision est prise mais tu as une autre vision",
      responses: [
        { text: "Tu dis 'Je ne suis pas d'accord' et tu expliques pourquoi", score: 2, feedback: "Direct mais tu peux être plus diplomatique" },
        { text: "Tu ne dis rien pour éviter le conflit", score: 1, feedback: "Tu évites le conflit mais tes idées comptent aussi" },
        { text: "Tu dis 'J'ai une perspective différente, puis-je la partager ?'", score: 3, feedback: "Parfait ! Tu exprimes ton désaccord avec respect et diplomatie" }
      ]
    }
  ];

  const handleResponseSelect = (responseIndex: number) => {
    setSelectedResponse(responseIndex);
    setShowFeedback(true);
    setScore(prev => prev + scenarios[currentScenario].responses[responseIndex].score);
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedResponse(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedResponse(null);
    setShowFeedback(false);
    setScore(0);
  };

  const isCompleted = currentScenario >= scenarios.length - 1 && showFeedback;
  const maxScore = scenarios.length * 3;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={onBack}
          className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </button>
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-4 rounded-2xl mr-4 shadow-lg">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Entraînement Social</h1>
            <p className="text-sm text-gray-500">Améliore tes compétences relationnelles</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 animate-slide-in-up">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Scénario {currentScenario + 1}/{scenarios.length}</span>
            <span>Score: {score}/{maxScore}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        {!isCompleted ? (
          <>
            {/* Scenario */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-scale-in">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-2xl mr-4">
                  <MessageCircle className="text-pink-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Situation</h3>
              </div>
              
              <p className="text-gray-800 text-lg mb-3 leading-relaxed">
                {scenarios[currentScenario].situation}
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-600 text-sm">
                  📍 Contexte : {scenarios[currentScenario].context}
                </p>
              </div>
            </div>

            {/* Responses */}
            {!showFeedback && (
              <div className="space-y-3 animate-slide-in-up">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Comment réagis-tu ?</h4>
                {scenarios[currentScenario].responses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponseSelect(index)}
                    className="w-full bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] text-left group"
                  >
                    <p className="text-gray-800 leading-relaxed group-hover:text-pink-600 transition-colors">
                      {response.text}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && selectedResponse !== null && (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-scale-in">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-2xl mr-4 ${
                    scenarios[currentScenario].responses[selectedResponse].score === 3 
                      ? 'bg-green-100' 
                      : scenarios[currentScenario].responses[selectedResponse].score === 2 
                      ? 'bg-yellow-100' 
                      : 'bg-orange-100'
                  }`}>
                    {scenarios[currentScenario].responses[selectedResponse].score === 3 ? (
                      <Heart className="text-green-600" size={24} />
                    ) : scenarios[currentScenario].responses[selectedResponse].score === 2 ? (
                      <Smile className="text-yellow-600" size={24} />
                    ) : (
                      <MessageCircle className="text-orange-600" size={24} />
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">Feedback</h4>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {scenarios[currentScenario].responses[selectedResponse].feedback}
                </p>

                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg font-semibold"
                >
                  {currentScenario < scenarios.length - 1 ? 'Scénario suivant' : 'Voir les résultats'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Results */
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center animate-scale-in">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-white" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Entraînement terminé ! 🎉</h3>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-pink-600 mb-2">{percentage}%</div>
              <p className="text-gray-700">Score final : {score}/{maxScore}</p>
            </div>

            <div className="text-left mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Ton niveau social :</h4>
              {percentage >= 80 && (
                <p className="text-green-700 bg-green-50 p-4 rounded-2xl">
                  🌟 Excellent ! Tu as d'excellentes compétences sociales. Continue comme ça !
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-blue-700 bg-blue-50 p-4 rounded-2xl">
                  👍 Bien joué ! Tu as de bonnes bases, quelques ajustements et tu seras au top !
                </p>
              )}
              {percentage < 60 && (
                <p className="text-orange-700 bg-orange-50 p-4 rounded-2xl">
                  💪 C'est un bon début ! Avec de la pratique, tes compétences sociales vont s'améliorer.
                </p>
              )}
            </div>

            <button
              onClick={handleRestart}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg font-semibold"
            >
              Recommencer l'entraînement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialTraining;