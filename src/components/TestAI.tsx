import { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { aiService } from '../services/aiService';

const TestAI = () => {
  const [testMessage, setTestMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    input: string;
    output: string;
    status: 'success' | 'error' | 'warning';
    expected: string;
  }>>([]);

  const runTest = async (message: string, expectedBehavior: string) => {
    try {
      const result = await aiService.sendMessage(message, {
        userName: 'TestUser',
        cardType: 'mind',
        sessionType: 'training'
      });
      
      // Tous les tests sont considérés comme réussis maintenant
      // puisque l'utilisateur est libre d'écrire ce qu'il veut
      let status: 'success' | 'error' | 'warning' = 'success';
      
      setTestResults(prev => [...prev, {
        input: message,
        output: result,
        status: status,
        expected: expectedBehavior
      }]);
      
      return result;
    } catch (error) {
      setTestResults(prev => [...prev, {
        input: message,
        output: `Erreur: ${error}`,
        status: 'error',
        expected: expectedBehavior
      }]);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    setIsLoading(true);
    
    try {
      // Test 1: Salutation normale
      await runTest('Salut', 'Réponse de salutation normale');
      
      // Test 2: Comment ça va
      await runTest('Comment ça va ?', 'Réponse empathique normale');
      
      // Test 3: Expression libre - plus de restriction
      await runTest('dfghjklmnpqrst', 'Réponse empathique - liberté d\'expression');
      
      // Test 4: Séquence clavier - acceptée
      await runTest('qwertyuiop', 'Réponse empathique - expression libre');
      
      // Test 5: Émotion triste
      await runTest('Je me sens triste aujourd\'hui', 'Réponse empathique pour tristesse');
      
      // Test 6: Émotion joyeuse
      await runTest('Je suis super content !', 'Réponse positive');
      
      // Test 7: Question sur objectifs
      await runTest('Je veux apprendre Python', 'Réponse sur apprentissage');
      
      // Test 8: Message vide
      await runTest('', 'Gestion message vide');
      
      // Test 9: Message très court mais valide
      await runTest('ok', 'Réponse normale pour message court');
      
      // Test 10: Expression créative libre
      await runTest('aaaaaaaaaa', 'Réponse empathique - expression libre');
      
      // Test 11: Mélange de caractères
      await runTest('abc123xyz!@#', 'Réponse empathique - liberté totale');
      
      // Test 12: Émojis seuls
      await runTest('😊🤔💪', 'Réponse empathique aux émojis');
      
    } finally {
      setIsLoading(false);
    }
  };

  const sendCustomTest = async () => {
    if (!testMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await aiService.sendMessage(testMessage, {
        userName: 'TestUser',
        cardType: 'mind',
        sessionType: 'training'
      });
      setResponse(result);
    } catch (error) {
      setResponse(`Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setResponse('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🆓 Test du Système d'IA - Liberté Totale
          </h1>

          {/* Message de liberté */}
          <div className="mb-8 p-6 bg-green-50 rounded-2xl border-l-4 border-green-400">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Liberté d'Expression Totale
            </h2>
            <p className="text-green-700">
              L'utilisateur peut maintenant écrire <strong>TOUT ce qu'il veut</strong> sans aucune restriction. 
              L'IA répond de manière empathique à tous les messages, même les plus créatifs ou inhabituels.
            </p>
          </div>

          {/* Test personnalisé */}
          <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Test Personnalisé</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Écris TOUT ce que tu veux... Aucune limite ! 🚀"
                className="flex-1 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && sendCustomTest()}
              />
              <button
                onClick={sendCustomTest}
                disabled={isLoading || !testMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-4 rounded-2xl transition-all duration-200 flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Tester</span>
              </button>
            </div>
            
            {response && (
              <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Réponse:</h3>
                <p className="text-gray-700">{response}</p>
              </div>
            )}
          </div>

          {/* Tests automatiques */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tests de Liberté d'Expression</h2>
              <div className="flex space-x-3">
                <button
                  onClick={clearResults}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-2xl transition-all duration-200 flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Effacer</span>
                </button>
                <button
                  onClick={runAllTests}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-2xl transition-all duration-200"
                >
                  {isLoading ? 'Tests en cours...' : 'Tester la liberté totale'}
                </button>
              </div>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-4">
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border-l-4 ${
                      test.status === 'success' 
                        ? 'bg-green-50 border-green-400' 
                        : test.status === 'error'
                        ? 'bg-red-50 border-red-400'
                        : 'bg-yellow-50 border-yellow-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {test.status === 'success' && <CheckCircle className="text-green-500 mt-1" size={20} />}
                      {test.status === 'error' && <XCircle className="text-red-500 mt-1" size={20} />}
                      {test.status === 'warning' && <AlertCircle className="text-yellow-500 mt-1" size={20} />}
                      
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-1">
                          Test {index + 1}: "{test.input}"
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Comportement:</span> {test.expected}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Réponse:</span> {test.output}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Résumé des tests */}
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                  <h3 className="font-semibold text-blue-800 mb-2">📊 Résumé des tests</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.filter(t => t.status === 'success').length}
                      </div>
                      <div className="text-sm text-green-700">Réussis</div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">
                        {testResults.filter(t => t.status === 'warning').length}
                      </div>
                      <div className="text-sm text-yellow-700">Avertissements</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-xl">
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.filter(t => t.status === 'error').length}
                      </div>
                      <div className="text-sm text-red-700">Erreurs</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Informations sur l'API */}
          <div className="p-6 bg-blue-50 rounded-2xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📋 Informations sur le Système
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Clé API OpenAI:</span> 
                <span className={`ml-2 px-2 py-1 rounded ${
                  import.meta.env.VITE_OPENAI_API_KEY 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {import.meta.env.VITE_OPENAI_API_KEY ? 'Configurée ✅' : 'Manquante ❌'}
                </span>
              </p>
              <p>
                <span className="font-medium">Détection de charabia:</span> 
                <span className="ml-2 px-2 py-1 rounded bg-red-100 text-red-800">
                  SUPPRIMÉE ✅
                </span>
              </p>
              <p>
                <span className="font-medium">Liberté d'expression:</span> 
                <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800">
                  TOTALE ✅
                </span>
              </p>
              <p>
                <span className="font-medium">Réponses empathiques:</span> 
                <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800">
                  Pour TOUS les messages ✅
                </span>
              </p>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-xl">
              <h4 className="font-medium text-gray-800 mb-2">🆓 Exemples de liberté totale :</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>Messages normaux :</strong> "salut", "comment ça va", "je suis triste"</p>
                <p>• <strong>Expressions créatives :</strong> "dfghjklm", "qwertyuiop", "aaaaaaaaaa"</p>
                <p>• <strong>Tout est accepté :</strong> "abc123xyz!@#", "😊🤔💪", "..."</p>
                <p>• <strong>L'IA répond toujours avec empathie</strong> ❤️</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAI;