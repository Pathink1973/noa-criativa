import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

async function testKey() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Olá, teste de API.' }],
      model: 'gpt-4',
    });
    console.log('Chave válida! Resposta:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Erro na chave:', error.message);
    console.error('Detalhes:', error);
  }
}

testKey();