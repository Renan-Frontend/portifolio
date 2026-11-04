import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
  /** Placeholder visual até haver print em /public/projects/. */
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
    accent: "from-violet-600/40 via-neutral-900 to-neutral-950",
  },
  {
    id: "plataforma-educacao",
    name: "Plataforma Educação",
    tagline: "Produto digital",
    description:
      "Aplicação voltada à aprendizagem, com interfaces claras, responsivas e acessíveis.",
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "rotina-tracker",
    name: "Rotina Tracker",
    tagline: "Produtividade",
    description:
      "Ferramenta para organização de hábitos e rotinas, com foco em usabilidade e clareza.",
    accent: "from-fuchsia-600/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "portfolio",
    name: "Portfólio",
    tagline: "Identidade digital",
    description:
      "Este próprio site — apresentação profissional com navegação por seções e animações.",
    accent: "from-purple-500/35 via-neutral-900 to-neutral-950",
  },
];

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

/** Índice do slide a partir do id, ou 0 se não encontrado. */
function indexFromProjectId(id: string | undefined): number {
  if (!id) return 0;
  const index = PROJECT_SLIDES.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Projetos: marca d’água no topo e carrossel grande horizontal.
 * Desktop e mobile com scroll/snap; setas para avançar à direita.
 */
function ProjectsPage({
  onBack,
  onExperience,
  initialProjectId,
}: ProjectsPageProps) {
  // ----- estado -----
  const [activeIndex, setActiveIndex] = useState(() =>
    indexFromProjectId(initialProjectId),
  );
  const trackRef = useRef<HTMLDivElement>(null);
  /** Ignora onScroll enquanto o scroll programático (setas / hash) ainda anima. */
  const ignoreScrollSyncRef = useRef(true);
  const scrollUnlockTimerRef = useRef<number | null>(null);
  /** Arraste com mouse (pressionar e jogar para o lado). */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // ----- efeitos -----

  /**
   * Centraliza o slide ativo no track.
   * Bloqueia sync do onScroll até o scroll programático estabilizar no alvo
   * (scrollend + poll; sem timeout curto que libera no meio do caminho).
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || isDraggingRef.current) return;

    const card = track.querySelector<HTMLElement>(
      `[data-slide-index="${activeIndex}"]`,
    );
    if (!card) return;

    ignoreScrollSyncRef.current = true;
    if (scrollUnlockTimerRef.current !== null) {
      window.clearTimeout(scrollUnlockTimerRef.current);
      scrollUnlockTimerRef.current = null;
    }

    let cancelled = false;
    let rafId = 0;

    /** Libera a sincronização manual após o scroll programático. */
    function unlockScrollSync() {
      if (cancelled) return;
      ignoreScrollSyncRef.current = false;
      if (scrollUnlockTimerRef.current !== null) {
        window.clearTimeout(scrollUnlockTimerRef.current);
        scrollUnlockTimerRef.current = null;
      }
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    /** Diz se o centro do track já está alinhado ao card alvo. */
    function isNearTarget() {
      const trackBox = track.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      const trackCenter = trackBox.left + trackBox.width / 2;
      const cardCenter = cardBox.left + cardBox.width / 2;
      return Math.abs(cardCenter - trackCenter) < 28;
    }

    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    track.addEventListener("scrollend", unlockScrollSync, { once: true });

    // Fallback sem scrollend: só libera quando para perto do alvo (ou após 2s).
    let lastLeft = track.scrollLeft;
    let stableMs = 0;
    const startedAt = performance.now();

    /** Observa estabilização do scroll até o card alvo. */
    function pollSettle(now: number) {
      if (cancelled || !ignoreScrollSyncRef.current) return;

      const left = track.scrollLeft;
      if (Math.abs(left - lastLeft) < 0.5) {
        stableMs += 16;
      } else {
        stableMs = 0;
        lastLeft = left;
      }

      if ((stableMs >= 120 && isNearTarget()) || now - startedAt > 2000) {
        unlockScrollSync();
        return;
      }

      rafId = window.requestAnimationFrame(pollSettle);
    }

    rafId = window.requestAnimationFrame(pollSettle);
    scrollUnlockTimerRef.current = window.setTimeout(unlockScrollSync, 2000);

    return () => {
      cancelled = true;
      track.removeEventListener("scrollend", unlockScrollSync);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (scrollUnlockTimerRef.current !== null) {
        window.clearTimeout(scrollUnlockTimerRef.current);
        scrollUnlockTimerRef.current = null;
      }
    };
  }, [activeIndex]);

  // ----- handlers -----

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

  /** Vai para o slide anterior. */
  function goPrev() {
    setActiveIndex((index) =>
      index === 0 ? PROJECT_SLIDES.length - 1 : index - 1,
    );
  }

  /** Vai para o próximo slide (à direita). */
  function goNext() {
    setActiveIndex((index) =>
      index === PROJECT_SLIDES.length - 1 ? 0 : index + 1,
    );
  }

  /** Índice do card cujo centro está mais perto do meio do track. */
  function closestSlideIndex(): number {
    const track = trackRef.current;
    if (!track) return activeIndex;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide-index]"),
    );
    if (cards.length === 0) return activeIndex;

    const trackBox = track.getBoundingClientRect();
    const trackCenter = trackBox.left + trackBox.width / 2;
    let closest = 0;
    let closestDist = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const cardCenter = box.left + box.width / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = index;
      }
    });

    return closest;
  }

  /**
   * Atualiza o índice só no scroll manual (arrastar / swipe).
   * Ignorado durante scrollIntoView das setas, hash inicial ou drag com mouse.
   */
  function handleTrackScroll() {
    if (ignoreScrollSyncRef.current || isDraggingRef.current) return;
    const closest = closestSlideIndex();
    setActiveIndex((current) => (current === closest ? current : closest));
  }

  /** Inicia o arraste horizontal com o mouse (touch continua nativo). */
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragScrollLeftRef.current = track.scrollLeft;
    ignoreScrollSyncRef.current = true;
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
  }

  /** Encerra o arraste e encaixa o card mais próximo no centro. */
  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    const closest = closestSlideIndex();

    if (closest === activeIndex) {
      // Mesmo índice: o efeito não reexecuta; força o snap no centro.
      ignoreScrollSyncRef.current = true;
      const card = track?.querySelector<HTMLElement>(
        `[data-slide-index="${closest}"]`,
      );
      card?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      window.setTimeout(() => {
        ignoreScrollSyncRef.current = false;
      }, 320);
      return;
    }

    ignoreScrollSyncRef.current = false;
    setActiveIndex(closest);
  }

  // ----- interface -----
  return (
    <main className="projects-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Projetos
      </h1>

      <section className="projects-layout about-layout relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-0 pb-3 md:pb-2">
        {/*
          Carrossel centralizado: card ativo no meio, vizinhos visíveis nas laterais.
          scroll-padding + snap-center mantêm o destaque equilibrado.
        */}
        <div className="about-enter__facts relative w-full py-5 md:py-8">
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={[
              "projects-carousel flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[max(1.25rem,calc((100%-min(34rem,58vw))/2))] pb-3 md:gap-6 md:px-[max(2.5rem,calc((100%-min(38rem,52vw))/2))]",
              isDragging
                ? "is-dragging cursor-grabbing select-none"
                : "cursor-grab",
            ].join(" ")}
            aria-label="Carrossel de projetos"
          >
            {PROJECT_SLIDES.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <article
                  key={slide.id}
                  data-slide-index={index}
                  className={[
                    "projects-carousel__card relative flex shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl border transition-[transform,opacity,height,box-shadow] duration-300 ease-out",
                    "w-[min(34rem,82vw)] md:w-[min(38rem,52vw)]",
                    isActive
                      ? "z-10 h-[min(56vh,32rem)] scale-100 border-purple-400/45 opacity-100 shadow-[0_18px_50px_-28px_rgba(168,85,247,0.55)] md:h-[min(60vh,34rem)]"
                      : "z-0 h-[min(48vh,27rem)] scale-[0.94] border-white/10 opacity-55 md:h-[min(52vh,29rem)]",
                    `bg-linear-to-br ${slide.accent}`,
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.22),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/25 to-transparent" />
                  <div className="relative z-10 p-6 md:p-8 lg:p-9">
                    <p className="text-xs tracking-[0.2em] text-purple-300/90 uppercase md:text-sm">
                      {slide.tagline}
                    </p>
                    <h2
                      className={[
                        "mt-2.5 font-semibold tracking-wide text-neutral-50",
                        isActive
                          ? "text-[clamp(1.5rem,3.5vw,2.35rem)]"
                          : "text-[clamp(1.25rem,3vw,1.85rem)]",
                      ].join(" ")}
                    >
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
                </article>
              );
            })}
          </div>

          {/* Controles */}
          <div className="mt-5 flex items-center justify-between gap-3 px-5 min-[390px]:px-6 md:mt-6 md:px-10 lg:px-14 xl:px-20">
            <p className="text-sm tracking-wide text-neutral-400 tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(PROJECT_SLIDES.length).padStart(2, "0")}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 text-neutral-200 transition hover:border-purple-400/60 hover:text-purple-300"
                aria-label="Projeto anterior"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-purple-400/50 bg-purple-500/15 text-purple-200 transition hover:border-purple-300 hover:bg-purple-500/25"
                aria-label="Próximo projeto"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
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
