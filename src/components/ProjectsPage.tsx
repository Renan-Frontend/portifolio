import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

type CarouselSlide = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /**
   * Capa do card no carrossel.
   * Trocar depois por arquivos locais em /public/.
   */
  cover: string;
  /** Tom de reforço sob a imagem (fallback se a capa falhar). */
  accent: string;
};

/** Slides do carrossel de projetos. */
const PROJECT_SLIDES: CarouselSlide[] = [
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

/** Slides do carrossel de certificados (mesmo layout dos projetos). */
export const CERTIFICATE_SLIDES: CarouselSlide[] = [
  {
    id: "ui-design",
    name: "UI Design para Iniciantes",
    tagline: "Design de interfaces",
    description:
      "Fundamentos de UI para criar interfaces claras, hierarquia visual e consistência.",
    cover: "https://picsum.photos/seed/cert-ui-design/1400/900",
    accent: "from-violet-600/40 via-neutral-900 to-neutral-950",
  },
  {
    id: "react-completo",
    name: "React Completo",
    tagline: "Front-end",
    description:
      "Componentes, estado e composição em React para aplicações modernas.",
    cover: "https://picsum.photos/seed/cert-react/1400/900",
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "css-grid",
    name: "CSS Grid Layout",
    tagline: "Layout",
    description:
      "Grades responsivas e organização de páginas com CSS Grid.",
    cover: "https://picsum.photos/seed/cert-css-grid/1400/900",
    accent: "from-fuchsia-600/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "css-flexbox",
    name: "CSS Flexbox",
    tagline: "Layout",
    description:
      "Alinhamento e distribuição de elementos com Flexbox.",
    cover: "https://picsum.photos/seed/cert-flexbox/1400/900",
    accent: "from-purple-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "html-css",
    name: "HTML e CSS para Iniciantes",
    tagline: "Fundamentos web",
    description:
      "Estrutura semântica e estilização base para páginas web.",
    cover: "https://picsum.photos/seed/cert-html-css/1400/900",
    accent: "from-violet-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "js-es6",
    name: "JavaScript Completo ES6",
    tagline: "Linguagem",
    description:
      "JavaScript moderno (ES6+) para lógica de interface e integração.",
    cover: "https://picsum.photos/seed/cert-js-es6/1400/900",
    accent: "from-indigo-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "saga-start",
    name: "Curso Start — SAGA",
    tagline: "Formação",
    description:
      "Introdução prática a ferramentas e fluxo de trabalho criativo.",
    cover: "https://picsum.photos/seed/cert-saga/1400/900",
    accent: "from-fuchsia-500/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "residencia-nivelamento",
    name: "Nivelamento — Residência em TIC",
    tagline: "BRISA / SOFTEX / UFG",
    description:
      "Etapa de nivelamento do Programa de Residência em TIC.",
    cover: "https://picsum.photos/seed/cert-nivelamento/1400/900",
    accent: "from-purple-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "residencia-imersao",
    name: "Imersão em Computação Avançada",
    tagline: "480 horas · UFG/BRISA",
    description:
      "Conclusão da fase de imersão na Residência em TIC, com prática colaborativa.",
    cover: "https://picsum.photos/seed/cert-imersao/1400/900",
    accent: "from-violet-600/35 via-neutral-900 to-neutral-950",
  },
];

/**
 * Três cópias: [A B C D][A B C D][A B C D].
 * O usuário permanece na cópia do meio; nas pontas saltamos o scrollLeft.
 */
const LOOP_COPIES = 3;

type LoopedSlide = CarouselSlide & {
  loopIndex: number;
  logicalIndex: number;
  loopKey: string;
};

/** Variante do carrossel (projetos ou certificados). */
type CarouselVariant = "projects" | "certificates";

// =============================================================================
// TIPOS
// =============================================================================

type ProjectsPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Próximo passo do rodapé (Certificados ou Currículo). */
  onNext: () => void;
  /** Rótulo do link à direita no rodapé. */
  nextLabel: string;
  /** Hash do próximo passo. */
  nextHref: string;
  /** Conteúdo do carrossel. */
  variant?: CarouselVariant;
  /** Id do slide a focar no carrossel (deep-link). */
  initialSlideId?: string;
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/** Monta as 3 cópias do carrossel infinito. */
function buildLoopedSlides(slides: CarouselSlide[]): LoopedSlide[] {
  const count = slides.length;
  return Array.from({ length: LOOP_COPIES * count }, (_, loopIndex) => {
    const logicalIndex = loopIndex % count;
    const slide = slides[logicalIndex];
    return {
      ...slide,
      loopIndex,
      logicalIndex,
      loopKey: `${slide.id}-${loopIndex}`,
    };
  });
}

/** Índice lógico do slide a partir do id, ou 0 se não encontrado. */
function indexFromSlideId(
  slides: CarouselSlide[],
  id: string | undefined,
): number {
  if (!id) return 0;
  const index = slides.findIndex((slide) => slide.id === id);
  return index >= 0 ? index : 0;
}

/** Índice absoluto na cópia do meio. */
function middleLoopIndex(slideCount: number, logicalIndex: number): number {
  return slideCount + logicalIndex;
}

/** Índice lógico (0..n-1) a partir do índice absoluto do loop. */
function logicalFromLoop(slideCount: number, loopIndex: number): number {
  return ((loopIndex % slideCount) + slideCount) % slideCount;
}

/** Largura de uma cópia completa (todos os slides + gaps). */
function measureSetWidth(track: HTMLDivElement, slideCount: number): number {
  const first = track.querySelector<HTMLElement>('[data-loop-index="0"]');
  const next = track.querySelector<HTMLElement>(
    `[data-loop-index="${slideCount}"]`,
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

/** Deslocamento necessário para centralizar o card no track. */
function centerDelta(track: HTMLDivElement, card: HTMLElement): number {
  const trackBox = track.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();
  return (
    cardBox.left + cardBox.width / 2 - (trackBox.left + trackBox.width / 2)
  );
}

/** Easing suave (ease-in-out cúbico) para o scroll das setas. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

type ArrowAnimationHandle = {
  promise: Promise<void>;
  /** Cancela o rAF (ex.: unmount no meio da passagem). */
  cancel: () => void;
};

/**
 * Anima o scroll até centralizar o card (mais suave que scrollIntoView).
 * Mantém snap desligado até o fim para não “puxar” no meio do caminho.
 */
function animateCenterCard(
  track: HTMLDivElement,
  card: HTMLElement,
  durationMs = 720,
): ArrowAnimationHandle {
  const startLeft = track.scrollLeft;
  const distance = centerDelta(track, card);

  if (Math.abs(distance) < 1) {
    return { promise: Promise.resolve(), cancel: () => undefined };
  }

  track.classList.add("is-arrow-animating");

  let rafId = 0;
  let cancelled = false;

  /** Interrompe a animação e limpa a classe de estado. */
  function cancel() {
    cancelled = true;
    cancelAnimationFrame(rafId);
    track.classList.remove("is-arrow-animating");
  }

  const promise = new Promise<void>((resolve) => {
    const startedAt = performance.now();

    /** Frame da animação de scroll das setas. */
    function frame(now: number) {
      if (cancelled) {
        resolve();
        return;
      }

      const elapsed = now - startedAt;
      const t = Math.min(1, elapsed / durationMs);
      track.scrollLeft = startLeft + distance * easeInOutCubic(t);

      if (t < 1) {
        rafId = requestAnimationFrame(frame);
        return;
      }

      // Ajuste fino ainda sem snap; só então libera a classe.
      track.scrollLeft += centerDelta(track, card);
      track.classList.remove("is-arrow-animating");
      resolve();
    }

    rafId = requestAnimationFrame(frame);
  });

  return { promise, cancel };
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Carrossel em loop (Projetos ou Certificados).
 * Scroll nativo + snap; o React só atualiza o destaque e corrige o loop.
 */
function ProjectsPage({
  onBack,
  onNext,
  nextLabel,
  nextHref,
  variant = "projects",
  initialSlideId,
}: ProjectsPageProps) {
  // ----- dados da variante -----
  const isCertificates = variant === "certificates";
  const slides = isCertificates ? CERTIFICATE_SLIDES : PROJECT_SLIDES;
  const slideCount = slides.length;
  const loopedSlides = buildLoopedSlides(slides);
  const pageTitle = isCertificates ? "Certificados" : "Projetos";
  const carouselLabel = isCertificates
    ? "Carrossel de certificados"
    : "Carrossel de projetos";
  const prevAria = isCertificates ? "Certificado anterior" : "Projeto anterior";
  const nextAria = isCertificates ? "Próximo certificado" : "Próximo projeto";
  const ctaLabel = isCertificates ? "Ver certificado" : "Ver projeto";

  // ----- estado -----
  const [activeLoopIndex, setActiveLoopIndex] = useState(() =>
    middleLoopIndex(slideCount, indexFromSlideId(slides, initialSlideId)),
  );
  /** Contagem estável (só muda ao encaixar o slide, sem piscar no scroll). */
  const [counterIndex, setCounterIndex] = useState(() =>
    indexFromSlideId(slides, initialSlideId),
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const activeLoopIndexRef = useRef(activeLoopIndex);
  const slideCountRef = useRef(slideCount);
  /** Arraste com mouse. */
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  /** Impede normalizar/atualizar no meio de um salto de loop. */
  const isJumpingRef = useRef(false);
  /** Bloqueia setas enquanto a animação suave roda. */
  const isArrowAnimatingRef = useRef(false);
  /** Cancela animação das setas no unmount. */
  const cancelArrowAnimationRef = useRef<(() => void) | null>(null);
  /** Último slide id aplicado via prop (deep-link). */
  const appliedSlideIdRef = useRef(initialSlideId);
  /** Origem do ponteiro para distinguir toque de swipe. */
  const tapStartRef = useRef<{ x: number; y: number } | null>(null);
  /** Se o scroll moveu o bastante, ignora o clique no card. */
  const tapMovedRef = useRef(false);

  activeLoopIndexRef.current = activeLoopIndex;
  slideCountRef.current = slideCount;

  /** Atualiza a contagem a partir do índice absoluto do loop. */
  function syncCounter(loopIndex: number) {
    setCounterIndex(logicalFromLoop(slideCountRef.current, loopIndex));
  }

  // ----- efeitos -----

  /** Cancela rAF das setas se a página desmontar no meio da animação. */
  useEffect(() => {
    return () => {
      cancelArrowAnimationRef.current?.();
      cancelArrowAnimationRef.current = null;
    };
  }, []);

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
    if (
      !track ||
      isJumpingRef.current ||
      isDraggingRef.current ||
      isArrowAnimatingRef.current
    ) {
      return;
    }

    const count = slideCountRef.current;
    const closest = closestLoopIndex();
    if (closest >= count && closest < count * 2) {
      setActiveLoopIndex((current) =>
        current === closest ? current : closest,
      );
      syncCounter(closest);
      return;
    }

    const setWidth = measureSetWidth(track, count);
    if (setWidth <= 0) return;

    const delta = closest < count ? setWidth : -setWidth;
    const nextIndex =
      closest < count ? closest + count : closest - count;

    isJumpingRef.current = true;
    track.classList.add("is-jumping");
    track.scrollLeft += delta;
    setActiveLoopIndex(nextIndex);
    syncCounter(nextIndex);

    requestAnimationFrame(() => {
      track.classList.remove("is-jumping");
      isJumpingRef.current = false;
    });
  }

  const normalizeLoopRef = useRef(normalizeLoopIfNeeded);
  normalizeLoopRef.current = normalizeLoopIfNeeded;

  /** Posiciona na cópia do meio; scrollend nativo ou fallback por debounce. */
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
      if (isDraggingRef.current || isArrowAnimatingRef.current) return;
      normalizeLoopRef.current();
    }

    const supportsScrollEnd = "onscrollend" in window;
    let settleTimer = 0;

    /** Fallback: após o scroll parar ~150ms, normaliza o loop. */
    function onScrollSettle() {
      if (supportsScrollEnd) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(onScrollEnd, 150);
    }

    if (supportsScrollEnd) {
      track.addEventListener("scrollend", onScrollEnd);
    } else {
      track.addEventListener("scroll", onScrollSettle, { passive: true });
    }

    return () => {
      window.clearTimeout(settleTimer);
      track.removeEventListener("scrollend", onScrollEnd);
      track.removeEventListener("scroll", onScrollSettle);
    };
  }, []);

  /**
   * Reage a mudança de deep-link sem depender só do remount —
   * reposiciona o carrossel e a contagem.
   */
  useEffect(() => {
    if (initialSlideId === appliedSlideIdRef.current) return;

    appliedSlideIdRef.current = initialSlideId;
    const count = slideCountRef.current;
    const nextLogical = indexFromSlideId(slides, initialSlideId);
    const nextLoop = middleLoopIndex(count, nextLogical);
    const track = trackRef.current;

    cancelArrowAnimationRef.current?.();
    cancelArrowAnimationRef.current = null;
    isArrowAnimatingRef.current = false;

    setActiveLoopIndex(nextLoop);
    setCounterIndex(nextLogical);

    if (!track) return;

    isJumpingRef.current = true;
    track.classList.add("is-jumping");
    jumpCenterCard(track, nextLoop);
    requestAnimationFrame(() => {
      track.classList.remove("is-jumping");
      isJumpingRef.current = false;
    });
  }, [initialSlideId, slides]);

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Navega para o próximo passo do rodapé. */
  function handleNext(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNext();
  }

  /** Atualiza destaque e contador conforme o card mais próximo do centro. */
  function handleTrackScroll() {
    if (
      isJumpingRef.current ||
      isDraggingRef.current ||
      isArrowAnimatingRef.current
    ) {
      return;
    }

    const closest = closestLoopIndex();
    setActiveLoopIndex((current) => (current === closest ? current : closest));
    syncCounter(closest);
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

  /** Move o carrossel e já troca o ativo para o card mais próximo. */
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const dx = event.clientX - dragStartXRef.current;
    track.scrollLeft = dragScrollLeftRef.current - dx;

    const closest = closestLoopIndex();
    setActiveLoopIndex((current) => (current === closest ? current : closest));
    syncCounter(closest);
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

  /**
   * Centraliza um slide absoluto do loop, com o efeito ativo na hora.
   * Usado pelas setas e pelo toque/clique no card (mobile).
   */
  function goToLoopIndex(to: number) {
    const track = trackRef.current;
    if (
      !track ||
      isDraggingRef.current ||
      isJumpingRef.current ||
      isArrowAnimatingRef.current
    ) {
      return;
    }

    const total = LOOP_COPIES * slideCountRef.current;
    if (to < 0 || to >= total) return;
    if (to === activeLoopIndexRef.current) return;

    const card = track.querySelector<HTMLElement>(
      `[data-loop-index="${to}"]`,
    );
    if (!card) return;

    cancelArrowAnimationRef.current?.();
    isArrowAnimatingRef.current = true;
    setActiveLoopIndex(to);
    syncCounter(to);

    const animation = animateCenterCard(track, card, 560);
    cancelArrowAnimationRef.current = animation.cancel;

    void animation.promise
      .then(() => {
        if (cancelArrowAnimationRef.current !== animation.cancel) return;
        cancelArrowAnimationRef.current = null;
        isArrowAnimatingRef.current = false;
        normalizeLoopIfNeeded();
      })
      .catch(() => {
        if (cancelArrowAnimationRef.current !== animation.cancel) return;
        cancelArrowAnimationRef.current = null;
        isArrowAnimatingRef.current = false;
        track.classList.remove("is-arrow-animating");
      });
  }

  /** Avança ou volta um slide pelas setas. */
  function goBy(delta: -1 | 1) {
    goToLoopIndex(activeLoopIndexRef.current + delta);
  }

  /** Slide anterior (seta esquerda). */
  function goPrev() {
    goBy(-1);
  }

  /** Próximo slide (seta direita). */
  function goNext() {
    goBy(1);
  }

  /** Marca o início do toque no card (para não confundir com swipe). */
  function handleCardPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    tapStartRef.current = { x: event.clientX, y: event.clientY };
    tapMovedRef.current = false;
  }

  /** Se o dedo/mouse andou demais, trata como swipe e não como clique. */
  function handleCardPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const start = tapStartRef.current;
    if (!start) return;
    const dx = Math.abs(event.clientX - start.x);
    const dy = Math.abs(event.clientY - start.y);
    if (dx > 10 || dy > 10) {
      tapMovedRef.current = true;
    }
  }

  /** Toque/clique no card: aplica o ativo e centraliza (efeito no mobile). */
  function handleCardPointerUp(
    event: ReactPointerEvent<HTMLElement>,
    loopIndex: number,
  ) {
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start || tapMovedRef.current) return;
    if (isDraggingRef.current) return;

    // Clique curto: ativa o card tocado.
    event.preventDefault();
    goToLoopIndex(loopIndex);
  }

  /** Número exibido na contagem (1-based). */
  const activeNumber = counterIndex + 1;

  // ----- interface -----
  return (
    <main className="projects-page relative isolate flex h-svh max-h-svh w-full flex-col overflow-hidden bg-neutral-950 text-white">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        {pageTitle}
      </h1>

      <section className="projects-layout about-layout relative z-10 mx-auto flex min-h-0 w-full flex-1 flex-col justify-center px-0 pb-1">
        <div className="about-enter__facts relative w-full py-1 md:py-2">
          <div className="projects-carousel-shell relative w-full">
            <button
              type="button"
              onClick={goPrev}
              className="projects-carousel__nav projects-carousel__nav--prev"
              aria-label={prevAria}
            >
              <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="projects-carousel__nav projects-carousel__nav--next"
              aria-label={nextAria}
            >
              <ChevronRight className="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
            </button>

            <div
              ref={trackRef}
              onScroll={handleTrackScroll}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={[
                "projects-carousel flex snap-x snap-mandatory items-center gap-6 overflow-x-auto px-[max(1rem,calc((100%-min(42rem,88vw))/2))] py-7 md:gap-8 md:px-[max(1.5rem,calc((100%-min(52rem,62vw))/2))] md:py-9",
                isDragging
                  ? "is-dragging cursor-grabbing select-none"
                  : "cursor-grab",
              ].join(" ")}
              aria-label={carouselLabel}
            >
              {loopedSlides.map((slide) => {
                const isActive = slide.loopIndex === activeLoopIndex;
                return (
                  <article
                    key={slide.loopKey}
                    data-loop-index={slide.loopIndex}
                    data-logical-index={slide.logicalIndex}
                    onPointerDown={handleCardPointerDown}
                    onPointerMove={handleCardPointerMove}
                    onPointerUp={(event) =>
                      handleCardPointerUp(event, slide.loopIndex)
                    }
                    onPointerCancel={() => {
                      tapStartRef.current = null;
                      tapMovedRef.current = false;
                    }}
                    className={[
                      "projects-carousel__card relative flex h-[min(64dvh,34rem)] w-[min(42rem,88vw)] shrink-0 snap-center flex-col justify-end overflow-visible rounded-2xl origin-center md:h-[min(68dvh,40rem)] md:w-[min(52rem,62vw)]",
                      isActive
                        ? "projects-carousel__card--active z-10 scale-100"
                        : "projects-carousel__card--side z-0 scale-[0.86]",
                      `bg-linear-to-br ${slide.accent}`,
                    ].join(" ")}
                  >
                    {/* Capa com clip (card overflow visible para as quinas no miolo da borda) */}
                    <div
                      className={[
                        "projects-carousel__media pointer-events-none absolute inset-0 overflow-hidden rounded-2xl transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-50",
                      ].join(" ")}
                    >
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

                    {/* Filete fino contínuo + quinas grossas (só nos cantos) */}
                    <div
                      className={[
                        "projects-carousel__corners pointer-events-none absolute inset-0 z-20",
                        isActive
                          ? "projects-carousel__corners--active"
                          : "projects-carousel__corners--side",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <span className="projects-carousel__frame" />
                      <span className="projects-carousel__corner projects-carousel__corner--tl" />
                      <span className="projects-carousel__corner projects-carousel__corner--tr" />
                      <span className="projects-carousel__corner projects-carousel__corner--bl" />
                      <span className="projects-carousel__corner projects-carousel__corner--br" />
                    </div>

                    <div
                      className={[
                        "relative z-10 flex flex-col gap-5 p-6 transition-opacity duration-300 md:gap-6 md:p-8 lg:p-9",
                        isActive ? "opacity-100" : "opacity-50",
                      ].join(" ")}
                    >
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

                      {!isCertificates ? (
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
                          <span>{ctaLabel}</span>
                          <ArrowUpRight
                            className="h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ) : null}
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

          {/* Contagem do projeto selecionado */}
          <p
            className="mt-3 text-center text-sm tracking-[0.18em] text-neutral-400 tabular-nums md:mt-4 md:text-base"
            aria-live="polite"
          >
            <span className="text-neutral-300">
              {String(activeNumber).padStart(2, "0")}
            </span>
            <span className="mx-1.5 text-neutral-600">/</span>
            <span>{String(slideCount).padStart(2, "0")}</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label={`Navegação da página ${pageTitle}`}
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
            href={nextHref}
            onClick={handleNext}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <span className="truncate">{nextLabel}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default ProjectsPage;
