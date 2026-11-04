import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS (a partir do CV)
// =============================================================================

/** Texto de abertura da página. */
const CERTIFICATES_INTRO = [
  "Ao longo da minha formação, concluí cursos e programas que reforçam minha base em front-end, design de interfaces e boas práticas de desenvolvimento.",
  "Abaixo estão as certificações e participações que constam no meu currículo — um recorte objetivo do que venho estudando e aplicando na prática.",
];

type CertificateItem = {
  id: string;
  title: string;
  detail?: string;
};

/** Lista de certificados / formações práticas. */
const CERTIFICATES: CertificateItem[] = [
  {
    id: "ui-design",
    title: "UI Design para Iniciantes",
  },
  {
    id: "react-completo",
    title: "React Completo",
  },
  {
    id: "css-grid",
    title: "CSS Grid Layout",
  },
  {
    id: "css-flexbox",
    title: "CSS Flexbox",
  },
  {
    id: "html-css",
    title: "HTML e CSS para Iniciantes",
  },
  {
    id: "js-es6",
    title: "JavaScript Completo ES6",
  },
  {
    id: "saga-start",
    title: "Curso Start — SAGA",
  },
  {
    id: "residencia-nivelamento",
    title: "Etapa de Nivelamento — Residência em TIC",
    detail: "Programa de Residência em TIC (BRISA / SOFTEX / UFG)",
  },
  {
    id: "residencia-imersao",
    title: "Imersão em Computação Avançada (480 horas)",
    detail: "Conclusão da fase de imersão — Residência em TIC UFG/BRISA",
  },
];

// =============================================================================
// TIPOS
// =============================================================================

type CertificatesPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a página Currículo. */
  onCurriculum: () => void;
};

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Certificados: lista das formações do CV no visual do portfólio.
 */
function CertificatesPage({ onBack, onCurriculum }: CertificatesPageProps) {
  // ----- handlers -----

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Navega para Currículo. */
  function handleCurriculum(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onCurriculum();
  }

  // ----- interface -----
  return (
    <main className="certificates-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white md:h-svh md:max-h-svh md:overflow-hidden">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Certificados
      </h1>

      <section className="about-layout relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-6 pt-[clamp(4.25rem,11vw,5.75rem)] min-[390px]:px-6 md:justify-center md:px-10 md:pb-4 lg:px-14 xl:px-20">
        <div className="about-layout__row grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-[minmax(0,42fr)_auto_minmax(0,58fr)] md:items-center md:gap-0">
          {/* Intro */}
          <div className="about-enter__bio flex min-w-0 flex-col justify-center gap-3 md:gap-2.5 md:pr-2 lg:pr-3">
            <p className="text-xs tracking-[0.2em] text-purple-300/90 uppercase">
              Formação contínua
            </p>
            {CERTIFICATES_INTRO.map((paragraph) => (
              <p
                key={paragraph.slice(0, 28)}
                className="text-pretty text-left text-[clamp(1rem,4vw,1.35rem)] leading-[1.65] text-neutral-200 md:text-[clamp(1.05rem,1.7vw,1.28rem)] md:leading-[1.55]"
              >
                {avoidOrphan(paragraph)}
              </p>
            ))}
          </div>

          <div
            className="about-enter__divider about-layout__divider min-w-0 md:mx-5 lg:mx-8 xl:mx-10"
            aria-hidden="true"
          />

          {/* Lista */}
          <ul className="about-enter__facts grid min-w-0 grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 md:gap-x-10 md:gap-y-7">
            {CERTIFICATES.map((item) => (
              <li key={item.id} className="min-w-0 text-left">
                <p className="text-[clamp(1rem,3.8vw,1.2rem)] font-medium leading-snug text-neutral-100">
                  {avoidOrphan(item.title)}
                </p>
                {item.detail ? (
                  <p className="mt-1 text-sm leading-snug text-neutral-400 md:text-xs">
                    {avoidOrphan(item.detail)}
                  </p>
                ) : (
                  <p className="mt-1 text-xs tracking-[0.16em] text-purple-300/70 uppercase">
                    Certificação
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label="Navegação da página Certificados"
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
            href="#curriculum"
            onClick={handleCurriculum}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <span className="truncate">Currículo</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default CertificatesPage;
