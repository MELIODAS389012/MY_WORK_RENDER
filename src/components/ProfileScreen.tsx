import { Settings, Bell, HelpCircle, ChevronRight, User, Award, Calendar, Target } from 'lucide-react';

const ProfileScreen = () => {
  const menuItems = [
    { icon: Settings, label: 'Paramètres du compte', color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { icon: Bell, label: 'Notifications', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { icon: HelpCircle, label: 'Aide', color: 'text-green-600', bgColor: 'bg-green-100' },
  ];

  const achievements = [
    { icon: Award, label: 'Premier objectif', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { icon: Calendar, label: '7 jours consécutifs', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { icon: Target, label: 'Vision complète', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center pt-12 pb-6 animate-slide-in-up">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl animate-float">
            <User className="text-white" size={40} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
        <h1 className="text-3xl font-light text-gray-800 mb-2 animate-fade-in">Alex Martin</h1>
        <p className="text-gray-500 text-base animate-fade-in animate-stagger-1">En route vers l'excellence</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-slide-in-left hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Mes statistiques</h2>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-scale-in">
            <p className="text-3xl font-bold text-blue-600 mb-1 animate-bounce">12</p>
            <p className="text-sm text-gray-600 font-medium">Jours actifs</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-scale-in animate-stagger-1">
            <p className="text-3xl font-bold text-green-600 mb-1 animate-pulse">8</p>
            <p className="text-sm text-gray-600 font-medium">Objectifs</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-scale-in animate-stagger-2">
            <p className="text-3xl font-bold text-purple-600 mb-1 animate-bounce">54%</p>
            <p className="text-sm text-gray-600 font-medium">Progression</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-slide-in-right hover:shadow-xl transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Mes réussites</h2>
        <div className="grid grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const IconComponent = achievement.icon;
            return (
              <div 
                key={index} 
                className={`${achievement.bgColor} rounded-2xl p-4 text-center hover:scale-105 transition-all duration-200 animate-scale-in cursor-pointer`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-2">
                  <IconComponent className={`${achievement.color} animate-bounce`} size={24} />
                </div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{achievement.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-4 animate-slide-in-up">
        <h2 className="text-xl font-semibold text-gray-800">Paramètres</h2>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className="w-full bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-between group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center">
                <div className={`${item.bgColor} p-4 rounded-2xl mr-6 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className={item.color} size={24} />
                </div>
                <span className="font-semibold text-gray-800 text-lg">{item.label}</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors group-hover:translate-x-1 transition-transform duration-200" size={24} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileScreen;