// ═══════════════════════════════════════════════════════════
// Compositor de Extração — Ciências Sociais UFSC
// Lógica principal: seleção, composição e cópia de prompts
// ═══════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  const selectDisciplina = document.getElementById("sel-disciplina");
  const ementaBox = document.getElementById("ementa-box");
  const ementaMeta = document.getElementById("ementa-meta");
  const ementaTexto = document.getElementById("ementa-texto");
  const modulosContainer = document.getElementById("modulos-container");
  const promptContent = document.getElementById("prompt-content");
  const btnCopiar = document.getElementById("btn-copiar");
  const btnGerar = document.getElementById("btn-gerar");
  const btnPreProcessar = document.getElementById("btn-pre-processar");
  const chkPreProcessador = document.getElementById("chk-pre-processador");
  const statsChars = document.getElementById("stats-chars");
  const statsTokens = document.getElementById("stats-tokens");
  const statsModulos = document.getElementById("stats-modulos");

  let disciplinaSelecionada = null;
  let modulosSelecionados = new Set();
  let usarPreProcessador = false;
  let promptGerado = "";

  // ── Popular dropdown de disciplinas ──
  function popularDisciplinas() {
    // Agrupar por área (obrigatórias) e campo temático (optativas)
    const obrigatorias = DISCIPLINAS.filter(d => d.tipo === "Ob");
    const optativas = DISCIPLINAS.filter(d => d.tipo === "Op");

    // Obrigatórias por área
    const areaGroups = {};
    obrigatorias.forEach(d => {
      if (!areaGroups[d.area]) areaGroups[d.area] = [];
      areaGroups[d.area].push(d);
    });

    // Optativas por campo temático
    const campoGroups = {};
    optativas.forEach(d => {
      const campo = d.campo_tematico || "Outros";
      if (!campoGroups[campo]) campoGroups[campo] = [];
      campoGroups[campo].push(d);
    });

    // Criar optgroups
    AREAS.forEach(area => {
      if (!areaGroups[area]) return;
      const group = document.createElement("optgroup");
      group.label = `${area} (Obrigatórias)`;
      areaGroups[area]
        .sort((a, b) => (a.semestre || 99) - (b.semestre || 99))
        .forEach(d => {
          const opt = document.createElement("option");
          opt.value = d.codigo;
          opt.textContent = `${d.codigo} — ${d.nome}`;
          group.appendChild(opt);
        });
      selectDisciplina.appendChild(group);
    });

    // Separador
    const sepGroup = document.createElement("optgroup");
    sepGroup.label = "── Optativas ──";
    selectDisciplina.appendChild(sepGroup);

    CAMPOS_TEMATICOS.forEach(campo => {
      if (!campoGroups[campo]) return;
      const group = document.createElement("optgroup");
      group.label = campo;
      campoGroups[campo].forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.codigo;
        opt.textContent = `${d.codigo} — ${d.nome}`;
        group.appendChild(opt);
      });
      selectDisciplina.appendChild(group);
    });
  }

  // ── Popular módulos ──
  function popularModulos() {
    MODULOS.forEach(mod => {
      const item = document.createElement("label");
      item.className = "modulo-item";
      item.dataset.moduloId = mod.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = mod.id;
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          modulosSelecionados.add(mod.id);
          item.classList.add("checked");
        } else {
          modulosSelecionados.delete(mod.id);
          item.classList.remove("checked");
        }
        atualizarPrompt();
      });

      const info = document.createElement("div");
      info.className = "modulo-info";
      info.innerHTML = `
        <div class="modulo-nome">${mod.icone} ${mod.nome}</div>
        <div class="modulo-desc">${mod.descricao}</div>
        <div class="modulo-tag" style="display:none">sugerido para esta disciplina</div>
      `;

      item.appendChild(checkbox);
      item.appendChild(info);
      modulosContainer.appendChild(item);
    });
  }

  // ── Sugerir módulos com base na área ──
  function sugerirModulos(area) {
    document.querySelectorAll(".modulo-item").forEach(item => {
      const modId = item.dataset.moduloId;
      const mod = MODULOS.find(m => m.id === modId);
      const tag = item.querySelector(".modulo-tag");
      const sugerido = mod.sugestao_areas.includes(area);

      item.classList.toggle("sugerido", sugerido);
      tag.style.display = sugerido ? "block" : "none";
    });
  }

  // ── Limpar sugestões ──
  function limparSugestoes() {
    document.querySelectorAll(".modulo-item").forEach(item => {
      item.classList.remove("sugerido");
      item.querySelector(".modulo-tag").style.display = "none";
    });
  }

  // ── Selecionar disciplina ──
  selectDisciplina.addEventListener("change", () => {
    const codigo = selectDisciplina.value;
    if (!codigo) {
      disciplinaSelecionada = null;
      ementaBox.classList.remove("visible");
      limparSugestoes();
      atualizarPrompt();
      return;
    }

    disciplinaSelecionada = DISCIPLINAS.find(d => d.codigo === codigo);
    if (!disciplinaSelecionada) return;

    // Mostrar ementa
    const tipoLabel = disciplinaSelecionada.tipo === "Ob" ? "Obrigatória" : "Optativa";
    const semLabel = disciplinaSelecionada.semestre ? `${disciplinaSelecionada.semestre}° sem` : "";
    const campoLabel = disciplinaSelecionada.campo_tematico || "";

    let metaHtml = `<span>${tipoLabel}</span>`;
    metaHtml += `<span>${disciplinaSelecionada.area}</span>`;
    if (semLabel) metaHtml += `<span>${semLabel}</span>`;
    metaHtml += `<span>${disciplinaSelecionada.h_a} h/a</span>`;
    if (campoLabel) metaHtml += `<span>${campoLabel}</span>`;

    ementaMeta.innerHTML = metaHtml;
    ementaTexto.textContent = disciplinaSelecionada.ementa;
    ementaBox.classList.add("visible");

    // Sugerir módulos
    sugerirModulos(disciplinaSelecionada.area);
    atualizarPrompt();
  });

  // ── Pré-processador toggle ──
  chkPreProcessador.addEventListener("change", () => {
    usarPreProcessador = chkPreProcessador.checked;
    document.querySelector(".pre-processador-toggle").classList.toggle("checked", usarPreProcessador);
    atualizarPrompt();
  });

  // ── Gerar prompt ──
  btnGerar.addEventListener("click", () => atualizarPrompt());

  function atualizarPrompt() {
    if (!disciplinaSelecionada && modulosSelecionados.size === 0 && !usarPreProcessador) {
      promptContent.innerHTML = `
        <div class="prompt-empty">
          <div class="icon">&#9997;</div>
          <p>Selecione uma disciplina e escolha os módulos de extração para compor seu prompt</p>
        </div>`;
      promptGerado = "";
      atualizarStats();
      return;
    }

    let prompt = "";
    let sections = [];

    // Se pré-processador ativo, gerar prompt do pré-processador
    if (usarPreProcessador) {
      let ppPrompt = PRE_PROCESSADOR.prompt;

      if (disciplinaSelecionada) {
        ppPrompt += `\n\n## Contexto da Disciplina\nEsta análise é para a disciplina ${disciplinaSelecionada.nome} (${disciplinaSelecionada.codigo}) do curso de Ciências Sociais da UFSC.\nEmenta: ${disciplinaSelecionada.ementa}\nConsidere o escopo temático desta disciplina ao classificar o domínio.`;
      }

      sections.push({
        label: "PRÉ-PROCESSADOR (Etapa 1 — envie antes da extração)",
        text: ppPrompt
      });

      sections.push({
        label: "EXTRATOR (Etapa 2 — envie depois com o resultado da Etapa 1)",
        text: ""
      });
    }

    // Prompt base
    let promptBase = `Você é um extrator estruturado de textos. Sua função é ler o texto que eu enviar e produzir um JSON seguindo exatamente o schema que defino abaixo.

Regras:
- Extraia apenas o que está no texto. Não invente informações.
- Se um campo não puder ser preenchido, use null.
- Citações diretas devem ser transcritas literalmente com localização.
- Em "notas_do_pesquisador", faça análise crítica própria.
- Responda SOMENTE com o JSON. Sem texto antes ou depois.
- No campo "_modulos_aplicados", liste os módulos usados.`;

    sections.push({ label: "PROMPT BASE", text: promptBase });

    // Contexto da disciplina
    if (disciplinaSelecionada) {
      let contexto = `Contexto da pesquisa: Esta extração é para a disciplina ${disciplinaSelecionada.nome} (${disciplinaSelecionada.codigo}) do curso de Ciências Sociais da UFSC.
Ementa da disciplina: ${disciplinaSelecionada.ementa}
Ao preencher "notas_do_pesquisador.utilidade", considere especificamente como o texto se relaciona com o escopo temático desta disciplina.`;
      sections.push({ label: "CONTEXTO DA DISCIPLINA", text: contexto });
    }

    // Schema — montar instrução
    const modulosAtivos = MODULOS.filter(m => modulosSelecionados.has(m.id));
    let schemaInstrucao = "";

    if (modulosAtivos.length === 0) {
      schemaInstrucao = "Schema: aplique apenas o NÚCLEO.";
    } else {
      const nomes = modulosAtivos.map(m => `MÓDULO ${m.nome.toUpperCase()}`).join(" + ");
      schemaInstrucao = `Schema: aplique NÚCLEO + ${nomes}.`;
    }

    sections.push({ label: "INSTRUÇÃO DE SCHEMA", text: schemaInstrucao });

    // Núcleo JSON
    const nucleoStr = JSON.stringify(NUCLEO_SCHEMA, null, 2);
    sections.push({ label: "NÚCLEO", text: `NÚCLEO:\n${nucleoStr}` });

    // Módulos JSON
    modulosAtivos.forEach(mod => {
      const modStr = JSON.stringify(mod.schema, null, 2);
      sections.push({
        label: `MÓDULO ${mod.nome.toUpperCase()}`,
        text: `MÓDULO ${mod.nome.toUpperCase()} (adicione como campo "${mod.campo_json}" no JSON):\n${modStr}`
      });
    });

    // Renderizar
    let html = '<div class="prompt-text">';
    sections.forEach(s => {
      if (s.label) {
        html += `<span class="section-label">${escapeHtml(s.label)}</span>`;
      }
      if (s.text) {
        html += escapeHtml(s.text) + "\n\n";
      }
    });
    html += "</div>";

    promptContent.innerHTML = html;

    // Gerar texto plano para cópia
    promptGerado = sections.map(s => {
      let part = "";
      if (s.text) part = s.text;
      return part;
    }).filter(Boolean).join("\n\n");

    atualizarStats();
  }

  // ── Copiar ──
  btnCopiar.addEventListener("click", async () => {
    if (!promptGerado) return;
    try {
      await navigator.clipboard.writeText(promptGerado);
      btnCopiar.textContent = "Copiado!";
      btnCopiar.classList.add("copied");
      setTimeout(() => {
        btnCopiar.textContent = "Copiar Prompt";
        btnCopiar.classList.remove("copied");
      }, 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = promptGerado;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btnCopiar.textContent = "Copiado!";
      btnCopiar.classList.add("copied");
      setTimeout(() => {
        btnCopiar.textContent = "Copiar Prompt";
        btnCopiar.classList.remove("copied");
      }, 2000);
    }
  });

  // ── Stats ──
  function atualizarStats() {
    const chars = promptGerado.length;
    const tokens = Math.round(chars / 3.5); // estimativa grosseira
    const mods = modulosSelecionados.size;
    statsChars.textContent = chars.toLocaleString("pt-BR");
    statsTokens.textContent = `~${tokens.toLocaleString("pt-BR")}`;
    statsModulos.textContent = mods;
  }

  // ── Escape HTML ──
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ──
  popularDisciplinas();
  popularModulos();
  atualizarPrompt();
});
