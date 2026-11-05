import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { CertificateViewer } from "./CertificateViewer";
import { publicUrl } from "../utils/publicUrl";
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
  /** Arquivo original para download (certificados). */
  file?: string;
  /** Link externo do projeto (GitHub, demo, etc.). */
  url?: string;
};

/** Slides do carrossel de projetos. */
const PROJECT_SLIDES: CarouselSlide[] = [
  {
    id: "bp-company",
    name: "BP Company",
    tagline: "Gestão comercial · Residência em TIC",
    description:
      "App de gestão comercial com CRM e geração de diagramas BPMN por IA — React no front e FastAPI no backend (Grupo 08).",
    cover: "https://picsum.photos/seed/bp-company-crm/1400/900",
    url: "https://renan-frontend.github.io/Grupo08/",
    accent: "from-violet-600/40 via-neutral-900 to-neutral-950",
  },
  {
    id: "bikcraft",
    name: "Bikcraft",
    tagline: "HTML · CSS · Origamid",
    description:
      "Site institucional de bicicletas elétricas — layout responsivo, páginas de produtos, orçamento e contato.",
    cover: "https://picsum.photos/seed/bikcraft-bikes/1400/900",
    url: "https://renan-frontend.github.io/bikcraft/",
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "dogs",
    name: "Dogs",
    tagline: "React · Origamid",
    description:
      "Rede social para cachorros — projeto final do curso Origamid com React, JavaScript, CSS e HTML.",
    cover: "https://picsum.photos/seed/dogs-social/1400/900",
    url: "https://renan-frontend.github.io/Dogs/",
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

/**
 * Slides do carrossel de certificados (arquivos em /public/certificates).
 * Capas geradas a partir dos PDFs/imagens originais da pasta local.
 */
export const CERTIFICATE_SLIDES: CarouselSlide[] = [
  {
    id: "ui-design",
    name: "UI Design para Iniciantes",
    tagline: "Origamid · 34 horas",
    description:
      "Concluído em 18/06/2025 — fundamentos de UI, hierarquia visual e consistência de interfaces.",
    cover: publicUrl("certificates/ui-design-cover.jpg"),
    file: publicUrl("certificates/ui-design.pdf"),
    accent: "from-violet-600/40 via-neutral-900 to-neutral-950",
  },
  {
    id: "react-completo",
    name: "React Completo",
    tagline: "Origamid · 36 horas",
    description:
      "Concluído em 04/02/2026 — componentes, estado e composição em React.",
    cover: publicUrl("certificates/react-completo-cover.jpg"),
    file: publicUrl("certificates/react-completo.pdf"),
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "css-grid",
    name: "CSS Grid Layout",
    tagline: "Origamid · 10 horas",
    description:
      "Concluído em 31/07/2025 — grades responsivas e organização de layout com CSS Grid.",
    cover: publicUrl("certificates/css-grid-cover.jpg"),
    file: publicUrl("certificates/css-grid.pdf"),
    accent: "from-fuchsia-600/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "css-flexbox",
    name: "CSS Flexbox",
    tagline: "Origamid · 6 horas",
    description:
      "Concluído em 17/07/2025 — alinhamento e distribuição de elementos com Flexbox.",
    cover: publicUrl("certificates/css-flexbox-cover.jpg"),
    file: publicUrl("certificates/css-flexbox.pdf"),
    accent: "from-purple-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "html-css",
    name: "HTML e CSS para Iniciantes",
    tagline: "Origamid · 46 horas",
    description:
      "Concluído em 07/07/2025 — estrutura semântica e estilização base para a web.",
    cover: publicUrl("certificates/html-css-cover.jpg"),
    file: publicUrl("certificates/html-css.pdf"),
    accent: "from-violet-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "js-es6",
    name: "JavaScript Completo ES6",
    tagline: "Origamid · 74 horas",
    description:
      "Concluído em 20/03/2025 — JavaScript moderno para lógica de interface e integração.",
    cover: publicUrl("certificates/js-es6-cover.jpg"),
    file: publicUrl("certificates/js-es6.pdf"),
    accent: "from-indigo-500/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "bootcamp-frontbase",
    name: "Bootcamp Frontbase",
    tagline: "60 horas · aulas ao vivo",
    description:
      "Concluído em 12/12/2024 — bootcamp de front-end com Gabriel Soares Salvador.",
    cover: publicUrl("certificates/bootcamp-frontbase-cover.jpg"),
    file: publicUrl("certificates/bootcamp-frontbase.pdf"),
    accent: "from-fuchsia-500/30 via-neutral-900 to-neutral-950",
  },
  {
    id: "saga-start",
    name: "Curso Start — SAGA",
    tagline: "SAGA Goiânia · 270 horas",
    description:
      "Concluído em 27/07/2021 — Adobe, Maya, Animate e pipeline criativo (frequência 96%).",
    cover: publicUrl("certificates/saga-start-cover.jpg"),
    file: publicUrl("certificates/saga-start.jpeg"),
    accent: "from-purple-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "residencia-nivelamento",
    name: "Nivelamento — Residência em TIC",
    tagline: "BRISA / SOFTEX / UFG · 180 horas",
    description:
      "Etapa de Nivelamento do Programa de Residência em TIC 16 (set–nov/2025), EaD.",
    cover: publicUrl("certificates/residencia-nivelamento-cover.jpg"),
    file: publicUrl("certificates/residencia-nivelamento.pdf"),
    accent: "from-violet-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "residencia-imersao",
    name: "Imersão em Computação Avançada",
    tagline: "BRISA / SOFTEX / UFG · 480 horas",
    description:
      "Fase de imersão da Residência em TIC 16 (dez/2025–jun/2026), com projetos presenciais.",
    cover: publicUrl("certificates/residencia-imersao-cover.jpg"),
    file: publicUrl("certificates/residencia-imersao.pdf"),
    accent: "from-indigo-600/35 via-neutral-900 to-neutral-950",
  },
  {
    id: "supera-jogos-3d",
    name: "Desenvolvimento de Jogos 3D",
    tagline: "SUPERA · 300 horas",
    description:
      "Capacitação em jogos 3D (Unreal, Maya, ZBrush e Substance), concluída em 13/02/2021.",
    cover: publicUrl("certificates/supera-1-cover.jpg"),
    file: publicUrl("certificates/supera-1.jpeg"),
    accent: "from-fuchsia-600/30 via-neutral-900 to-neutral-950",
  },
];

/** Distância mínima (px) para tratar o ponteiro do mouse como arraste, não clique. */
const DRAG_THRESHOLD_PX = 10;

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
  /** Notifica o App quando o slide ativo muda (alinhar hash/`active`). */
  onActiveSlideChange?: (slideId: string) => void;
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
  onActiveSlideChange,
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

  // ----- estado -----
  /** Certificado aberto no overlay (só na variante certificados). */
  const [viewerSlide, setViewerSlide] = useState<CarouselSlide | null>(null);
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
  /** Arraste com mouse (só true depois do limiar de movimento). */
  const isDraggingRef = useRef(false);
  /** Mouse down no track, ainda sem decidir se é clique ou arraste. */
  const dragArmedRef = useRef(false);
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
  /** Lista de slides atual (para sync do hash sem fechar sobre closures). */
  const slidesRef = useRef(slides);
  /** Evita notificar o App com o mesmo id em sequência. */
  const lastNotifiedSlideIdRef = useRef<string | null>(null);
  const onActiveSlideChangeRef = useRef(onActiveSlideChange);

  activeLoopIndexRef.current = activeLoopIndex;
  slideCountRef.current = slideCount;
  slidesRef.current = slides;
  onActiveSlideChangeRef.current = onActiveSlideChange;

  /**
   * Mantém o hash alinhado ao slide ativo (F5 / compartilhar link).
   * Usa replaceState para não empilhar histórico a cada scroll.
   * Também notifica o App para alinhar `active` (submenu / deep-link).
   */
  function syncHashFromLoop(loopIndex: number) {
    const logical = logicalFromLoop(slideCountRef.current, loopIndex);
    const slide = slidesRef.current[logical];
    if (!slide) return;

    const nextHash = `#${slide.id}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }

    if (lastNotifiedSlideIdRef.current === slide.id) return;
    lastNotifiedSlideIdRef.current = slide.id;
    // Evita o efeito de initialSlideId reposicionar o carrossel à toa.
    appliedSlideIdRef.current = slide.id;
    onActiveSlideChangeRef.current?.(slide.id);
  }

  /** Atualiza a contagem e o hash a partir do índice absoluto do loop. */
  function syncCounter(loopIndex: number) {
    setCounterIndex(logicalFromLoop(slideCountRef.current, loopIndex));
    syncHashFromLoop(loopIndex);
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

  /**
   * Sai da página; se o viewer estiver aberto, remove a entrada do histórico
   * antes de navegar (evita state órfão certificateViewer).
   */
  function navigateAway(navigate: () => void) {
    if (!viewerSlide) {
      navigate();
      return;
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      window.removeEventListener("popstate", onPop);
      setViewerSlide(null);
      navigate();
    };

    const onPop = () => finish();
    window.addEventListener("popstate", onPop);

    const state = window.history.state as { certificateViewer?: boolean } | null;
    if (state?.certificateViewer) {
      window.history.back();
    } else {
      finish();
    }

    window.setTimeout(finish, 150);
  }

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigateAway(onBack);
  }

  /** Navega para o próximo passo do rodapé. */
  function handleNext(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    navigateAway(onNext);
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

  /**
   * Arma o arraste com o mouse sem capturar o ponteiro ainda.
   * Assim o clique no card lateral ainda recebe pointerup e centraliza.
   */
  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const track = trackRef.current;
    if (!track) return;

    dragArmedRef.current = true;
    isDraggingRef.current = false;
    dragStartXRef.current = event.clientX;
    dragScrollLeftRef.current = track.scrollLeft;
  }

  /**
   * Só vira arraste após o limiar; aí captura o ponteiro e move o carrossel.
   */
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragArmedRef.current && !isDraggingRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const dx = event.clientX - dragStartXRef.current;

    if (!isDraggingRef.current) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      isDraggingRef.current = true;
      tapMovedRef.current = true;
      setIsDragging(true);
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    }

    track.scrollLeft = dragScrollLeftRef.current - dx;

    const closest = closestLoopIndex();
    setActiveLoopIndex((current) => (current === closest ? current : closest));
    syncCounter(closest);
  }

  /** Solta o arraste (ou o armamento); no drag, normaliza o loop após o snap. */
  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragArmedRef.current && !isDraggingRef.current) return;

    const track = trackRef.current;
    const wasDragging = isDraggingRef.current;
    dragArmedRef.current = false;
    isDraggingRef.current = false;
    setIsDragging(false);

    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    if (!wasDragging) return;

    // Pequeno atraso para o snap voltar a atuar após remover is-dragging.
    requestAnimationFrame(() => {
      normalizeLoopIfNeeded();
    });
  }

  /** Impede que o clique no CTA inicie o arraste do carrossel. */
  function stopCarouselDrag(
    event: ReactPointerEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    event.stopPropagation();
  }

  /** Abre o certificado no overlay do site. */
  function openCertificateViewer(
    event: MouseEvent<HTMLButtonElement>,
    slide: CarouselSlide,
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (!slide.file) return;
    setViewerSlide(slide);
  }

  /** Fecha o overlay do certificado. */
  function closeCertificateViewer() {
    setViewerSlide(null);
  }

  /** Classes compartilhadas dos CTAs do card (ativo vs lateral). */
  function ctaClass(isActive: boolean, emphasize = false): string {
    return [
      "inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium tracking-wide transition-[transform,background-color,border-color,opacity,color] duration-300 ease-out",
      isActive
        ? emphasize
          ? "pointer-events-auto border-purple-300/55 bg-purple-500/20 text-purple-100 opacity-100 hover:border-purple-200 hover:bg-purple-500/30"
          : "pointer-events-auto border-white/20 bg-white/5 text-neutral-100 opacity-100 hover:border-white/35 hover:bg-white/10"
        : "pointer-events-none border-white/10 bg-white/5 text-neutral-400 opacity-0",
    ].join(" ");
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

  /** Toque/clique no card: aplica o ativo e centraliza (mobile e desktop). */
  function handleCardPointerUp(
    event: ReactPointerEvent<HTMLElement>,
    loopIndex: number,
  ) {
    const start = tapStartRef.current;
    tapStartRef.current = null;
    if (!start || tapMovedRef.current) return;
    if (isDraggingRef.current) return;

    // Clique curto (sem arraste): ativa o card tocado.
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
                        isCertificates ? "bg-neutral-950" : "",
                      ].join(" ")}
                    >
                      <img
                        src={slide.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className={[
                          "absolute inset-0 h-full w-full select-none",
                          // Certificados: contain para não cortar o documento; projetos: cover.
                          isCertificates
                            ? "object-contain object-center p-3 md:p-4"
                            : "object-cover object-center",
                        ].join(" ")}
                      />
                      {!isCertificates ? (
                        <div className="absolute inset-0 bg-neutral-950/20" />
                      ) : null}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.16),transparent_55%)]" />
                      <div
                        className={
                          isCertificates
                            ? "absolute inset-0 bg-linear-to-t from-neutral-950/95 via-neutral-950/50 to-transparent"
                            : "absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/65 to-neutral-950/5"
                        }
                      />
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

                      {isCertificates && slide.file ? (
                        <div
                          className="flex flex-wrap items-center gap-2.5"
                          aria-hidden={!isActive}
                        >
                          <button
                            type="button"
                            onPointerDown={stopCarouselDrag}
                            onClick={(event) =>
                              openCertificateViewer(event, slide)
                            }
                            className={ctaClass(isActive, true)}
                            tabIndex={isActive ? 0 : -1}
                          >
                            <span>Ver no site</span>
                            <Eye
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                          </button>
                          <a
                            href={slide.file}
                            download
                            onPointerDown={stopCarouselDrag}
                            onClick={(event) => event.stopPropagation()}
                            className={ctaClass(isActive, false)}
                            tabIndex={isActive ? 0 : -1}
                          >
                            <span>Baixar</span>
                            <Download
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                          </a>
                        </div>
                      ) : !isCertificates && slide.url ? (
                        <a
                          href={slide.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onPointerDown={stopCarouselDrag}
                          onClick={(event) => event.stopPropagation()}
                          className={ctaClass(isActive, true)}
                          tabIndex={isActive ? 0 : -1}
                          aria-hidden={!isActive}
                        >
                          <span>Ver site</span>
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

      {viewerSlide?.file ? (
        <CertificateViewer
          title={viewerSlide.name}
          fileUrl={viewerSlide.file}
          onClose={closeCertificateViewer}
        />
      ) : null}
    </main>
  );
}

export default ProjectsPage;
