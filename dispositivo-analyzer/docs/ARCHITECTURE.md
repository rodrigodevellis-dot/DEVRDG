# Arquitetura de um sistema computacional para análise de fenômenos como dispositivos

---

**Nota preliminar.** Esta arquitetura é uma proposta conceitual. Ela não é um sistema implementado nem um plano técnico definitivo; é o desenho de uma máquina analítica fiel à teoria foucaultiana do dispositivo. Onde menciono tecnologias específicas (grafos de conhecimento, modelos de linguagem, bancos temporais), cito-as como exemplos compatíveis, não como prescrições. As decisões de implementação dependem de escolhas posteriores que cabe ao analista fazer.

A arquitetura é estruturada para que o próprio sistema reflita os três traços constitutivos do dispositivo: heterogeneidade composicional, rede de relações funcionais-estratégicas, e função estratégica em resposta a uma urgência. Onde a teoria deixa tensões em aberto, a arquitetura também as deixa — e isso é deliberado.

---

## 1. Premissa: o que é possível computar e o que não é

Antes de desenhar, é preciso ser honesto sobre os limites. O dispositivo não é, em si, um objeto computável. Ele é o resultado de uma operação interpretativa: um analista, lendo documentos, observando práticas, mapeando arranjos, *constitui* o dispositivo como objeto de análise. A operação envolve julgamento — sobre o que conta como elemento do dispositivo, sobre quais relações são funcionais ou estratégicas, sobre qual urgência histórica orientou sua emergência.

Um sistema computacional não pode substituir esse julgamento. Pode, no entanto, fazer três coisas que aumentam a capacidade analítica do pesquisador:

Primeiro, organizar massas de material heterogêneo (documentos legislativos, protocolos clínicos, transcrições, plantas arquitetônicas, séries estatísticas, discursos midiáticos, regulamentos institucionais) de modo a preservar — em vez de apagar — sua heterogeneidade. Segundo, mapear e visualizar relações entre esses elementos, permitindo que padrões que escapariam à leitura linear se tornem perceptíveis. Terceiro, oferecer suporte crítico-reflexivo, alertando o analista quando suas interpretações se tornam excessivamente totalizadoras, reducionistas, ou quando ignoram tensões que o próprio Foucault deixou em aberto.

O sistema não produz a análise. Organiza o material, propõe relações candidatas, registra a trajetória das interpretações e oferece resistência a leituras simplificadoras. A interpretação permanece com o analista.

## 2. Arquitetura geral

A arquitetura tem cinco camadas funcionais e dois módulos transversais. Cada camada e módulo corresponde, propositadamente, a um aspecto da teoria do dispositivo.

```
┌─────────────────────────────────────────────────────────────┐
│  CAMADA 5 — Reflexividade crítica                           │
│  (tensões em aberto, alertas de redução, autocrítica)       │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 4 — Análise genealógico-estratégica                 │
│  (urgência, gênese, remplissement, unidades estratégicas)   │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 3 — Rede relacional (o dispositivo como objeto)     │
│  (relações funcionais-estratégicas, mobilidade posicional)  │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 2 — Representação heterogênea                       │
│  (tipologia de elementos, dito e não dito)                  │
├─────────────────────────────────────────────────────────────┤
│  CAMADA 1 — Ingestão                                        │
│  (documentos, observação, metadados de proveniência)        │
└─────────────────────────────────────────────────────────────┘

Módulos transversais:
─ Módulo poder-saber/subjetividade (atravessa as camadas 2 a 5)
─ Módulo de tradução (sinaliza apparatus/deployment/device etc.)
```

A leitura é ascendente em função: as camadas inferiores alimentam as superiores. Mas a arquitetura é bidirecional em uso: a camada 5 pode invalidar interpretações da camada 4 e exigir nova ingestão na camada 1.

## 3. Camada 1 — Ingestão

### Função
Receber e indexar material primário heterogêneo, preservando metadados de proveniência, datação e tipo.

### Tipos de fonte aceitos
A arquitetura é deliberadamente promíscua quanto a formatos, porque o dispositivo é definicionalmente heterogêneo. Devem ser ingestáveis, no mínimo:

