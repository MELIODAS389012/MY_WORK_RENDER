import { Sparkles, Brain, Heart, Code, Users, TrendingUp, Quote } from 'lucide-react';

const HomeScreen = () => {
  const progressData = [
    { label: 'MIND', progress: 65, color: 'bg-purple-400', icon: Brain, bgGradient: 'from-purple-100 to-purple-50' },
    { label: 'BODY', progress: 40, color: 'bg-green-400', icon: Heart, bgGradient: 'from-green-100 to-green-50' },
    { label: 'SKILLS', progress: 80, color: 'bg-blue-400', icon: Code, bgGradient: 'from-blue-100 to-blue-50' },
    { label: 'SOCIAL', progress: 30, color: 'bg-pink-400', icon: Users, bgGradient: 'from-pink-100 to-pink-50' },
  ];

  const dailyVerses = [
    "La seule façon de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
    "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte. - Winston Churchill",
    "Votre temps est limité, ne le gaspillez pas en vivant la vie de quelqu'un d'autre. - Steve Jobs",
    "La différence entre l'ordinaire et l'extraordinaire, c'est ce petit 'extra'. - Jimmy Johnson",
    "Ne regardez pas l'horloge ; faites comme elle. Continuez d'avancer. - Sam Levenson",
    "Le seul moyen de faire un excellent travail est d'aimer ce que vous faites. - Steve Jobs",
    "Croyez en vous-même et tout devient possible. - Anonyme"
  ];

  const todayVerse = dailyVerses[new Date().getDay()];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen pb-24">
      {/* Welcome Message */}
      <div className="text-center pt-12 pb-6 animate-slide-in-up">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center shadow-lg animate-float">
            <Sparkles className="text-white" size={28} />
          </div>
        </div>
        <h1 className="text-3xl font-light text-gray-800 mb-3 animate-fade-in">
          Bonjour, <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Alex</span>
        </h1>
        <p className="text-gray-500 text-base animate-fade-in animate-stagger-1">Prêt à évoluer aujourd'hui ?</p>
      </div>

      {/* Badge info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 shadow-lg border border-white backdrop-blur-sm animate-slide-in-left hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-2xl mr-4 shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Application Bolt.new</h2>
        </div>
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-blue-400 animate-scale-in">
          <p className="text-gray-700 leading-relaxed font-medium">
            Cette application a été entièrement construite avec <strong>Bolt.new</strong> ! 
            Un coach de vie IA moderne et empathique pour ton développement personnel. 🚀
          </p>
        </div>
      </div>

      {/* Verset du Jour */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-lg border border-white backdrop-blur-sm animate-slide-in-left hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-3 rounded-2xl mr-4 shadow-lg">
            <Quote className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Citation du Jour</h2>
        </div>
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-indigo-400 animate-scale-in">
          <p className="text-gray-700 leading-relaxed font-medium italic text-lg">
            "{todayVerse}"
          </p>
        </div>
      </div>

      {/* Focus du Jour */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-white backdrop-blur-sm animate-slide-in-left hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-2xl mr-4 shadow-lg animate-glow">
            <TrendingUp className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Votre Focus du Jour</h2>
        </div>
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-blue-400 animate-scale-in">
          <p className="text-gray-700 leading-relaxed font-medium">
            Aujourd'hui, concentrez-vous sur votre première leçon Python : les variables.
          </p>
        </div>
      </div>

      {/* Progression */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-slide-in-right hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-2xl mr-4 shadow-lg">
            <Brain className="text-white" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Progression de votre Vision</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {progressData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-r ${item.bgGradient} rounded-2xl p-6 border border-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-scale-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white bg-opacity-80 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <IconComponent className="text-gray-600" size={28} />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700 mb-3 text-center">{item.label}</p>
                <div className="bg-white bg-opacity-60 rounded-full h-3 overflow-hidden mb-2">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-sm animate-slide-in-left`}
                    style={{ 
                      width: `${item.progress}%`,
                      animationDelay: `${index * 0.2 + 0.5}s`
                    }}
                  />
                </div>
                <p className="text-sm font-semibold text-gray-600 text-center">{item.progress}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;