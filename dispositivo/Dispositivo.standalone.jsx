const { useState, useEffect, useCallback } = React;

const slides = [
  {
    kind: "cover",
    title: "O Dispositivo",
    subtitle: "Michel Foucault — História da Sexualidade",
    hint: "Use ← → ou espaço para navegar",
  },
  {
    kind: "question",
    eyebrow: "Ponto de partida",
    question:
      "De que tipo é esse novo objeto histórico que Foucault chama de \"sexualidade\"?",
    negations: [
      "Não é a sexualidade dos botânicos ou biólogos (história das ciências).",
      "Não é a da história tradicional das ideias ou dos costumes.",
      "Não é a das práticas sexuais estudadas pelos historiadores.",
    ],
    answer:
      "É um dispositivo de sexualidade. E \"dispositivo\" tem, para Foucault, um sentido e uma função metodológica precisos.",
  },
  {
    kind: "definition",
    eyebrow: "Primeiro traço",
    number: "1",
    heading: "Um conjunto resolutamente heterogêneo",
    body:
      "Discursos, instituições, disposições arquitetônicas, decisões regulamentares, leis, medidas administrativas, enunciados científicos, proposições filosóficas, morais, filantrópicas — o dito e o não dito.",
    highlight:
      "O dispositivo, em si, é a rede que se estabelece entre esses elementos.",
    chips: [
      "Discursos",
      "Instituições",
      "Arquitetura",
      "Regulamentos",
      "Leis",
      "Medidas administrativas",
      "Enunciados científicos",
      "Proposições filosóficas",
      "Morais",
      "Filantrópicas",
      "O não dito",
    ],
  },
  {
    kind: "definition",
    eyebrow: "Segundo traço",
    number: "2",
    heading: "A natureza do vínculo entre elementos heterogêneos",
    body:
      "Um mesmo discurso pode funcionar ora como programa de uma instituição, ora como justificação que mascara uma prática muda, ora como reinterpretação segunda que lhe dá acesso a um novo campo de racionalidade.",
    highlight:
      "Entre os elementos, discursivos ou não, há um jogo: mudanças de posição e modificações de funções.",
    roles: [
      { label: "Programa", note: "prescreve a instituição" },
      { label: "Máscara", note: "justifica a prática muda" },
      { label: "Reinterpretação", note: "abre nova racionalidade" },
    ],
  },
  {
    kind: "definition",
    eyebrow: "Terceiro traço",
    number: "3",
    heading: "Uma formação que responde a uma urgência",
    body:
      "Num dado momento histórico, o dispositivo tem por função maior responder a uma urgência. Ele possui, portanto, uma função estratégica dominante.",
    highlight:
      "Exemplo: reabsorver a população flutuante incômoda à economia mercantilista — imperativo estratégico que se tornou, pouco a pouco, dispositivo de controle-sujeição da loucura, da doença mental, da neurose.",
  },
  {
    kind: "genesis",
    eyebrow: "Gênese do dispositivo",
    heading: "Dois momentos essenciais",
    intro:
      "Um dispositivo se define por uma estrutura heterogênea, mas também por um certo tipo de gênese.",
    moments: [
      {
        label: "Momento 1",
        title: "Prevalência de um objetivo estratégico",
        text:
          "Uma urgência histórica impõe um imperativo; ele funciona como matriz do dispositivo.",
      },
      {
        label: "Momento 2",
        title: "Constituição do dispositivo como tal",
        text: "Ele permanece dispositivo enquanto lugar de um duplo processo.",
        subitems: [
          {
            title: "Sobredeterminação funcional",
            text:
              "Cada efeito — positivo ou negativo, desejado ou não — entra em ressonância ou contradição com os outros e exige reajustamentos.",
          },
          {
            title: "Preenchimento estratégico perpétuo",
            text:
              "Efeitos imprevistos são reutilizados e reinvestidos em novas estratégias.",
          },
        ],
      },
    ],
  },
  {
    kind: "case",
    eyebrow: "Um caso exemplar",
    heading: "A prisão e o meio delinquente",
    steps: [
      {
        title: "Urgência estratégica",
        text:
          "A detenção aparece, num dado momento, como o instrumento mais eficaz e razoável diante da criminalidade.",
      },
      {
        title: "Efeito imprevisto",
        text:
          "A prisão funciona como filtragem, concentração, profissionalização e fechamento de um meio delinquente — algo distinto da antiga semeadura de ilegalismos do século XVIII.",
      },
      {
        title: "Preenchimento estratégico",
        text:
          "A partir dos anos 1830, o meio delinquente é reutilizado para fins políticos e econômicos diversos — por exemplo, a extração de lucro sobre o prazer, com a organização da prostituição.",
      },
    ],
    closing:
      "O negativo e involuntário é transformado em positivo: eis o preenchimento estratégico do dispositivo.",
  },
  {
    kind: "synthesis",
    eyebrow: "Síntese",
    heading: "O dispositivo em três linhas",
    lines: [
      "Uma rede entre elementos heterogêneos — o dito e o não dito.",
      "Um jogo de funções que desloca e reposiciona esses elementos.",
      "Uma estratégia nascida de uma urgência, sempre retomada e reinvestida.",
    ],
    coda:
      "Não há sujeito trans-histórico que o pense: há efeitos que se organizam, ressoam e são reinvestidos.",
  },
];