- **Textos discursivos**: leis, regulamentos, protocolos clínicos, manuais, artigos científicos, notícias, transcrições de entrevistas, discursos parlamentares, pareceres jurídicos, documentos eclesiásticos.
- **Textos não-discursivos descritos por discurso**: relatórios de observação etnográfica, descrições de práticas, atas de reuniões, registros de procedimentos.
- **Material visual e espacial**: plantas arquitetônicas, diagramas de fluxo de pacientes/usuários, mapas de circulação, fotografias de espaços, imagens institucionais.
- **Material quantitativo**: séries estatísticas, taxas, indicadores, censos, registros administrativos.
- **Material normativo formal**: leis, portarias, resoluções, decisões judiciais.
- **Marcadores de "não dito"**: ausências documentadas (silêncios em arquivos, gaps em séries temporais, tópicos referidos mas não tratados, recusas explícitas de pronunciamento).

### Esquema de metadados
Cada item ingerido recebe um conjunto mínimo de metadados, alguns objetivos, alguns interpretativos e revisáveis:

- proveniência (autor/instituição/órgão emissor)
- data
- localização geográfica e institucional
- gênero documental (lei, protocolo, transcrição, planta...)
- *tipo de elemento provisório* — uma classificação inicial que pode ser revista (ver §4)
- estatuto epistêmico (oficial, clínico, doutrinal, testemunhal...)
- relações de citação ou referência interna a outros itens

### Ponto crítico
A categorização inicial é provisória. O sistema não deve fechar a tipologia de elementos no momento da ingestão, porque a mesma fonte pode funcionar diferentemente em diferentes análises. Um protocolo clínico pode ser, alternativamente: instrumento de saber médico, dispositivo de classificação de sujeitos, peça normativa, justificação *post hoc* de uma prática. A camada 1 registra a fonte; é a camada 3 que mobiliza essa fonte como elemento numa rede específica.

## 4. Camada 2 — Representação heterogênea

### Função
Modelar os itens ingeridos como elementos tipificados, preservando sua heterogeneidade ontológica em vez de homogeneizá-los para fins computacionais.

### O risco a evitar
Sistemas computacionais tendem a achatar heterogeneidade. Um pipeline de NLP convencional transforma tudo em texto, vetoriza, e opera estatisticamente sobre os vetores. Esse achatamento é precisamente o que a teoria do dispositivo recusa: discurso e arranjo arquitetônico não devem ser representados pelo mesmo tipo de objeto, porque sua articulação produz efeitos que dependem da diferença ontológica entre eles.

### Tipologia de elementos
A camada 2 mantém uma tipologia que segue a lista da definição de 1977, com possibilidade de extensão:

- discursos (textos, enunciados, formulações)
- instituições (configurações organizadas, com regras e papéis)
- arranjos arquitetônicos (espaços, fluxos, distribuições materiais)
- decisões regulamentares (atos normativos, com força jurídica)
- leis (normas formais, com hierarquia jurídica)
- medidas administrativas (atos infralegais)
- enunciados científicos (proposições com pretensão de saber)
- proposições filosóficas, morais, filantrópicas
- silêncios e não-ditos estruturais (categoria *especialmente* importante; ver abaixo)

### A categoria do não-dito
Sistemas digitais têm dificuldade nativa com silêncios — eles operam sobre o que está registrado. Mas, para a teoria do dispositivo, o não-dito é elemento constitutivo. A arquitetura precisa de um dispositivo (no sentido técnico) específico para isso:

- **Silêncio referido**: tópicos que documentos mencionam mas recusam tratar ("não cabe aqui discutir...").
- **Lacuna serial**: um tipo de documento que existe para um período e não para outro; categorias que aparecem em alguns censos mas não em outros.
- **Recusa explícita**: declarações de não-decisão, suspensões, encaminhamentos para outro foro.
- **Ausência sintomática**: o que poderia esperar-se encontrar e não se encontra.

Cada uma dessas modalidades é um elemento, e deve ser tratada como tal pela camada 3.

