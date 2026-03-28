// Disciplinas do curso de Ciências Sociais - UFSC (Currículo 20071)
// Fonte: PPP e grade curricular oficial
// Cada disciplina: { codigo, nome, tipo, h_a, semestre, area, campo_tematico, ementa }

const DISCIPLINAS = [
  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — ANTROPOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7101",
    nome: "Introdução à Antropologia",
    tipo: "Ob",
    h_a: 108,
    semestre: 1,
    area: "Antropologia",
    campo_tematico: null,
    ementa: "Introdução ao campo da Antropologia. Conceitos fundamentais: cultura, etnocentrismo, relativismo cultural, alteridade. Principais tradições antropológicas e seus contextos históricos de formação. A especificidade do olhar antropológico. Prática pedagógica (PCC 36h/a)."
  },
  {
    codigo: "ANT7201",
    nome: "Teoria Antropológica I",
    tipo: "Ob",
    h_a: 108,
    semestre: 2,
    area: "Antropologia",
    campo_tematico: null,
    ementa: "A constituição das antropologias social-britânica — funcionalismo e estrutural-funcionalismo — e cultural norte-americana. PCC 36h/a."
  },
  {
    codigo: "ANT7301",
    nome: "Teoria Antropológica II",
    tipo: "Ob",
    h_a: 72,
    semestre: 3,
    area: "Antropologia",
    campo_tematico: null,
    ementa: "A escola sociológica francesa e o estruturalismo. PCC 18h/a."
  },
  {
    codigo: "ANT7401",
    nome: "Teoria Antropológica III",
    tipo: "Ob",
    h_a: 108,
    semestre: 4,
    area: "Antropologia",
    campo_tematico: null,
    ementa: "O pensamento antropológico pós-guerra e as bases da antropologia contemporânea. A diversificação dos paradigmas antropológicos em reações às escolas nacionais e aos modelos dualistas (natureza e cultura; indivíduo e sociedade; história e estrutura). Proposições para as antropologias processuais, históricas, interpretativas e simbólicas. PCC 36h/a."
  },
  {
    codigo: "ANT7701",
    nome: "Estudos Afro-Brasileiros",
    tipo: "Ob",
    h_a: 72,
    semestre: 7,
    area: "Antropologia",
    campo_tematico: null,
    ementa: "Relações raciais e racismo no Brasil. Relações interétnicas e identidades étnicas. Estudos sobre os negros no Brasil. PCC 18h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — SOCIOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7103",
    nome: "Introdução à Sociologia",
    tipo: "Ob",
    h_a: 108,
    semestre: 1,
    area: "Sociologia",
    campo_tematico: null,
    ementa: "Perspectiva histórica do desenvolvimento da sociologia como ciência. Introdução ao debate e dilemas teóricos centrais da Sociologia a partir da contribuição das principais matrizes clássicas (estrutura X ação; consenso X conflito; tradição X modernidade; subjetividade X objetividade) e seus desdobramentos contemporâneos. A imaginação sociológica como experiência crítica da sociedade. PCC 36h/a."
  },
  {
    codigo: "SPO7203",
    nome: "Teoria Sociológica I",
    tipo: "Ob",
    h_a: 108,
    semestre: 2,
    area: "Sociologia",
    campo_tematico: null,
    ementa: "Pensamento Social Clássico: a sociologia positivista de Emile Durkheim; o materialismo histórico e dialético de Karl Marx e seus desdobramentos contemporâneos. PCC 36h/a."
  },
  {
    codigo: "SPO7303",
    nome: "Teoria Sociológica II",
    tipo: "Ob",
    h_a: 72,
    semestre: 3,
    area: "Sociologia",
    campo_tematico: null,
    ementa: "Pensamento social clássico: a sociologia compreensiva de Max Weber; o neofuncionalismo de Robert Merton; o estrutural-funcionalismo de Talcott Parsons e seus desdobramentos contemporâneos. PCC 18h/a."
  },
  {
    codigo: "SPO7403",
    nome: "Teoria Sociológica III",
    tipo: "Ob",
    h_a: 108,
    semestre: 4,
    area: "Sociologia",
    campo_tematico: null,
    ementa: "Pensamento Social Contemporâneo: a praxeologia de Pierre Bourdieu; a Escola de Frankfurt; o pós-modernismo de Michel Foucault, Boaventura de Souza Santos, Latour e outros; a contribuição da sociologia brasileira à teoria da globalização: Otávio Ianni. PCC 36h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — CIÊNCIA POLÍTICA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7102",
    nome: "Introdução à Ciência Política",
    tipo: "Ob",
    h_a: 108,
    semestre: 1,
    area: "Ciência Política",
    campo_tematico: null,
    ementa: "História do surgimento do conceito de política. Política e teoria política na antiguidade greco-romana. As diferentes dimensões do objeto da Ciência Política. O Estado moderno e a transformação da política clássica. Conceitos fundamentais da Ciência Política: Poder, Dominação, Legitimidade, Estado, Governo, Povo, Cidadania, Liberdade, Igualdade. PCC 36h/a."
  },
  {
    codigo: "SPO7202",
    nome: "Teoria Política I",
    tipo: "Ob",
    h_a: 108,
    semestre: 2,
    area: "Ciência Política",
    campo_tematico: null,
    ementa: "Estudo das principais contribuições clássicas da teoria política moderna, entre o contexto do Renascimento e o contexto das revoluções francesa e americana. Maquiavel e o Estado moderno. O republicanismo moderno (Harrington, Milton, Morus); vertentes do contratualismo (Hobbes, Locke, Rousseau); Conservadorismo e liberalismo (Burke, Montesquieu, Tocqueville). Os 'federalistas' e a revolução americana (Madison, Jay, Hamilton). PCC 36h/a."
  },
  {
    codigo: "SPO7302",
    nome: "Teoria Política II",
    tipo: "Ob",
    h_a: 72,
    semestre: 3,
    area: "Ciência Política",
    campo_tematico: null,
    ementa: "Estudo das principais correntes de pensamento e dos autores clássicos do pensamento político moderno, situado entre as primeiras décadas do século XIX e as primeiras décadas do século XX. Liberalismo e utilitarismo (Bentham, James Mill, Stuart Mill). Socialismo utópico (Saint-Simon, Owen, Fourier). Anarquismo (Stirner, Proudhon, Bakunin). Marxismo (Marx, Engels, Lênin, Gramsci). Elitismo (Weber, Pareto, Mosca, Michels). PCC 18h/a."
  },
  {
    codigo: "SPO7402",
    nome: "Teoria Política III",
    tipo: "Ob",
    h_a: 108,
    semestre: 4,
    area: "Ciência Política",
    campo_tematico: null,
    ementa: "Estudo das principais correntes de pensamento e autores da teoria política contemporânea desde o pós-segunda guerra mundial. Pluralismo (Schumpeter, Dahl, Downs, Lindblom). Neomarxismo (Poulantzas, Offe, Habermas, Przeworski, Elster). Neoliberalismo (Mises, Hayek, Friedman). Neoinstitucionalismo (Skocpol, Tilly, Evans, Hall, North, Riker). Neorepublicanismo (Arendt, Skinner, Pettit). Teorias da democracia. PCC 36h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — METODOLOGIA E EPISTEMOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "FIL7101",
    nome: "Fundamentos Filosóficos de Pesquisa Científica",
    tipo: "Ob",
    h_a: 72,
    semestre: 1,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Fundamentos filosóficos da pesquisa científica. Epistemologia e filosofia da ciência aplicadas às ciências humanas e sociais."
  },
  {
    codigo: "CSO7304",
    nome: "Epistemologia das Ciências Sociais",
    tipo: "Ob",
    h_a: 108,
    semestre: 3,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Conceito de epistemologia. Análise crítica das principais linhas de reflexão epistemológica em Ciências Sociais. Fundamento de teoria do conhecimento. Estrutura lógica dos enunciados científicos. Problemas epistemológicos centrais para a prática da Ciência Social (relação ciência-ideologia, conceito de objetividade, relação ciência social e ciência natural, conceito de lei e teoria, construção de modelos multifatoriais, reducionismo, individualismo e holismo metodológicos, etc.). Ciência, tecnologia, sociedade e política. PCC 36h/a."
  },
  {
    codigo: "CSO7506",
    nome: "Métodos e Técnicas de Pesquisa I",
    tipo: "Ob",
    h_a: 108,
    semestre: 5,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "As diversas concepções sobre o método nas Ciências Sociais. A construção do objeto. Tipos de pesquisa. Problemas gerais de planejamento, execução e avaliação do processo da pesquisa. Estrutura da explicação e da predição em Ciência Social. PCC 36h/a."
  },
  {
    codigo: "CSO7606",
    nome: "Métodos e Técnicas de Pesquisa II",
    tipo: "Ob",
    h_a: 108,
    semestre: 6,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "As relações entre teoria e dados: uso de roteiros, entrevistas, genealogias, história de vida. A experiência etnográfica. O trabalho de campo. Observação participante. Processos de coleta, análise e interpretação de dados. Discussão preliminar sobre o projeto de pesquisa para o trabalho de conclusão de curso."
  },
  {
    codigo: "INE5127",
    nome: "Estatística Aplicada a Ciências Sociais",
    tipo: "Ob",
    h_a: 72,
    semestre: 6,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Probabilidade. Estatística descritiva. Amostragem. Estimação de parâmetros e testes de hipóteses. Testes não-paramétricos. Correlações."
  },
  {
    codigo: "CSO7205",
    nome: "Prática de Pesquisa I",
    tipo: "Ob",
    h_a: 36,
    semestre: 2,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Conhecimento sobre os projetos de pesquisa desenvolvidos pelos professores do curso nos núcleos de pesquisa e estudo dos dois principais departamentos do curso. PCC 36h/a."
  },
  {
    codigo: "CSO7505",
    nome: "Prática de Pesquisa II",
    tipo: "Ob",
    h_a: 36,
    semestre: 5,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Conhecimento sobre os projetos de pesquisa desenvolvidos pelos professores do curso nos núcleos de pesquisa e estudo dos dois principais departamentos do curso. PCC 36h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — TRANSVERSAIS
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "LLV7801",
    nome: "Produção Textual Acadêmica",
    tipo: "Ob",
    h_a: 72,
    semestre: 1,
    area: "Transversal",
    campo_tematico: null,
    ementa: "Estudo e produção de textos técnico-científicos relevantes para o desempenho das atividades acadêmicas, tais como: resumo, resenha, artigo e seminário. Prática pedagógica."
  },
  {
    codigo: "HST7402",
    nome: "História Contemporânea I",
    tipo: "Ob",
    h_a: 72,
    semestre: 3,
    area: "Transversal",
    campo_tematico: null,
    ementa: "História Contemporânea I. PCC 12h/a."
  },
  {
    codigo: "CSO7504",
    nome: "Pensamento Social Brasileiro",
    tipo: "Ob",
    h_a: 108,
    semestre: 5,
    area: "Transversal",
    campo_tematico: null,
    ementa: "Contribuições Teóricas das Ciências Sociais no Brasil. História da Sociologia Brasileira: o ensino de sociologia, suas fases e os ensaístas, realismo literário e sociologia, as Ciências Sociais e as apresentações do Brasil. Sociologia crítica: o negro na sociedade de classes, a revolução Brasileira (a evolução política do Brasil e a Revolução Burguesa), subdesenvolvimento e dependência."
  },
  {
    codigo: "CNM7115",
    nome: "Economia Política",
    tipo: "Ob",
    h_a: 72,
    semestre: 4,
    area: "Transversal",
    campo_tematico: null,
    ementa: "Introdução à Economia Política das escolas que estabeleceram os paradigmas da Ciência Econômica na interpretação das economias capitalistas. Apresentação da Economia Política contemporânea e suas análises sobre o capitalismo contemporâneo."
  },
  {
    codigo: "PSI5138",
    nome: "Psicologia Social",
    tipo: "Ob",
    h_a: 72,
    semestre: 4,
    area: "Transversal",
    campo_tematico: null,
    ementa: "Psicologia Social. PCC 18h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — LICENCIATURA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "EED5331",
    nome: "Teorias da Educação",
    tipo: "Ob",
    h_a: 72,
    semestre: 4,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "Conceito de educação: elaborações e práticas em torno da formação moral, intelectual e estética do homem. Conceito de pedagogia: pedagogia da essência e pedagogia da existência — referências clássicas, modernas e contemporâneas. Pensamento pedagógico brasileiro."
  },
  {
    codigo: "MEN5602",
    nome: "Didática B",
    tipo: "Ob",
    h_a: 72,
    semestre: 5,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "Educação escolar como fenômeno histórico-social. Currículo e trabalho pedagógico no contexto escolar. As relações de ensino-aprendizagem em contexto escolar. Mediações pedagógicas e suas relações com o ensino da área específica do curso. PCC 12h/a."
  },
  {
    codigo: "PSI5137",
    nome: "Psicologia Educacional: Desenvolvimento e Aprendizagem",
    tipo: "Ob",
    h_a: 72,
    semestre: 5,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "Introdução à Psicologia como ciência: histórico, objetivo e métodos. Interações sociais no contexto educacional e o lugar do professor. Introdução ao estudo do desenvolvimento e de aprendizagem — infância, adolescência, idade adulta. Contribuições da Psicologia na prática escolar cotidiana e na compreensão do fracasso escolar. PCC 12h/a."
  },
  {
    codigo: "EED5187",
    nome: "Organização Escolar",
    tipo: "Ob",
    h_a: 72,
    semestre: 6,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "O papel social da escola. O direito à educação. A democratização da educação. Currículo e organização da escola. LDB: a organização da educação nacional e níveis e modalidades de ensino. Projeto Político Pedagógico: a gestão democrática da escola. Parâmetros Curriculares Nacionais. Propostas Curriculares estadual e municipal. PCC 18h/a."
  },
  {
    codigo: "MEN7015",
    nome: "Metodologia de Ensino das Ciências Sociais",
    tipo: "Ob",
    h_a: 72,
    semestre: 6,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "A constituição, organização e desenvolvimento do ensino das Ciências Sociais no contexto da educação escolarizada no Brasil. Os princípios teórico-metodológicos das atividades de ensino e de aprendizagem e a especificidade do trabalho pedagógico nas Ciências Sociais. As propostas curriculares e os materiais e recursos didáticos para o ensino das Ciências Sociais. As pesquisas e a discussão contemporânea sobre as possibilidades e os desafios do ensino de Ciências Sociais na realidade escolar brasileira."
  },
  {
    codigo: "SPO7603",
    nome: "Sociologia da Educação",
    tipo: "Ob",
    h_a: 72,
    semestre: 6,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "Análise dos aspectos históricos do desenvolvimento da sociologia e da sociologia da educação, estudos clássicos e contemporâneos da sociologia da educação. A educação no processo de produção e reprodução das relações sociais. PCC 18h/a."
  },
  {
    codigo: "LSB7904",
    nome: "Língua Brasileira de Sinais — Libras I",
    tipo: "Ob",
    h_a: 72,
    semestre: 9,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "Prática de conversação em Libras habilitando o aluno a se comunicar em nível básico. Mitos e crenças relacionadas à Língua Brasileira de Sinais (Libras) e aos Surdos. Noções sobre os estudos linguísticos das línguas de sinais em diferentes níveis da descrição linguística. Conceitos básicos da Língua Brasileira de Sinais como iconicidade e arbitrariedade e aspectos culturais e históricos específicos da comunidade surda brasileira. Educação de surdos, papéis dos professores e de intérpretes de libras-português em uma perspectiva inclusiva. PCC 18h/a."
  },

  // ═══════════════════════════════════════════════════════════
  // OBRIGATÓRIAS — SEMINÁRIOS E TCC (Bacharelado)
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "CSO7707",
    nome: "Seminário de Pesquisa I",
    tipo: "Ob",
    h_a: 72,
    semestre: 7,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Início do processo de elaboração do trabalho de conclusão de curso. Encontros coletivos, sob a supervisão docente, para discussão metodológica dos projetos de trabalho de final de curso dos alunos do bacharelado."
  },
  {
    codigo: "CSO7807",
    nome: "Seminário de Pesquisa II",
    tipo: "Ob",
    h_a: 72,
    semestre: 8,
    area: "Metodologia",
    campo_tematico: null,
    ementa: "Início do processo de elaboração do trabalho de conclusão de curso. Encontros coletivos, sob a supervisão docente, para discussão metodológica dos projetos de trabalho de final de curso dos alunos do bacharelado."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ETNOLOGIA E ALTERIDADE
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7004",
    nome: "Etnologia Indígena",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Temáticas, abordagens e perspectivas teórico-metodológicas em etnologia indígena, com ênfase sobre as sociedades situadas no Brasil. O campo de estudo da etnologia indígena, panorama histórico e atual."
  },
  {
    codigo: "ANT7003",
    nome: "Relações Inter-étnicas",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Grupos étnicos. Processos sócio-culturais de construção de identidades étnicas. Particularidades históricas e processos de diferenciação. Etnicidades e questões raciais, acomodações e conflitos. Sociedades pluriétnicas, cultura e política."
  },
  {
    codigo: "ANT7005",
    nome: "Organização Social e Parentesco",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "A constituição do campo: fundamentos teóricos e conceituais. Sistemas terminológicos, regras de filiação, aliança e residência. Herança e onomástica. Debates contemporâneos sobre a temática."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — CORPO, PESSOA, SUJEITO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7002",
    nome: "Relações de Gênero",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Gênero, Sexualidade, Feminismo",
    ementa: "O conceito de gênero segundo diferentes escolas teóricas. Identidades de gênero. Parentesco, família, filiação, reprodução e sexualidade. Representações do masculino e do feminino. Análise crítica dos estudos clássicos na Antropologia sobre o lugar das relações de gênero nas sociedades."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ARTE, IMAGEM, MÚSICA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7001",
    nome: "Cultura Brasileira",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "Significados e dinâmicas da Cultura Brasileira. Estudos antropológicos sobre Cultura Brasileira. Conceitos de Cultura Brasileira. Artes no Brasil. Literaturas no período colonial e contemporâneo. Cultura popular e folclore. Comunicação de massa."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ESPAÇO URBANO / RURAL
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7006",
    nome: "Antropologia Urbana",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Espaço Urbano/Rural",
    ementa: "O fenômeno urbano. Organização social e espaço. Territórios e territorialidade. Apropriações e intervenção no espaço público. Dicotomias rural-urbano."
  },
  {
    codigo: "ANT7007",
    nome: "Antropologia do Mundo Rural",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Espaço Urbano/Rural",
    ementa: "Conceitos e tradições teóricas nos estudos do chamado campesinato e da ruralidade. Modos de ocupação dos espaços e acesso aos recursos. Diversidades, organizações econômicas, relações sociais e moralidades nos coletivos do mundo rural. Relações com o urbano."
  }
];

// Áreas disponíveis (para agrupamento no dropdown)
const AREAS = [
  "Antropologia",
  "Sociologia",
  "Ciência Política",
  "Metodologia",
  "Transversal",
  "Licenciatura"
];

// Campos temáticos das optativas
const CAMPOS_TEMATICOS = [
  "Etnologia e Alteridade",
  "Corpo, Pessoa, Sujeito",
  "Gênero, Sexualidade, Feminismo",
  "Simbólico, Ritual, Religião",
  "Arte, Imagem, Música",
  "Espaço Urbano/Rural",
  "Cultura, Mídia, Globalização",
  "Violência, Conflito, Direitos",
  "Saúde, Alimentação, Meio Ambiente",
  "Ciência, Tecnologia, Linguagem",
  "Parentesco, Organização Social",
  "Política, Estado, Poder",
  "Trabalho, Economia, Organizações",
  "Educação, Juventude"
];
