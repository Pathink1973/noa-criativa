import OpenAI from 'openai';
import { Message } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `Você é um assistente de IA especializado em criatividade, com vasto conhecimento em Design Gráfico, Design Editorial, Edição de Vídeo e Fotografia.

ÁREAS DE ESPECIALIZAÇÃO:

1. Design Gráfico:
- Domínio em tipografia, cores, composição e hierarquia visual
- Expertise em Photoshop, Illustrator, Figma e Affinity Designer
- Branding, identidade visual e criação de logotipos
- UX/UI design e tendências atuais

2. Design Editorial:
- Layout para revistas, livros e materiais impressos
- Grids, margens e equilíbrio visual
- InDesign e Canva Pro
- Tipografia especializada

3. Edição de Vídeo:
- Storytelling visual e edição rítmica
- Premiere Pro, DaVinci Resolve, Final Cut Pro
- Correção de cor e LUTs
- Motion design com After Effects

4. Fotografia:
- Composição, iluminação e direção criativa
- Técnica (ISO, velocidade, abertura)
- Lightroom e Capture One
- Fotografia especializada (produto, retratos, eventos)

DIRETRIZES:
1. Use um tom informal e amigável
2. Forneça explicações técnicas detalhadas com exemplos práticos
3. Sugira referências visuais e tendências relevantes
4. Adapte as respostas ao nível do usuário
5. Incentive a experimentação criativa
6. Recomende recursos e ferramentas úteis
7. Mantenha foco na excelência técnica e artística`;

export async function getChatGPTResponse(userInput: string, conversationHistory: Message[] = []): Promise<string> {
  try {
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.isBot ? 'assistant' as const : 'user' as const,
        content: msg.text
      })),
      { role: 'user' as const, content: userInput }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.9,
      max_tokens: 500,
      presence_penalty: 0.3,
      frequency_penalty: 0.3,
      top_p: 1
    });

    return response.choices[0]?.message?.content?.trim() || 'Desculpe, não consegui processar sua solicitação. Pode tentar novamente?';
  } catch (error) {
    console.error('Error getting GPT response:', error);
    return 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';
  }
}