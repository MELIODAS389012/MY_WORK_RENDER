import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit3, Search, Mic, Image, Paperclip, Smile, Save, X } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'challenging';
  tags: string[];
  attachments: any[];
}

interface Journal3DProps {
  onBack: () => void;
}

const Journal3D: React.FC<Journal3DProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookOpen, setIsBookOpen] = useState(false);

  // États pour l'éditeur
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState<'positive' | 'neutral' | 'challenging'>('neutral');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['😊', '😄', '🤔', '💪', '❤️', '👍', '🎉', '✨', '🔥', '💯', '🙏', '😌', '😢', '😤', '🤗', '🌟'];

  const themes = [
    { name: 'Classique', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
    { name: 'Océan', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
    { name: 'Forêt', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
    { name: 'Coucher de soleil', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-900' },
    { name: 'Lavande', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900' }
  ];

  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  useEffect(() => {
    // Charger les entrées depuis le localStorage
    const savedEntries = localStorage.getItem('evolve_journal_entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(parsed);
    } else {
      // Créer quelques entrées d'exemple
      const sampleEntries: JournalEntry[] = [
        {
          id: '1',
          date: new Date(2024, 0, 15),
          title: 'Nouveau départ',
          content: 'Aujourd\'hui j\'ai commencé mon parcours avec Evolve. Je me sens motivé et prêt à changer ma vie.',
          mood: 'positive',
          tags: ['motivation', 'nouveau départ'],
          attachments: []
        },
        {
          id: '2',
          date: new Date(2024, 0, 20),
          title: 'Première méditation',
          content: 'J\'ai fait ma première session de méditation. C\'était difficile de rester concentré mais je sens déjà les bienfaits.',
          mood: 'neutral',
          tags: ['méditation', 'concentration'],
          attachments: []
        }
      ];
      setEntries(sampleEntries);
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    localStorage.setItem('evolve_journal_entries', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const openEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsBookOpen(true);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setEditMood(entry.mood);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEntry = () => {
    if (selectedEntry) {
      const updatedEntry = {
        ...selectedEntry,
        title: editTitle,
        content: editContent,
        mood: editMood
      };
      
      const updatedEntries = entries.map(entry => 
        entry.id === selectedEntry.id ? updatedEntry : entry
      );
      
      saveEntries(updatedEntries);
      setSelectedEntry(updatedEntry);
      setIsEditing(false);
    }
  };

  const createNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      title: editTitle || 'Nouvelle entrée',
      content: editContent,
      mood: editMood,
      tags: [],
      attachments: []
    };
    
    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);
    setIsCreating(false);
    setEditTitle('');
    setEditContent('');
    setEditMood('neutral');
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return 'bg-green-400';
      case 'neutral': return 'bg-blue-400';
      case 'challenging': return 'bg-orange-400';
      default: return 'bg-gray-400';
    }
  };

  const addEmoji = (emoji: string) => {
    setEditContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vue livre fermé - liste des entrées
  if (!isBookOpen && !isCreating) {
    return (
      <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Mon Journal 3D</h1>
              <p className="text-sm text-gray-500">{entries.length} entrées</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 bg-white border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans mes entrées..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Livre 3D */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="relative perspective-1000">
            <div className="book-container transform-style-preserve-3d hover:rotate-y-12 transition-transform duration-700">
              {/* Couverture du livre */}
              <div className="book-cover bg-gradient-to-br from-amber-600 to-orange-700 w-80 h-96 rounded-r-lg shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent"></div>
                <div className="p-8 h-full flex flex-col justify-between text-white">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Mon Journal</h2>
                    <p className="text-amber-100">de Croissance</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm opacity-80">
                      {entries.length} entrées
                    </div>
                    <div className="text-xs opacity-60">
                      Dernière entrée: {entries[0] ? entries[0].date.toLocaleDateString() : 'Aucune'}
                    </div>
                  </div>
                </div>
                
                {/* Reliure */}
                <div className="absolute left-0 top-0 w-2 h-full bg-amber-800 shadow-inner"></div>
              </div>
              
              {/* Pages visibles */}
              <div className="absolute top-2 right-2 w-76 h-92 bg-white rounded-r-lg shadow-lg transform translate-z-2">
                <div className="p-6 space-y-4 max-h-full overflow-hidden">
                  {filteredEntries.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className="border-b border-gray-200 pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all duration-200"
                      onClick={() => openEntry(entry)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{entry.title}</h3>
                        <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.mood)}`}></div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{entry.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{entry.date.toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des entrées en bas */}
        <div className="bg-white border-t border-gray-100 max-h-48 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Toutes mes entrées</h3>
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => openEntry(entry)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getMoodColor(entry.mood)}`}></div>
                    <div>
                      <p className="font-medium text-gray-800">{entry.title}</p>
                      <p className="text-sm text-gray-500">{entry.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Edit3 className="text-gray-400" size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue éditeur/création
  if (isCreating || isEditing) {
    return (
      <div className={`h-screen flex flex-col ${selectedTheme.bg}`}>
        {/* Header éditeur */}
        <div className="flex items-center justify-between p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setEditTitle('');
                setEditContent('');
              }}
              className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
            >
              <X className="text-gray-600" size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {isCreating ? 'Nouvelle entrée' : 'Modifier l\'entrée'}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={isCreating ? createNewEntry : saveEntry}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <Save size={20} />
            <span>Sauvegarder</span>
          </button>
        </div>

        {/* Sélecteur de thème */}
        <div className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Thème:</span>
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(theme)}
                className={`w-8 h-8 rounded-full ${theme.bg} ${theme.border} border-2 transition-all duration-200 hover:scale-110 ${
                  selectedTheme.name === theme.name ? 'ring-2 ring-blue-500' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Éditeur */}
        <div className="flex-1 p-6 space-y-6">
          {/* Titre */}
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Titre de mon entrée..."
            className={`w-full text-2xl font-bold ${selectedTheme.text} bg-transparent border-none outline-none placeholder-gray-400`}
          />

          {/* Mood selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Humeur:</span>
            {[
              { mood: 'positive', label: '😊 Positive', color: 'bg-green-100 text-green-700' },
              { mood: 'neutral', label: '😐 Neutre', color: 'bg-blue-100 text-blue-700' },
              { mood: 'challenging', label: '😤 Difficile', color: 'bg-orange-100 text-orange-700' }
            ].map((option) => (
              <button
                key={option.mood}
                onClick={() => setEditMood(option.mood as any)}
                className={`px-4 py-2 rounded-2xl transition-all duration-200 ${
                  editMood === option.mood 
                    ? option.color + ' ring-2 ring-blue-500' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className={`${selectedTheme.bg} ${selectedTheme.border} border-2 rounded-3xl p-6 shadow-lg`}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Écris tes pensées, tes réflexions, tes découvertes..."
              className={`w-full h-64 ${selectedTheme.text} bg-transparent border-none outline-none placeholder-gray-400 resize-none text-lg leading-relaxed`}
            />
          </div>

          {/* Barre d'outils */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
                <Mic size={20} />
              </button>
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
                <Image size={20} />
              </button>
              <button className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200">
                <Paperclip size={20} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
                >
                  <Smile size={20} />
                </button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 grid grid-cols-8 gap-2 z-50">
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
            </div>
            
            <div className="text-sm text-gray-500">
              {editContent.length} caractères
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue lecture d'une entrée
  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
      {/* Header lecture */}
      <div className="flex items-center justify-between p-6 pt-12 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center">
          <button
            onClick={() => setIsBookOpen(false)}
            className="mr-4 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="text-gray-600" size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{selectedEntry?.title}</h1>
            <p className="text-sm text-gray-500">{selectedEntry?.date.toLocaleDateString()}</p>
          </div>
        </div>
        
        <button
          onClick={startEditing}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Edit3 size={20} />
        </button>
      </div>

      {/* Contenu de l'entrée */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedEntry?.title}</h2>
              <div className={`w-4 h-4 rounded-full ${getMoodColor(selectedEntry?.mood || 'neutral')}`}></div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedEntry?.content}
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Écrit le {selectedEntry?.date.toLocaleDateString()}</span>
                <span>{selectedEntry?.content.length} caractères</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal3D;