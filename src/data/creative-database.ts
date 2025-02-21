interface TechnicalDetail {
  name: string;
  description: string;
  tips?: string[];
}

interface SoftwareDetail {
  name: string;
  description: string;
  features: string[];
}

interface PracticalApplication {
  name: string;
  description: string;
  techniques: string[];
}

interface CreativeCategory {
  name: string;
  fundamentals: TechnicalDetail[];
  software: SoftwareDetail[];
  applications: PracticalApplication[];
}

export const creativeDatabase: CreativeCategory[] = [
  {
    name: "Design Gráfico",
    fundamentals: [
      {
        name: "Teoria da Cor",
        description: "Princípios fundamentais de harmonia cromática e psicologia das cores",
        tips: [
          "Utiliza a roda de cores para criar combinações harmoniosas",
          "Considera o significado psicológico das cores",
          "Mantém consistência na paleta de cores do projeto"
        ]
      },
      {
        name: "Tipografia",
        description: "Fundamentos de escolha e combinação de tipos",
        tips: [
          "Limita o uso a 2-3 famílias tipográficas por projeto",
          "Mantém hierarquia visual clara",
          "Considera legibilidade em diferentes tamanhos"
        ]
      }
    ],
    software: [
      {
        name: "Adobe Photoshop",
        description: "Software profissional para edição de imagens",
        features: [
          "Edição não-destrutiva com camadas",
          "Ferramentas avançadas de seleção",
          "Filtros e efeitos profissionais"
        ]
      },
      {
        name: "Adobe Illustrator",
        description: "Software para criação de gráficos vetoriais",
        features: [
          "Desenho vetorial preciso",
          "Ferramentas de tipografia avançadas",
          "Exportação para múltiplos formatos"
        ]
      }
    ],
    applications: [
      {
        name: "Identidade Visual",
        description: "Criação de logos e sistemas de identidade visual",
        techniques: [
          "Pesquisa de mercado e concorrência",
          "Desenvolvimento de conceito",
          "Criação de manual de marca"
        ]
      }
    ]
  },
  {
    name: "Design Editorial",
    fundamentals: [
      {
        name: "Grid e Layout",
        description: "Sistemas de grelhas para organização de conteúdo",
        tips: [
          "Utiliza grelhas modulares para flexibilidade",
          "Mantém consistência nas margens",
          "Considera a hierarquia da informação"
        ]
      }
    ],
    software: [
      {
        name: "Adobe InDesign",
        description: "Software profissional para layout editorial",
        features: [
          "Estilos de parágrafo e caractere",
          "Páginas mestre",
          "Ferramentas de índice e sumário"
        ]
      }
    ],
    applications: [
      {
        name: "Publicações Impressas",
        description: "Design de livros, revistas e catálogos",
        techniques: [
          "Planeamento de estrutura",
          "Gestão de fluxo de texto",
          "Preparação para impressão"
        ]
      }
    ]
  }
];

export function findTechnicalInfo(query: string): string | null {
  const queryLower = query.toLowerCase();
  let result = '';

  for (const category of creativeDatabase) {
    if (queryLower.includes(category.name.toLowerCase())) {
      // Add fundamentals
      category.fundamentals.forEach(fundamental => {
        result += `${fundamental.name}:\n${fundamental.description}\n`;
        if (fundamental.tips) {
          result += "Dicas:\n" + fundamental.tips.map(tip => `• ${tip}\n`).join('');
        }
      });
    }
  }

  return result || null;
}

export function getTipsAndBestPractices(query: string): string | null {
  const queryLower = query.toLowerCase();
  let tips: string[] = [];

  for (const category of creativeDatabase) {
    if (queryLower.includes(category.name.toLowerCase())) {
      // Collect tips from fundamentals
      category.fundamentals.forEach(fundamental => {
        if (fundamental.tips) {
          tips = [...tips, ...fundamental.tips];
        }
      });

      // Add software recommendations
      category.software.forEach(software => {
        tips.push(`Utiliza ${software.name} para ${software.description.toLowerCase()}`);
      });

      // Add practical techniques
      category.applications.forEach(application => {
        tips = [...tips, ...application.techniques];
      });
    }
  }

  return tips.length > 0 ? tips.map(tip => `• ${tip}`).join('\n') : null;
}
