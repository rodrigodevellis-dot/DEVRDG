import { useState, useRef } from "react";

const SYSTEM_CLEAN = `Especialista em formatação de roteiros no padrão Hollywood. Formate o trecho recebido:
1. CABEÇALHO: INT./EXT. LOCAL - DIA/NOITE em CAIXA ALTA
2. AÇÃO: margem esquerda, tempo presente, 1ª aparição do personagem em CAIXA ALTA
3. PERSONAGEM: centralizado, CAIXA ALTA
4. PARÊNTESES: centralizado, entre parênteses
5. DIÁLOGO: indentado, sem aspas
6. TRANSIÇÕES: direita, CAIXA ALTA (CORTE PARA:, FADE OUT.)
7. Remova: espaços extras, tabs inconsistentes, linhas duplicadas, *, #, |, ---
Retorne APENAS o roteiro limpo. Sem explicações, sem markdown.`;

const SYSTEM_ANALYZE = `Você é um analista de roteiros. Dado um roteiro, extraia e retorne APENAS um JSON válido com esta estrutura exata:
{
  "estrutura": {
    "ato1": "resumo do primeiro ato (apresentação)",
    "ato2": "resumo do segundo ato (confronto/desenvolvimento)",
    "ato3": "resumo do terceiro ato (resolução)",
    "tema": "tema central do roteiro",
    "genero": "gênero identificado"
  },
  "personagens": [
    {
      "nome": "NOME",
      "tipo": "protagonista|antagonista|secundário|figurante",
      "descricao": "breve descrição baseada no roteiro",
      "cenas": ["lista de cabeçalhos de cena onde aparece"]
    }
  ],
  "cenas": [
    {
      "cabecalho": "INT./EXT. LOCAL - DIA/NOITE",
      "numero": 1,
      "resumo": "o que acontece nesta cena",
      "personagens": ["NOMES presentes"],
      "funcao": "apresentação|conflito|desenvolvimento|clímax|resolução|transição"
    }
  ]
}
Retorne SOMENTE o JSON, sem markdown, sem explicações.`;

const CHUNK_SIZE = 3500;
const EXAMPLE = `int. escritorio - dia
MARIA entra apressada, derrubando papeis pelo chão.

         JOAO
   (nervoso
você está atrasada de novo!!

MARIA para, respira fundo.

                        MARIA
Eu sei, eu sei... o trânsito estava horrível.

   JOAO
(cruzando os braços)
Isso sempre. Todo dia a mesma coisa.

EXT. RUA - noite
João sai batendo a porta. Maria observa pela janela.`;

const SIGNALS = [/\b(INT|EXT|INT\/EXT)\./i,/\b(DIA|NOITE|AMANHECER|ENTARDECER)\b/i,/\bFADE (IN|OUT)\b/i,/\bCORTE PARA\b/i,/\([\w\s]+\)/];
function validate(text) {
  const t = text.trim();
  if (t.length < 30) return { ok: false, level: "error", msg: "Texto muito curto para ser um roteiro." };
  const sigs = SIGNALS.filter(r => r.test(t));
  if (sigs.length === 0) return { ok: false, level: "warn", msg: "Nenhum elemento de roteiro reconhecido. Processar mesmo assim?" };
  return { ok: true };
}

function splitIntoChunks(text) {
  const scenes = text.split(/(?=^(?:INT\.|EXT\.|INT\.\/EXT\.)\s)/im).filter(s => s.trim());
  if (!scenes.length) return [text];
  const chunks = []; let cur = "";
  for (const s of scenes) {
    if ((cur + s).length > CHUNK_SIZE && cur.length) { chunks.push(cur.trim()); cur = s; }
    else cur += (cur ? "\n\n" : "") + s;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks.length ? chunks : [text];
}

function highlight(text) {
  return text.split("\n").map((line, i) => {
    const t = line.trim(); let color = "#e2e8f0", weight = 400;
    if (/^(INT\.|EXT\.|INT\.\/EXT\.)/.test(t)) { color = "#7dd3fc"; weight = 700; }
    else if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+$/.test(t) && t.length > 1 && t.length < 40 && !/[.!?]$/.test(t)) { color = "#fbbf24"; weight = 700; }
    else if (/^\(.*\)$/.test(t)) color = "#a78bfa";
    else if (/(CORTE PARA:|FUSÃO PARA:|FADE IN:|FADE OUT\.|CORTE SECO)/.test(t)) color = "#34d399";
    return <span key={i} style={{ color, fontWeight: weight, display: "block", minHeight: "1.4em" }}>{line || " "}</span>;
  });
}

