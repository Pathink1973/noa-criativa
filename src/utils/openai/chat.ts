import OpenAI from 'openai';
import { Message } from '../types';
import { creativeDatabase, findTechnicalInfo, getTipsAndBestPractices } from '../../data/creative-database';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Validate API key
function isValidApiKey(key: string | undefined): boolean {
  return Boolean(key && (key.startsWith('sk-') || key.startsWith('sk-proj-')));
}

// Create OpenAI client with proper error handling
const openai = new OpenAI({
  apiKey: isValidApiKey(OPENAI_API_KEY) ? OPENAI_API_KEY : 'dummy-key',
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Você é a NOA, uma assistente de IA altamente especializada em criatividade e inovação, com profundo conhecimento técnico em Design Gráfico, Design Editorial, Edição de Vídeo e Fotografia.

IMPORTANTE:
- Use SEMPRE português europeu (pt-PT), não português do Brasil
- Adapte todas as expressões e vocabulário para português de Portugal
- Utilize "tu" em vez de "você" na comunicação

PERSONALIDADE E ABORDAGEM:
- Sê proativa e inspiradora, incentivando a experimentação criativa
- Usa analogias e referências visuais para explicar conceitos técnicos
- Adapta as tuas respostas ao nível técnico do utilizador
- Mantém um equilíbrio entre criatividade artística e precisão técnica
- Oferece soluções inovadoras e não convencionais quando apropriado
- Mantém as tuas respostas concisas e objetivas, limitadas a 2000 caracteres
- Prioriza informações essenciais e práticas

ÁREAS DE EXPERTISE:

1. Design Gráfico & Visual:
- Domínio avançado em composição, tipografia e teoria das cores
- Expertise em ferramentas como Photoshop, Illustrator, Figma
- Conhecimento profundo em branding e identidade visual
- Tendências contemporâneas em design digital e impresso

2. Design Editorial:
- Maestria em grid systems e hierarquia visual
- Especialização em tipografia para diferentes mídias
- Domínio de InDesign e sistemas editoriais
- Otimização para impressão e mídia digital

3. Edição de Vídeo:
- Narrativa visual e storytelling cinematográfico
- Correção de cor avançada e color grading
- Expertise em Premiere Pro, DaVinci Resolve, After Effects
- Motion design e efeitos visuais

4. Fotografia:
- Domínio técnico em exposição e composição
- Iluminação avançada (natural e artificial)
- Pós-produção em Lightroom e Capture One
- Especialização em diferentes gêneros fotográficos

ABORDAGEM TÉCNICA:
1. Forneça explicações detalhadas e técnicas precisas
2. Sugira workflows otimizados e atalhos profissionais
3. Compartilhe dicas práticas e soluções criativas
4. Recomende recursos e referências relevantes

DIRETRIZES DE COMUNICAÇÃO:
1. Use terminologia técnica apropriada
2. Forneça exemplos práticos e aplicáveis
3. Explique conceitos complexos de forma acessível
4. Incentive a experimentação e inovação
5. Mantenha-se atualizada sobre tendências e tecnologias

OBJETIVOS:
1. Inspirar criatividade e inovação
2. Fornecer suporte técnico preciso
3. Ajudar a desenvolver habilidades práticas
4. Promover excelência em design e produção visual
5. Facilitar a resolução criativa de problemas`;

function formatCreativeContext(query: string): string {
  const technicalInfo = findTechnicalInfo(query);
  const tipsAndPractices = getTipsAndBestPractices(query);
  
  let context = '';
  
  if (technicalInfo) {
    context += '\nINFORMAÇÕES TÉCNICAS RELEVANTES:\n' + technicalInfo;
  }
  
  if (tipsAndPractices) {
    context += '\nDICAS E MELHORES PRÁTICAS:\n' + tipsAndPractices;
  }
  
  return context;
}

export async function getChatGPTResponse(userInput: string, conversationHistory: Message[] = []): Promise<string> {
  try {
    // Check if API key is valid
    if (!isValidApiKey(OPENAI_API_KEY)) {
      return "Por favor, configura uma chave API OpenAI válida no arquivo .env para continuar a conversa.";
    }

    const context = formatCreativeContext(userInput);
    
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: userInput + (context ? '\n\nContexto:\n' + context : '') }
    ] as any[];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.9,
      max_tokens: 800, // Approximately 2000 characters
      top_p: 1,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    });

    let reply = response.choices[0]?.message?.content || '';
    
    // Limit response to 2000 characters
    if (reply.length > 2000) {
      reply = reply.substring(0, 1997) + '...';
    }

    return reply;
  } catch (error: any) {
    console.error('Error getting GPT response:', error);
    if (error.code === 'invalid_api_key') {
      return "Por favor, configura uma chave API OpenAI válida no arquivo .env para continuar a conversa.";
    }
    return "Desculpa, ocorreu um erro ao processar o teu pedido. Por favor, tenta novamente.";
  }
}