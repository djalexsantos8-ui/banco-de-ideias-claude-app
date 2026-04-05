export type Frase = {
  texto: string
  autor?: string
  original?: string
}

export const frasesLoading: Frase[] = [
  // Psicologia da ideia
  { texto: 'Ideias não registradas se perdem em horas.' },
  { texto: 'Você está organizando o que a maioria deixa escapar.' },
  { texto: 'O cérebro humano esquece 70% das ideias em 24 horas.' },
  { texto: 'Registrar é o primeiro ato de execução.' },
  { texto: 'Cada ideia que você salva é uma versão futura de você agradecendo.' },
  { texto: 'A mente cria. O papel preserva. O sistema executa.' },
  { texto: 'Ninguém lembra do que não anotou.' },
  { texto: 'Ideias são frágeis. Sistemas as tornam fortes.' },
  { texto: 'O momento de captura é o mais valioso do processo criativo.' },
  { texto: 'Uma ideia esquecida é uma oportunidade perdida.' },

  // Mentalidade
  { texto: 'Pensar é comum. Estruturar é raro.' },
  { texto: 'Clareza gera execução.' },
  { texto: 'Quem organiza o caos tem vantagem sobre quem só pensa.' },
  { texto: 'A diferença entre sonho e projeto é um plano.' },
  { texto: 'Disciplina é só consistência com algo que importa.' },
  { texto: 'Velocidade de execução começa com clareza de intenção.' },
  { texto: 'Sistemas batem força de vontade no longo prazo.' },
  { texto: 'Pequenas ações repetidas criam resultados impossíveis.' },
  { texto: 'O foco não é fazer mais. É fazer o que importa.' },
  { texto: 'Organizar pensamentos é treinar a mente para criar mais.' },

  // Empreendedores
  {
    autor: 'Steve Jobs',
    original: 'Innovation distinguishes between a leader and a follower.',
    texto: '"Inovação distingue um líder de um seguidor." — Steve Jobs',
  },
  {
    autor: 'Reid Hoffman',
    original: 'An entrepreneur is someone who jumps off a cliff and builds a plane on the way down.',
    texto: '"Um empreendedor é alguém que pula de um penhasco e constrói o avião na queda." — Reid Hoffman',
  },
  {
    autor: 'Paul Graham',
    original: 'The way to get startup ideas is not to try to think of startup ideas.',
    texto: '"A melhor forma de ter uma ideia de startup é não tentar ter uma." — Paul Graham',
  },
  {
    autor: 'Peter Thiel',
    original: 'Every moment in business happens only once.',
    texto: '"Cada momento nos negócios acontece uma única vez." — Peter Thiel',
  },
  {
    autor: 'Elon Musk',
    original: 'When something is important enough, you do it even if the odds are not in your favor.',
    texto: '"Quando algo é importante o suficiente, você faz mesmo que as chances não estejam do seu lado." — Elon Musk',
  },
  {
    autor: 'Jeff Bezos',
    original: 'Your brand is what other people say about you when you\'re not in the room.',
    texto: '"Sua marca é o que as pessoas falam de você quando você não está na sala." — Jeff Bezos',
  },
  {
    autor: 'Marc Andreessen',
    original: 'Software is eating the world.',
    texto: '"O software está devorando o mundo." — Marc Andreessen',
  },
  {
    autor: 'Naval Ravikant',
    original: 'Specific knowledge is knowledge you cannot be trained for.',
    texto: '"Conhecimento específico é aquele que não pode ser ensinado formalmente." — Naval Ravikant',
  },
  {
    autor: 'Warren Buffett',
    original: 'Price is what you pay. Value is what you get.',
    texto: '"Preço é o que você paga. Valor é o que você recebe." — Warren Buffett',
  },
  {
    autor: 'Henry Ford',
    original: 'Whether you think you can or you think you can\'t, you\'re right.',
    texto: '"Seja você acreditar que pode ou não pode, você está certo." — Henry Ford',
  },
]
