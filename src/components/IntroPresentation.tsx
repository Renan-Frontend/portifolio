import { useEffect, useRef, useState } from "react";
import { publicUrl } from "../utils/publicUrl";

// =============================================================================
// DADOS
// =============================================================================

/**
 * Projetos exibidos no mosaico da intro.
 * `image` fica pronto para prints reais em /public/projects/ depois.
 */
const INTRO_WORKS = [
  { id: "bp-company", name: "BP Company", initials: "BP", image: null as string | null },
  {
    id: "plataforma-educacao",
    name: "Plataforma Educação",
    initials: "PE",
    image: null as string | null,
  },
  { id: "rotina-tracker", name: "Rotina Tracker", initials: "RT", image: null as string | null },
  { id: "portfolio", name: "Portfólio", initials: "P", image: null as string | null },
];

/**
 * Beats da apresentação (~7s no total).
 * `visual`: retrato à direita ou mosaico de trabalhos.
 */
const INTRO_SLIDES = [
  {
    visual: "photo" as const,
    durationMs: 2200,
    lines: [
      { text: "Bem-vindo", tone: "plain" as const },
      { text: "à minha vida", tone: "script" as const },
    ],
  },
  {
    visual: "photo" as const,
    durationMs: 2200,
    lines: [
      { text: "Eu sou Renan Naves", tone: "script" as const },
      { text: "Desenvolvedor de Software", tone: "plain" as const },
    ],
  },
  {
    visual: "works" as const,
    durationMs: 2100,
    lines: [{ text: "Este é o meu mundo", tone: "plain" as const }],
  },
];

/** Duração do fade entre beats (ms) — deve bater com o CSS. */
const SLIDE_FADE_MS = 350;

/** Duração do fade final da overlay (ms). */
const EXIT_FADE_MS = 700;

/** Foto usada no painel direito da intro. */
const INTRO_PHOTO = publicUrl("profile/renan-profile.png");

// =============================================================================
// TIPOS
// =============================================================================

type IntroPresentationProps = {
  /** Chamado quando a intro termina (ou o usuário pula). */
  onComplete: () => void;
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/** Diz se o usuário pediu menos movimento no sistema. */
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Apresentação em duas colunas: texto à esquerda, foto/mosaico menor à direita.
 * Pode ser pulada a qualquer momento.
 */
function IntroPresentation({ onComplete }: IntroPresentationProps) {
  // ----- estado -----
  /** Índice do beat atual. */
  const [index, setIndex] = useState(0);

  /** Entrada ou saída do conteúdo do beat. */
  const [phase, setPhase] = useState<"in" | "out">("in");

  /** Fade final da overlay antes de sumir. */
  const [exiting, setExiting] = useState(false);

  /** Ref estável para não reiniciar a sequência a cada render do pai. */
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // ----- efeitos -----

  /**
   * Avança os beats no tempo.
   * Com prefers-reduced-motion, encerra a intro imediatamente.
   */
  useEffect(() => {
    if (prefersReducedMotion()) {
      onCompleteRef.current();
      return;
    }

    document.body.style.overflow = "hidden";

    let fadeTimer: number | undefined;
    let nextTimer: number | undefined;
    let exitTimer: number | undefined;

    /** Agenda a saída do beat atual e a entrada do próximo (ou o fim). */
    const schedule = (current: number) => {
      const duration = INTRO_SLIDES[current].durationMs;

      fadeTimer = window.setTimeout(() => {
        setPhase("out");

        nextTimer = window.setTimeout(() => {
          const next = current + 1;

          if (next >= INTRO_SLIDES.length) {
            setExiting(true);
            exitTimer = window.setTimeout(
              () => onCompleteRef.current(),
              EXIT_FADE_MS,
            );
            return;
          }

          setIndex(next);
          setPhase("in");
          schedule(next);
        }, SLIDE_FADE_MS);
      }, duration);
    };

    schedule(0);

    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  // ----- handlers -----

  /** Interrompe a sequência e libera o portfólio na hora. */
  function skip() {
    document.body.style.overflow = "";
    onCompleteRef.current();
  }

  // ----- interface -----
  const slide = INTRO_SLIDES[index];
  const showWorks = slide.visual === "works";

  return (
    <div
      className={[
        "intro-overlay fixed inset-0 z-50 overflow-hidden bg-neutral-950",
        exiting ? "intro-overlay--exit" : "",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label="Apresentação inicial"
    >
      {/* Atmosfera suave no fundo (sem foto full-bleed) */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(196,181,253,0.1),transparent_55%)]"
        aria-hidden="true"
      />

      {/* Layout: texto | imagem — usa quase a tela toda */}
      <div
        key={`${index}-${phase}`}
        className={[
          "relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col items-center justify-center gap-10 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-10 lg:gap-14 lg:px-16 xl:px-20",
          phase === "in" ? "intro-line--in" : "intro-line--out",
        ].join(" ")}
      >
        {/* ----- Coluna esquerda: texto (grande, ocupa bem a metade) ----- */}
        <div className="flex w-full flex-col items-start gap-4 text-left md:w-[50%] md:max-w-none md:gap-5 lg:gap-6">
          {slide.lines.map((line) => (
            <p
              key={line.text}
              className={[
                "leading-none",
                line.tone === "script"
                  ? "font-script max-w-[11ch] text-[clamp(3.75rem,14vw,8.5rem)] text-purple-300"
                  : "max-w-[18ch] text-[clamp(1.45rem,5vw,2.85rem)] tracking-[0.16em] text-neutral-200 uppercase",
              ].join(" ")}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* ----- Coluna direita: foto / mosaico (maior, ~metade da tela) ----- */}
        <div className="flex w-full max-w-[min(92vw,420px)] shrink-0 justify-center min-[430px]:max-w-[min(88vw,480px)] md:max-w-[min(46vw,560px)] lg:max-w-[min(44vw,620px)]">
          {showWorks ? (
            <ul className="intro-works grid w-full grid-cols-2 gap-3 sm:gap-4 md:gap-5">
              {INTRO_WORKS.map((work, i) => (
                <li
                  key={work.id}
                  className="intro-work-card"
                  style={{ animationDelay: `${80 + i * 70}ms` }}
                >
                  {work.image ? (
                    <img
                      src={work.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-70"
                    />
                  ) : (
                    <span className="intro-work-card__mono" aria-hidden="true">
                      {work.initials}
                    </span>
                  )}
                  <span className="intro-work-card__name">{work.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="intro-portrait" aria-hidden="true">
              <img
                src={INTRO_PHOTO}
                alt=""
                className="intro-portrait__img"
              />
              <div className="intro-portrait__fade" />
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-5 bottom-6 z-20 text-xs tracking-[0.25em] text-neutral-400 uppercase transition hover:text-purple-300 min-[390px]:right-6 min-[390px]:bottom-8 min-[390px]:text-sm"
      >
        Pular
      </button>
    </div>
  );
}

export default IntroPresentation;
