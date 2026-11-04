import { ArrowLeft, Download } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS — resumo do PDF (detalhes completos ficam no download)
// =============================================================================

/** Contato público no topo. */
const CV_CONTACT = [
  { label: "Telefone", value: "(62) 98294-1455", href: "tel:+5562982941455" },
  {
    label: "Email",
    value: "renan.naves.frontend@gmail.com",
    href: "mailto:renan.naves.frontend@gmail.com",
  },
  { label: "Local", value: "Goiânia, Brasil" },
];

/** Texto curto de apresentação. */
const CV_SUMMARY = [
  "Desenvolvedor de Software com especialização em Front-end e conhecimento em Back-end. Atuo com React, TypeScript, Next.js e Tailwind CSS, além de Python, APIs e bancos de dados.",
  "Busco vaga de Estágio ou Desenvolvedor Júnior para entregar aplicações web performáticas e centradas no usuário. O PDF completo traz o detalhamento de experiências, projetos e certificações.",
];

/** Destaques em grade (visão rápida do CV). */
const CV_HIGHLIGHTS = [
  {
    label: "Experiência",
    value: "Escreva+ (IA) · ERP — Residência TIC UFG/BRISA",
  },
  {
    label: "Educação",
    value: "ADS — IPOG · Imersão em Computação Avançada (480h)",
  },
  {
    label: "Stack",
    value: "React, Next.js, TypeScript, Tailwind, Python, APIs REST",
  },
  {
    label: "Foco",
    value: "UI/UX, acessibilidade (WCAG), Clean Code, Git/GitHub",
  },
];

/** Experiências em uma linha cada. */
const CV_JOBS_BRIEF = [
  {
    id: "escreva-mais",
    title: "Escreva+",
    detail: "Front-end de correção textual com IA · 2026",
  },
  {
    id: "erp",
    title: "Residência TIC UFG/BRISA",
    detail: "ERP para microempresas · 2025–2026",
  },
];

/** Skills principais (não a lista inteira do PDF). */
const CV_SKILLS_BRIEF = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Python",
  "APIs REST",
  "Git",
  "Figma",
];

/** Caminho público do PDF para download. */
const CV_PDF_HREF = "/cv/renan-naves.pdf";

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
 * Página Currículo: resumo visual do PDF + download do arquivo completo.
 * Mantém o layout editorial das outras páginas internas.
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
    <main className="curriculum-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white md:h-svh md:max-h-svh md:overflow-hidden">
      {/* Marca d’água */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Currículo
      </h1>

      <section className="curriculum-layout about-layout relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-6 min-[390px]:px-6 md:justify-center md:px-10 md:pb-4 lg:px-14 xl:px-20">
        {/* Cabeçalho */}
        <div className="relative z-10 mb-5 flex min-w-0 flex-wrap items-end justify-between gap-3 md:mb-6">
          <div className="min-w-0 text-left">
            <p className="text-sm tracking-[0.2em] text-purple-300/90 uppercase md:text-xs">
              Renan Naves
            </p>
            <p className="mt-1 text-[clamp(1.15rem,4vw,1.45rem)] font-semibold text-neutral-100">
              Desenvolvedor de Software
            </p>
            <p className="mt-1 text-sm leading-snug text-neutral-400 md:text-xs">
              Especializado em Front-end, com conhecimento em Back-end
            </p>
          </div>

          <a
            href={CV_PDF_HREF}
            download="Renan-Naves-Curriculo.pdf"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-purple-300/45 bg-purple-500/15 px-3.5 py-2 text-xs font-medium tracking-wide text-purple-100 uppercase transition-[transform,background-color,border-color] duration-200 hover:border-purple-200/70 hover:bg-purple-500/25 md:text-[0.7rem]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Baixar PDF completo
          </a>
        </div>

        {/* Contato */}
        <ul className="mb-6 flex min-w-0 flex-wrap gap-x-4 gap-y-1.5 text-left text-sm text-neutral-300 md:mb-8 md:gap-x-5 md:text-xs">
          {CV_CONTACT.map((item) => (
            <li key={item.label} className="min-w-0">
              <span className="sr-only">{item.label}: </span>
              {item.href ? (
                <a
                  href={item.href}
                  className="transition-colors hover:text-purple-300"
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </li>
          ))}
        </ul>

        <div className="about-layout__row grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-[minmax(0,48fr)_auto_minmax(0,52fr)] md:items-center md:gap-0">
          {/* ----- Resumo + experiências breves + skills ----- */}
          <div className="about-enter__bio flex min-w-0 flex-col justify-center gap-4 md:gap-3 md:pr-2 lg:pr-2.5 xl:pr-3">
            {CV_SUMMARY.map((paragraph) => (
              <p
                key={paragraph.slice(0, 28)}
                className="text-pretty text-left text-[clamp(1rem,4.2vw,1.35rem)] leading-[1.65] text-neutral-200 md:text-[clamp(1.05rem,1.7vw,1.3rem)] md:leading-[1.55]"
              >
                {avoidOrphan(paragraph)}
              </p>
            ))}

            <div className="mt-1">
              <p className="mb-2 text-xs tracking-[0.2em] text-purple-300/90 uppercase">
                Experiências
              </p>
              <ul className="flex flex-col gap-2">
                {CV_JOBS_BRIEF.map((job) => (
                  <li key={job.id} className="min-w-0 text-left">
                    <p className="font-medium text-neutral-100">{job.title}</p>
                    <p className="text-sm text-neutral-400 md:text-xs">
                      {job.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-2 text-xs tracking-[0.2em] text-purple-300/90 uppercase">
                Principais skills
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {CV_SKILLS_BRIEF.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs tracking-wide text-neutral-200 md:text-[0.7rem]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ----- Divisória ----- */}
          <div
            className="about-enter__divider about-layout__divider min-w-0 md:mx-5 lg:mx-8 xl:mx-10"
            aria-hidden="true"
          />

          {/* ----- Destaques ----- */}
          <dl className="about-enter__facts about-layout__facts grid min-w-0 gap-y-6 md:gap-x-8 md:gap-y-7 lg:gap-x-12 lg:gap-y-9">
            {CV_HIGHLIGHTS.map((fact) => (
              <div key={fact.label} className="about-layout__fact min-w-0 text-left">
                <dt className="text-xs tracking-[0.2em] text-purple-300/90 uppercase min-[390px]:text-sm">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-pretty text-[clamp(1rem,4vw,1.35rem)] leading-snug text-neutral-100 md:text-[clamp(1.05rem,1.7vw,1.3rem)]">
                  {avoidOrphan(fact.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
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
