import { ArrowLeft, Download } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS (a partir do CV — sem CPF/dados sensíveis)
// =============================================================================

/** Contato público exibido no topo. */
const CV_CONTACT = [
  { label: "Telefone", value: "(62) 98294-1455", href: "tel:+5562982941455" },
  {
    label: "Email",
    value: "renan.naves.frontend@gmail.com",
    href: "mailto:renan.naves.frontend@gmail.com",
  },
  { label: "Local", value: "Goiânia, Brasil" },
  { label: "Nacionalidade", value: "Brasileiro" },
];

/** Resumo profissional do CV. */
const CV_SUMMARY =
  "Desenvolvedor Front-end com experiência prática em interfaces responsivas usando HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js e Tailwind CSS. Atuação em produto com IA (Escreva+) e no ERP da Residência em TIC (UFG/BRISA), com componentização, consumo de APIs RESTful, Git/GitHub, UI/UX, acessibilidade (WCAG) e Clean Code. Objetivo: vaga de Estágio ou Desenvolvedor Júnior para entregar aplicações web performáticas e centradas no usuário.";

/** Habilidades listadas no CV. */
const CV_SKILLS = [
  "HTML5",
  "CSS3",
  "JavaScript (ES6+)",
  "TypeScript",
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Vite",
  "Git",
  "GitHub",
  "GitHub Actions",
  "Figma",
  "Vercel",
  "APIs RESTful",
  "JSON",
  "LocalStorage",
  "Acessibilidade (WCAG)",
  "Responsividade",
  "Clean Code",
];

type CvJob = {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

/** Experiência profissional. */
const CV_JOBS: CvJob[] = [
  {
    id: "escreva-mais",
    role: "Desenvolvedor Front-end",
    company: "Escreva+",
    period: "Junho 2026 — Novembro 2026",
    bullets: [
      "Resultado: entreguei a interface responsiva de um app de correção textual com IA, cobrindo envio, análise e visualização das sugestões.",
      "Criei +15 componentes reutilizáveis em React.js, TypeScript e Tailwind CSS (Vite), padronizando a UI em mobile e desktop.",
      "Modelei fluxos de UI/UX no Figma e na implementação, com foco em usabilidade e acessibilidade (WCAG).",
      "Estruturei a integração front-end com APIs/serviços de IA (JSON) para análise textual e sugestões automáticas.",
      "Implementei funcionalidades-chave do produto: comparação de textos, feedback detalhado e sugestões inteligentes de correção.",
    ],
  },
  {
    id: "erp-residencia",
    role: "Desenvolvedor Front-end — Projeto ERP para Microempresas",
    company: "Residência em TIC UFG/BRISA",
    period: "Janeiro 2025 — Janeiro 2026",
    bullets: [
      "Resultado: desenvolvi telas do ERP para microempresas em React.js, TypeScript e Tailwind CSS, com layout responsivo.",
      "Implementei componentes reutilizáveis com Clean Code, acessibilidade (WCAG) e boas práticas de Front-end.",
      "Integrei a interface a APIs RESTful (JSON), com manipulação dinâmica de dados entre UI e serviços.",
      "Versionamento com Git/GitHub e atenção a UX/UI e performance em diferentes dispositivos.",
      "Concluí formação prática de 480 horas em Computação Avançada, atuando de forma colaborativa no projeto.",
    ],
  },
];

type CvEducation = {
  id: string;
  title: string;
  institution: string;
  period: string;
  detail?: string;
};

/** Formação acadêmica / prática. */
const CV_EDUCATION: CvEducation[] = [
  {
    id: "ads-ipog",
    title: "Tecnologia em Análise e Desenvolvimento de Sistemas",
    institution: "IPOG",
    period: "Janeiro 2025 — Atual",
  },
  {
    id: "residencia-imersao",
    title: "Residência em TIC — Imersão em Computação Avançada (480 horas)",
    institution: "BRISA / SOFTEX / UFG",
    period: "Conclusão da fase de imersão",
    detail: "Participou da Etapa de Nivelamento do Programa de Residência em TIC.",
  },
];

/** Certificações do CV. */
const CV_CERTS = [
  "UI Design para Iniciantes",
  "React Completo",
  "CSS Grid Layout",
  "CSS Flexbox",
  "HTML e CSS para Iniciantes",
  "Curso Start — SAGA",
  "JavaScript Completo ES6",
];

/** Outros projetos citados no CV. */
const CV_OTHER_PROJECTS = [
  "Portfólio pessoal desenvolvido com React, Next.js e Tailwind CSS",
  "Calculadora de Gorjetas utilizando HTML, CSS e JavaScript",
  "Projetos educacionais em React e JavaScript",
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
// SUBCOMPONENTES
// =============================================================================

/** Título de seção no estilo editorial (como Experiência / Sobre Mim). */
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-1.5 text-sm tracking-[0.2em] text-purple-300/90 uppercase md:mb-1 md:text-xs">
      {children}
    </p>
  );
}

