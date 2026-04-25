# Especificação técnica — sistema de análise de dispositivos

**Documento destinado a uso com OpenAI Codex (GPT-5.4 / GPT-5.5, abril 2026).**
**Idioma deste documento:** português para a discussão das decisões; inglês nos blocos de tarefa endereçados a Codex (`### Codex Task`), porque Codex performa melhor com prompts em inglês para geração de código.

---

## 0. Como este documento se usa com Codex

Este documento é um híbrido: especificação técnica que você lê e *playbook* de tarefas que você submete a Codex. O fluxo recomendado:

1. **Leitura humana**: ler §§1–5 (decisões arquiteturais e de stack) antes de envolver Codex.
2. **Setup inicial**: a tarefa `T-00` cria o repositório com a estrutura especificada. Submeter manualmente ou via Codex Cloud.
3. **Tarefas paralelizáveis**: tarefas `T-01` a `T-07` são modulares; várias podem rodar em paralelo no Codex desktop ou Cloud.
4. **Tarefas dependentes**: tarefas `T-08` em diante dependem de tarefas anteriores. Não submeter antes do *merge*.
5. **Tarefas que exigem decisão humana**: `T-09` (camada 5, reflexividade) é deliberadamente subdescrita; Codex pode produzir esqueleto, mas o conteúdo da camada precisa de design seu.

**Modelo recomendado**: GPT-5.5 ou GPT-5.4 com janela de contexto de 1M para tarefas com muitos arquivos relacionados (ex.: T-04, T-06). Tarefas mais simples (T-01, T-02) funcionam com GPT-5.4-mini.

**Sandbox**: para tarefas que envolvem download de modelos ML ou *scrapers*, configurar acesso a *package managers* + *full internet* conforme necessário. Para o resto, *package managers only* basta.

**Plugins/Skills**: este documento não usa o formato `.codex-plugin/`; é diretamente um conjunto de prompts. Caso queira convertê-lo em plugin reutilizável, ver §11.

---

## 1. Decisões arquiteturais fixadas

Estas decisões correspondem à arquitetura conceitual proposta anteriormente. Marco com 🔒 as decisões fechadas e com 🔄 as que recomendo manter revisáveis.

### 1.1 Stack 🔒

- **Linguagem principal**: Python 3.12+
- **Banco relacional + JSONB**: PostgreSQL 17 (`jsonb` para metadados heterogêneos)
- **Camada de grafo**: Apache AGE 1.5+ (extensão PostgreSQL que adiciona Cypher) — escolha que mantém um único banco em vez de Neo4j separado; reduz complexidade operacional
- **NLP**: spaCy 3.7+ (PT-BR e EN) + Hugging Face Transformers para extração de relações
- **LLM para suporte interpretativo**: API agnóstica (suporte a OpenAI, Anthropic, e modelos locais via vLLM); abstração via biblioteca `litellm` ou similar
- **API web**: FastAPI 0.110+
- **ORM**: SQLAlchemy 2.0+ (com suporte a AGE via raw SQL para *queries* Cypher)
- **Validação**: Pydantic 2.x
- **Testes**: pytest + hypothesis (property-based testing para invariantes do grafo)
- **Containerização**: Docker + Docker Compose (Postgres+AGE, app, opcional: Neo4j Browser para *debugging* de Cypher)
- **Frontend**: deferido. Para protótipo, Streamlit. Para produção, React + Cytoscape.js (decidir em fase 2).

### 1.2 Modelo de versionamento de dados 🔒

- **Bitemporalidade**: cada nó e cada aresta tem `valid_from` / `valid_to` (tempo modelado) e `recorded_at` / `superseded_at` (tempo de registro). Não usar *triggers* mágicos; o domínio decide quando uma relação muda.
- **Imutabilidade de fontes (Camada 1)**: documentos ingeridos nunca são editados; correções produzem nova versão com referência à anterior.
- **Mutabilidade interpretativa (Camadas 2–5)**: tipagens, anotações e relações são revisáveis, sempre com histórico.

### 1.3 Posições mantidas explicitamente revisáveis 🔄

- Tipologia das relações na Camada 3 (lista da §3.2 do documento conceitual). Implementar como tabela enumerável em DB, **não** como `enum` Python rígido — o pesquisador deve poder adicionar tipos sem migração.
- Tipologia dos elementos na Camada 2 (idem).
- Critérios do detector de hipertotalização na Camada 5. Implementar como regras configuráveis, não como código.
- Decisão sobre suporte a português + inglês simultâneo nas pipelines de NLP: começar com PT-BR; estender depois.