### Implementação possível
Um grafo de conhecimento heterogêneo (heterogeneous knowledge graph) com tipos de nó distintos, esquemas próprios para cada tipo, e ligações entre tipos preservadas. Tecnologias compatíveis: RDF com OWL, Wikibase, Neo4j com tipagem rígida, ou bancos orientados a documentos com schema-validation por tipo.

## 5. Camada 3 — Rede relacional: o dispositivo como objeto

### Função
Esta é a camada onde o dispositivo *acontece* enquanto objeto. Aqui são representadas as relações que articulam elementos da camada 2 numa configuração estratégica.

### Princípio fundamental
O dispositivo *é* a rede, não a soma dos elementos. A camada 2 cataloga; a camada 3 articula. Pode-se ter o mesmo conjunto de elementos da camada 2 e múltiplos dispositivos coexistentes na camada 3, segundo a articulação que se trace.

### Tipologia de relações
As relações entre elementos não são genéricas (não basta um "está-relacionado-com"). Devem ser tipificadas segundo categorias que o trabalho de Foucault sugere:

- **programa-de**: um discurso é programa de uma prática institucional.
- **justificação-post-hoc-de**: um discurso justifica retrospectivamente uma prática que precedeu sua formulação.
- **obstáculo-a**: um elemento opera como resistência interna ao funcionamento de outro.
- **resposta-a-urgência**: um elemento emerge em resposta a uma urgência histórica nomeada.
- **suporte-material-para**: um arranjo arquitetônico ou administrativo materializa um discurso.
- **sobredeterminação**: um efeito de um elemento entra em ressonância com efeitos de outros.
- **remplissement**: um efeito não-previsto de um elemento é reincorporado em nova estratégia.
- **produção-de-sujeito**: a articulação entre elementos produz uma posição de sujeito específica.
- **circulação-de-saber**: um saber emerge de um arranjo e o condiciona em retorno.
- **exclusão / marginalização**: um elemento exclui ou marginaliza outro do regime de visibilidade.

A lista é extensível. O ponto é que cada relação carrega informação sobre *como* os elementos estão articulados, e não apenas que estão.

### Mobilidade posicional
Foucault insiste, na entrevista de 1977, que o mesmo elemento pode mudar de função: ser programa num momento, justificação *post hoc* em outro. A camada 3 deve representar isso temporalmente. Cada relação tem versão temporal; o mesmo par de elementos pode estar ligado por uma relação tipo-A no tempo *t1* e tipo-B no tempo *t2*. Tecnologias relevantes: bancos de dados temporais (Neo4j com timestamps em arestas; bitemporal databases).

### Múltiplos dispositivos coexistentes
Um corpus pode dar origem a múltiplos dispositivos analíticos. Por exemplo, ao analisar a sexualidade adolescente no Brasil contemporâneo, é possível constituir analiticamente: um dispositivo de aliança (centrado na autoridade familiar e no consentimento parental), um dispositivo de sexualidade (centrado na incitação ao discurso clínico-preventivo), um dispositivo de segurança (centrado na regulação populacional e na probabilidade epidemiológica). A camada 3 deve permitir múltiplas redes coexistentes sobre os mesmos elementos da camada 2, e ferramentas de comparação entre elas.

## 6. Camada 4 — Análise genealógico-estratégica

### Função
Operações analíticas sobre a rede da camada 3, organizadas pelos três tempos da gênese do dispositivo descritos por Foucault em 1977: a urgência inicial, a sobredeterminação funcional, o preenchimento estratégico.

### Operações principais

**Detecção de urgência**: dada uma rede, identificar candidatos para o que Foucault chama de "urgência histórica" — o problema concreto a que o dispositivo responde. Esta é necessariamente uma operação interpretativa; o sistema não decide qual é a urgência. Mas pode oferecer candidatos a partir da temporalidade dos elementos (que problemas estavam sendo nomeados nos documentos do período em que os elementos mais antigos da rede emergem?), e o analista decide.

**Traçamento genealógico**: a partir de uma configuração contemporânea, percorrer a rede para identificar a trajetória histórica dos elementos. O que existia antes? O que mudou de função? O que foi importado de outro dispositivo? Esta é a operação genealógica clássica: descobrir que uma prática que parece evidente hoje foi montada em condições muito específicas, com componentes que tiveram outras vidas.

