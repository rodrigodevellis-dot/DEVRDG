// Módulos de extração — gerados a partir de extrator-modular/modulo-*.json
// Cada módulo: { id, nome, descricao, icone, campo_json, sugestao_areas[], schema }

const MODULOS = [
  {
    id: "teorico",
    nome: "Teórico-Acadêmico",
    descricao: "Para textos que produzem, discutem ou revisam teoria",
    icone: "📖",
    campo_json: "teorico",
    sugestao_areas: ["Antropologia", "Sociologia", "Ciência Política", "Metodologia", "Transversal"],
    schema: {
      "teorico": {
        "type": "object",
        "properties": {
          "perspectiva_epistemologica": { "type": "string", "description": "Posição epistemológica do autor" },
          "tradicao_teorica": { "type": "string", "description": "Escola ou tradição de pensamento" },
          "contribuicao_teorica": {
            "type": "object",
            "properties": {
              "tipo": { "type": "string", "enum": ["nova_teoria", "extensao", "revisao_critica", "sintese", "refutacao", "traducao_entre_campos"] },
              "descricao": { "type": "string" },
              "lacuna_que_preenche": { "type": "string" }
            }
          },
          "debate_no_campo": {
            "type": "object",
            "properties": {
              "debate": { "type": "string" },
              "posicao_do_autor": { "type": "string" },
              "posicoes_adversarias": { "type": "array", "items": { "type": "object", "properties": { "posicao": { "type": "string" }, "representantes": { "type": "array", "items": { "type": "string" } }, "critica_do_autor": { "type": "string" } } } }
            }
          },
          "genealogia_conceitual": { "type": "array", "items": { "type": "object", "properties": { "conceito": { "type": "string" }, "origem": { "type": "string" }, "transformacoes": { "type": "string" } } } },
          "implicacoes": { "type": "object", "properties": { "para_teoria": { "type": "string" }, "para_pratica": { "type": "string" }, "para_pesquisa_futura": { "type": "string" } } },
          "agenda_futura": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  },
  {
    id: "empirico",
    nome: "Empírico",
    descricao: "Para textos que coletam e analisam dados empíricos",
    icone: "🔬",
    campo_json: "empirico",
    sugestao_areas: ["Metodologia", "Sociologia", "Antropologia"],
    schema: {
      "empirico": {
        "type": "object",
        "properties": {
          "problema_pesquisa": { "type": "string" },
          "perguntas_hipoteses": { "type": "array", "items": { "type": "string" } },
          "desenho_metodologico": { "type": "object", "properties": { "abordagem": { "type": "string", "enum": ["qualitativa", "quantitativa", "mista"] }, "metodo": { "type": "string" }, "justificativa_metodologica": { "type": "string" } } },
          "dados": { "type": "object", "properties": { "tipo": { "type": "string" }, "amostra": { "type": "string" }, "contexto": { "type": "string" }, "periodo": { "type": "string" } } },
          "analise": { "type": "object", "properties": { "tecnica": { "type": "string" }, "categorias": { "type": "array", "items": { "type": "string" } } } },
          "resultados": { "type": "object", "properties": { "achados_principais": { "type": "array", "items": { "type": "string" } }, "achados_inesperados": { "type": "array", "items": { "type": "string" } }, "dados_brutos_relevantes": { "type": "array", "items": { "type": "object", "properties": { "dado": { "type": "string" }, "significado": { "type": "string" } } } } } },
          "validade": { "type": "object", "properties": { "limitacoes_declaradas": { "type": "array", "items": { "type": "string" } }, "limitacoes_nao_declaradas": { "type": "array", "items": { "type": "string" } }, "generalizabilidade": { "type": "string" } } }
        }
      }
    }
  },
  {
    id: "etnografico",
    nome: "Etnográfico",
    descricao: "Para etnografias, relatos de campo e descrições de práticas sociais",
    icone: "🌍",
    campo_json: "etnografico",
    sugestao_areas: ["Antropologia"],
    schema: {
      "etnografico": {
        "type": "object",
        "properties": {
          "campo": { "type": "object", "properties": { "grupo_comunidade": { "type": "string" }, "localidade": { "type": "string" }, "periodo_campo": { "type": "string" }, "modo_insercao": { "type": "string" }, "condicoes_de_pesquisa": { "type": "string" } } },
          "praticas_observadas": { "type": "array", "items": { "type": "object", "properties": { "pratica": { "type": "string" }, "descricao_densa": { "type": "string" }, "agentes": { "type": "array", "items": { "type": "string" } }, "contexto_situacional": { "type": "string" }, "significado_atribuido": { "type": "object", "properties": { "pelos_sujeitos": { "type": "string" }, "pelo_pesquisador": { "type": "string" } } }, "materialidade": { "type": "array", "items": { "type": "string" } } } } },
          "categorias_nativas": { "type": "array", "items": { "type": "object", "properties": { "termo": { "type": "string" }, "significado_nativo": { "type": "string" }, "traducao_analitica": { "type": "string" }, "intraduzibilidade": { "type": "string" } } } },
          "cosmologia_ontologia": { "type": "object", "properties": { "principios_organizadores": { "type": "array", "items": { "type": "string" } }, "relacoes_nao_humanas": { "type": "array", "items": { "type": "string" } }, "temporalidade": { "type": "string" }, "espacialidade": { "type": "string" } } },
          "relacoes_de_poder": { "type": "object", "properties": { "hierarquias_internas": { "type": "array", "items": { "type": "string" } }, "relacao_com_estado_mercado": { "type": "string" }, "conflitos": { "type": "array", "items": { "type": "string" } } } },
          "posicao_do_etnografo": { "type": "object", "properties": { "como_percebido": { "type": "string" }, "efeitos_da_presenca": { "type": "string" }, "dilemas_eticos": { "type": "array", "items": { "type": "string" } }, "limites_do_acesso": { "type": "string" } } },
          "vozes_do_campo": { "type": "array", "items": { "type": "object", "properties": { "quem": { "type": "string" }, "fala": { "type": "string" }, "contexto": { "type": "string" }, "uso_analitico": { "type": "string" } } } }
        }
      }
    }
  },
  {
    id: "autoetnografico",
    nome: "Autoetnográfico",
    descricao: "Para textos em que o autor é simultaneamente sujeito e pesquisador",
    icone: "🪞",
    campo_json: "autoetnografico",
    sugestao_areas: ["Antropologia"],
    schema: {
      "autoetnografico": {
        "type": "object",
        "properties": {
          "posicionalidade": { "type": "object", "properties": { "marcadores_declarados": { "type": "array", "items": { "type": "string" } }, "marcadores_implicitos": { "type": "array", "items": { "type": "string" } }, "como_posicionalidade_afeta_analise": { "type": "string" } } },
          "experiencia_narrada": { "type": "array", "items": { "type": "object", "properties": { "experiencia": { "type": "string" }, "contexto": { "type": "string" }, "emocoes_registradas": { "type": "array", "items": { "type": "string" } }, "uso_analitico": { "type": "string" }, "grau_vulnerabilidade": { "type": "string" } } } },
          "movimento_eu_nos": { "type": "object", "properties": { "do_pessoal_ao_cultural": { "type": "string" }, "do_cultural_ao_pessoal": { "type": "string" }, "tensoes_nesse_transito": { "type": "array", "items": { "type": "string" } } } },
          "estrategias_de_escrita": { "type": "object", "properties": { "voz": { "type": "string" }, "temporalidade": { "type": "string" }, "recursos_narrativos": { "type": "array", "items": { "type": "string" } }, "relacao_com_leitor": { "type": "string" } } },
          "etica_da_autoexposicao": { "type": "object", "properties": { "outros_envolvidos": { "type": "array", "items": { "type": "string" } }, "estrategias_de_protecao": { "type": "array", "items": { "type": "string" } }, "dilemas_explicitos": { "type": "array", "items": { "type": "string" } } } },
          "legitimacao": { "type": "object", "properties": { "justificativa_epistemologica": { "type": "string" }, "criterios_de_validade": { "type": "string" }, "autores_metodologicos": { "type": "array", "items": { "type": "string" } } } }
        }
      }
    }
  },
  {
    id: "narrativa",
    nome: "Narrativa",
    descricao: "Para romance, conto, crônica, reportagem narrativa, narrativa etnográfica",
    icone: "📝",
    campo_json: "narrativa",
    sugestao_areas: [],
    schema: {
      "narrativa": {
        "type": "object",
        "properties": {
          "narrador": { "type": "object", "properties": { "tipo": { "type": "string" }, "posicao": { "type": "string" }, "tom": { "type": "string" }, "confiabilidade": { "type": "string" } } },
          "tempo": { "type": "object", "properties": { "tempo_da_historia": { "type": "string" }, "tempo_da_narracao": { "type": "string" }, "estrutura_temporal": { "type": "string" }, "recursos_temporais": { "type": "array", "items": { "type": "string" } } } },
          "espaco": { "type": "array", "items": { "type": "object", "properties": { "lugar": { "type": "string" }, "tipo": { "type": "string" }, "funcao_narrativa": { "type": "string" }, "atmosfera": { "type": "string" } } } },
          "enredo": { "type": "object", "properties": { "sinopse": { "type": "string" }, "conflito_central": { "type": "string" }, "pontos_de_virada": { "type": "array", "items": { "type": "string" } }, "desfecho": { "type": "string" }, "tipo_desfecho": { "type": "string" } } },
          "temas": { "type": "array", "items": { "type": "object", "properties": { "tema": { "type": "string" }, "como_se_manifesta": { "type": "string" } } } },
          "intertextualidade": { "type": "array", "items": { "type": "object", "properties": { "referencia": { "type": "string" }, "tipo": { "type": "string" }, "funcao": { "type": "string" } } } },
          "linguagem": { "type": "object", "properties": { "registro_predominante": { "type": "string" }, "recursos_estilisticos": { "type": "array", "items": { "type": "string" } }, "relacao_forma_conteudo": { "type": "string" } } }
        }
      }
    }
  },
  {
    id: "personagem",
    nome: "Personagens Literários",
    descricao: "Para estudo de personagens em textos literários",
    icone: "🎭",
    campo_json: "personagens",
    sugestao_areas: [],
    schema: {
      "personagens": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "nome": { "type": "string" },
            "funcao_narrativa": { "type": "string" },
            "caracterizacao": { "type": "object", "properties": { "direta": { "type": "array", "items": { "type": "string" } }, "indireta": { "type": "array", "items": { "type": "string" } }, "marcadores_sociais": { "type": "object", "properties": { "classe": { "type": "string" }, "genero": { "type": "string" }, "raca_etnia": { "type": "string" }, "idade": { "type": "string" }, "ocupacao": { "type": "string" } } } } },
            "voz": { "type": "object", "properties": { "registro_linguistico": { "type": "string" }, "marcas_discursivas": { "type": "array", "items": { "type": "string" } }, "exemplos": { "type": "array", "items": { "type": "string" } } } },
            "arco": { "type": "object", "properties": { "estado_inicial": { "type": "string" }, "eventos_transformadores": { "type": "array", "items": { "type": "string" } }, "estado_final": { "type": "string" }, "tipo_arco": { "type": "string" } } },
            "relacoes": { "type": "array", "items": { "type": "object", "properties": { "com_quem": { "type": "string" }, "tipo": { "type": "string" }, "dinamica": { "type": "string" } } } },
            "espacos": { "type": "array", "items": { "type": "object", "properties": { "espaco": { "type": "string" }, "significado": { "type": "string" } } } },
            "temas_encarnados": { "type": "array", "items": { "type": "string" } },
            "intertextualidade": { "type": "array", "items": { "type": "object", "properties": { "referencia": { "type": "string" }, "tipo": { "type": "string" } } } }
          }
        }
      },
      "sistema_de_personagens": {
        "type": "object",
        "properties": {
          "eixos_de_oposicao": { "type": "array", "items": { "type": "string" } },
          "hierarquia_narrativa": { "type": "string" },
          "ausencias_significativas": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  },
  {
    id: "poetico",
    nome: "Poético/Lírico",
    descricao: "Para análise de poesia e textos líricos",
    icone: "🎵",
    campo_json: "poetico",
    sugestao_areas: [],
    schema: {
      "poetico": {
        "type": "object",
        "properties": {
          "forma": { "type": "object", "properties": { "tipo_composicao": { "type": "string" }, "estrutura": { "type": "string" }, "metro": { "type": "string" }, "rima": { "type": "string" }, "forma_como_sentido": { "type": "string" } } },
          "sonoridade": { "type": "object", "properties": { "ritmo": { "type": "string" }, "recursos_fonicos": { "type": "array", "items": { "type": "string" } }, "relacao_som_sentido": { "type": "string" } } },
          "imagens": { "type": "array", "items": { "type": "object", "properties": { "imagem": { "type": "string" }, "tipo": { "type": "string" }, "campo_semantico": { "type": "string" }, "efeito": { "type": "string" } } } },
          "eu_lirico": { "type": "object", "properties": { "caracterizacao": { "type": "string" }, "posicao_enunciativa": { "type": "string" }, "interlocutor": { "type": "string" }, "tom_emocional": { "type": "string" }, "deslocamentos": { "type": "string" } } },
          "tematica": { "type": "object", "properties": { "temas": { "type": "array", "items": { "type": "string" } }, "tensoes": { "type": "array", "items": { "type": "string" } }, "nao_dito": { "type": "string" } } },
          "contexto_poetico": { "type": "object", "properties": { "movimento_geracao": { "type": "string" }, "dialogo_com_tradicao": { "type": "string" }, "projeto_poetico": { "type": "string" } } }
        }
      }
    }
  },
  {
    id: "jornalistico",
    nome: "Jornalístico",
    descricao: "Para notícias, reportagens, colunas, editoriais",
    icone: "📰",
    campo_json: "jornalistico",
    sugestao_areas: [],
    schema: {
      "jornalistico": {
        "type": "object",
        "properties": {
          "tipo_texto": { "type": "string" },
          "veiculo": { "type": "object", "properties": { "nome": { "type": "string" }, "tipo": { "type": "string" }, "linha_editorial": { "type": "string" }, "alcance": { "type": "string" } } },
          "enquadramento": { "type": "object", "properties": { "angulo": { "type": "string" }, "o_que_enfatiza": { "type": "array", "items": { "type": "string" } }, "o_que_omite_ou_minimiza": { "type": "array", "items": { "type": "string" } }, "metaforas_enquadradoras": { "type": "array", "items": { "type": "string" } }, "categorias_usadas": { "type": "array", "items": { "type": "string" } } } },
          "fontes": { "type": "array", "items": { "type": "object", "properties": { "quem": { "type": "string" }, "tipo_fonte": { "type": "string" }, "o_que_diz": { "type": "string" }, "como_apresentada": { "type": "string" } } } },
          "vozes_ausentes": { "type": "array", "items": { "type": "string" } },
          "contextualizacao": { "type": "object", "properties": { "historico_fornecido": { "type": "string" }, "historico_ausente": { "type": "string" }, "dados_apresentados": { "type": "array", "items": { "type": "string" } } } },
          "agenda": { "type": "object", "properties": { "tema_da_agenda": { "type": "string" }, "posicao_no_ciclo": { "type": "string" }, "relacao_com_poder": { "type": "string" } } }
        }
      }
    }
  }
];

// Pré-processador: prompt de análise de domínio (etapa opcional antes da extração)
const PRE_PROCESSADOR = {
  id: "pre_processador",
  nome: "Pré-Processador de Domínio",
  descricao: "Analisa a estrutura argumentativa do texto ANTES da extração para calibrar o pipeline",
  prompt: `Você analisa a estrutura argumentativa de textos acadêmicos. Sua saída será usada para configurar um pipeline de extração de dados. Você NÃO resume o texto. Você mapeia sua arquitetura lógica.

## Entrada
<DOCUMENTO></DOCUMENTO>.

## Instruções de Análise

Produza um relatório com EXATAMENTE estas 4 seções, nesta ordem:

### 1. DOMÍNIO
- Área primária (ex: Sociologia do Conhecimento, Epidemiologia).
- Subárea, se identificável.
- Se o texto for interdisciplinar, liste as áreas envolvidas e indique qual é dominante.

### 2. ANTAGONISMO
Responda cada sub-item:
  a) Autores, escolas ou teses EXPLICITAMENTE criticados. Cite o trecho entre aspas.
  b) Pressupostos IMPLÍCITOS que o autor rejeita, mesmo sem nomear adversário. Justifique a inferência.
  c) Se nenhum antagonismo for identificável, declare: "ANTAGONISMO: NÃO DETECTADO — Texto não-polêmico."

### 3. DICIONÁRIO NUCLEAR
- Liste termos que o autor DEFINE explicitamente OU usa com sentido DIFERENTE do uso corrente na área.
- Para cada termo, forneça:
    - Termo: [nome]
    - Tipo: [DEFINIÇÃO ORIGINAL] ou [RE-SIGNIFICAÇÃO]
    - Sentido no texto: [descrição]
    - Se RE-SIGNIFICAÇÃO: Sentido corrente na área: [descrição]
- NÃO há mínimo nem máximo de termos. Se o texto não contém termos nucleares, declare: "DICIONÁRIO: VAZIO — Terminologia padrão da área."

### 4. CLASSIFICAÇÃO DE COMPLEXIDADE
Preencha cada campo:
  - Estrutura dominante: [DESCRITIVO | ARGUMENTATIVO | DIALÉTICO | HÍBRIDO]
  - Se HÍBRIDO: descreva a distribuição.
  - Densidade conceitual: [BAIXA | ALTA] — Justifique em uma frase.
  - Risco de extração: [BAIXO | ALTO] — BAIXO se afirmações são explícitas. ALTO se teses centrais requerem inferência.

## Restrições
- NÃO resuma o conteúdo do texto.
- NÃO adicione interpretações que não possam ser rastreadas até um trecho específico.
- Se uma seção não puder ser preenchida com confiança, declare explicitamente: "INCERTO — [motivo]".
- Formato de saída: Gere APENAS um objeto JSON válido, sem crase ou markdown de código, seguindo este schema:

{
  "analise_dominio": {
    "area_primaria": "string",
    "interdisciplinaridade": ["string"]
  },
  "mapeamento_antagonismo": {
    "inimigos_explicitos": [
      {"alvo": "string", "citacao_prova": "string"}
    ],
    "pressupostos_rejeitados": [
      {"pressuposto": "string", "justificativa": "string"}
    ],
    "status": "DETECTADO | NAO_DETECTADO"
  },
  "dicionario_nuclear": [
    {
      "termo": "string",
      "tipo": "DEFINICAO_ORIGINAL | RESIGNIFICACAO",
      "sentido_no_texto": "string",
      "alerta_de_uso": "string"
    }
  ],
  "complexidade_e_risco": {
    "estrutura": "DESCRITIVO | DIALETICO",
    "densidade": "BAIXA | ALTA",
    "risco_extracao": "BAIXO | ALTO",
    "recomendacao_persona": "string"
  }
}`
};