### 1.4 Decisões deliberadamente **não** tomadas 🔄

- Frontend definitivo (ver §1.1).
- Estratégia de autenticação multi-usuário (começar single-user; ver §10).
- Hospedagem (local / cloud / on-prem universitário). Especificação assume execução local.
- Modelo de licenciamento. Ver §10.

---

## 2. Estrutura do repositório

```
dispositivo-analyzer/
├── README.md
├── ARCHITECTURE.md              # cópia/link do documento conceitual
├── SPEC.md                      # este documento
├── pyproject.toml
├── docker-compose.yml
├── .env.example
├── alembic.ini
├── migrations/                  # Alembic migrations
│   └── versions/
├── src/
│   └── dispositivo/
│       ├── __init__.py
│       ├── config.py            # configuração via Pydantic Settings
│       ├── db/
│       │   ├── __init__.py
│       │   ├── session.py       # SQLAlchemy session
│       │   ├── models/          # ORM models (camadas 1 e 2)
│       │   └── graph.py         # wrapper para queries Cypher via AGE
│       ├── ingestion/           # camada 1
│       │   ├── __init__.py
│       │   ├── pipeline.py
│       │   ├── extractors/      # PDF, DOCX, HTML, TXT, planilhas
│       │   └── provenance.py
│       ├── representation/      # camada 2
│       │   ├── __init__.py
│       │   ├── element_types.py
│       │   ├── annotation.py
│       │   └── silences.py      # tipos de não-dito
│       ├── network/             # camada 3
│       │   ├── __init__.py
│       │   ├── relation_types.py
│       │   ├── builder.py
│       │   └── temporal.py
│       ├── analysis/            # camada 4
│       │   ├── __init__.py
│       │   ├── genealogical.py
│       │   ├── strategic.py
│       │   ├── remplissement.py
│       │   └── comparison.py
│       ├── reflexivity/         # camada 5
│       │   ├── __init__.py
│       │   ├── tensions.py
│       │   ├── overreach_detector.py
│       │   └── interpretation_log.py
│       ├── transversal/
│       │   ├── __init__.py
│       │   ├── power_knowledge.py
│       │   ├── subjectivity.py
│       │   ├── strategy_no_subject.py
│       │   ├── resistance.py
│       │   └── translation.py   # apparatus/deployment/etc.
│       ├── llm/
│       │   ├── __init__.py
│       │   ├── client.py        # litellm wrapper
│       │   └── prompts/         # prompts foucaultianamente informados
│       └── api/
│           ├── __init__.py
│           ├── main.py          # FastAPI app
│           └── routers/
├── tests/
│   ├── conftest.py
│   ├── unit/
│   ├── integration/
│   └── fixtures/                # corpus mínimo para testes
├── scripts/
│   ├── seed_dev.py
│   └── analyze_corpus.py        # CLI para análise via terminal
└── docs/
    ├── ontology.md              # tipologia de elementos e relações
    ├── codex-tasks/             # cópias dos prompts Codex usados
    └── adrs/                    # Architecture Decision Records
```

---

## 3. Modelo de dados (esquemas centrais)

### 3.1 Esquema relacional (PostgreSQL)