**Identificação de unidades estratégicas**: detecção de subconjuntos da rede que operam como estratégias coerentes — por exemplo, no estudo da sexualidade, as quatro unidades que Foucault identifica (histerização, pedagogização, socialização, psiquiatrização). O sistema pode propor *clusters* candidatos a partir de centralidade e densidade na rede, mas a constituição da unidade estratégica como tal é interpretativa.

**Detecção de remplissement**: identificação de pontos onde efeitos não-previstos foram reincorporados. Operacionalmente: encontrar elementos cujas *funções* (relações tipificadas com outros elementos) mudaram drasticamente após sua emergência inicial. O exemplo paradigmático é o meio delinquente que a prisão produziu sem querer e que foi depois reutilizado para fins econômicos e políticos.

**Comparação entre dispositivos**: dados dois ou mais dispositivos coexistentes na camada 3, identificar pontos de articulação (a "família como cristal" entre aliança e sexualidade), pontos de tensão e pontos onde elementos circulam de um a outro.

## 7. Módulo transversal — Poder-saber, subjetividade, estratégia sem sujeito, resistência

### Função
Atravessa as camadas 2 a 5. Trata dos eixos que percorrem o conceito de dispositivo independentemente de qualquer dispositivo específico.

### Submódulos

**Submódulo poder-saber**: a cada saber identificado na camada 2 (cada enunciado científico, cada formulação técnica, cada protocolo), associar (a) os arranjos materiais, institucionais e práticos de que ele depende, e (b) as configurações de poder que ele torna possíveis. A premissa é a regra de imanência da Vontade de Saber: não há saber sem suporte de poder, nem poder sem produção de saber. O submódulo nunca aceita um saber como flutuante.

**Submódulo de subjetividade**: catalogar as posições de sujeito produzidas pela rede — não pessoas, mas categorias-tipo (o "delinquente", o "homossexual", o "adolescente em risco", o "casal malthusiano", o "doente mental", o "PrEP user"). Para cada posição: que elementos da rede a constituem? Que práticas a fixam? Que técnicas de exame, classificação ou confissão a produzem? A pergunta orientadora é: o que esse dispositivo torna possível *ser*?

**Submódulo de estratégia sem sujeito**: identificar coerências estratégicas de larga escala que não correspondem a decisões de atores individuais. Operacionalmente: detectar convergências entre práticas locais dispersas (em geografias diferentes, em instituições diferentes, em discursos de tipos diferentes) que apontam para um mesmo efeito estratégico, sem que tenha havido coordenação. O exemplo de Foucault: as técnicas locais de fixação dos operários nas indústrias de Mulhouse, dos Vosges, do Norte da França, que convergem para uma "estratégia de moralização da classe operária" sem que ninguém a tenha desenhado.

**Submódulo de resistência**: identificar os pontos onde o dispositivo é internamente contestado — não como reação externa, mas como componente do próprio dispositivo. Quem se recusa a confessar? Que sujeitos aparecem como anomalias internas? Onde os efeitos do dispositivo são revertidos contra suas estratégias?

## 8. Camada 5 — Reflexividade crítica

### Função
Atuar contra o uso reducionista do conceito de dispositivo. Esta é a camada que diferencia o sistema de uma máquina interpretativa que se contenta em chamar tudo de "dispositivo".

### Funções específicas

**Detector de hipertotalização**: emite alerta quando a análise tende a tratar o dispositivo como sujeito (atribuindo intencionalidade, planejamento, agência ao dispositivo enquanto tal); como totalidade fechada (sem internalizar a resistência); ou como inevitabilidade (sem deixar espaço para contingência e remplissement).

**Mantenedor das tensões em aberto**: a teoria deixa ao menos três tensões irresolvidas — discursivo/não-discursivo, o que orienta a estratégia sem sujeito, oscilação entre instrumento geral / objeto específico / quase-transcendental. O sistema não as resolve. Quando o analista produz uma interpretação que trata uma dessas tensões como resolvida, o sistema flagra: "esta interpretação supõe que [a tensão x] está resolvida; ela não está; deseja prosseguir?"

