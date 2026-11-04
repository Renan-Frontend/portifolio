import { ArrowLeft, Download, Mail } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS
// =============================================================================

/** Status de disponibilidade. */
const CV_STATUS = "Aberto a novas oportunidades";

/** Chamada principal da página. */
const CV_HEADLINE = "Vamos trabalhar juntos?";

/** Apresentação profissional (acima da imagem do currículo). */
const CV_INTRO = [
  "Estou em busca de uma oportunidade para dar o próximo passo na minha carreira em desenvolvimento de software.",
  "Sou desenvolvedor de software, com experiência prática em projetos colaborativos e independentes. Tenho conhecimentos em desenvolvimento front-end e back-end, e interesse em contribuir com equipes que valorizem tecnologia, criatividade e boas experiências digitais.",
  "Busco oportunidades de estágio ou posições júnior onde possa aplicar meus conhecimentos, participar de projetos reais e continuar evoluindo profissionalmente.",
];

/** Preview visual do currículo (imagem fornecida — não recriar o conteúdo). */
const CV_PREVIEW_SRC = "/cv/curriculo-preview.png";
const CV_PREVIEW_ALT =
  "Prévia do currículo de Renan Naves — Desenvolvedor de Software";

/** PDF completo para download. */
const CV_PDF_HREF = "/cv/renan-naves.pdf";

/** Contato direto (mailto). */
const CV_MAILTO = "mailto:renan.naves.frontend@gmail.com";

// =============================================================================
// TIPOS
// =============================================================================

type CurriculumPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
};

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Currículo: apresentação + imagem do CV + download do PDF.
 * Visual alinhado às demais páginas (fundo preto, acentos lilás).
 */
function CurriculumPage({ onBack }: CurriculumPageProps) {
  // ----- handlers -----

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  // ----- interface -----
  return (
    <main className="curriculum-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white">
      {/* 1. Título (marca d’água) */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Currículo
      </h1>

      <section className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col px-5 pb-8 pt-[clamp(4.5rem,12vw,6.5rem)] min-[390px]:px-6 md:px-10 md:pb-6 lg:px-14">
        {/* 2. Apresentação + disponibilidade */}
        <div className="about-enter__bio mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.22em] text-purple-300 uppercase min-[390px]:text-sm">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300"
              aria-hidden="true"
            />
            {CV_STATUS}
          </p>

          <h2 className="font-script mt-4 text-[clamp(2rem,7vw,3.25rem)] leading-none text-purple-300 md:mt-5">
            {CV_HEADLINE}
          </h2>

          <div className="mt-5 flex flex-col gap-3 md:mt-6 md:gap-3.5">
            {CV_INTRO.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-pretty text-[clamp(0.98rem,3.6vw,1.15rem)] leading-[1.65] text-neutral-200"
              >
                {avoidOrphan(paragraph)}
              </p>
            ))}
          </div>
        </div>

        {/* 3. Imagem do currículo */}
        <div className="about-enter__facts mt-8 w-full md:mt-10">
          <div className="mb-3 flex min-w-0 items-end justify-between gap-3 border-t border-neutral-800 pt-5 md:mb-4 md:pt-6">
            <h3 className="text-base font-semibold tracking-wide text-white md:text-lg">
              Meu currículo
            </h3>
            <p className="shrink-0 text-xs tracking-wide text-neutral-500 md:text-sm">
              Documento profissional
            </p>
          </div>

          <figure className="mx-auto w-full max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-purple-300/25 bg-neutral-900/40 shadow-[0_0_0_1px_rgb(0_0_0_/_0.4),0_18px_40px_-20px_rgb(0_0_0_/_0.85)]">
              <img
                src={CV_PREVIEW_SRC}
                alt={CV_PREVIEW_ALT}
                width={908}
                height={332}
                decoding="async"
                className="mx-auto block h-auto w-full max-w-full object-contain"
              />
            </div>
            <figcaption className="sr-only">
              Prévia visual do currículo em PDF
            </figcaption>
          </figure>
        </div>

        {/* 4. CTAs — download em destaque */}
        <div className="about-enter__footer mt-7 flex w-full flex-wrap items-center justify-center gap-3 md:mt-8 md:gap-4">
          <a
            href={CV_PDF_HREF}
            download="Renan-Naves-Curriculo.pdf"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-purple-500 px-5 py-2.5 text-sm font-medium tracking-wide text-white transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-purple-400"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            Baixar currículo
          </a>

          <a
            href={CV_MAILTO}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-purple-300/55 bg-transparent px-5 py-2.5 text-sm font-medium tracking-wide text-neutral-100 transition-[transform,background-color,border-color] duration-200 hover:scale-[1.02] hover:border-purple-200 hover:bg-purple-500/10"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            Entrar em contato
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label="Navegação da página Currículo"
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
            href={CV_PDF_HREF}
            download="Renan-Naves-Curriculo.pdf"
            className="inline-flex min-w-0 shrink items-center gap-1.5 text-neutral-300 transition-colors hover:text-purple-300"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">Baixar PDF</span>
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default CurriculumPage;
