import { ServiceItem, Testimonial } from '../types';

export const ELECTRICAL_SERVICES: ServiceItem[] = [
  {
    id: 'quadro-distribuicao',
    title: 'Troca e Modernização de Quadro de Distribuição (QDT)',
    category: 'instalacao',
    shortDesc: 'Substituição de caixas antigas com fusíveis ou disjuntores pretos NEMA por padrão moderno DIN com DR e DPS.',
    fullDesc: 'Modernizamos o quadro elétrico central do imóvel com disjuntores termomagnéticos padrão DIN, Dispositivo DR (que protege contra choques elétricos fatais) e DPS (proteção contra queima de aparelhos por raios e surtos de tensão).',
    startingPrice: 380,
    unit: 'a partir de / mão de obra',
    timeEstimate: '3 a 6 horas',
    popular: true,
    features: [
      'Disjuntores padrão DIN certificados Inmetro',
      'Instalação de DR (Diferencial Residual) anti-choque',
      'Instalação de DPS (Dispositivo Protetor de Surto)',
      'Balanceamento e identificação de todos os circuitos',
      'Barramentos tipo pente bifásicos/trifásicos',
      'Garantia de 1 ano com emissão de nota'
    ]
  },
  {
    id: 'fiação-completa',
    title: 'Reforma e Troca Completa de Fiação Elétrica',
    category: 'manutencao',
    shortDesc: 'Substituição de fios antigos ressecados por cabos flexíveis antichama Prysmian/Sil normatizados NBR 5410.',
    fullDesc: 'Fiação antiga causa aquecimento (efeito Joule), aumenta a conta de luz e representa a principal causa de incêndios residenciais. Substituímos toda a fiação antiga por cabos de cobre eletrolítico antichama dimensionados para os eletrodomésticos modernos.',
    startingPrice: 65,
    unit: 'por ponto elétrico ou m²',
    timeEstimate: '1 a 3 dias',
    popular: true,
    features: [
      'Cabos de cobre puro livres de chumbo e antichama',
      'Dimensionamento técnico conforme carga instalada',
      'Passagem de cabos sem quebrar alvenaria (pelo conduíte)',
      'Substituição de tomadas antigas pelo padrão 3 pinos',
      'Redução de perdas de energia na conta de luz',
      'Conexões seladas com conectores automáticos WAGO'
    ]
  },
  {
    id: 'wallbox-ev',
    title: 'Instalação de Carregador de Carro Elétrico (Wallbox EV)',
    category: 'instalacao',
    shortDesc: 'Circuito dedicado 220V/380V de alta amperagem para recarga segura de veículos BYD, GWM, Volvo, BMW e Tesla.',
    fullDesc: 'Carregadores de veículos elétricos exigem circuitos dedicados com cabo dimensionado (geralmente 6mm² a 10mm²), disjuntor curva C exclusivo, DR Classe A ou B e aterramento perfeito para não travar o carregamento nem sobrecarregar o transformador do imóvel.',
    startingPrice: 200,
    unit: 'ponto dedicado até 15m',
    timeEstimate: '4 a 8 horas',
    popular: true,
    features: [
      'Circuito exclusivo 32A/40A monofásico ou trifásico',
      'Compatível com BYD Dolphin/Song, Haval, Volvo, Tesla, etc.',
      'DR específico para corrente contínua residual',
      'Tubulação aparente galvanizada ou embutida',
      'Medição de resistência de aterramento ôhmico',
      'Teste de carga contínua sob regime pesado'
    ]
  },
  {
    id: 'iluminacao-led',
    title: 'Iluminação Arquitetônica & Fitas de LED',
    category: 'instalacao',
    shortDesc: 'Instalação de trilhos eletrificados, perfis de LED de sobrepor ou embutir no gesso, lustres e pendentes de luxo.',
    fullDesc: 'Projeto executivo e instalação minuciosa de iluminação decorativa e técnica. Instalação de fontes chaveadas bivolt, amplificadores de sinal, fita LED COB contínua (sem pontos aparentes) e interruptores dimerizáveis.',
    startingPrice: 90,
    unit: 'por luminária / metro linear',
    timeEstimate: '2 a 5 horas',
    features: [
      'Perfis de LED embutidos em gesso ou marcenaria',
      'Trilhos eletrificados com spots direcionais',
      'Lustres de cristal e pendentes complexos de pé direito duplo',
      'Fontes Slim de alta eficiência escondidas com ventilação',
      'Controle por interruptores inteligentes (Alexa/Google)'
    ]
  },
  {
    id: 'emergencia-curto',
    title: 'Plantão de Emergência 24h & Diagnóstico de Curto',
    category: 'emergencia',
    shortDesc: 'Socorro rápido para falta de energia, faíscas em tomadas, cheiro de queimado ou disjuntores desarmando sem parar.',
    fullDesc: 'Equipe pronta para deslocamento imediato com maleta de teste térmico e instrumentos digitais de precisão para localizar fugas de corrente, curtos-circuitos embutidos nas paredes ou falhas no neutro da concessionária.',
    startingPrice: 220,
    unit: 'taxa de visita e diagnóstico emergencial',
    timeEstimate: 'Chegada em até 45 minutos, capital paulista.',
    popular: true,
    features: [
      'Atendimento 24 horas por dia, 7 dias por semana',
      'Diagnóstico com câmera termográfica e megômetro',
      'Isolamento imediato do circuito perigoso',
      'Reparo definitivo e restabelecimento seguro da energia',
      'Laudo simplificado da ocorrência'
    ]
  },
  {
    id: 'chuveiro-ar',
    title: 'Instalação de Chuveiros de Alta Potência & Ar Condicionado',
    category: 'instalacao',
    shortDesc: 'Fiação independente para chuveiros de 7500W e condensadoras de ar sem derreter emendas nem queimar disjuntores.',
    fullDesc: 'Eliminamos o perigo de disjuntor caindo no meio do banho. Instalamos cabos de 6mm² a 10mm² diretos do quadro, conectores cerâmicos de porcelana ou WAGO para altas temperaturas, e aterramento funcional contra choque no registro.',
    startingPrice: 150,
    unit: 'por equipamento instalado',
    timeEstimate: '1 a 2 horas',
    features: [
      'Conexão com conector cerâmico ou borne WAGO 221-612',
      'Eliminação de fitas isolantes derretidas',
      'Aterramento exclusivo para eliminar choque no registro',
      'Dimensionamento de disjuntor de curva C apropriado',
      'Teste com vazão de água e teste térmico'
    ]
  },
  {
    id: 'laudo-art',
    title: 'Laudo Técnico de Inspeção Elétrica, Termografia & ART',
    category: 'laudos',
    shortDesc: 'Vistoria técnica para condomínios, seguradoras, AVCB dos Bombeiros e compra/venda de imóveis com ART/TRT.',
    fullDesc: 'Inspeção com laudo assinado por responsável técnico habilitado (CFT/CREA). Análise termográfica para identificar pontos quentes imperceptíveis a olho nu, medição da malha de aterramento e conformidade com NBR 5410.',
    startingPrice: 490,
    unit: 'por vistoria e laudo técnico',
    timeEstimate: 'Entregue em 24h a 48h',
    features: [
      'Relatório fotográfico termográfico Fluke de pontos quentes',
      'Medição de resistência de terra (Terrômetro)',
      'Emissão de ART (Anotação de Responsabilidade Técnica)',
      'Válido para renovação de AVCB de bombeiros e seguros',
      'Plano de ação corretiva detalhado'
    ]
  },
  {
    id: 'padrao-entrada',
    title: 'Adequação de Padrão de Entrada (Poste & Relógio)',
    category: 'instalacao',
    shortDesc: 'Mudança de monofásico para bifásico ou trifásico com homologação perante a concessionária de energia.',
    fullDesc: 'Adequação completa da caixa de medição e poste padrão homologado conforme as normas da concessionária (Enel, CPFL, EDP, Light). Acompanhamento do projeto até a ligação e lacre oficial pela companhia.',
    startingPrice: 850,
    unit: 'mão de obra e projeto de adequação',
    timeEstimate: '1 a 2 dias úteis',
    features: [
      'Instalação de caixa padrão policarbonato normatizada',
      'Instalação de bengala, haste de terra cobreada e cabeamento',
      'Solicitação e acompanhamento da vistoria da concessionária',
      'Aumento de carga para suporte a múltiplos ares-condicionados'
    ]
  }
];