```sql
-- Camada 1: documentos ingeridos (imutáveis)
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    source_uri TEXT NOT NULL,
    document_type TEXT NOT NULL,           -- lei, protocolo, transcrição, planta, etc.
    content_text TEXT,                      -- texto extraído (pode ser NULL p/ visual)
    content_blob BYTEA,                     -- binário original
    content_hash TEXT NOT NULL UNIQUE,
    metadata JSONB NOT NULL DEFAULT '{}',
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Camada 2: elementos (interpretação tipificada de fontes)
CREATE TABLE elements (
    id UUID PRIMARY KEY,
    element_type TEXT NOT NULL              -- discurso, instituição, arranjo_arquitetônico, etc.
        REFERENCES element_types(name),
    label TEXT NOT NULL,
    description TEXT,
    source_document_id UUID REFERENCES documents(id),
    source_locator JSONB,                   -- página, parágrafo, coordenadas, etc.
    valid_from DATE,
    valid_to DATE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    superseded_at TIMESTAMPTZ,
    superseded_by UUID REFERENCES elements(id),
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE element_types (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    is_silence BOOLEAN NOT NULL DEFAULT false,    -- categorias de não-dito
    schema JSONB                                   -- JSON Schema para metadata
);

-- Tipos de não-dito (subset de element_types)
-- Populados por seed: silencio_referido, lacuna_serial, recusa_explicita, ausencia_sintomatica

-- Camada 3: dispositivos (redes nomeadas)
CREATE TABLE dispositifs (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    historical_urgency TEXT,                -- texto livre — interpretativo
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'
);

-- Relações tipificadas (arestas) entre elementos, sempre dentro de um dispositivo
CREATE TABLE relations (
    id UUID PRIMARY KEY,
    dispositif_id UUID NOT NULL REFERENCES dispositifs(id),
    source_element_id UUID NOT NULL REFERENCES elements(id),
    target_element_id UUID NOT NULL REFERENCES elements(id),
    relation_type TEXT NOT NULL REFERENCES relation_types(name),
    valid_from DATE,
    valid_to DATE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    superseded_at TIMESTAMPTZ,
    superseded_by UUID REFERENCES relations(id),
    interpreter_id UUID,                    -- quem fez a interpretação
    justification TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE relation_types (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    is_directional BOOLEAN NOT NULL DEFAULT true,
    requires_justification BOOLEAN NOT NULL DEFAULT false
);

-- Seed inicial (revisável):
-- programa_de, justificacao_post_hoc_de, obstaculo_a, resposta_a_urgencia,
-- suporte_material_para, sobredeterminacao, remplissement,
-- producao_de_sujeito, circulacao_de_saber, exclusao

-- Camada 4–5: registro de interpretações
CREATE TABLE interpretations (
    id UUID PRIMARY KEY,
    dispositif_id UUID REFERENCES dispositifs(id),
    interpreter_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    interpretation_type TEXT NOT NULL,      -- urgency_attribution, strategic_unity, remplissement_event, etc.
    content JSONB NOT NULL,
    superseded_by UUID REFERENCES interpretations(id),
    notes TEXT
);

-- Camada 5: alertas reflexivos
CREATE TABLE reflexive_alerts (
    id UUID PRIMARY KEY,
    dispositif_id UUID NOT NULL REFERENCES dispositifs(id),
    alert_type TEXT NOT NULL,               -- hypertotalization, tension_collapsed, overreduction, etc.
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    context JSONB NOT NULL,
    acknowledged BOOLEAN NOT NULL DEFAULT false,
    acknowledged_by UUID,
    response TEXT
);
```

### 3.2 Camada de grafo (AGE)

Para *queries* topológicas (caminhos entre elementos, *clustering* para detecção de unidades estratégicas, centralidade), espelhar `elements` e `relations` num grafo AGE:

```cypher
-- Setup do grafo (executar uma vez)
SELECT create_graph('dispositif_graph');

-- Sincronização: trigger ou view materializada que reflete elements/relations no grafo
-- (decidir entre sincronia em tempo real via trigger vs. batch noturno)
```

Decisão: **batch periódico**, não trigger. Mais robusto, debugável.

---

## 4. APIs e contratos

### 4.1 Endpoints principais (FastAPI)

```
POST   /documents                      ingere documento
GET    /documents/{id}
GET    /documents?type=...&date=...

POST   /elements                       cria elemento (tipificação interpretativa)
PATCH  /elements/{id}                  versiona elemento (sem deletar histórico)
GET    /elements?type=...

POST   /dispositifs                    cria dispositivo (rede nomeada)
GET    /dispositifs/{id}
GET    /dispositifs/{id}/network       retorna grafo (nodes + edges)

POST   /dispositifs/{id}/relations     adiciona relação tipificada
PATCH  /relations/{id}                 versiona relação

POST   /dispositifs/{id}/analysis/genealogy
POST   /dispositifs/{id}/analysis/strategic-units
POST   /dispositifs/{id}/analysis/remplissement
POST   /dispositifs/{id}/compare/{other_id}

GET    /dispositifs/{id}/alerts        alertas reflexivos
POST   /alerts/{id}/acknowledge

GET    /translations/lookup?term=apparatus
```

### 4.2 Convenção de erros

