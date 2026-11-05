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
  {
    id: "bp-company",
    name: "BP Company",
    initials: "BP",
    image: publicUrl("projects/bp-company-cover.jpg"),
  },
  {
    id: "bikcraft",
    name: "Bikcraft",
    initials: "BK",
    image: publicUrl("projects/bikcraft-cover.jpg"),
  },
  {
    id: "dogs",
    name: "Dogs",
    initials: "DG",
    image: publicUrl("projects/dogs-cover.jpg"),
  },
  {
    id: "portfolio",
    name: "Portfólio",
    initials: "P",
    image: publicUrl("projects/portfolio-cover.jpg"),
  },
];

/**
 * Beats da apresentação (~7s no total).
 * `visual`: creative (abstrato), photo (retrato) ou works (mosaico).
 * `photo` opcional: caminho público do retrato do beat.
 */
const INTRO_SLIDES = [
  {
    visual: "creative" as const,
    durationMs: 2200,
    lines: [
      { text: "Bem-vindo", tone: "plain" as const },
      { text: "à minha vida", tone: "script" as const },
    ],
  },
  {
    visual: "photo" as const,
    photo: publicUrl("profile/renan-smile.jpg"),
    photoPosition: "50% 18%",
    durationMs: 2200,
    lines: [
      { text: "Eu sou Renan Naves", tone: "script" as const },
      { text: "Desenvolvedor de Software", tone: "plain" as const },
    ],
  },
  {
    visual: "works" as const,
    durationMs: 2800,
    lines: [{ text: "Este é o meu mundo", tone: "plain" as const }],
  },
];

/** Duração do fade entre beats (ms) — deve bater com o CSS. */
const SLIDE_FADE_MS = 350;

/** Duração do fade final da overlay (ms). */
const EXIT_FADE_MS = 700;

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

/**
 * Painel criativo do beat “Bem-vindo”: portal abstrato (código + órbitas),
 * sem foto pessoal — convite visual para a vida/trabalho do Renan.
 */
function IntroCreativePanel() {
  return (
    <div className="intro-creative" aria-hidden="true">
      <div className="intro-creative__glow" />
      <div className="intro-creative__ring intro-creative__ring--a" />
      <div className="intro-creative__ring intro-creative__ring--b" />
      <div className="intro-creative__grid" />
      <p className="intro-creative__line intro-creative__line--1">{`<life />`}</p>
      <p className="intro-creative__line intro-creative__line--2">
        {"const path = 'create'"}
      </p>
      <p className="intro-creative__line intro-creative__line--3">{"{ code }"}</p>
      <p className="intro-creative__line intro-creative__line--4">design · build</p>
      <span className="intro-creative__dot intro-creative__dot--1" />
      <span className="intro-creative__dot intro-creative__dot--2" />
      <span className="intro-creative__dot intro-creative__dot--3" />
    </div>
  );
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Apresentação: texto à esquerda + visual full-bleed à direita
 * (criativo → retrato → mosaico), no mesmo encaixe da foto da home.
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
  const photoSrc =
    "photo" in slide && slide.photo
      ? slide.photo
      : publicUrl("profile/renan-profile.png");
  const photoPosition =
    "photoPosition" in slide && slide.photoPosition
      ? slide.photoPosition
      : undefined;

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
      {/* Visual à direita — mesmo encaixe full-bleed da home (sem caixa) */}
      <div
        key={`visual-${index}-${phase}`}
        className={[
          "intro-visual pointer-events-none absolute inset-0 -z-0",
          phase === "in" ? "intro-line--in" : "intro-line--out",
        ].join(" ")}
        aria-hidden="true"
      >
        {slide.visual === "creative" ? (
          <div className="intro-visual__bleed intro-visual__bleed--creative">
            <IntroCreativePanel />
            <div className="intro-visual__edge intro-visual__edge--soft" />
          </div>
        ) : slide.visual === "works" ? (
          <div className="intro-visual__bleed intro-visual__bleed--works">
            <ul className="intro-works">
              {INTRO_WORKS.map((work, i) => (
                <li
                  key={work.id}
                  className="intro-work-card"
                  style={{ animationDelay: `${80 + i * 70}ms` }}
                >
                  {work.image ? (
                    <img src={work.image} alt="" className="intro-work-card__img" />
                  ) : (
                    <span className="intro-work-card__mono">{work.initials}</span>
                  )}
                  <span className="intro-work-card__name">{work.name}</span>
                </li>
              ))}
            </ul>
            <div className="intro-visual__edge intro-visual__edge--works" />
          </div>
        ) : (
          <div className="intro-visual__bleed">
            <img
              src={photoSrc}
              alt=""
              className="intro-portrait__img"
              style={photoPosition ? { objectPosition: photoPosition } : undefined}
            />
            <div className="intro-visual__edge" />
            <div className="intro-portrait__fade" />
          </div>
        )}
      </div>

      {/* Texto à esquerda, sobre o visual */}
      <div
        key={`copy-${index}-${phase}`}
        className={[
          "relative z-10 flex h-full w-full flex-col justify-center px-5 py-12 sm:px-8 md:px-10 md:py-10 lg:px-16 xl:px-20",
          phase === "in" ? "intro-line--in" : "intro-line--out",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-full flex-col items-start gap-4 text-left md:gap-5 lg:gap-6",
            slide.visual === "works"
              ? "max-w-[min(92%,22rem)] md:max-w-[36%] lg:max-w-[34%]"
              : "max-w-[min(92%,28rem)] md:max-w-[46%] lg:max-w-[44%]",
          ].join(" ")}
        >
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
