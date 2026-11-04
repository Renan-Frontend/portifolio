import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS
// =============================================================================

type ProjectSlide = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /**
   * Capa do projeto no carrossel.
   * Trocar depois por arquivos em /public/projects/.
   */
  cover: string;
  /** Tom de reforço sob a imagem (fallback se a capa falhar). */
  accent: string;
};

/** Slides do carrossel de projetos. */
const PROJECT_SLIDES: ProjectSlide[] = [
  {
    id: "monsterland",
    name: "Monsterland",
    tagline: "Experiência interativa",
    description:
      "Projeto focado em interfaces envolventes, exploração visual e interação com o usuário.",
    cover: "https://picsum.photos/seed/monsterland-ui/1400/900",
    accent: "from-violet-600/40 via-neutral-900 to-neutral-950",
  },
  {
    id: "plataforma-educacao",
    name: "Plataforma Educação",
    tagline: "Produto digital",
    description:
      "Aplicação voltada à aprendizagem, com interfaces claras, responsivas e acessíveis.",
    cover: "https://picsum.photos/seed/educacao-app/1400/900",
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "rotina-tracker",
    name: "Rotina Tracker",
    tagline: "Produtividade",
    description:
      "Ferramenta para organização de hábitos e rotinas, com foco em usabilidade e clareza.",
    cover: "https://picsum.photos/seed/rotina-desk/1400/900",
    accent: "from-fuchsia-600/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "portfolio",
    name: "Portfólio",
    tagline: "Identidade digital",
    description:
      "Este próprio site — apresentação profissional com navegação por seções e animações.",
    cover: "https://picsum.photos/seed/portfolio-dark/1400/900",
    accent: "from-purple-500/35 via-neutral-900 to-neutral-950",
  },
];

/** Quantidade de slides reais. */
const SLIDE_COUNT = PROJECT_SLIDES.length;

/**
 * Três cópias: [A B C D][A B C D][A B C D].
 * O usuário permanece na cópia do meio; nas pontas saltamos o scrollLeft.
 */
const LOOP_COPIES = 3;

type LoopedSlide = ProjectSlide & {
  loopIndex: number;
  logicalIndex: number;
  loopKey: string;
};

/** Lista renderizada do carrossel infinito. */
const LOOPED_SLIDES: LoopedSlide[] = Array.from(
  { length: LOOP_COPIES * SLIDE_COUNT },
  (_, loopIndex) => {
    const logicalIndex = loopIndex % SLIDE_COUNT;
    const slide = PROJECT_SLIDES[logicalIndex];
    return {
      ...slide,
      loopIndex,
      logicalIndex,
      loopKey: `${slide.id}-${loopIndex}`,
    };
  },
);

// =============================================================================
// TIPOS
// =============================================================================

type ProjectsPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a página Experiência. */
  onExperience: () => void;
  /** Id do projeto a focar no carrossel (hash individual). */
  initialProjectId?: string;
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/** Índice lógico do slide a partir do id, ou 0 se não encontrado. */
function indexFromProjectId(id: string | undefined): number {
  if (!id) return 0;
  const index = PROJECT_SLIDES.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

/** Índice absoluto na cópia do meio. */
function middleLoopIndex(logicalIndex: number): number {
  return SLIDE_COUNT + logicalIndex;
}

/** Largura de uma cópia completa (todos os slides + gaps). */
function measureSetWidth(track: HTMLDivElement): number {
  const first = track.querySelector<HTMLElement>('[data-loop-index="0"]');
  const next = track.querySelector<HTMLElement>(
    `[data-loop-index="${SLIDE_COUNT}"]`,
  );
  if (!first || !next) return 0;
  return next.offsetLeft - first.offsetLeft;
}

/** Centraliza um card no track sem animação (salto / mount). */
function jumpCenterCard(track: HTMLDivElement, loopIndex: number) {
  const card = track.querySelector<HTMLElement>(
    `[data-loop-index="${loopIndex}"]`,
  );
  if (!card) return;

  const trackBox = track.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();
  const delta =
    cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2);
  track.scrollLeft += delta;
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Projetos: marca d’água e carrossel horizontal em loop.
 * Scroll nativo + snap; o React só atualiza o destaque e corrige o loop.
 */
function ProjectsPage({
  onBack,
  onExperience,
  initialProjectId,
}: ProjectsPageProps) {
  // ----- estado -----
  const [activeLoopIndex, setActiveLoopIndex] = useState(() =>
    middleLoopIndex(indexFromProjectId(initialProjectId)),
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const activeLoopIndexRef = useRef(activeLoopIndex);
  /** Arraste com mouse. */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  /** Impede normalizar/atualizar no meio de um salto de loop. */
  const isJumpingRef = useRef(false);

  activeLoopIndexRef.current = activeLoopIndex;

  // ----- efeitos -----

  // ----- handlers (refs estáveis para listeners de mount) -----

  /** Índice absoluto do card mais próximo do centro. */
  function closestLoopIndex(): number {
    const track = trackRef.current;
    if (!track) return activeLoopIndexRef.current;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-loop-index]"),
    );
    if (cards.length === 0) return activeLoopIndexRef.current;

    const trackBox = track.getBoundingClientRect();
    const trackCenter = trackBox.left + trackBox.width / 2;
    let closest = activeLoopIndexRef.current;
    let closestDist = Number.POSITIVE_INFINITY;

    for (const card of cards) {
      const loopIndex = Number(card.dataset.loopIndex);
      if (Number.isNaN(loopIndex)) continue;

      const box = card.getBoundingClientRect();
      const cardCenter = box.left + box.width / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = loopIndex;
      }
    }

    return closest;
  }

  /**
   * Se o scroll caiu na 1ª ou 3ª cópia, desloca scrollLeft em 1 set
   * e atualiza o índice — sem animação, sem scrollIntoView.
   */
  function normalizeLoopIfNeeded() {
    const track = trackRef.current;
    if (!track || isJumpingRef.current || isDraggingRef.current) return;

    const closest = closestLoopIndex();
    if (closest >= SLIDE_COUNT && closest < SLIDE_COUNT * 2) {
      setActiveLoopIndex((current) =>
        current === closest ? current : closest,
      );
      return;
    }

    const setWidth = measureSetWidth(track);
    if (setWidth <= 0) return;

    const delta = closest < SLIDE_COUNT ? setWidth : -setWidth;
    const nextIndex =
      closest < SLIDE_COUNT ? closest + SLIDE_COUNT : closest - SLIDE_COUNT;

    isJumpingRef.current = true;
    track.classList.add("is-jumping");
    track.scrollLeft += delta;
    setActiveLoopIndex(nextIndex);

    requestAnimationFrame(() => {
      track.classList.remove("is-jumping");
      isJumpingRef.current = false;
    });
  }

  const normalizeLoopRef = useRef(normalizeLoopIfNeeded);
  normalizeLoopRef.current = normalizeLoopIfNeeded;

  /** Posiciona na cópia do meio e escuta scrollend nativo. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    isJumpingRef.current = true;
    jumpCenterCard(track, activeLoopIndexRef.current);
    requestAnimationFrame(() => {
      isJumpingRef.current = false;
    });

    /** Normaliza o loop quando a inércia/snap termina. */
    function onScrollEnd() {
      if (isDraggingRef.current) return;
      normalizeLoopRef.current();
    }

    track.addEventListener("scrollend", onScrollEnd);
    return () => track.removeEventListener("scrollend", onScrollEnd);
  }, []);

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Navega para Experiência. */
  function handleExperience(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onExperience();
  }

  /** Só atualiza o destaque visual durante o scroll (não mexe no scroll). */
  function handleTrackScroll() {
    if (isJumpingRef.current || isDraggingRef.current) return;

    const closest = closestLoopIndex();
    setActiveLoopIndex((current) => (current === closest ? current : closest));
  }

  /** Ao terminar o gesto/inércia (React): encaixa o loop no meio se preciso. */
  function handleScrollEnd() {
    if (isDraggingRef.current) return;
    normalizeLoopIfNeeded();
  }

  /** Inicia o arraste horizontal com o mouse. */
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragScrollLeftRef.current = track.scrollLeft;
    setIsDragging(true);
    track.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  /** Move o carrossel acompanhando o mouse. */
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const dx = event.clientX - dragStartXRef.current;
    track.scrollLeft = dragScrollLeftRef.current - dx;

    const closest = closestLoopIndex();
    setActiveLoopIndex((current) => (current === closest ? current : closest));
  }

  /** Solta o arraste; o snap CSS encaixa e o scrollend normaliza o loop. */
  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    // Pequeno atraso para o snap voltar a atuar após remover is-dragging.
    requestAnimationFrame(() => {
      normalizeLoopIfNeeded();
    });
  }

  /** Impede que o clique no CTA inicie o arraste do carrossel. */
  function stopCarouselDrag(event: ReactPointerEvent<HTMLAnchorElement>) {
    event.stopPropagation();
  }

  // ----- interface -----
  return (
    <main className="projects-page relative isolate flex min-h-svh w-full flex-col bg-neutral-950 text-white">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Projetos
      </h1>

      <section className="projects-layout about-layout relative z-10 mx-auto flex w-full flex-1 flex-col justify-center px-0 pb-3 md:pb-2">
        <div className="about-enter__facts relative w-full py-5 md:py-8">
          <div className="projects-carousel-shell relative w-full">
            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              onScrollEnd={handleScrollEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={[
                "projects-carousel flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[max(1rem,calc((100%-min(42rem,88vw))/2))] py-8 md:gap-8 md:px-[max(1.5rem,calc((100%-min(52rem,62vw))/2))] md:py-10",
                isDragging
                  ? "is-dragging cursor-grabbing select-none"
                  : "cursor-grab",
              ].join(" ")}
              aria-label="Carrossel de projetos"
            >
              {LOOPED_SLIDES.map((slide) => {
                const isActive = slide.loopIndex === activeLoopIndex;
                return (
                  <article
                    key={slide.loopKey}
                    data-loop-index={slide.loopIndex}
                    data-logical-index={slide.logicalIndex}
                    className={[
                      // Altura fixa: evita “pulo” ao trocar o ativo no meio do gesto
                      "projects-carousel__card relative flex h-[min(66vh,38rem)] w-[min(42rem,88vw)] shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl origin-center md:h-[min(70vh,42rem)] md:w-[min(52rem,62vw)]",
                      isActive
                        ? "projects-carousel__card--active z-10 scale-100 opacity-100"
                        : "projects-carousel__card--side z-0 scale-[0.86] opacity-50",
                      `bg-linear-to-br ${slide.accent}`,
                    ].join(" ")}
                  >
                    {/*
                      Capa dentro da moldura: inset + raio interno
                      para a imagem ficar certinha no quadrado.
                    */}
                    <div className="projects-carousel__media pointer-events-none absolute overflow-hidden">
                      <img
                        src={slide.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover object-center select-none"
                      />
                      <div className="absolute inset-0 bg-neutral-950/20" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.16),transparent_55%)]" />
                      <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/5" />
                    </div>

                    {/* Cantoneiras em L (só as quinas, sem linhas entre elas) */}
                    <div
                      className={[
                        "projects-carousel__corners pointer-events-none absolute inset-0 z-20",
                        isActive
                          ? "projects-carousel__corners--active"
                          : "projects-carousel__corners--side",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                        <svg
                          key={corner}
                          className={`projects-carousel__corner projects-carousel__corner--${corner}`}
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <path
                            className="projects-carousel__corner-path"
                            d="M42 7 H18 C11 7 7 11 7 18 V42"
                            stroke="currentColor"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ))}
                    </div>

                    <div className="relative z-10 flex flex-col gap-5 p-6 md:gap-6 md:p-8 lg:p-9">
                      <div>
                        <p className="text-xs tracking-[0.2em] text-purple-300/90 uppercase md:text-sm">
                          {slide.tagline}
                        </p>
                        <h2 className="mt-2.5 text-[clamp(1.4rem,3.2vw,2.2rem)] font-semibold tracking-wide text-neutral-50">
                          {slide.name}
                        </h2>
                        <p
                          className={[
                            "experience-copy mt-2.5 max-w-xl text-pretty",
                            isActive ? "text-neutral-200" : "text-neutral-400",
                          ].join(" ")}
                        >
                          {avoidOrphan(slide.description)}
                        </p>
                      </div>

                      <a
                        href={`#${slide.id}`}
                        onPointerDown={stopCarouselDrag}
                        onClick={(event) => event.stopPropagation()}
                        className={[
                          "inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium tracking-wide transition-[transform,background-color,border-color,opacity,color] duration-300 ease-out",
                          isActive
                            ? "pointer-events-auto border-purple-300/55 bg-purple-500/20 text-purple-100 opacity-100 hover:border-purple-200 hover:bg-purple-500/30"
                            : "pointer-events-none border-white/10 bg-white/5 text-neutral-400 opacity-0",
                        ].join(" ")}
                        tabIndex={isActive ? 0 : -1}
                        aria-hidden={!isActive}
                      >
                        <span>Ver projeto</span>
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <div
              className="projects-carousel-edge projects-carousel-edge--left pointer-events-none absolute inset-y-0 left-0 z-20 w-10 md:w-16 lg:w-24"
              aria-hidden="true"
            />
            <div
              className="projects-carousel-edge projects-carousel-edge--right pointer-events-none absolute inset-y-0 right-0 z-20 w-10 md:w-16 lg:w-24"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label="Navegação da página Projetos"
        >
          <a
            href="#"
            onClick={handleBack}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:-translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Página inicial</span>
          </a>

          <a
            href="#experience"
            onClick={handleExperience}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <span className="truncate">Experiência</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default ProjectsPage;
