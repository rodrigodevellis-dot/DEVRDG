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
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ARTE, IMAGEM, MÚSICA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7008",
    nome: "Antropologia Visual",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "A imagem como objeto de estudo antropológico. A história da sub- disciplina e algumas de suas principais tendências. A \"antropologia compartilhada\". As teorias e práticas de técnicas audiovisuais (fotografia, vídeo, cinema, multimídia) na pesquisa antropológica."
  },
  {
    codigo: "ANT7013",
    nome: "Etnomusicologia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "A música como objeto de estudo antropológico. Esboço histórico e panorama atual: musicologia comparada, etnomusicologia, antropologia da música, estudos musicais. Música como código sócio-cultural: principais tendências teórico- metodológicas, hoje. Música popular, erudita, folclórica, indígenas. Estudos recentes no Brasil."
  },
  {
    codigo: "ANT7014",
    nome: "Antropologia da Arte",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "A arte como objeto de estudo antropológico: etnoestética, etnomusicologia, etnocoreologia e outros e sub-campos da área. Arte como código sócio-cultural: principais tendências teórico-metodológicas. Arte e artisticidade. Arte e agência. Artes populares, eruditas, folclóricas e indígenas. Etnografias clássicas, modernas e recentes sobre a arte. Estudos recentes no Brasil."
  },
  {
    codigo: "ANT7060",
    nome: "Representação e Imagem",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "Introdução a perspectivas antropológicas, culturais e filosóficas sobre a representação. Imagens e outras formas de representação para além da linguagem verbal: teatro; cinema; objetos; fotografia; coleções; arte."
  },
  {
    codigo: "ANT7062",
    nome: "Antropologia dos Objetos",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Arte, Imagem, Música",
    ementa: "Objetos materiais na história da antropologia social e cultural. Interpretações antropológicas sobre os objetos materiais. Transformações e reclassificações. Desafios na pesquisa de coleções e arquivos etnográficos. Antropologia e Consumo, cultura material e pessoas."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — CULTURA, MÍDIA, GLOBALIZAÇÃO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7010",
    nome: "Antropologia da Mídia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Cultura, Mídia, Globalização",
    ementa: "Teorias da mídia impressa e eletrônica. Apocalípticos e integrados: as diferentes escolas analíticas. Ética, mídia e poder. Teorias da escola funcionalista, teorias de recepção e estudos culturais. Conceitos de repetição e serialidade. Etnografias de mídia e de audiência. Cybercultura."
  },
  {
    codigo: "ANT7011",
    nome: "Antropologia e Esporte",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Cultura, Mídia, Globalização",
    ementa: "Teorias do corpo, dos jogos, do esporte. Esporte, mídia e poder. Sublimação, identificação, masoquismo, pulsão de morte; masculinidade; identidade nacional e totemismo clubístico. Origens do esporte moderno e história do futebol brasileiro: classe e raça."
  },
  {
    codigo: "ANT7012",
    nome: "Globalização Cultural",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Cultura, Mídia, Globalização",
    ementa: "Teorias da globalização cultural e sua relação com a Antropologia. Teorias da Modernidade e da Pós-Modernidade. Globalização e transnacionalismo. Fluxos de pessoas: Processos migratórios e novas identidades. Multiculturalismo. Fluxos de imagens: mídia, imaginação e imaginário. Teorias do consumo."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — SAÚDE, ALIMENTAÇÃO, MEIO AMBIENTE
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7009",
    nome: "Antropologia da Alimentação",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Saúde, Alimentação, Meio Ambiente",
    ementa: "A comida como objeto antropológico. As diferentes escolas antropológicas e suas interpretações das práticas alimentares. Tabus e as prescrições alimentares. Alimentação e classe social, gênero e etnia. Identidade e estilo de vida. Emigração e globalização alimentar. Distúrbios alimentares e identidade."
  },
  {
    codigo: "ANT7017",
    nome: "Cultura e Meio Ambiente",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Saúde, Alimentação, Meio Ambiente",
    ementa: "O meio ambiente na reflexão antropológica. Natureza, Cultura e Sociedade. Teorias antropológicas sobre a relação do homem com o meio ambiente. Antropologia da paisagem. Ambientalismo, ecologia política, áreas de preservação, e populações tradicionais. Sustentabilidade, gestão ambiental, e ambientes urbanos e rurais."
  },
  {
    codigo: "ANT7066",
    nome: "Antropologia da Saúde",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Saúde, Alimentação, Meio Ambiente",
    ementa: "Panorama do campo da Antropologia da Saúde, destacando as suas diversas atividades e pesquisas sobre a relação entre saúde, sociedade, e cultura de uma perspectiva antropológica. Doença como processo sócio-cultural. Relação saúde e cultura. Representações do corpo, etnomedicina, práticas de cura, itinerário terapêutico, eficacia ritual, cura, etc. A relação entre sistemas religiosos, cosmológicos e a saúde, incluindo sistemas xamânicos, religiões afro- brasileiras e medicina popular."
  },
  {
    codigo: "SPO7045",
    nome: "Ciências Sociais e Saúde",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Saúde, Alimentação, Meio Ambiente",
    ementa: "A construção do saber médico e do estatuto do normal e do patológico. Ecologia dos vetores. Doenças infecciosas emergentes. Representações sociais em saúde. Políticas de saúde"
  },
  {
    codigo: "SPO7073",
    nome: "Ecologia Política",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Saúde, Alimentação, Meio Ambiente",
    ementa: "Da ecologia à critica radical da sociedade industrial. Desequilíbrio social. Conservacionismo e ecologismo. Movimentos ecológicos e questionamentos da cultura política materialista. Ecologismo e Ecosocialismo."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — CORPO, PESSOA, SUJEITO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7016",
    nome: "Individuo e Sociedade",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Corpo, Pessoa, Sujeito",
    ementa: "Pessoa e coletividade. Indivíduo, cultura e personalidade. A construção social da pessoa, grupo, identidade. Biografias e estrutura social."
  },
  {
    codigo: "ANT7023",
    nome: "Pessoa e Corporalidade",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Corpo, Pessoa, Sujeito",
    ementa: "Introdução a uma abordagem antropológica da Pessoa e da corporalidade. A reflexão antropológica clássica sobre as técnicas corporais e sobre a noção de Pessoa, pensadas como construções simbólicas, sociais e históricas e os seus cruzamentos em diferentes campos da antropologia. Os estudos de etnologia ameríndia e a centralidade do idioma corporal. O individualismo moderno e seus desdobramentos quanto às concepções de corpo e Pessoa nas culturas urbanas contemporâneas. Gênero, corporalidade e subjetividade. Tecnologia e novas visões estéticas e midiáticas sobre o corpo e a Pessoa."
  },
  {
    codigo: "ANT7052",
    nome: "Antropologia da Pessoa e Teorias do",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Corpo, Pessoa, Sujeito",
    ementa: "Os diferentes paradigmas e abordagens da temática do sujeito no mundo contemporâneo. A reflexão antropológica sobre as categorias de Pessoa e Indivíduo, pensados como construções simbólicas, sociais e históricas. As diferentes teorias do sujeito e da subjetividade e a contribuição de outros campos do conhecimento."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — GÊNERO, SEXUALIDADE, FEMINISMO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7020",
    nome: "Família e Parentesco em Sociedades",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Gênero, Sexualidade, Feminismo",
    ementa: "A perspectiva antropológica sobre a família. Reprodução, sexualidade e parentesco. Papéis sexuais. Relações de gênero, família e sociedade. Teorias sobre parentesco e casamento. Parentalidade e conjugalidade. Casamento."
  },
  {
    codigo: "ANT7050",
    nome: "Gênero e Sexualidade",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Gênero, Sexualidade, Feminismo",
    ementa: "O propósito da disciplina é refletir sobre as relações entre gênero e sexualidade através de temáticas colocadas por estudos antropológicos, como a reprodução, a conjugalidade, as tecnologias reprodutivas e a transexualidade. O foco recairá na dinâmica das problemáticas trazidas pelos temas, a vinculação destas com determinadas abordagens e conceitos tomados como centrais e suas implicações no debate contemporâneo sobre as políticas pelos direitos sexuais e reprodutivos."
  },
  {
    codigo: "ANT7051",
    nome: "Antropologia e Feminismo",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Gênero, Sexualidade, Feminismo",
    ementa: "Abordagens antropológicas do gênero, a antropologia feminista e o campo dos estudos feministas de modo geral. Genealogia e trajetória dos estudos antropológicos de gênero e da antropologia feminista, abordando o gênero não apenas como um objeto da investigação antropológica, mas como um paradigma importante na análise cultural. Abordagem das teorias feministas e suas contribuições para a teoria antropológica. Leitura e discussão de etnografias que abordam questões de gênero e sexualidade e de etnografias."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — SIMBÓLICO, RITUAL, RELIGIÃO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7053",
    nome: "Antropologia da Religião",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Simbólico, Ritual, Religião",
    ementa: "Sujeito Introdução e fundamentação de uma perspectiva antropológica para os estudos sobre religião, religiões e religiosidades. Abordagem da trajetória dos estudos antropológicos de religião, teorias, etnografia e conceitos, através da leitura e discussão de estudos clássicos e contemporâneos do campo de estudos. Religião, cultura e sociedade. Desdobramentos temáticos e articulações entre religião e outros temas contemporâneos."
  },
  {
    codigo: "ANT7059",
    nome: "Mito, Rito e Cosmologia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Simbólico, Ritual, Religião",
    ementa: "Antropologia simbólica. Estudos de mito e rito e sua relação com a cosmologia. Pensamento antropológico sobre religião e o papel do rito. Xamanismo, rito e mito. Comprender a relação entre rito, cosmologia, e mito."
  },
  {
    codigo: "ANT7063",
    nome: "Antropologia Simbólica",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Simbólico, Ritual, Religião",
    ementa: "O campo da antropologia simbólica preocupa com o papel do símbolo na vida humana, particularmente na sua expressão em rito, mito, e religião. A disciplina visa fornecer uma base para entender as preocupações principais da antropologia simbólica com ênfase na linha caracterizada como \"antropologia interpretativa\". Além de examinar as teorias mais representativas, explora alguns desdobramentos atuais que vão além de uma perspectiva normativa para dar conta da complexidade da vida social."
  },
  {
    codigo: "ANT7067",
    nome: "Do Rito à Performance",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Simbólico, Ritual, Religião",
    ementa: "Noção de performance e seu desenvolvimento nas ciências humanas. Performances sagrados (ritos) e lúdicos. Manifestações étnicas e politicas. Teatro popular, jogos, espectáculos, e festas. Estudos de casos."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — CIÊNCIA, TECNOLOGIA, LINGUAGEM
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7054",
    nome: "Antropologia da Ciência e da Tecnologia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Ciência, Tecnologia, Linguagem",
    ementa: "A construção social da ciência e da tecnologia. As epistemes modernas e o discurso científico. Ciência e poder. Razão e racionalidade. Natureza e cultura; humano, pós-humano, não-humano."
  },
  {
    codigo: "ANT7058",
    nome: "Antropologia e Linguagem",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Ciência, Tecnologia, Linguagem",
    ementa: "Introdução a teorias do signo e da linguagem. Comunicação e cultura. Texto, contexto e discurso. Referência, sentido e polissemia. Oralidade e escrita. Narrativa e poética. Signos e linguagens não-verbais. Tradução cultural."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — VIOLÊNCIA, CONFLITO, DIREITOS
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7015",
    nome: "Antropologia das Minorias",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Violência, Conflito, Direitos",
    ementa: "Bacharelado em Ciências Sociais"
  },
  {
    codigo: "ANT7068",
    nome: "Identidades e Diversidade",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Violência, Conflito, Direitos",
    ementa: "Liminal e liminoid na sociedade complexa. A construção de identidades sociais. Territorialidade, fronteiras simbólicas e etnicidade. Políticas de identidade e minorias como questões sociais e antropológicas."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ETNOLOGIA E ALTERIDADE
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7202",
    nome: "Introdução à Etnografia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Introdução à etnografia como método, forma de representação e modo de reflexão antropológica. Os precursores da etnografia: o imaginário europeu sobre o ‘exótico’, o ‘selvagem’ e o ‘outro’; relatos de viagem; memórias dos colonizadores; antropologia de gabinete."
  },
  {
    codigo: "ANT7203",
    nome: "Leituras Etnográficas I",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Estudos etnográficos elaborados a partir do marco da antropologia social- britânica - funcionalismo e estrutural-funcionalismo - e do cultural-historicismo norte- americano."
  },
  {
    codigo: "ANT7204",
    nome: "Leituras Etnográficas II",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Estudos etnográficos elaborados a partir do marco da escola sociológica francesa e do estruturalismo. A relação entre teoria e etnografia."
  },
  {
    codigo: "ANT7211",
    nome: "Leituras Etnográficas III",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Etnologia e Alteridade",
    ementa: "Estudos etnográficos elaborados a partir da antropologia pós-guerra e contemporânea. A relação entre pesquisa de campo e escrita etnográfica. Etnografia como representação e como narrativa. Autoria e autoridade etnográfica. Representação etnográfica do \'eu\' e do \'outro\'. Reflexividade e dialogismo."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — EDUCAÇÃO, JUVENTUDE
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7022",
    nome: "Antropologia da Educação",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Educação, Juventude",
    ementa: "A disciplina tratará dos seguintes temas da Antropologia da Educação: abordagens antropológicas clássicas sobre os processos de ensino e aprendizagem, em especial estudos sobre \"socialização\" e \"cultura e personalidade\"; abordagens antropológicas contemporâneas sobre cognição, processos de transmissão de saberes, desenvolvimento infantil e a contribuição das crianças para o estudo da cultura e da sociedade; estudos das relações estabelecidas por meio da escola, com ênfase nas questões de raça e gênero; reflexões sobre o ensino da Antropologia na sala de aula do ensino fundamental e médio."
  },
  {
    codigo: "SPO7049",
    nome: "Sociologia da Juventude",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Educação, Juventude",
    ementa: "A Sociologia das Gerações como campo de estudos teóricos e de intervenções práticas. As abordagens teóricas e metodológica da Sociologia da Juventude,como campo de investigação e intervenção das políticas públicas. Análise da sociabilidade juvenil relacionada com a transformação social na sua interface com a cultura, processos educativos e a formação política"
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — HISTÓRIA, ANTROPOLOGIA BRASILEIRA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7018",
    nome: "Antropologia e História",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "História, Antropologia Brasileira",
    ementa: "A fronteira entre a Antropologia e a História. Temas, debates e conceitos: estrutura e acontecimento, diacronia e sincronia."
  },
  {
    codigo: "ANT7021",
    nome: "Antropologia Brasileira",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "História, Antropologia Brasileira",
    ementa: "Complexas História da antropologia no Brasil. A questão nacional. Conceitos, questões e tendências da antropologia no Brasil."
  },
  {
    codigo: "SPO7051",
    nome: "Sociologia Brasileira",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "História, Antropologia Brasileira",
    ementa: "A Sociologia Crítica de Florestan Fernandes e Otávio Ianni, bem como suas abordagens sobre a associação entre pesquisa sociológica, teoria e suas aplicações na solução de problemas sociais brasileiros"
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — ESPAÇO URBANO/RURAL
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7038",
    nome: "Sociologia Urbana",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Espaço Urbano/Rural",
    ementa: "Problemas de conceituação e definição do objeto da Sociologia Urbana. Evolução histórica das diversas interpretações do fenômeno urbano. As relações entre urbanização e industrialização no Brasil. Problemas urbanos: a questão da habitação e da violência nas cidades. Intervenção do Estado e o planejamento urbano. A intervenção dos cidadãos e os movimentos sociais urbanos."
  },
  {
    codigo: "SPO7039",
    nome: "Sociologia Rural",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Espaço Urbano/Rural",
    ementa: "Raízes teóricas, tendências e perspectivas da Sociologia Rural. A Estrutura agrária brasileira: formas de uso e relações de propriedades. Estrutura agrária catarinense: evolução histórica, tendência e perspectivas. A cooperação do meio rural. Os camponeses e a política. O movimento do capital no campo: formas de desenvolvimento, tendências e perspectivas. Reforma agrária"
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — TRABALHO, ECONOMIA, ORGANIZAÇÕES
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7065",
    nome: "Introdução à Antropologia Econômica",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Surgimento, desenvolvimento e crítica à chamada antropologia econômica, compreendida como sub-área da Antropologia. As diferentes correntes: formalista, substantivista, marxista e culturalista, e principais autores e debates entre as teorias da antropologia econômica."
  },
  {
    codigo: "SPO7040",
    nome: "Sociologia do Trabalho",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Problemas de conceituação e definição do objetivo da sociologia do trabalho. Relações de produção, de trabalho e de distribuição. Trabalho assalariado nos diversos setores da produção. Industrialização: processo de trabalho, tecnologia e automação. Emprego e desemprego. Trabalho material e imaterial. Mundialização do capital e os mundos do trabalho. Sindicato e movimentos sociais"
  },
  {
    codigo: "SPO7041",
    nome: "Sociologia das Organizações",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Racionalização e história: do modo de produção assiático ao \"capitalismo de organização\". organização e Sociedade: a crise do capitalismo; da teoria da administração à Psicologia das organizações e do comportamento burocrático: mediação ou dominação -organização com sistema social; organização como poder político. Exploração do trabalho, participacionismo, co-gestão operária e auto-gestão social, na sociedade contemporânea."
  },
  {
    codigo: "SPO7042",
    nome: "Sociologia do Desenvolvimento",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "As Ciências Sociais e a caracterização do desenvolvimento. Sociologia do Desenvolvimento: conceito e teorias. O desenvolvimento brasileiro e a acumulação monopolista. Atuação das classes e grupos sociais e o papel do Estado no Brasil."
  },
  {
    codigo: "SPO7043",
    nome: "Planejamento Social",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Antecedentes históricos do planejamento. Planejamento na concepção capitalista. Planejamento: conceito e limites. Aspectos metodológicos do planejamento geral e do Planejamento Social. Planejamento Social no Brasil, questões sociais, políticas, ideológicas e econômicas. Planos globais, regionais, setoriais. Prática de planejamento social"
  },
  {
    codigo: "SPO7046",
    nome: "Sociologia Econômica",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Análise sociológica dos fenômenos econômicos nos autores clássicos e contemporâneos: métodos e conceitos. Estado e regulação da economia. Análise da emergência da ideologia liberal. Ética e economia. A construção social do mercado"
  },
  {
    codigo: "SPO7047",
    nome: "Ciências Sociais e Sistema Financeiro",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Trabalho, Economia, Organizações",
    ementa: "Desenvolver capacidades teóricas e metodológicas para analisar o sistema financeiro contemporâneo a partir da perspectiva sociopolítica. Análise do sistema financeiro a partir da contribuição teórica e metodológica dos autores clássicos e contemporâneos das Ciências Sociais. Temas abordados: instituições financeiras contemporâneas, crédito e poder; as contribuições da Sociologia do Dinheiro; características e tendências do sistema financeiro brasileiro e internacional; capital financeiro e grupos econômicos; redes financeiras; organização política e corporativa do empresariado do setor; trabalhadores bancários; sistema financeiro e movimentos sociais; formas alternativas ( moeda social, cooperativas de crédito, finanças solidárias, bancos públicos entre outras"
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — POLÍTICA, ESTADO, PODER
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7019",
    nome: "Antropologia da Política",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Política, Estado, Poder",
    ementa: "As origens e fundamentos do poder político. Processos de formação dos sistemas políticos. Relações e poder e comportamento simbólico. Organização política em sociedades sem estado."
  },
  {
    codigo: "SPO7064",
    nome: "Relações Internacionais no Século XXI",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Paradigmas clássicos das relações internacionais. Novos atores e processos da política internacional das últimas décadas do século XX. Paz e Guerra no século XX e no início do século XXI. América Latina e Brasil no mundo contemporâneo (a política exterior brasileira). Hipóteses para pensar a formação da nova ordem internacional."
  },
  {
    codigo: "SPO7065",
    nome: "Instituições e Comportamento Político no",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Instituições políticas brasileiras: o sistema de governo presidencialista; o federalismo; o sistema eleitoral. Partidos e sistema partidário. Relações Executivo/Legislativo; comportamento legislativo. Cultura política e comportamento eleitoral no Brasil."
  },
  {
    codigo: "SPO7066",
    nome: "Pensamento Político Brasileiro",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Brasil História do pensamento político no Brasil nos períodos imperial e republicano. Correntes do pensamento político brasileiro (liberalismo, conservadorismo, autoritarismo, marxismo, desenvolvimentismo, nacionalismo etc.). Autores exemplares, tais como: Tavares Bastos, Visconde de Uruguai, Rui Barbosa, Alberto Torres, Oliveira Vianna, Azevedo Amaral, Alceu Amoroso Lima, Plínio Salgado, Sergio Buarque de Holanda, Caio Prado Júnior, Vitor Nunes Leal, Raymundo Faoro, Florestan Fernandes."
  },
  {
    codigo: "SPO7067",
    nome: "Política Brasileira: Teoria e História",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Bacharelado em Ciências Sociais Esboço das principais linhas explicativas da evolução histórica brasileira concernentes ao processo político e à organização institucional. Política, Ideologia e Cultura: bases para uma interpretação histórica do Brasil. A formação social brasileira, a organização política e a construção do Estado. Liberalismo, Autoritarismo e Conservadorismo na República Velha"
  },
  {
    codigo: "SPO7068",
    nome: "Política e Cultura",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Tópicos de investigação e questões de método. Conceitos, categorias e ressignificação. Relações entre pesquisa social e análise política: ênfase sobre o eixo política e cultura. Relações entre política e cultura na perspectiva do debate contemporâneo sobre as tensões entre história e realidade. Marxismo, marxismo cultural e estudos culturais: as relações entre política e cultura e a convergência entre agir humano, ser social e consciência social. Determinação, mediação e contradições: produção cultural; produção simbólica; horizonte político-ideológico; hegemonia, ideologia e base material. Teoria Crítica. Linguagem, mídia, e semiologia. Estudos de caso."
  },
  {
    codigo: "SPO7069",
    nome: "Abordagens e Problemas Contemporâneos",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Behaviorismo e pluralismo na Ciência política. A teoria da escolha racional e os problemas da ação coletiva e da escolha pública. O marxismo analítico. Realismo e realismo crítico. O neo-institucionalismo em suas diferentes vertentes. Introdução à teoria dos jogos aplicada à Ciência política."
  },
  {
    codigo: "SPO7070",
    nome: "Teoria e Método na História das Idéias",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "na Ciência Política Alternativas metodológicas para o estudo da história do pensamento político. Procedimentos interpretativos na formulação, análise e crítica da teoria política. Modelos analíticos para o estudo do papel das idéias nas instituições e processos políticos. Ideologia e ação política."
  },
  {
    codigo: "SPO7071",
    nome: "Estado e Políticas Públicas",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Políticas O conceito de Estado. Estado e sociedade no capitalismo contemporâneo. Democracia, descentralização e reforma do Estado. Estado e instituições. Estado e proteção social num mundo globalizado. Welfare State: emergência e declínio. Razões do Estadoprovidência e condições morais do Estado-prisonal. Políticas públicas, neo-institucionalismo e escolha racional. Novos bens públicos e as agências regulatórias. Federalismo e poder local. Políticas Públicas e Sociedade Civil. Movimentos sociais e esferas públicas de gestão."
  },
  {
    codigo: "SPO7072",
    nome: "Análise e Avaliação de Políticas Públicas",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "Política Públicas e Welfare State: o estado da arte do debate. Dimensões da racionalidade econômica, política e social no âmbito das políticas públicas. Modelos de gestão pública: planejamento público. Gestão participativa. Análise e formulação de políticas públicas: políticas setoriais, políticas temáticas, políticas emergentes e georeferenciadas. Análise e avaliação de políticas públicas: aspectos metodológicos e critérios políticos e sociológicos. Avaliação de políticas públicas: métodos quantitativos. Gastos públicos e indicadores sociais."
  },
  {
    codigo: "SPO7074",
    nome: "Estados, Partidos Políticos e Movimentos",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Política, Estado, Poder",
    ementa: "A passagem do estadoliberalao estado estado intervencionista. Funções de acumulação e legitimação do Estado. Os mecanismos de representação. Partidos e sistemas partidários. Movimentos sociais e movimentos populares."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — METODOLOGIA AVANÇADA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7044",
    nome: "Demografia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Metodologia Avançada",
    ementa: "Teoria da Origem, sua fundamentação e composição demográfica. Demografia como ciência e abordagem social. Leis Sociais e Demografia. Natalidade, Sexualidade, Nupcialidade e fertilidade. Demografia Urbana, sob a ótica diferencial dos grandes e pequenos aglomerados. Composição da População Brasileira e Mundial. Migrações na sua divisão: emigração, êxodo e desenvolvimento. Planejamento familiar: Igreja, Métodos e o Aborto. População e poder Político. Mortalidade Infantil, intermediária e Geral. População e acumulação do capital."
  },
  {
    codigo: "SPO7048",
    nome: "Práticas e Intervenções Sociológicas",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Metodologia Avançada",
    ementa: "A Sociologia como herdeira e geradora de práticas e intervenções. A estatística , o trabalho social e os movimentos sociais. Estudo de casos"
  },
  {
    codigo: "SPO7050",
    nome: "Laboratório de Observação Social",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Metodologia Avançada",
    ementa: "Definição e seleção de uma agenda de eventos locais e regionais; preparação dos alunos para participarem como observadores de eventos (ex. Seminários, congressos de categorias ou temáticos que tenham conteúdo político, sociológico ou cultural); organizar metodologias de observação, acompanhamento e análise do evento. Produção de relatório, seminário interno de avaliação do evento. Encaminhamento de relatório analítico aos promotores dos eventos."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — TÓPICOS ESPECIAIS EM ANTROPOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "ANT7029",
    nome: "Tópicos Especiais em Antropologia III",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Tópicos Especiais em Antropologia",
    ementa: "Estudo de temas específicos na Antropologia."
  },
  {
    codigo: "ANT7030",
    nome: "Tópicos Especiais em Antropologia IV",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Antropologia",
    campo_tematico: "Tópicos Especiais em Antropologia",
    ementa: "Estudo de temas específicos na Antropologia."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — TÓPICOS ESPECIAIS EM SOCIOLOGIA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7062",
    nome: "Tópicos Especiais em Sociologia X",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Tópicos Especiais em Sociologia",
    ementa: "Estudo de um tema específico e pertinente em Sociologia 72 4 72 4 72 4 72 4 72 4 72 4 72 4 72 4 72 4 72 4"
  },
  {
    codigo: "SPO7063",
    nome: "Debates Atuais em Sociologia",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: "Tópicos Especiais em Sociologia",
    ementa: "Estudo de um tema de interesse atual ou de demanda conjuntural."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — TÓPICOS ESPECIAIS EM CIÊNCIA POLÍTICA
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "SPO7075",
    nome: "Tópicos Especiais em Política I",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Sociais Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7076",
    nome: "Tópicos Especiais em Política II",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7077",
    nome: "Tópicos Especiais em Política III",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7078",
    nome: "Tópicos Especias em Política IV",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7079",
    nome: "Tópicos Especiais em Política V",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7080",
    nome: "Tópicos Especiais em Política VI",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7081",
    nome: "Tópicos Especiais em Política VII",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7082",
    nome: "Tópicos Especiais em Política VIII",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7083",
    nome: "Tópicos Especiais em Política IX",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },
  {
    codigo: "SPO7084",
    nome: "Tópicos Especiais em Política X",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Ciência Política",
    campo_tematico: "Tópicos Especiais em Ciência Política",
    ementa: "Estudo de um tema específico e pertinente em Política."
  },

  // ═══════════════════════════════════════════════════════════
  // OPTATIVAS — SEM CLASSIFICAÇÃO
  // ═══════════════════════════════════════════════════════════
  {
    codigo: "EED7149",
    nome: "Educação Especial na Educação Básica",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Licenciatura",
    campo_tematico: null,
    ementa: "-Introdução à educação especial: história, abordagens teóricas e terminologia. A política de educação especial. O trabalho pedagógico com os estudantes da educação especial na Educação Básica."
  },
  {
    codigo: "SPO5132",
    nome: "(ANT7101 eh SPO7102 eh",
    tipo: "Op",
    h_a: 72,
    semestre: null,
    area: "Sociologia",
    campo_tematico: null,
    ementa: "Disciplina Optativa II Ob 72 4"
  },
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
  "Educação, Juventude",
  "História, Antropologia Brasileira",
  "Metodologia Avançada",
  "Tópicos Especiais em Antropologia",
  "Tópicos Especiais em Sociologia",
  "Tópicos Especiais em Ciência Política"
];