function useKeyNavigation(onPrev, onNext) {
  useEffect(() => {
    function handler(e) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        onPrev();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onPrev, onNext]);
}

function Cover({ slide }) {
  return (
    <div className="slide slide-cover">
      <div className="cover-rule" />
      <h1 className="cover-title">{slide.title}</h1>
      <p className="cover-subtitle">{slide.subtitle}</p>
      <p className="cover-hint">{slide.hint}</p>
    </div>
  );
}

function Question({ slide }) {
  return (
    <div className="slide">
      <div className="eyebrow">{slide.eyebrow}</div>
      <h2 className="question">{slide.question}</h2>
      <ul className="negations">
        {slide.negations.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
      <p className="answer">{slide.answer}</p>
    </div>
  );
}

function Definition({ slide }) {
  return (
    <div className="slide">
      <div className="eyebrow">{slide.eyebrow}</div>
      <div className="definition-head">
        <div className="number">{slide.number}</div>
        <h2 className="heading">{slide.heading}</h2>
      </div>
      <p className="body">{slide.body}</p>
      {slide.chips && (
        <div className="chips">
          {slide.chips.map((c, i) => (
            <span className="chip" key={i}>
              {c}
            </span>
          ))}
        </div>
      )}
      {slide.roles && (
        <div className="roles">
          {slide.roles.map((r, i) => (
            <div className="role" key={i}>
              <div className="role-label">{r.label}</div>
              <div className="role-note">{r.note}</div>
            </div>
          ))}
        </div>
      )}
      <div className="highlight">{slide.highlight}</div>
    </div>
  );
}

function Genesis({ slide }) {
  return (
    <div className="slide">
      <div className="eyebrow">{slide.eyebrow}</div>
      <h2 className="heading">{slide.heading}</h2>
      <p className="body">{slide.intro}</p>
      <div className="moments">
        {slide.moments.map((m, i) => (
          <div className="moment" key={i}>
            <div className="moment-label">{m.label}</div>
            <div className="moment-title">{m.title}</div>
            <p className="moment-text">{m.text}</p>
            {m.subitems && (
              <div className="subitems">
                {m.subitems.map((s, j) => (
                  <div className="subitem" key={j}>
                    <div className="subitem-title">{s.title}</div>
                    <div className="subitem-text">{s.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Case({ slide }) {
  return (
    <div className="slide">
      <div className="eyebrow">{slide.eyebrow}</div>
      <h2 className="heading">{slide.heading}</h2>
      <ol className="steps">
        {slide.steps.map((s, i) => (
          <li key={i}>
            <div className="step-title">{s.title}</div>
            <div className="step-text">{s.text}</div>
          </li>
        ))}
      </ol>
      <div className="highlight">{slide.closing}</div>
    </div>
  );
}

function Synthesis({ slide }) {
  return (
    <div className="slide">
      <div className="eyebrow">{slide.eyebrow}</div>
      <h2 className="heading">{slide.heading}</h2>
      <ul className="lines">
        {slide.lines.map((l, i) => (
          <li key={i}>
            <span className="bullet">—</span>
            <span>{l}</span>
          </li>
        ))}
      </ul>
      <p className="coda">{slide.coda}</p>
    </div>
  );
}

function renderSlide(slide) {
  switch (slide.kind) {
    case "cover":
      return <Cover slide={slide} />;
    case "question":
      return <Question slide={slide} />;
    case "definition":
      return <Definition slide={slide} />;
    case "genesis":
      return <Genesis slide={slide} />;
    case "case":
      return <Case slide={slide} />;
    case "synthesis":
      return <Synthesis slide={slide} />;
    default:
      return null;
  }
}

function Dispositivo() {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const next = useCallback(
    () => setIndex((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useKeyNavigation(prev, next);

  return (
    <div className="stage">
      <div className="frame">
        {renderSlide(slides[index])}
        <footer className="footer">
          <div className="progress">
            {slides.map((_, i) => (
              <span
                key={i}
                className={"dot" + (i === index ? " active" : "")}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <div className="counter">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </div>
          <div className="controls">
            <button onClick={prev} disabled={index === 0} aria-label="Anterior">
              ←
            </button>
            <button
              onClick={next}
              disabled={index === total - 1}
              aria-label="Próximo"
            >
              →
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Dispositivo />);
