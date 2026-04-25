# Ontologia do projeto

Este documento mantém o registro vivo das tipologias usadas pelo sistema:

- **Element types** (tipos de elementos) — categorias para entidades da Camada 2.
- **Relation types** (tipos de relações) — categorias para arestas da Camada 3.

A ontologia é **revisável**. Adições são feitas via skills `add-element-type` e `add-relation-type`. Toda entrada deve incluir a motivação documentária ou conceitual que a justifica.

---

## Element types

### Categorias iniciais (do seed)

#### Discursivos

##### `discurso`
Texto, enunciado, formulação verbal ou escrita.
**Exemplo**: protocolo clínico, lei, parecer, transcrição de audiência.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977) — "discursos" é o primeiro tipo enumerado na definição.

##### `enunciado_cientifico`
Proposição com pretensão de saber científico.
**Exemplo**: tese sobre etiologia de uma patologia, classificação nosológica.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

##### `proposicao_filosofica_moral_filantropica`
Formulação que articula juízo moral, filosófico ou filantrópico, sem pretensão científica.
**Exemplo**: discurso de fundação de uma instituição assistencial; posição moral pública sobre uma prática.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

#### Não discursivos

##### `instituicao`
Configuração organizada com regras, papéis e práticas estabelecidas.
**Exemplo**: prisão, escola, hospital, família.
**Cf.**: Foucault, *Vigiar e Punir* (1975), *passim*; *Le jeu de Michel Foucault* (1977).
**Nota**: o *dispositivo* não se identifica com a *instituição*. A instituição é um dos elementos do dispositivo, não seu equivalente. (CLAUDE.md, Core Commitment #1.)

##### `arranjo_arquitetonico`
Espaço, fluxo, distribuição material que organiza corpos e visibilidades.
**Exemplo**: planta panóptica, distribuição de salas em um hospital, arquitetura de uma escola.
**Cf.**: Foucault, *Vigiar e Punir*, "O Panoptismo" (1975).

##### `decisao_regulamentar`
Ato normativo infralegal com força administrativa.
**Exemplo**: portaria ministerial, regulamento interno, resolução de conselho.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

##### `lei`
Norma formal com hierarquia jurídica plena.
**Exemplo**: código penal, lei orgânica, constituição.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

##### `medida_administrativa`
Ato infralegal de gestão.
**Exemplo**: ofício, circular, despacho administrativo.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

#### Silêncios e não-ditos

##### `silencio_referido`
Tópico que documentos mencionam mas recusam tratar ("não cabe aqui discutir...").
**Exemplo**: protocolo que cita que "questões de gênero não são objeto deste documento".

##### `lacuna_serial`
Tipo de documento ou categoria que existe para um período mas não para outro.
**Exemplo**: estatística que aparece em alguns censos e desaparece em outros sem justificativa.

##### `recusa_explicita`
Declaração de não-decisão, suspensão, encaminhamento para outro foro.
**Exemplo**: "esta questão será objeto de regulamentação posterior".

##### `ausencia_sintomatica`
O que se poderia esperar encontrar e não se encontra.
**Exemplo**: a ausência de protocolo específico para uma população esperada.

---

## Relation types

### Categorias iniciais (do seed)

##### `programa_de`
Direcional. **Não requer justificação obrigatória.**
A é programa explícito de B (A precede e orienta B).
**Exemplo**: o regulamento militar que programa a manobra do batalhão.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977) — sobre o programa arquitetônico da École militaire.

##### `justificacao_post_hoc_de`
Direcional. **Não requer justificação obrigatória.**
A justifica retrospectivamente B (A é formulado *após* B existir como prática).
**Exemplo**: discurso médico que racionaliza uma prática higiênica já em curso.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977) — sobre mobilidade posicional.
**Nota**: o mesmo elemento A pode ser `programa_de` B em t1 e `justificacao_post_hoc_de` C em t2. Esta é a **mobilidade posicional** que torna o conceito de dispositivo dinâmico e não-estrutural.

##### `obstaculo_a`
Direcional. **Requer justificação.**
A funciona como resistência interna a B.
**Exemplo**: a recusa do paciente à confissão como obstáculo interno ao dispositivo psiquiátrico.
**Cf.**: Foucault, *A Vontade de Saber* (1976) — Proposição 5: "onde há poder, há resistência".

##### `resposta_a_urgencia`
Direcional. **Requer justificação.**
A emerge como resposta a uma urgência histórica nomeada.
**Exemplo**: o dispositivo carceral como resposta à urgência de redução dos ilegalismos populares no fim do século XVIII.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977).

##### `suporte_material_para`
Direcional. **Não requer justificação obrigatória.**
A (não-discursivo) materializa B (discursivo).
**Exemplo**: a planta panóptica como suporte material para o discurso da vigilância contínua.

##### `sobredeterminacao`
Direcional. **Não requer justificação obrigatória.**
Um efeito de A entra em ressonância com efeitos de B.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977) — "sobredeterminação funcional".

##### `remplissement`
Direcional. **Requer justificação.**
Um efeito não-previsto de A foi reincorporado em uma nova estratégia B.
**Exemplo**: o meio delinquente produzido pela prisão (efeito imprevisto), reutilizado depois para fins políticos e econômicos.
**Cf.**: Foucault, *Le jeu de Michel Foucault* (1977) — "preenchimento estratégico".

##### `producao_de_sujeito`
Direcional. **Requer justificação.**
A articulação entre A e B produz uma posição de sujeito específica.
**Exemplo**: a articulação entre confessionário, exame médico e classificação psiquiátrica produz "o homossexual" como espécie.
**Cf.**: Foucault, *A Vontade de Saber* (1976) — sobre a homossexualidade como espécie.

##### `circulacao_de_saber`
Direcional. **Não requer justificação obrigatória.**
Um saber emerge de A e o condiciona em retorno (regra de imanência).
**Cf.**: Foucault, *A Vontade de Saber* (1976) — Regra 1 (Imanência).

##### `exclusao`
Direcional. **Requer justificação.**
A exclui ou marginaliza B do regime de visibilidade do dispositivo.
**Exemplo**: o dispositivo da sexualidade exclui certas práticas como "perversão" para incluí-las depois sob nova economia.

---

## Adicionando novas entradas

Para adicionar um novo tipo:

1. Use a skill correspondente: `/add-element-type` ou `/add-relation-type`.
2. A skill vai exigir motivação documentária e checagem contra duplicação.
3. Após confirmação, a skill atualiza:
   - `scripts/seed_taxonomies.py` (banco)
   - `tests/unit/test_*_types.py` (teste)
   - Este documento (entrada com motivação).

**Não edite este arquivo diretamente para introduzir tipos.** Use as skills.

---

## ADR (Architecture Decision Records)

Para mudanças que envolvem **deletar** ou **renomear** tipos existentes (operações destrutivas), criar um ADR em `docs/adrs/` antes da migração. Tipos antigos não devem ser silenciosamente removidos — devem ser marcados como deprecados, com migração explícita das relações que os usavam.