**Verificador de demarcação**: quando o analista usa "dispositivo" como sinônimo de instituição, ideologia, episteme ou estrutura, o sistema oferece uma intervenção: "a articulação que você descreveu é compatível com 'instituição'; o que ela acrescenta? se nada acrescenta, talvez a categoria mais econômica seja a outra."

**Registro genealógico das interpretações**: cada interpretação produzida pelo analista é registrada com sua data, sua justificação, suas fontes. Interpretações posteriores que revisem as anteriores são datadas. O sistema mantém uma genealogia das próprias análises — instrumento metodológico contra a ilusão de evidência retrospectiva.

## 9. Módulo transversal — Tradução

### Função
Sinalizar a dispersão tradutória do termo *dispositif* nas fontes secundárias.

### Operação
Quando o sistema processa uma fonte em inglês e detecta os termos *apparatus*, *deployment*, *device* ou *mechanism* em contexto que sugira correspondência ao *dispositif* foucaultiano, sinaliza o termo no original e propõe a equivalência. Quando processa fontes em português, observa a alternância *dispositivo / aparato / aparelho*. O analista decide se aceita a correspondência. Trata-se de evitar que a fragmentação tradutória — que oblitera o conceito na recepção anglófona — se reproduza na leitura informatizada das fontes.

## 10. O sistema como dispositivo: o problema reflexivo

Aqui está o ponto que mais merece honestidade. Qualquer sistema computacional como o descrito *é*, ele próprio, um dispositivo no sentido foucaultiano.

Considere os seus elementos: discursos (a teoria foucaultiana embutida em sua tipologia de relações), instituições (a equipe que o desenvolve, a universidade que o hospeda), arranjos arquitetônicos (a interface, o pipeline, os fluxos de dados), decisões regulamentares (o que pode e o que não pode ser ingerido), enunciados científicos (os modelos de NLP usados, as métricas de centralidade), proposições filosóficas (a teoria do dispositivo). Mais o não-dito: o que o sistema decide não classificar, as categorias que recusa, os silêncios programados.

Considere a rede de relações: o sistema produz uma forma específica de articulação entre esses elementos, com sua função estratégica.

Considere a urgência: o sistema responde a alguma urgência historicamente situada — talvez a multiplicação de dados sobre fenômenos que escapam à análise por leitura individual; talvez a demanda institucional por pesquisa "de impacto"; talvez o desejo de dar dignidade computacional à análise crítica.

Considere os efeitos: o sistema produz posições de sujeito (o "analista", o "objeto de análise", o "fenômeno-como-dispositivo"), e essas posições têm consequências. Aquilo que o sistema torna *visível* é precisamente o que vai ser tratado; aquilo que o sistema deixa fora do esquema deixa de existir analiticamente. O sistema é uma tecnologia de produção de objetos-de-análise.

A camada 5 deve incluir, portanto, um módulo de *autocrítica reflexiva*: instrumentos para o analista pensar o próprio sistema como dispositivo. Que urgência ele responde? Que sujeitos ele produz (incluindo o próprio analista)? Que silêncios ele programa? Que estratégia sem sujeito ele participa de instaurar?

O sistema não deve ocultar essa dimensão. Pelo contrário: assumi-la é a única forma de não trair a teoria que pretende implementar. Um dispositivo que se ignora como dispositivo é exatamente o que Foucault chamou de *contradireito* — a operação técnica oculta sob a forma neutra do método. O sistema honesto declara sua condição.

## 11. O que o sistema não pode fazer (e nunca deve pretender)

Para fechar com a precisão que a teoria exige, é preciso enumerar os limites:

O sistema não pode *constituir* um dispositivo. Constituir um dispositivo como objeto de análise é uma operação interpretativa que cabe ao analista. O sistema oferece elementos, propõe relações candidatas, organiza redes alternativas — mas a decisão de chamar uma configuração específica de "o dispositivo X" é decisão humana.

O sistema não pode identificar, sozinho, a urgência histórica. Pode propor candidatos, oferecer cronologias, mostrar correlações temporais entre emergências de elementos e ocorrências de problemas nomeados. Mas dizer "esta é a urgência" é leitura, não computação.