- 4xx para entrada inválida com `detail` em formato Pydantic.
- 422 para violações de invariante (ex.: relação tipificada como `requires_justification=true` sem `justification`).
- 5xx para falhas internas — sempre logar com `interpretation_id` se aplicável.

---

## 5. Considerações de segurança e ética computacional

- **Documentos podem conter dados sensíveis** (transcrições clínicas, dados de menores). Esquema de pseudonimização opcional na ingestão; *flag* `contains_sensitive_data` em `documents.metadata`.
- **LLMs externos**: enviar conteúdo de documentos a APIs externas (OpenAI, Anthropic) **só** se *flag* `allow_external_llm` = true no documento. Default: false. Modelos locais via vLLM/Ollama como alternativa.
- **Auditoria**: tabela `interpretations` é *append-only* — registra cada decisão analítica com seu autor e timestamp. Indispensável para trabalho acadêmico publicável.

---

## 6. Tarefas Codex

A partir daqui, as tarefas estão em inglês para uso direto com Codex. Cada tarefa tem: objetivo, entradas, critérios de aceitação, testes esperados.

### Codex Task T-00: Repository scaffolding

**Goal:** Initialize the repository structure described in §2 of `SPEC.md`. Create all directories with empty `__init__.py` files. Set up `pyproject.toml` with the dependencies listed in §1.1. Configure Docker Compose with PostgreSQL 17 + Apache AGE 1.5. Set up Alembic. Add a basic `pytest` configuration. Create `.env.example` with required variables (`DATABASE_URL`, `LLM_PROVIDER`, `LLM_API_KEY`, etc.).

**Acceptance criteria:**
- `docker-compose up` starts a Postgres+AGE container that accepts connections.
- `alembic upgrade head` succeeds on a fresh database (no migrations yet — just the framework).
- `pytest` runs (no tests yet — just the framework).
- `pip install -e .` installs the package without errors.

**Do not:** Implement any business logic. This task is pure scaffolding.

---

### Codex Task T-01: Database schema and migrations (Camadas 1, 2, 3)

**Goal:** Implement the SQLAlchemy models and Alembic migrations corresponding to the schemas in §3.1 of `SPEC.md`. Tables: `documents`, `element_types`, `elements`, `dispositifs`, `relation_types`, `relations`, `interpretations`, `reflexive_alerts`. Add a seed script that populates `element_types` and `relation_types` with the initial taxonomies (see lists in §3.1 comments).

