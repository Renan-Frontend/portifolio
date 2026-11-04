import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
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

  // ----- efeitos -----

  /**
   * Centraliza o slide ativo no track.
   * Bloqueia sync do onScroll até o fim da animação para não “voltar” o índice.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(
      `[data-slide-index="${activeIndex}"]`,
    );
    if (!card) return;

    ignoreScrollSyncRef.current = true;
    if (scrollUnlockTimerRef.current !== null) {
      window.clearTimeout(scrollUnlockTimerRef.current);
    }

    /** Libera a sincronização manual após o scroll programático. */
    function unlockScrollSync() {
      ignoreScrollSyncRef.current = false;
      if (scrollUnlockTimerRef.current !== null) {
        window.clearTimeout(scrollUnlockTimerRef.current);
        scrollUnlockTimerRef.current = null;
      }
    }

    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    track.addEventListener("scrollend", unlockScrollSync, { once: true });
    // Fallback: navegadores sem scrollend (ou snap interrompido)
    scrollUnlockTimerRef.current = window.setTimeout(unlockScrollSync, 500);

    return () => {
      track.removeEventListener("scrollend", unlockScrollSync);
      if (scrollUnlockTimerRef.current !== null) {
        window.clearTimeout(scrollUnlockTimerRef.current);
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

  /**
   * Atualiza o índice só no scroll manual (arrastar / swipe).
   * Ignorado durante scrollIntoView das setas ou do hash inicial.
   */
  function handleTrackScroll() {
    if (ignoreScrollSyncRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-slide-index]"),
    );
    if (cards.length === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = index;
      }
    });

    setActiveIndex((current) => (current === closest ? current : closest));
  }

  // ----- interface -----
  return (
    <main className="projects-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white md:h-svh">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Projetos
      </h1>

      <section className="projects-layout about-layout relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-0 pb-3 md:min-h-0 md:pb-2">
        <div className="about-enter__bio mb-3 px-5 min-[390px]:px-6 md:mb-4 md:px-10 lg:px-14 xl:px-20">
          <p className="text-sm tracking-[0.2em] text-purple-300/90 uppercase">
            Seleção
          </p>
          <p className="experience-copy mt-1 max-w-2xl text-neutral-300">
            {avoidOrphan(
              "Explore os projetos em um carrossel amplo — deslize ou use as setas para navegar à direita.",
            )}
          </p>
        </div>

        {/* Carrossel grande */}
        <div className="about-enter__facts relative w-full">
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="projects-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 min-[390px]:gap-5 min-[390px]:px-6 md:gap-6 md:px-10 lg:px-14 xl:px-20"
            aria-label="Carrossel de projetos"
          >
            {PROJECT_SLIDES.map((slide, index) => (
              <article
                key={slide.id}
                data-slide-index={index}
                className={[
                  "projects-carousel__card relative flex shrink-0 snap-center flex-col justify-end overflow-hidden rounded-2xl border border-purple-500/25",
                  "h-[min(58vh,32rem)] w-[min(88vw,52rem)] md:h-[min(62vh,36rem)] md:w-[min(72vw,58rem)]",
                  `bg-linear-to-br ${slide.accent}`,
                  index === activeIndex
                    ? "opacity-100 ring-1 ring-purple-400/40"
                    : "opacity-80",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.18),transparent_55%)]" />
                <div className="relative z-10 p-5 min-[390px]:p-6 md:p-8">
                  <p className="text-xs tracking-[0.2em] text-purple-300/90 uppercase md:text-sm">
                    {slide.tagline}
                  </p>
                  <h2 className="mt-2 text-[clamp(1.35rem,4vw,2.25rem)] font-semibold tracking-wide text-neutral-50">
                    {slide.name}
                  </h2>
                  <p className="experience-copy mt-2 max-w-xl text-neutral-200">
                    {avoidOrphan(slide.description)}
                  </p>
                </div>
              </article>
            ))}
            {/* Espaço final para o último card poder centralizar */}
            <div className="w-[12vw] shrink-0 md:w-[18vw]" aria-hidden="true" />
          </div>

          {/* Controles */}
          <div className="mt-4 flex items-center justify-between gap-3 px-5 min-[390px]:px-6 md:px-10 lg:px-14 xl:px-20">
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