export const ESTIMATE_OPTIONS = [
  { id: 'chuveiro', name: 'Instalação / Troca de Chuveiro Elétrico', basePrice: 150, unitText: 'unidade' },
  { id: 'tomadas', name: 'Instalação ou Troca de Tomadas / Interruptores', basePrice: 40, unitText: 'ponto' },
  { id: 'luminarias', name: 'Instalação de Luminárias / Plafons / Spots', basePrice: 60, unitText: 'unidade' },
  { id: 'quadro', name: 'Reforma Completa de Quadro de Disjuntores DIN', basePrice: 450, unitText: 'quadro' },
  { id: 'wallbox', name: 'Instalação de Carregador de Carro Elétrico (Wallbox)', basePrice: 650, unitText: 'ponto' },
  { id: 'circuito_ar', name: 'Puxar Circuito Dedicado para Ar Condicionado', basePrice: 220, unitText: 'circuito' },
  { id: 'troca_fiacao', name: 'Revisão / Troca de Fiação por Cômodo', basePrice: 350, unitText: 'cômodo' },
  { id: 'curto_circuito', name: 'Visita de Diagnóstico / Conserto de Curto', basePrice: 200, unitText: 'visita' },
  { id: 'laudo_art', name: 'Laudo Elétrico com ART / Termografia', basePrice: 500, unitText: 'imóvel' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    author: 'Renato Silveira',
    role: 'Proprietário de Residência',
    location: 'Vila Mariana, São Paulo',
    rating: 5,
    comment: 'Minha casa antiga estava caindo a chave geral toda vez que ligava o forno elétrico e o chuveiro. O eletricista veio, trocou o quadro velho por disjuntores DIN e balanceou as fases. Trabalho impecável, limpo e super atencioso.',
    serviceProvided: 'Reforma Geral de Quadro e Balanceamento',
    date: 'Há 2 semanas'
  },
  {
    id: '2',
    author: 'Mariana Duarte',
    role: 'Arquiteta de Interiores',
    location: 'Pinheiros, São Paulo',
    rating: 5,
    comment: 'Instalou toda a iluminação de um apartamento de alto padrão que projetei: fitas de LED COB invisíveis na marcenaria e trilhos magnéticos. Execução precisa milimétrica, sem deixar um fio torto.',
    serviceProvided: 'Iluminação Arquitetônica & Fitas de LED',
    date: 'Há 1 mês'
  },
  {
    id: '3',
    author: 'Carlos Eduardo Nogueira',
    role: 'Condômino & Proprietário de BYD Song',
    location: 'Moema, São Paulo',
    rating: 5,
    comment: 'Precisava instalar o Wallbox na garagem do condomínio com medição independente. Fizeram a tubulação aparente de metal galvanizado perfeita, aprovaram o projeto com o síndico e emitiram a ART no mesmo dia.',
    serviceProvided: 'Instalação de Wallbox Veicular EV',
    date: 'Há 3 semanas'
  },
  {
    id: '4',
    author: 'Luciana Bittencourt',
    role: 'Gerente Comercial',
    location: 'Alphaville, Barueri',
    rating: 5,
    comment: 'Tive um princípio de fumaça na tomada da lavanderia às 21h de um sábado. Entrei no site, mandei meu nome e telefone e em 35 minutos o eletricista já estava aqui com a maleta de teste. Evitou um incêndio real!',
    serviceProvided: 'Plantão Emergencial Noturno 24h',
    date: 'Há 1 semana'
  }
];

export const SAFETY_CHECKLIST = [
  {
    title: 'Certificação NR-10 e NR-35 Válidas',
    desc: 'Técnicos habilitados para intervenções elétricas em baixa e média tensão com cursos de segurança e trabalho em altura.'
  },
  {
    title: 'Instrumentos Calibrados Fluke',
    desc: 'Uso de multímetros True-RMS categoria CAT IV 600V / CAT III 1000V, alicates amperímetros e câmeras termográficas de alta precisão.'
  },
  {
    title: 'Ferramental com Isolamento 1.000V VDE',
    desc: 'Chaves de fenda, Phillips e alicates certificados para tensão de trabalho de até mil volts, garantindo zero risco de acidente.'
  },
  {
    title: 'Garantia Técnica de 1 Ano',
    desc: 'Todo serviço conta com termo de garantia por escrito e suporte pós-instalação para qualquer ajuste necessário.'
  }
];