/** Bloco de um emprego do CV. */
function JobBlock({ job }: { job: CvJob }) {
  return (
    <article className="min-w-0 text-left">
      <h2 className="text-[clamp(1.05rem,3.8vw,1.22rem)] font-semibold tracking-wide text-purple-300">
        {job.role}
      </h2>
      <p className="mt-0.5 text-sm text-neutral-300 md:text-xs">
        <span className="text-neutral-100">{job.company}</span>
        <span className="mx-1.5 text-neutral-600">·</span>
        <span className="tabular-nums">{job.period}</span>
      </p>
      <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4 md:mt-1 md:gap-0.5">
        {job.bullets.map((bullet) => (
          <li
            key={bullet.slice(0, 36)}
            className="experience-copy text-pretty text-neutral-100"
          >
            {avoidOrphan(bullet)}
          </li>
        ))}
      </ul>
    </article>
  );
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Currículo: conteúdo do PDF em layout alinhado às outras páginas.
 * Desktop compacto em duas colunas; mobile com scroll natural.
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

      <section className="curriculum-layout about-layout relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-3 min-[390px]:px-6 md:justify-center md:px-10 md:pb-2 lg:px-14 xl:px-20">
        {/* Cabeçalho: cargo + download */}
        <div className="about-enter__title relative z-10 mb-4 flex min-w-0 flex-wrap items-end justify-between gap-3 md:mb-3">
          <div className="min-w-0 text-left">
            <p className="text-sm tracking-[0.2em] text-purple-300/90 uppercase md:text-xs">
              Renan Naves
            </p>
            <p className="mt-1 text-[clamp(1.15rem,4vw,1.45rem)] font-semibold text-neutral-100">
              Desenvolvedor Front-end
            </p>
          </div>

          <a
            href={CV_PDF_HREF}
            download="Renan-Naves-Curriculo.pdf"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-purple-300/45 bg-purple-500/15 px-3.5 py-2 text-xs font-medium tracking-wide text-purple-100 uppercase transition-[transform,background-color,border-color] duration-200 hover:border-purple-200/70 hover:bg-purple-500/25 md:text-[0.7rem]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Baixar PDF
          </a>
        </div>

        {/* Contato */}
        <ul className="about-enter__bio mb-4 flex min-w-0 flex-wrap gap-x-4 gap-y-1.5 text-left text-sm text-neutral-300 md:mb-3 md:gap-x-5 md:text-xs">
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

        {/* ----- Desktop: duas colunas ----- */}
        <div className="about-layout__row hidden min-h-0 w-full grid-cols-[minmax(0,0.92fr)_auto_minmax(0,1.08fr)] items-stretch md:grid">
          {/* Esquerda: resumo, skills, educação, certs */}
          <div className="about-enter__bio flex min-h-0 min-w-0 flex-col justify-start gap-3 overflow-y-auto pr-3 lg:gap-3.5 lg:pr-4 xl:pr-5">
            <div>
              <SectionLabel>Resumo</SectionLabel>
              <p className="experience-copy text-pretty text-neutral-300">
                {avoidOrphan(CV_SUMMARY)}
              </p>
            </div>

            <div>
              <SectionLabel>Habilidades</SectionLabel>
              <ul className="flex flex-wrap gap-1.5">
                {CV_SKILLS.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] tracking-wide text-neutral-200"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionLabel>Educação</SectionLabel>
              <div className="flex flex-col gap-2.5">
                {CV_EDUCATION.map((item) => (
                  <div key={item.id} className="min-w-0 text-left">
                    <h2 className="text-sm font-semibold text-purple-300 md:text-[0.85rem]">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-neutral-300">
                      {item.institution}
                      <span className="mx-1.5 text-neutral-600">·</span>
                      <span className="tabular-nums">{item.period}</span>
                    </p>
                    {item.detail ? (
                      <p className="experience-copy mt-1 text-pretty text-neutral-400">
                        {avoidOrphan(item.detail)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Certificações</SectionLabel>
              <ul className="flex flex-col gap-0.5">
                {CV_CERTS.map((cert) => (
                  <li
                    key={cert}
                    className="experience-copy text-pretty text-neutral-200"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="about-enter__divider about-layout__divider mx-4 min-w-0 self-stretch lg:mx-6 xl:mx-8"
            aria-hidden="true"
          />

          {/* Direita: experiência + outros projetos */}
          <div className="about-enter__facts flex min-h-0 min-w-0 flex-col justify-start gap-3 overflow-y-auto pl-3 lg:gap-3.5 lg:pl-4 xl:pl-5">
            <div className="flex flex-col gap-3 lg:gap-3.5">
              <SectionLabel>Experiência profissional</SectionLabel>
              {CV_JOBS.map((job) => (
                <JobBlock key={job.id} job={job} />
              ))}
            </div>

            <div>
              <SectionLabel>Outros projetos</SectionLabel>
              <ul className="flex list-disc flex-col gap-1 pl-4">
                {CV_OTHER_PROJECTS.map((project) => (
                  <li
                    key={project}
                    className="experience-copy text-pretty text-neutral-100"
                  >
                    {avoidOrphan(project)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ----- Mobile: coluna única ----- */}
        <div className="flex w-full flex-col gap-6 md:hidden">
          <div className="about-enter__bio">
            <SectionLabel>Resumo</SectionLabel>
            <p className="experience-copy text-pretty text-neutral-300">
              {avoidOrphan(CV_SUMMARY)}
            </p>
          </div>

          <div className="about-enter__facts">
            <SectionLabel>Habilidades</SectionLabel>
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {CV_SKILLS.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs tracking-wide text-neutral-200"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="about-enter__divider about-layout__divider"
            aria-hidden="true"
          />

          <div className="about-enter__facts flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <SectionLabel>Experiência profissional</SectionLabel>
              {CV_JOBS.map((job) => (
                <JobBlock key={job.id} job={job} />
              ))}
            </div>

            <div>
              <SectionLabel>Educação</SectionLabel>
              <div className="mt-1 flex flex-col gap-3">
                {CV_EDUCATION.map((item) => (
                  <div key={item.id}>
                    <h2 className="text-[clamp(1.05rem,3.8vw,1.2rem)] font-semibold text-purple-300">
                      {item.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-neutral-300">
                      {item.institution}
                      <span className="mx-1.5 text-neutral-600">·</span>
                      {item.period}
                    </p>
                    {item.detail ? (
                      <p className="experience-copy mt-1 text-pretty text-neutral-400">
                        {avoidOrphan(item.detail)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Certificações</SectionLabel>
              <ul className="mt-1 flex flex-col gap-1">
                {CV_CERTS.map((cert) => (
                  <li key={cert} className="experience-copy text-neutral-200">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionLabel>Outros projetos</SectionLabel>
              <ul className="mt-1 flex list-disc flex-col gap-1 pl-4">
                {CV_OTHER_PROJECTS.map((project) => (
                  <li
                    key={project}
                    className="experience-copy text-pretty text-neutral-100"
                  >
                    {avoidOrphan(project)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