**Acceptance criteria:**
- All tables created via `alembic upgrade head`.
- Seed script populates initial element types (10 types from Foucault's 1977 list + 4 silence types) and relation types (10 types from the conceptual document).
- Property-based tests (using `hypothesis`) verify bitemporal invariants: a versioned record always has `valid_from <= valid_to` and `recorded_at <= superseded_at`.
- All FK constraints enforced.

**Files to create:**
- `src/dispositivo/db/models/*.py` (one file per logical group)
- `migrations/versions/0001_initial_schema.py`
- `scripts/seed_taxonomies.py`
- `tests/unit/test_db_models.py`

---

### Codex Task T-02: Document ingestion pipeline (Camada 1)

**Goal:** Implement document ingestion supporting at minimum: PDF (text + OCR via `pytesseract` if needed), DOCX (`python-docx`), HTML (`beautifulsoup4`), TXT, EPUB (`ebooklib`). The pipeline must compute SHA-256 of content for deduplication, extract text where possible, store the original blob, and populate `documents` table with provenance metadata.

**Acceptance criteria:**
- A CLI command `dispositivo ingest <path>` ingests a file and returns its UUID.
- Same file ingested twice returns the existing UUID (deduplication via `content_hash`).
- Metadata extraction: title, language detection (using `langdetect`), document type guessed from extension + content heuristics (user-overridable).
- Failures are logged with file path, never silently dropped.
- Tests cover at least one fixture per supported format. Place fixtures under `tests/fixtures/documents/`.

**Files to create:**
- `src/dispositivo/ingestion/pipeline.py`
- `src/dispositivo/ingestion/extractors/{pdf,docx,html,txt,epub}.py`
- `src/dispositivo/ingestion/provenance.py`
- `tests/unit/test_ingestion.py`
- `tests/integration/test_ingestion_e2e.py`

**Do not:** Run NLP analysis at ingestion time. Ingestion is dumb on purpose; analysis happens later.

---

### Codex Task T-03: Element typing API (Camada 2)

**Goal:** Implement the FastAPI endpoints for element creation and versioning (POST/PATCH/GET on `/elements`). Elements are interpretive tags attached to documents (or fragments of documents). An element references `source_document_id` plus `source_locator` (page range, paragraph indices, span). Implement Pydantic schemas with strict validation against `element_types` table.

**Acceptance criteria:**
- POST creates element, validates `element_type` against table.
- PATCH creates a new version with FK to predecessor; predecessor's `superseded_at` is set.
- GET supports filtering by type, document, validity period.
- Endpoint to list silence-type elements separately (`GET /elements/silences?type=...`).
- OpenAPI spec is generated correctly.
- Tests cover: happy path, invalid type, versioning, idempotency.

**Files to create:**
- `src/dispositivo/api/routers/elements.py`
- `src/dispositivo/representation/{element_types,annotation,silences}.py`
- `tests/unit/test_elements_api.py`

---

### Codex Task T-04: Network builder and graph sync (Camada 3)

**Goal:** Implement creation, versioning, and querying of `dispositifs` and `relations`. Implement a batch synchronization job (`scripts/sync_graph.py`) that takes the relational data and rebuilds the AGE graph. The graph must reflect bitemporality: querying as of a specific date returns only relations valid then.

**Acceptance criteria:**
- POST `/dispositifs` and POST `/dispositifs/{id}/relations` work as specified.
- Sync script populates the AGE graph correctly. Verify with a Cypher query that returns expected nodes/edges.
- A sample query (provided in tests) computes shortest path between two elements within a dispositif.
- Bitemporal slice query: given a `as_of` date, returns the network as it was understood at that time.
- Tests use a fixture network described in `tests/fixtures/dispositivo_minimo.yaml`.

**Files to create:**
- `src/dispositivo/network/{relation_types,builder,temporal}.py`
- `src/dispositivo/db/graph.py`
- `src/dispositivo/api/routers/dispositifs.py`
- `scripts/sync_graph.py`
- `tests/integration/test_network.py`
- `tests/fixtures/dispositivo_minimo.yaml`

---

### Codex Task T-05: Genealogical and strategic analysis (Camada 4, parts)

**Goal:** Implement four analyses, each as a separate function and an API endpoint:
1. **Genealogical trace**: from an element, traverse `programa_de` and `resposta_a_urgencia` edges backward to find historical antecedents.
2. **Strategic unit detection**: cluster densely connected subgraphs using Louvain community detection (`networkx` or `python-louvain`); return clusters as candidates for strategic units, ranked by intra-cluster density.
3. **Remplissement detector**: identify elements whose `relation_type` distribution at `t1` differs significantly from their distribution at `t2 > t1`. "Significantly" = at least one outgoing relation type changed AND at least one new strategic context (different cluster) is reached.
4. **Comparison**: given two dispositifs A and B, return: shared elements, elements unique to each, relations of type `producao_de_sujeito` in each, and crossing-points (elements participating in both).

**Acceptance criteria:**
- Each function has a unit test against a known fixture.
- API endpoints documented and return JSON with stable schemas.
- Performance: for a graph of 10k nodes, all analyses complete in under 30 seconds on a single machine.

**Files to create:**
- `src/dispositivo/analysis/{genealogical,strategic,remplissement,comparison}.py`
- `src/dispositivo/api/routers/analysis.py`
- `tests/unit/test_analysis_*.py`

**Caveat (do not implement, only flag):** Strategic unit *interpretation* is human work. The system proposes clusters; it does not decide that a cluster is a strategic unit. The endpoint must return clusters with a clear `is_proposal: true` flag and not write `interpretations` records automatically.

---

### Codex Task T-06: Translation module

**Goal:** Implement a lookup service that, given a term, returns probable correspondences in the `dispositif`-translation lexicon. Lexicon stored in YAML at `src/dispositivo/transversal/translation_lexicon.yaml`. Initial entries: `apparatus`, `deployment`, `device`, `mechanism`, `aparato`, `aparelho` → `dispositif/dispositivo` with confidence scores and contextual notes.

When ingesting English documents (T-02 extension), automatically scan for these terms and create `silence_referido` or `translation_signal` annotation elements (decision: which type — leave configurable).

**Acceptance criteria:**
- `GET /translations/lookup?term=apparatus` returns the entry with notes.
- Document ingestion in English flags occurrences with character offsets.
- Tests use a fixture document that mixes `apparatus` and `deployment`.

**Files to create:**
- `src/dispositivo/transversal/translation.py`
- `src/dispositivo/transversal/translation_lexicon.yaml`
- `tests/unit/test_translation.py`

---

### Codex Task T-07: Transversal modules — minimal scaffolding

**Goal:** Create the four transversal module files (`power_knowledge.py`, `subjectivity.py`, `strategy_no_subject.py`, `resistance.py`) with their function signatures, docstrings citing the relevant Foucauldian source, and a `NotImplementedError` body. Each module also gets a router stub at `src/dispositivo/api/routers/transversal.py`.

The reason: these modules require interpretive judgment that should not be automated. Codex creates the scaffolding; the human researcher (you) implements the logic.

**Acceptance criteria:**
- Each module has documented signatures matching the analysis types described in §7 of `ARCHITECTURE.md`.
- Routers return 501 Not Implemented for now.
- Test stubs exist that will be filled in later.

**Files to create:**
- Files listed above.

**Important:** Do not invent implementations. Honest stubs are better than confident wrong code.

---

### Codex Task T-08: Reflexivity layer — alerts framework

**Goal:** Implement a rule-based alert framework that fires `reflexive_alerts` when interpretations match patterns indicating reductive readings. Rules are stored in `src/dispositivo/reflexivity/rules.yaml` and evaluated at every interpretation creation event.

Initial rules (revisable):
- `R-01`: if an interpretation attributes intentionality to a `dispositif` itself (e.g., field `agent_attributed_to_dispositif: true`), fire `hypertotalization` alert.
- `R-02`: if an interpretation marks a tension as resolved (via flag), fire `tension_collapsed` alert.
- `R-03`: if a `dispositif` has zero relations of type `obstaculo_a` or `producao_de_sujeito`, fire `incomplete_dispositif` alert (the system is being underused).

**Acceptance criteria:**
- Rules engine evaluates on every `POST /interpretations` and creates alerts as needed.
- Alerts can be acknowledged via `POST /alerts/{id}/acknowledge` with mandatory `response` text.
- Tests cover each rule: trigger and non-trigger cases.

**Files to create:**
- `src/dispositivo/reflexivity/{tensions,overreach_detector,interpretation_log}.py`
- `src/dispositivo/reflexivity/rules.yaml`
- `tests/unit/test_reflexivity.py`

---

### Codex Task T-09 (HUMAN-LED, NOT FOR CODEX)

This task is intentionally not delegated. The reflexivity layer needs human design for:
- The exact phrasing of alert messages (they speak to the researcher; tone matters).
- The decision about which tensions are detectable from data and which require dialogic prompting.
- The genealogy of interpretations (a Foucauldian researcher is genealogizing their own analytical history; this is recursive in a way Codex shouldn't attempt unsupervised).

If you (the researcher) want Codex's help here, use it for *scaffolding only* — to draft a structure that you then heavily rewrite. Do **not** submit T-09 as a Codex task with the same level of automation as T-01 to T-08.

---

### Codex Task T-10: Streamlit prototype UI

**Goal:** Build a minimal Streamlit app that lets a researcher: ingest documents, browse elements, build a dispositif by selecting elements and adding typed relations, run analyses (T-05), and view alerts. This is a prototype, not production UI.

**Acceptance criteria:**
- Five pages: Documents, Elements, Dispositifs, Analysis, Alerts.
- Cytoscape integration via `streamlit-agraph` or `pyvis` for graph viz.
- Hot reload works.
- Walks an end-to-end demo using `tests/fixtures/dispositivo_minimo.yaml`.

**Files to create:**
- `src/dispositivo/ui/streamlit_app.py`
- Page modules under `src/dispositivo/ui/pages/`.

---

## 7. Convenções para Codex

Quando submeter qualquer das tarefas acima, incluir como contexto adicional ao Codex:

```
Project context: Foucauldian dispositif analysis system. Read SPEC.md and ARCHITECTURE.md before implementing.

Code conventions:
- Type hints everywhere; mypy --strict must pass.
- Docstrings in Google style. Module docstrings cite the relevant Foucauldian source where applicable (e.g., "Camada 1: Vigiar e Punir, "A Mitigação das Penas"").
- All public functions have unit tests.
- No silent failures; log with structured logging (structlog).
- Naming: Portuguese for domain terms (dispositif → dispositivo), English for technical infrastructure (database, session, etc.).

Commit format: Conventional Commits (feat/fix/refactor/test/docs).

When in doubt about Foucauldian fidelity: stop and ask. Do not invent definitions.
```

Inserir este bloco no campo de contexto persistente do Codex (memória de projeto) para que apareça em todas as tarefas.

---

## 8. Quais partes recomendo *não* delegar a Codex

Resumo explícito:

| Componente | Codex? | Razão |
|---|---|---|
| Scaffolding, DB schemas, ingestão, APIs CRUD (T-00 a T-04) | Sim | Padrões claros; testáveis. |
| Análises algorítmicas (T-05) | Sim, com cuidado | Usa libs estabelecidas; mas o significado dos *clusters* é interpretativo. |
| Tradução (T-06) | Sim | Léxico fixo; lookup mecânico. |
| Stubs transversais (T-07) | Sim, **só stubs** | Implementação requer julgamento foucaultiano. |
| Framework de alertas (T-08) | Sim | Estrutura mecânica; regras revisáveis. |
| Conteúdo dos alertas, redação reflexiva (T-09) | **Não** | Tom, fraseado e dialogicidade são parte da fidelidade conceitual. |
| Tipologia de elementos e relações | Não | Decisão analítica que se quer manter aberta. |
| UI prototype (T-10) | Sim | Convencional. UI definitiva depois. |

---

## 9. Roteiro de execução sugerido

**Semana 1**: T-00, T-01 (paralelos com revisão humana entre eles).
**Semana 2**: T-02, T-03, T-06 (paralelos).
**Semana 3**: T-04 (depende de T-01, T-03).
**Semana 4**: T-05, T-07 (paralelos), T-10.
**Semana 5**: T-08.
**Semana 6+**: T-09 (humano), refinamento, testes em corpus real.

Em paralelo, do início, fazer o caminho 2 que recomendei antes — testar a arquitetura *manualmente* contra três a cinco documentos do seu corpus. Isso revela problemas de modelagem antes que estejam codificados.

---

## 10. Decisões deferidas

Ficam para depois da implementação básica:

- **Multi-usuário e auth**: começar single-user (o pesquisador). Adicionar `keycloak` ou `authlib` quando necessário.
- **Cloud / on-prem**: depende de onde a tese é institucionalmente alojada. Decidir antes de armazenar dados sensíveis reais.
- **Licenciamento**: AGPL-3.0 recomendado para projeto acadêmico (preserva abertura), mas confirmar com a instituição.
- **Internacionalização**: começar PT-BR, adicionar EN quando o sistema for usado por co-autores.
- **Frontend definitivo**: avaliar React + Cytoscape.js após o Streamlit cumprir seu papel de protótipo.

---

## 11. Conversão em plugin Codex (opcional)

Caso queira transformar este projeto num plugin Codex reutilizável, criar `.codex-plugin/plugin.json`:

```json
{
  "name": "dispositivo-analyzer",
  "version": "0.1.0",
  "description": "Foucauldian dispositif analysis system",
  "skills": [
    "skills/ingest-document",
    "skills/build-network",
    "skills/run-analysis"
  ],
  "mcp": ".mcp.json"
}
```

Cada *skill* é uma pasta com um `SKILL.md` que descreve quando ela é acionada e o que faz. Útil se a equipe se expandir e múltiplos pesquisadores quiserem invocar Codex sem repetir prompts.

---

## 12. Avisos finais

**Reiterando a posição honesta declarada no documento conceitual**: este sistema é, ele mesmo, um dispositivo. Sua arquitetura embute decisões interpretativas; sua tipologia de relações reflete uma leitura específica da entrevista de 1977; seus alertas reflexivos embutem julgamentos sobre o que constitui uso reducionista. Codex implementará fielmente a especificação que recebe, mas a especificação embute teoria.

A única salvaguarda é manter o sistema *auditável* — todas as tipologias revisáveis, todas as interpretações registradas, todos os alertas configuráveis. O sistema deve ser uma ferramenta que se deixa modificar pelo pesquisador, não um oráculo que produz verdades sobre dispositivos.

Quando Codex terminar a implementação, o trabalho conceitual permanece. A primeira análise real do seu corpus revelará lacunas no modelo. Esperar isso desde o início; não tratar a especificação como definitiva.