O sistema não pode validar uma análise como verdadeira. A análise foucaultiana não é falsificável no sentido popperiano; ela é defensável segundo critérios de coerência, fidelidade ao corpus, e capacidade de tornar pensável o que outras análises não tornam. O sistema não substitui esse julgamento.

O sistema não substitui a leitura. As fontes precisam ser lidas. O sistema ajuda a manter mapas, conexões e cronologias — não dispensa o trabalho interpretativo.

O sistema não é neutro, e não deve simular neutralidade. Sua arquitetura embute uma teoria; sua tipologia de relações embute decisões; seus alertas embutem julgamentos sobre o que constitui uso reducionista do conceito. Tornar essas decisões transparentes — auditáveis, revisáveis, criticáveis pelo próprio analista — é o requisito ético mínimo.

## 12. Mapa de implementação — sugestões técnicas (não prescrições)

Para tornar a arquitetura concreta sem fechá-la em uma escolha tecnológica:

| Camada / módulo | Possibilidades técnicas |
|---|---|
| Camada 1 (Ingestão) | Pipeline de OCR + NLP (transformers para extração de entidades e relações), arquivos versionados, sistema de proveniência tipo PROV-O |
| Camada 2 (Representação) | Grafo de conhecimento heterogêneo (Neo4j com tipos rígidos; ou RDF/OWL com Wikibase), schema validation por tipo de elemento |
| Camada 3 (Rede relacional) | Mesmo grafo da camada 2 com arestas tipificadas e versionamento temporal (bitemporal); SPARQL ou Cypher para consultas |
| Camada 4 (Análise) | Algoritmos de centralidade e clustering (Louvain, link prediction); LLMs para suporte interpretativo (com restrição explícita de não decidir, apenas propor) |
| Camada 5 (Reflexividade) | Sistema de regras simbólicas para detecção de padrões reducionistas; histórico versionado de interpretações |
| Módulo poder-saber | Anotações tipadas sobre nós; relações de mútua condicionamento explicitamente representadas |
| Módulo subjetividade | Tipo de nó "posição-de-sujeito" derivado de configurações de outros nós |
| Módulo estratégia-sem-sujeito | Análise de convergência multi-fonte com explicitação de não-coordenação |
| Módulo resistência | Tipo de relação dedicado, com requisito de explicitação |
| Módulo tradução | Léxico anotado *dispositif/apparatus/deployment/device/mechanism/dispositivo/aparato/aparelho* com regras de proposição de equivalência |

Essas sugestões podem ser combinadas ou substituídas conforme o contexto. O ponto invariante é a estrutura em camadas e módulos; as tecnologias específicas são contingentes.

## 13. Síntese

O sistema descrito é uma máquina analítica que reflete, em sua estrutura, os três traços do dispositivo foucaultiano: heterogeneidade composicional (camadas 1 e 2), rede de relações funcionais-estratégicas (camada 3), função estratégica em resposta a uma urgência com remplissement (camada 4). Os eixos transversais — poder-saber, subjetividade, estratégia sem sujeito, resistência — atravessam essa estrutura. A camada 5 mantém em aberto as tensões irresolvidas da teoria e exige do analista a explicitação reflexiva de seu próprio uso do conceito. O módulo de tradução protege contra a dispersão lexical do termo na recepção anglófona.

O sistema não substitui o analista. Sua função é permitir que o analista trabalhe com massas de material que excedem sua capacidade de leitura linear, mantendo a fidelidade conceitual ao instrumento que mobiliza. E, sobretudo, o sistema não se finge neutro: assume, no próprio desenho, que ele mesmo é um dispositivo de produção de saber sobre dispositivos, e oferece ao analista os instrumentos para pensar essa condição.

Como qualquer dispositivo, o sistema responde a uma urgência: a urgência de pensar o presente — protocolos clínicos, políticas de saúde, sistemas educacionais, dispositivos de proteção e controle — com a precisão que a teoria foucaultiana torna possível, à escala das massas documentais que os pesquisadores hoje precisam atravessar. Como qualquer dispositivo, ele incorporará efeitos imprevistos. Como qualquer dispositivo, ele produzirá sujeitos. Sua honestidade é assumir essa condição em sua própria arquitetura.
