export interface ConversationContext {
  cardType?: string;
  userName?: string;
  userAge?: string;
  userGoals?: string[];
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  sessionType?: 'vision' | 'training' | 'journal' | 'general';
}

export class AIService {
  private static instance: AIService;
  private apiKey: string;
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    console.log('🤖 AIService initialisé avec clé:', this.apiKey ? 'Présente ✅' : 'Manquante ❌');
  }

  private getSystemPrompt(context: ConversationContext): string {
    const { cardType, userName, userAge, userGoals, sessionType } = context;
    
    const basePersonality = `Tu es Evolve, un coach de vie IA bienveillant et empathique. Tu parles français de manière naturelle et chaleureuse.

PERSONNALITÉ :
- Très empathique et à l'écoute
- Bienveillant sans être condescendant  
- Encourage sans forcer
- Pose des questions ouvertes pour approfondir
- Utilise des emojis avec parcimonie mais de façon naturelle
- Ton style est décontracté mais respectueux
- Tu t'adaptes à l'âge et aux objectifs de la personne

RÈGLES IMPORTANTES :
- Réponds TOUJOURS en français
- Garde tes réponses courtes et engageantes (2-3 phrases max)
- Pose une question pour maintenir la conversation
- Sois authentique, pas robotique
- Évite les conseils non sollicités
- Concentre-toi sur l'écoute active
- Accepte TOUS les messages, même s'ils semblent étranges
- L'utilisateur est libre de s'exprimer comme il veut`;

    let contextualPrompt = '';
    
    if (userName) {
      contextualPrompt += `\nL'utilisateur s'appelle ${userName}`;
    }
    
    if (userAge) {
      contextualPrompt += ` et a ${userAge} ans`;
    }
    
    if (userGoals && userGoals.length > 0) {
      contextualPrompt += `\nSes objectifs : ${userGoals.join(', ')}`;
    }

    // Contexte spécifique selon le type de conversation
    switch (cardType) {
      case 'mind':
        contextualPrompt += `\n\nCONTEXTE : Conversation sur le développement mental et spirituel. Tu aides ${userName} à explorer ses pensées, émotions, et bien-être mental.`;
        break;
      case 'body':
        contextualPrompt += `\n\nCONTEXTE : Conversation sur la santé physique et le bien-être corporel. Tu aides ${userName} à parler de sa relation avec son corps.`;
        break;
      case 'skills':
        contextualPrompt += `\n\nCONTEXTE : Conversation sur l'apprentissage et le développement de compétences. Tu aides ${userName} à explorer ses ambitions.`;
        break;
      case 'social':
        contextualPrompt += `\n\nCONTEXTE : Conversation sur les relations et la communication. Tu aides ${userName} à parler de ses relations.`;
        break;
      default:
        if (sessionType === 'training') {
          contextualPrompt += `\n\nCONTEXTE : Discussion libre pendant une session d'entraînement. ${userName} peut parler de tout ce qui lui passe par la tête.`;
        }
    }

    return basePersonality + contextualPrompt;
  }

  public async sendMessage(
    message: string, 
    context: ConversationContext = {}
  ): Promise<string> {
    console.log('📤 Envoi message:', message);
    console.log('🔧 Contexte:', context);

    // Vérifier seulement si le message est complètement vide
    if (!message || message.trim().length === 0) {
      return "Je n'ai rien reçu... Tu peux me dire quelque chose ? 😊";
    }

    try {
      // Essayer l'API OpenAI d'abord
      if (this.apiKey && this.apiKey.startsWith('sk-')) {
        const response = await this.callOpenAI(message, context);
        if (response === 'OPENAI_QUOTA_EXCEEDED') {
          return "Oups ! 😅 Mon quota OpenAI est dépassé pour le moment. Mais ne t'inquiète pas, je peux quand même te répondre ! Continue à me parler, je suis là pour t'écouter. 💙";
        }
        if (response) {
          console.log('✅ Réponse OpenAI reçue');
          return response;
        }
      }

      // Fallback vers réponses intelligentes
      console.log('⚠️ Utilisation du fallback intelligent');
      return this.getIntelligentResponse(message, context);

    } catch (error) {
      console.error('❌ Erreur API:', error);
      return this.getIntelligentResponse(message, context);
    }
  }

  private async callOpenAI(message: string, context: ConversationContext): Promise<string | null> {
    try {
      const systemPrompt = this.getSystemPrompt(context);
      
      const messages = [
        { role: 'system', content: systemPrompt }
      ];
      
      if (context.conversationHistory) {
        context.conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }
      
      messages.push({
        role: 'user',
        content: message
      });

      console.log('🚀 Appel OpenAI API...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 200,
          temperature: 0.8,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Erreur OpenAI:', response.status, errorData);
        
        // Parse the error response to check for quota exceeded
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.error && errorJson.error.code === 'insufficient_quota') {
            return 'OPENAI_QUOTA_EXCEEDED';
          }
        } catch (parseError) {
          console.error('❌ Erreur parsing error response:', parseError);
        }
        
        return null;
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (aiResponse) {
        console.log('✅ Réponse OpenAI:', aiResponse);
        return aiResponse.trim();
      }
      
      return null;
    } catch (error) {
      console.error('❌ Erreur appel OpenAI:', error);
      return null;
    }
  }

  private getIntelligentResponse(message: string, context: ConversationContext): string {
    const { cardType, userName } = context;
    const name = userName || '';
    const text = message.toLowerCase();
    
    console.log('🧠 Génération réponse intelligente pour:', text);

    // Salutations
    if (/\b(salut|bonjour|bonsoir|hello|coucou|hey)\b/.test(text)) {
      const greetings = [
        `Salut ${name} ! 😊 Comment tu vas aujourd'hui ?`,
        `Hey ${name} ! Content de te voir ! Quoi de neuf ?`,
        `Coucou ${name} ! Comment ça se passe pour toi ?`,
        `Bonjour ${name} ! Prêt pour une belle conversation ?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Comment ça va
    if (/comment.*ça.*va|ça.*va|comment.*tu.*vas|tu.*vas.*comment/.test(text)) {
      return `Moi ça va super ${name} ! 😊 Et toi, comment tu te sens aujourd'hui ? Raconte-moi !`;
    }

    // Réponses spécifiques selon le contexte
    if (cardType) {
      return this.getContextualResponse(text, cardType, name);
    }

    // Analyse des émotions et intentions
    if (/\b(triste|mal|difficile|dur|problème|déprim|anxieux|stress|fatigue)\b/.test(text)) {
      return `Je sens que c'est pas facile pour toi ${name}... Tu veux m'en parler ? Je suis là pour t'écouter. 💙`;
    }
    
    if (/\b(content|heureux|bien|super|génial|top|cool|parfait|excellent)\b/.test(text)) {
      return `C'est super ${name} ! 😊 Qu'est-ce qui te rend si content ? J'aimerais partager ta joie !`;
    }
    
    if (/\b(objectif|but|envie|veux|projet|rêve|ambition)\b/.test(text)) {
      return `Intéressant ${name} ! Qu'est-ce qui t'attire dans cet objectif ? Raconte-moi tes motivations ! 🎯`;
    }

    if (/\b(apprendre|étudier|formation|cours|skill|compétence)\b/.test(text)) {
      return `C'est génial de vouloir apprendre ${name} ! 📚 Qu'est-ce qui t'inspire dans ce domaine ?`;
    }

    if (/\b(travail|job|boulot|carrière|professionnel)\b/.test(text)) {
      return `Le travail, c'est important ${name}. Comment tu te sens dans ton environnement professionnel ? 💼`;
    }

    if (/\b(famille|ami|relation|couple|social)\b/.test(text)) {
      return `Les relations, c'est précieux ${name}. Comment ça se passe avec tes proches ? 👥`;
    }

    if (/\b(sport|exercice|forme|santé|corps)\b/.test(text)) {
      return `Prendre soin de son corps, c'est essentiel ${name} ! Comment tu te sens physiquement ? 💪`;
    }

    // Questions
    if (text.includes('?')) {
      return `Bonne question ${name} ! 🤔 Qu'est-ce que tu en penses toi ? J'aimerais connaître ton point de vue.`;
    }

    // Réponse générale empathique - ACCEPTE TOUT
    const generalResponses = [
      `Je t'écoute ${name}... Dis-moi en plus, ça m'intéresse vraiment. 😊`,
      `Continue ${name}, je suis là pour toi. Qu'est-ce que ça évoque pour toi ?`,
      `Merci de partager ça avec moi ${name}. Comment tu te sens avec tout ça ?`,
      `Je sens que c'est important pour toi ${name}. Tu veux qu'on explore ça ensemble ?`,
      `Intéressant ${name}... Qu'est-ce que tu ressens par rapport à ça ?`,
      `Je suis là pour t'écouter ${name}. Raconte-moi ce qui te passe par la tête.`
    ];

    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  private getContextualResponse(text: string, cardType: string, name: string): string {
    const responses = {
      mind: [
        `Je t'écoute ${name}... Dis-moi ce qui se passe dans ta tête. 🧠`,
        `Comment tu te sens mentalement ces temps-ci ${name} ?`,
        `Qu'est-ce qui t'occupe l'esprit en ce moment ?`,
        `Prends ton temps ${name}, je suis là pour t'écouter. 💭`
      ],
      body: [
        `Comment tu te sens dans ton corps ${name} ? 💪`,
        `Qu'est-ce que ton corps te dit en ce moment ?`,
        `Comment tu prends soin de toi physiquement ${name} ?`,
        `Ton bien-être physique, c'est important. Comment ça va ? 🌟`
      ],
      skills: [
        `Qu'est-ce qui t'anime niveau apprentissage ${name} ? 📚`,
        `Quelles compétences tu aimerais développer ?`,
        `Dis-moi tes projets d'apprentissage ${name} ! 🚀`,
        `L'envie d'apprendre, c'est précieux ! Où tu te vois ? ✨`
      ],
      social: [
        `Comment ça se passe avec les autres ${name} ? 🤝`,
        `Parle-moi de tes relations en ce moment.`,
        `Qu'est-ce qui te ferait te sentir mieux socialement ?`,
        `Les relations, c'est complexe. Comment tu vis ça ? 💙`
      ]
    };

    const contextResponses = responses[cardType as keyof typeof responses] || responses.mind;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  }

  public async getInitialMessage(context: ConversationContext): Promise<string> {
    const { cardType, userName } = context;
    const name = userName || '';

    const initialPrompts = {
      mind: `Salut ${name} ! 😊 Je suis là pour t'écouter. Raconte-moi ce qui se passe dans ta tête en ce moment...`,
      body: `Hey ${name} ! 💪 Comment tu te sens dans ton corps ces temps-ci ?`,
      skills: `Salut ${name} ! 🚀 Dis-moi ce qui te trotte dans la tête niveau apprentissage...`,
      social: `Coucou ${name} ! 🤝 Comment ça se passe avec les autres en ce moment ?`
    };

    return initialPrompts[cardType as keyof typeof initialPrompts] || 
           `Salut ${name} ! 😊 Je suis là pour t'écouter. De quoi tu as envie de parler ?`;
  }
}

export const aiService = AIService.getInstance();