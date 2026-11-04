import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS (rascunho — edite aqui quando quiser)
// =============================================================================

/**
 * Bio em quatro parágrafos — apresentação pessoal (sem detalhar experiências).
 * `highlight` mantém o cargo em lilás no primeiro parágrafo.
 */
const ABOUT_BIO = {
  before: "Sou ",
  highlight: "desenvolvedor de software",
  after:
    " de Goiânia e gosto de transformar ideias em experiências digitais intuitivas. No front-end, desenvolvo interfaces modernas, responsivas e acessíveis com React, TypeScript, Next.js e Tailwind CSS. Também atuo no back-end com Python, desenvolvimento de APIs e bancos de dados, buscando compreender e trabalhar em diferentes partes de uma aplicação.",
  second:
    "Acredito que um bom produto vai além de funcionar: precisa oferecer uma experiência agradável, ser bem estruturado e atender às necessidades de quem o utiliza. Por isso, valorizo UI/UX, acessibilidade, atenção aos detalhes e código limpo. Gosto de pensar não apenas em como desenvolver uma funcionalidade, mas também em como ela será percebida e utilizada pelas pessoas.",
  third:
    "Sou apaixonado por tecnologia e jogos, interesses que despertam minha curiosidade sobre novas possibilidades, experiências interativas e inovação. Gosto de acompanhar o surgimento de novas ferramentas, explorar tecnologias emergentes e entender como elas podem transformar a maneira como criamos e utilizamos produtos digitais.",
  fourth:
    "Também valorizo o aprendizado constante, a criatividade e a resolução de problemas. Estou sempre buscando novos desafios que me permitam experimentar, aprimorar minhas habilidades e ampliar meus conhecimentos, unindo tecnologia, criatividade e boas práticas para desenvolver soluções digitais cada vez melhores.",
};

/** Itens da grade — preenchidos a partir do CV. */
const ABOUT_FACTS = [
  {
    label: "Educação",
    value: "Análise e Desenvolvimento de Sistemas — IPOG",
  },
  {
    label: "Experiência",
    value: "Escreva+ (IA) · ERP — Residência TIC UFG/BRISA",
  },
  { label: "Localização", value: "Goiânia, Brasil" },
  {
    label: "Tecnologias",
    value: "React, Next.js, TypeScript, Python, SQL, Tailwind",
  },
  {
    label: "Ferramentas",
    value: "Git, GitHub, Figma, Vercel",
  },
  {
    label: "Competências",
    value: "APIs REST, bancos de dados, WCAG, Clean Code",
  },
  {
    label: "Formação prática",
    value: "Imersão em Computação Avançada — 480h",
  },
  {
    label: "Interesses",
    value: "UI/UX, inteligência artificial, jogos e novas tecnologias",
  },
];

// =============================================================================
// TIPOS
// =============================================================================

type AboutPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a seção/página de Experiências. */
  onExperience: () => void;
};

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Sobre Mim: marca d’água, bio | divisória | grade de infos, footer nav.
 * Layout amplo em CSS Grid (minmax) para não sobrepor colunas.
 */
function AboutPage({ onBack, onExperience }: AboutPageProps) {
  // ----- handlers -----

  /** Impede navegação padrão e chama o callback de voltar. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Impede navegação padrão e chama o callback de experiências. */
  function handleExperience(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onExperience();
  }

  // ----- interface -----
  return (
    <main className="about-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white md:h-svh">
      {/* Marca d’água — mesmo ritmo da página Experiência */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Sobre&nbsp;Mim
      </h1>

      {/*
        Mobile: coluna única + scroll natural se precisar.
        Desktop: duas colunas, mesmo compactamento da Experiência.
      */}
      <section className="about-layout relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-3 min-[390px]:px-6 md:min-h-0 md:justify-center md:px-10 md:pb-2 lg:px-14 xl:px-20">
        <div className="about-layout__row grid w-full grid-cols-1 items-stretch gap-8 md:grid-cols-[minmax(0,48fr)_auto_minmax(0,52fr)] md:items-center md:gap-0">
          {/* ----- Bio ----- */}
          <div className="about-enter__bio flex min-w-0 flex-col justify-center gap-2.5 md:gap-1 md:pr-2 lg:pr-2.5 xl:pr-3">
            <p className="experience-copy text-pretty text-left text-neutral-300">
              {ABOUT_BIO.before}
              <strong className="font-semibold text-purple-300">
                {ABOUT_BIO.highlight}
              </strong>
              {avoidOrphan(ABOUT_BIO.after)}
            </p>
            <p className="experience-copy text-pretty text-left text-neutral-300">
              {avoidOrphan(ABOUT_BIO.second)}
            </p>
            <p className="experience-copy text-pretty text-left text-neutral-300">
              {avoidOrphan(ABOUT_BIO.third)}
            </p>
            <p className="experience-copy text-pretty text-left text-neutral-300">
              {avoidOrphan(ABOUT_BIO.fourth)}
            </p>
          </div>

          {/* ----- Divisória ----- */}
          <div
            className="about-enter__divider about-layout__divider min-w-0 md:mx-5 lg:mx-8 xl:mx-10"
            aria-hidden="true"
          />

          {/* ----- Fatos: sobe discretamente no desktop, mantendo equilíbrio com a bio ----- */}
          <dl className="about-enter__facts about-layout__facts grid min-w-0 gap-y-5 md:-translate-y-2 md:gap-x-8 md:gap-y-3.5 lg:-translate-y-3 lg:gap-x-12 lg:gap-y-4">
            {ABOUT_FACTS.map((fact) => (
              <div key={fact.label} className="about-layout__fact min-w-0 text-left">
                <dt className="text-sm tracking-[0.2em] text-purple-300/90 uppercase md:text-xs">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 experience-copy text-pretty text-neutral-100 md:mt-1">
                  {avoidOrphan(fact.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer — mesmo padding da Experiência */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label="Navegação da página Sobre Mim"
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
            <span className="truncate">Experiências</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default AboutPage;