const FUNC_COLOR = { apresentação:"#7dd3fc", conflito:"#f87171", desenvolvimento:"#fbbf24", clímax:"#f97316", resolução:"#34d399", transição:"#a78bfa" };
const TIPO_COLOR = { protagonista:"#7dd3fc", antagonista:"#f87171", "secundário":"#fbbf24", figurante:"#94a3b8" };

// ── Analysis Tab ──────────────────────────────────────────────────────────────
function AnalysisTab({ analysis, loading, error, onAnalyze, hasOutput }) {
  const [section, setSection] = useState("estrutura");

  if (!hasOutput) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:12, color:"#475569" }}>
      <span style={{ fontSize: 40 }}>🎬</span>
      <p style={{ fontSize: 14 }}>Primeiro limpe um roteiro na aba <b style={{color:"#94a3b8"}}>Editor</b>.</p>
    </div>
  );

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:12, color:"#94a3b8" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #334155", borderTopColor:"#4f46e5", animation:"spin 0.8s linear infinite" }} />
      <span>Analisando roteiro...</span>
    </div>
  );

  if (error) return (
    <div style={{ padding:20 }}>
      <div style={{ background:"#450a0a", border:"1px solid #f87171", borderRadius:10, padding:"12px 16px", color:"#fca5a5", fontSize:14 }}>🚫 {error}</div>
      <button onClick={onAnalyze} style={{ marginTop:12, background:"#4f46e5", border:"none", borderRadius:8, color:"#fff", padding:"10px 20px", cursor:"pointer", fontWeight:700 }}>Tentar novamente</button>
    </div>
  );

  if (!analysis) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:14 }}>
      <span style={{ fontSize:40 }}>🔍</span>
      <p style={{ color:"#94a3b8", fontSize:14 }}>Roteiro pronto para análise.</p>
      <button onClick={onAnalyze} style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", border:"none", borderRadius:12, color:"#fff", padding:"12px 32px", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:"0 4px 20px #4f46e540" }}>
        🔍 Analisar Roteiro
      </button>
    </div>
  );

  const { estrutura, personagens, cenas } = analysis;

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["estrutura","🏗️ Estrutura"],["personagens","👤 Personagens"],["cenas","🎬 Cenas"]].map(([k,l]) => (
          <button key={k} onClick={() => setSection(k)} style={{
            background: section===k ? "#4f46e5" : "transparent",
            border: `1px solid ${section===k ? "#4f46e5" : "#334155"}`,
            borderRadius:8, color: section===k ? "#fff" : "#94a3b8",
            padding:"7px 16px", fontSize:13, cursor:"pointer", fontWeight: section===k ? 700 : 400,
          }}>{l}</button>
        ))}
        <button onClick={onAnalyze} style={{ marginLeft:"auto", background:"transparent", border:"1px solid #334155", borderRadius:8, color:"#64748b", padding:"7px 12px", fontSize:12, cursor:"pointer" }}>↺ Re-analisar</button>
      </div>

      {/* Estrutura */}
      {section === "estrutura" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <div style={{ background:"#1e293b", borderRadius:10, padding:14, border:"1px solid #334155" }}>
              <div style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Tema Central</div>
              <div style={{ color:"#e2e8f0", fontSize:14 }}>{estrutura.tema || "—"}</div>
            </div>
            <div style={{ background:"#1e293b", borderRadius:10, padding:14, border:"1px solid #334155" }}>
              <div style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Gênero</div>
              <div style={{ color:"#7dd3fc", fontSize:14, fontWeight:700 }}>{estrutura.genero || "—"}</div>
            </div>
          </div>
          {[["🎬 Ato 1 — Apresentação","ato1","#7dd3fc"],["⚔️ Ato 2 — Desenvolvimento","ato2","#fbbf24"],["✅ Ato 3 — Resolução","ato3","#34d399"]].map(([title, key, color]) => (
            <div key={key} style={{ background:"#1e293b", borderRadius:10, padding:16, border:`1px solid #334155`, borderLeft:`3px solid ${color}` }}>
              <div style={{ fontSize:13, fontWeight:700, color, marginBottom:8 }}>{title}</div>
              <div style={{ color:"#cbd5e1", fontSize:14, lineHeight:1.7 }}>{estrutura[key] || "Não identificado."}</div>
            </div>
          ))}
        </div>
      )}

      {/* Personagens */}
      {section === "personagens" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {(personagens||[]).map((p, i) => (
            <div key={i} style={{ background:"#1e293b", borderRadius:10, padding:16, border:"1px solid #334155" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontWeight:800, color:"#fbbf24", fontSize:15 }}>{p.nome}</span>
                <span style={{ background: TIPO_COLOR[p.tipo]+"22", color: TIPO_COLOR[p.tipo], border:`1px solid ${TIPO_COLOR[p.tipo]}44`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{p.tipo}</span>
              </div>
              <p style={{ color:"#cbd5e1", fontSize:13, margin:"0 0 8px" }}>{p.descricao}</p>
              {p.cenas?.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {p.cenas.map((c,j) => <span key={j} style={{ background:"#0f172a", border:"1px solid #334155", borderRadius:6, padding:"2px 8px", fontSize:11, color:"#7dd3fc" }}>{c}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cenas */}
      {section === "cenas" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(cenas||[]).map((c, i) => (
            <div key={i} style={{ background:"#1e293b", borderRadius:10, padding:14, border:"1px solid #334155" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ background:"#0f172a", color:"#64748b", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700 }}>#{c.numero}</span>
                <span style={{ color:"#7dd3fc", fontWeight:700, fontSize:13 }}>{c.cabecalho}</span>
                <span style={{ marginLeft:"auto", background: (FUNC_COLOR[c.funcao]||"#475569")+"22", color: FUNC_COLOR[c.funcao]||"#94a3b8", border:`1px solid ${(FUNC_COLOR[c.funcao]||"#475569")}44`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{c.funcao}</span>
              </div>
              <p style={{ color:"#cbd5e1", fontSize:13, margin:"0 0 8px" }}>{c.resumo}</p>
              {c.personagens?.length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {c.personagens.map((p,j) => <span key={j} style={{ background:"#fbbf2415", border:"1px solid #fbbf2440", borderRadius:6, padding:"2px 8px", fontSize:11, color:"#fbbf24" }}>{p}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("editor");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [warn, setWarn] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const abortRef = useRef(false);

  const chars = input.trim().length;
  const estTokens = Math.ceil(chars / 4);
  const chunks = chars > 0 ? splitIntoChunks(input).length : 0;
  const validation = chars > 0 ? validate(input) : null;
  const sizePct = Math.min(100, Math.round((chars / (CHUNK_SIZE * 10)) * 100));
  const barColor = p => p > 85 ? "#f87171" : p > 50 ? "#fbbf24" : "#34d399";

  const attemptClean = () => {
    const v = validate(input);
    if (!v.ok) { if (v.level==="warn") { setWarn(v.msg); return; } setError(v.msg); return; }
    runClean();
  };

  const runClean = async () => {
    setWarn(null); setLoading(true); setError(null); setOutput(""); setAnalysis(null); abortRef.current = false;
    const parts = splitIntoChunks(input);
    setProgress({ done:0, total:parts.length });
    const results = [];
    for (let i = 0; i < parts.length; i++) {
      if (abortRef.current) break;
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1024, system:SYSTEM_CLEAN, messages:[{role:"user",content:parts[i]}] }) });
        const data = await res.json();
        results.push((data.content||[]).map(b=>b.text||"").join("").trim());
        setProgress({ done:i+1, total:parts.length });
        setOutput(results.join("\n\n"));
      } catch { setError(`Erro na parte ${i+1} de ${parts.length}.`); break; }
    }
    setLoading(false); setProgress(null);
  };

  const runAnalyze = async () => {
    if (!output.trim()) return;
    setAnalyzing(true); setAnalyzeError(null); setAnalysis(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:4096, system:SYSTEM_ANALYZE, messages:[{role:"user",content:output}] }) });
      const data = await res.json();
      const raw = (data.content||[]).map(b=>b.text||"").join("").trim();
      const clean = raw.replace(/```json|```/g,"").trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("JSON not found");
      setAnalysis(JSON.parse(match[0]));
    } catch { setAnalyzeError("Erro ao analisar o roteiro. Tente novamente."); }
    setAnalyzing(false);
  };

  const handleAnalyzeClick = () => { setTab("analise"); runAnalyze(); };

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#0f172a", minHeight:"100vh", padding:24, color:"#e2e8f0" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>

      {warn && (
        <div style={{ position:"fixed", inset:0, background:"#00000090", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#1e293b", border:"1px solid #f59e0b", borderRadius:16, padding:28, maxWidth:420, animation:"fadeIn .2s ease" }}>
            <div style={{ fontSize:22, marginBottom:10 }}>⚠️</div>
            <p style={{ color:"#fde68a", fontWeight:700, marginBottom:8 }}>Possível problema detectado</p>
            <p style={{ color:"#94a3b8", fontSize:14, marginBottom:20 }}>{warn}</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={runClean} style={{ flex:1, background:"#f59e0b", border:"none", borderRadius:8, padding:"10px 0", fontWeight:700, cursor:"pointer", color:"#0f172a" }}>Processar mesmo assim</button>
              <button onClick={() => setWarn(null)} style={{ flex:1, background:"transparent", border:"1px solid #475569", borderRadius:8, padding:"10px 0", cursor:"pointer", color:"#94a3b8" }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth:1100, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <h1 style={{ fontSize:26, fontWeight:800, color:"#fff", margin:0 }}>🧹 Screenplay Cleaner</h1>
          <p style={{ color:"#94a3b8", marginTop:6, fontSize:14 }}>Formate e analise seu roteiro no padrão Hollywood</p>
        </div>

        {/* Main Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:20, background:"#1e293b", borderRadius:12, padding:4, width:"fit-content" }}>
          {[["editor","✏️ Editor"],["analise","🔍 Análise"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              background: tab===k ? "#4f46e5" : "transparent",
              border:"none", borderRadius:8, color: tab===k ? "#fff" : "#64748b",
              padding:"8px 22px", fontSize:14, cursor:"pointer", fontWeight: tab===k ? 700 : 400, transition:"all .2s"
            }}>{l}</button>
          ))}
        </div>

        {/* ── EDITOR TAB ── */}
        {tab === "editor" && (
          <>
            {/* Legend */}
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:16 }}>
              {[["#7dd3fc","Cabeçalho"],["#fbbf24","Personagem"],["#a78bfa","Parêntese"],["#34d399","Transição"],["#e2e8f0","Ação/Diálogo"]].map(([c,l]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#94a3b8" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
                </div>
              ))}
            </div>

            {/* Stats */}
            {chars > 0 && (
              <div style={{ background:"#1e293b", border:`1px solid ${validation?.level==="error"?"#f87171":validation?.level==="warn"?"#f59e0b":"#334155"}`, borderRadius:10, padding:"10px 16px", marginBottom:14, display:"flex", flexWrap:"wrap", gap:14, alignItems:"center", fontSize:13 }}>
                <span style={{ color:"#94a3b8" }}>📏 <b style={{ color:"#e2e8f0" }}>{chars.toLocaleString()}</b> chars</span>
                <span style={{ color:"#94a3b8" }}>🔤 ~<b style={{ color:"#e2e8f0" }}>{estTokens.toLocaleString()}</b> tokens</span>
                <span style={{ color:"#94a3b8" }}>✂️ <b style={{ color:"#7dd3fc" }}>{chunks}</b> parte{chunks!==1?"s":""}</span>
                {validation?.ok && <span style={{ color:"#34d399" }}>✓ Roteiro válido</span>}
                {validation?.level==="warn" && <span style={{ color:"#f59e0b" }}>⚠️ Estrutura não reconhecida</span>}
                {validation?.level==="error" && <span style={{ color:"#f87171" }}>🚫 {validation.msg}</span>}
                <div style={{ flex:1, minWidth:80, height:4, background:"#334155", borderRadius:2 }}>
                  <div style={{ width:`${sizePct}%`, height:"100%", background:barColor(sizePct), borderRadius:2, transition:"width .3s" }} />
                </div>
              </div>
            )}

            {/* Progress */}
            {progress && (
              <div style={{ background:"#1e293b", border:"1px solid #4f46e5", borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                  <span style={{ color:"#94a3b8" }}>⏳ Parte <b style={{ color:"#e2e8f0" }}>{progress.done+1}</b> de <b style={{ color:"#e2e8f0" }}>{progress.total}</b></span>
                  <span style={{ color:"#7dd3fc" }}>{Math.round((progress.done/progress.total)*100)}%</span>
                </div>
                <div style={{ height:6, background:"#334155", borderRadius:3 }}>
                  <div style={{ width:`${(progress.done/progress.total)*100}%`, height:"100%", background:"linear-gradient(90deg,#4f46e5,#7c3aed)", borderRadius:3, transition:"width .4s ease" }} />
                </div>
              </div>
            )}

            {/* Panels */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div style={{ background:"#1e293b", borderRadius:14, border:"1px solid #334155", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid #334155" }}>
                  <span style={{ fontWeight:700, fontSize:13, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>📄 Roteiro</span>
                  <button onClick={() => setInput(EXAMPLE)} style={{ background:"transparent", border:"1px solid #475569", borderRadius:6, color:"#94a3b8", fontSize:12, padding:"4px 10px", cursor:"pointer" }}>Carregar exemplo</button>
                </div>
                <textarea value={input} onChange={e => { setInput(e.target.value); setError(null); }}
                  placeholder="Cole seu roteiro aqui — qualquer tamanho será dividido automaticamente..."
                  style={{ flex:1, minHeight:400, background:"transparent", border:"none", color:"#e2e8f0", fontSize:13, fontFamily:"Courier New, monospace", lineHeight:1.7, padding:16, resize:"none", outline:"none", boxSizing:"border-box" }} />
              </div>

              <div style={{ background:"#1e293b", borderRadius:14, border:"1px solid #334155", overflow:"hidden", display:"flex", flexDirection:"column" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid #334155" }}>
                  <span style={{ fontWeight:700, fontSize:13, color:"#94a3b8", textTransform:"uppercase", letterSpacing:1 }}>✨ Roteiro Limpo</span>
                  {output && (
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={handleAnalyzeClick} style={{ background:"#0f172a", border:"1px solid #4f46e5", borderRadius:6, color:"#7dd3fc", fontSize:12, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>🔍 Analisar</button>
                      <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                        style={{ background: copied?"#059669":"#4f46e5", border:"none", borderRadius:6, color:"#fff", fontSize:12, padding:"4px 12px", cursor:"pointer", fontWeight:600 }}>
                        {copied ? "✓ Copiado!" : "📋 Copiar"}
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ flex:1, minHeight:400, padding:16, fontSize:13, fontFamily:"Courier New, monospace", lineHeight:1.7, overflowY:"auto" }}>
                  {loading && !output ? (
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:360, gap:12, color:"#94a3b8" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", border:"3px solid #334155", borderTopColor:"#4f46e5", animation:"spin 0.8s linear infinite" }} />
                      <span>Processando parte 1 de {chunks}...</span>
                    </div>
                  ) : output ? highlight(output) : (
                    <div style={{ color:"#475569", fontStyle:"italic", paddingTop:8 }}>O roteiro formatado aparecerá aqui...</div>
                  )}
                </div>
              </div>
            </div>

            {error && <div style={{ marginTop:12, background:"#450a0a", border:"1px solid #f87171", borderRadius:10, padding:"12px 16px", color:"#fca5a5", fontSize:14 }}>🚫 {error}</div>}

            <div style={{ display:"flex", justifyContent:"center", marginTop:20, gap:12 }}>
              {loading ? (
                <button onClick={() => abortRef.current=true} style={{ background:"#7f1d1d", border:"1px solid #f87171", borderRadius:12, color:"#fca5a5", padding:"12px 28px", fontWeight:700, fontSize:15, cursor:"pointer" }}>⛔ Cancelar</button>
              ) : (
                <button onClick={attemptClean} disabled={!input.trim()||validation?.level==="error"}
                  style={{ background:!input.trim()||validation?.level==="error"?"#334155":"linear-gradient(135deg,#4f46e5,#7c3aed)", color:!input.trim()||validation?.level==="error"?"#64748b":"#fff", border:"none", borderRadius:12, padding:"12px 36px", fontWeight:700, fontSize:16, cursor:!input.trim()||validation?.level==="error"?"not-allowed":"pointer", boxShadow:!input.trim()?"none":"0 4px 20px #4f46e540", transition:"all .2s" }}>
                  {chunks > 1 ? `🧹 Limpar em ${chunks} partes` : "🧹 Limpar Roteiro"}
                </button>
              )}
              {(input||output) && !loading && (
                <button onClick={() => { setInput(""); setOutput(""); setError(null); setAnalysis(null); }} style={{ background:"transparent", border:"1px solid #334155", borderRadius:12, color:"#94a3b8", padding:"12px 20px", cursor:"pointer", fontSize:14 }}>Limpar tudo</button>
              )}
            </div>
          </>
        )}

        {/* ── ANÁLISE TAB ── */}
        {tab === "analise" && (
          <div style={{ background:"#1e293b", borderRadius:14, border:"1px solid #334155", padding:24 }}>
            <AnalysisTab analysis={analysis} loading={analyzing} error={analyzeError} onAnalyze={runAnalyze} hasOutput={!!output} />
          </div>
        )}
      </div>
    </div>
  );
}
