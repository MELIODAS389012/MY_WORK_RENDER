import { useState } from 'react';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Plus, Music, Heart, Shuffle, Repeat } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'relaxation' | 'focus' | 'motivation' | 'personal';
  url?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  color: string;
  icon: React.ComponentType<any>;
}

const MusicSession = ({ onBack }: { onBack: () => void }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'relaxation',
      name: 'Détente & Relaxation',
      description: 'Sons apaisants pour te relaxer',
      color: 'from-green-100 to-blue-100',
      icon: Heart,
      tracks: [
        { id: '1', title: 'Pluie Douce', artist: 'Nature Sounds', duration: '10:00', category: 'relaxation' },
        { id: '2', title: 'Vagues Océan', artist: 'Nature Sounds', duration: '15:00', category: 'relaxation' },
        { id: '3', title: 'Forêt Mystique', artist: 'Nature Sounds', duration: '12:00', category: 'relaxation' },
        { id: '4', title: 'Méditation Zen', artist: 'Zen Masters', duration: '8:00', category: 'relaxation' }
      ]
    },
    {
      id: 'focus',
      name: 'Focus & Concentration',
      description: 'Musique pour booster ta productivité',
      color: 'from-purple-100 to-pink-100',
      icon: Music,
      tracks: [
        { id: '5', title: 'Deep Focus', artist: 'Study Beats', duration: '45:00', category: 'focus' },
        { id: '6', title: 'Lofi Hip Hop', artist: 'Chill Vibes', duration: '30:00', category: 'focus' },
        { id: '7', title: 'Piano Ambiant', artist: 'Peaceful Piano', duration: '25:00', category: 'focus' },
        { id: '8', title: 'White Noise', artist: 'Focus Sounds', duration: '60:00', category: 'focus' }
      ]
    },
    {
      id: 'motivation',
      name: 'Motivation & Énergie',
      description: 'Musique pour te donner de l\'énergie',
      color: 'from-orange-100 to-red-100',
      icon: Play,
      tracks: [
        { id: '9', title: 'Rise Up', artist: 'Motivational Beats', duration: '3:45', category: 'motivation' },
        { id: '10', title: 'Power Workout', artist: 'Energy Mix', duration: '4:20', category: 'motivation' },
        { id: '11', title: 'Victory March', artist: 'Epic Sounds', duration: '3:30', category: 'motivation' },
        { id: '12', title: 'Unstoppable', artist: 'Pump Up', duration: '4:15', category: 'motivation' }
      ]
    }
  ]);

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const getCurrentPlaylist = () => {
    return playlists.find(p => p.id === currentPlaylist);
  };

  const getCurrentTrack = () => {
    const playlist = getCurrentPlaylist();
    return playlist?.tracks[currentTrack];
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const playlist = getCurrentPlaylist();
    if (playlist) {
      if (isShuffled) {
        setCurrentTrack(Math.floor(Math.random() * playlist.tracks.length));
      } else {
        setCurrentTrack((prev) => (prev + 1) % playlist.tracks.length);
      }
    }
  };

  const handlePrevious = () => {
    const playlist = getCurrentPlaylist();
    if (playlist) {
      setCurrentTrack((prev) => (prev - 1 + playlist.tracks.length) % playlist.tracks.length);
    }
  };

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        description: newPlaylistDescription || 'Ma playlist personnalisée',
        tracks: [],
        color: 'from-blue-100 to-purple-100',
        icon: Music
      };
      
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreatePlaylist(false);
    }
  };

  if (currentPlaylist) {
    const playlist = getCurrentPlaylist();
    const track = getCurrentTrack();
    const IconComponent = playlist?.icon || Music;

    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
          <button
            onClick={() => setCurrentPlaylist(null)}
            className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </button>
          <div className="flex items-center">
            <div className={`bg-gradient-to-br ${playlist?.color} p-4 rounded-2xl mr-4 shadow-lg`}>
              <IconComponent className="text-gray-700" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{playlist?.name}</h1>
              <p className="text-sm text-gray-500">{playlist?.tracks.length} titres</p>
            </div>
          </div>
        </div>

        {/* Current Track Display */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          <div className="text-center animate-scale-in">
            <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
              <Music className="text-white" size={80} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{track?.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{track?.artist}</p>
            <p className="text-sm text-gray-500">{track?.duration}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md">
            <div className="bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full w-1/3 transition-all duration-300"></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>1:23</span>
              <span>{track?.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                isShuffled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Shuffle size={20} />
            </button>

            <button
              onClick={handlePrevious}
              className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200 hover:scale-105"
            >
              <SkipBack size={24} />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button
              onClick={handleNext}
              className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200 hover:scale-105"
            >
              <SkipForward size={24} />
            </button>

            <button
              onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                repeatMode !== 'none' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Repeat size={20} />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center space-x-4 w-full max-w-md">
            <Volume2 className="text-gray-600" size={20} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 w-8">{volume}</span>
          </div>
        </div>

        {/* Playlist */}
        <div className="bg-white border-t border-gray-100 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Playlist</h3>
            {playlist?.tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrack(index)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 mb-2 ${
                  index === currentTrack 
                    ? 'bg-purple-50 border-2 border-purple-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-gray-800">{track.title}</p>
                  <p className="text-sm text-gray-500">{track.artist}</p>
                </div>
                <span className="text-sm text-gray-500">{track.duration}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="flex items-center p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <button
          onClick={onBack}
          className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="text-gray-600" size={20} />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Session Musique</h1>
          <p className="text-sm text-gray-500">Choisis ta playlist parfaite</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Create Playlist Button */}
        <button
          onClick={() => setShowCreatePlaylist(true)}
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-3xl p-6 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-blue-500 p-3 rounded-2xl">
              <Plus className="text-white" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">Créer une playlist</h3>
              <p className="text-gray-600">Ajoute tes artistes préférés</p>
            </div>
          </div>
        </button>

        {/* Playlists */}
        {playlists.map((playlist, index) => {
          const IconComponent = playlist.icon;
          
          return (
            <div
              key={playlist.id}
              className={`bg-gradient-to-r ${playlist.color} rounded-3xl p-6 border border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setCurrentPlaylist(playlist.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-white bg-opacity-80 p-4 rounded-2xl shadow-lg mr-4">
                    <IconComponent className="text-gray-700" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{playlist.name}</h3>
                    <p className="text-gray-600 font-medium">{playlist.description}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                  <Play className="text-gray-600" size={20} />
                </div>
              </div>
              
              <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-gray-300">
                <p className="text-gray-700 leading-relaxed font-medium">
                  {playlist.tracks.length} titres • Parfait pour {playlist.name.toLowerCase()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer une playlist</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la playlist</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Ma playlist géniale"
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Décris l'ambiance de ta playlist..."
                  rows={3}
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setShowCreatePlaylist(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-2xl transition-all duration-200 font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={createPlaylist}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-2xl transition-all duration-200 font-semibold"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicSession;