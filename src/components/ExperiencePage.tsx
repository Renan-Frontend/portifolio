import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS
// =============================================================================

/** Visão geral da experiência. */
const EXPERIENCE_SUMMARY = [
  "Minha experiência em desenvolvimento de software envolve projetos colaborativos e independentes, passando pela construção e evolução de aplicações web, sistemas de gestão e plataformas com inteligência artificial.",
  "Ao longo dessa trajetória, venho desenvolvendo habilidades em interfaces, implementação de funcionalidades, resolução de problemas e experiência do usuário.",
  "A seguir, apresento algumas das experiências e projetos que contribuíram para minha evolução profissional, desde a participação em equipes de desenvolvimento até a criação de soluções independentes.",
];

type ExperienceItem = {
  id: string;
  title: string;
  paragraphs: string[];
};

/** Coluna esquerda: Residência (após o resumo). */
const EXPERIENCE_LEFT: ExperienceItem = {
  id: "residencia-tic",
  title: "Residência em TIC — UFG/BRISA",
  paragraphs: [
    "Minha trajetória na Residência em TIC da UFG/BRISA começou com um curso preparatório on-line, seguido de uma prova seletiva na qual fiquei entre os 20 melhores colocados, conquistando a oportunidade de participar do programa.",
    "Durante a residência, participei de aulas teóricas e atividades práticas, incluindo o desenvolvimento do BP Company, um app de gestão comercial com CRM e geração de diagramas BPMN por IA, em equipe de cinco integrantes. Nesse projeto, atuei como principal desenvolvedor de software do grupo, no front-end em React e no backend em FastAPI, participando da implementação, das decisões técnicas e da construção da aplicação.",
    "Ao final do programa, apresentamos o projeto desenvolvido a professores da área de tecnologia e representantes de empresas, proporcionando a oportunidade de demonstrar a solução, explicar as decisões tomadas e compartilhar os resultados do trabalho.",
    "Essa experiência fortaleceu minhas habilidades técnicas, minha capacidade de trabalhar em equipe, resolver problemas e apresentar soluções de software.",
  ],
};

/** Coluna direita: Escreva+ e Projetos Independentes. */
const EXPERIENCE_RIGHT: ExperienceItem[] = [
  {
    id: "escreva-mais",
    title: "Escreva+ — Plataforma com Inteligência Artificial",
    paragraphs: [
      "Após meu desempenho na Residência em TIC da UFG/BRISA, fui convidado a integrar uma equipe de três desenvolvedores para construir o front-end do Escreva+, uma plataforma de correção de redações que utiliza inteligência artificial.",
      "Minha atuação envolve o desenvolvimento de interfaces, implementação de funcionalidades, correção de problemas e aprimoramento da experiência do usuário. Também trabalho com responsividade, refinamento de componentes e validação de funcionalidades, buscando tornar a aplicação intuitiva, consistente e acessível.",
      "A experiência me permite aprofundar conhecimentos em desenvolvimento front-end, participar de decisões técnicas e colaborar diretamente com outros desenvolvedores, utilizando fluxos de trabalho como Git, pull requests e revisão de implementações.",
    ],
  },
  {
    id: "projetos-independentes",
    title: "Projetos Independentes",
    paragraphs: [
      "Desenvolvo projetos independentes a partir de ideias próprias, explorando tecnologias e colocando em prática meus conhecimentos em desenvolvimento de software.",
      "Nesses projetos, atuo de forma autônoma em todas as etapas, desde a concepção e planejamento até a arquitetura, construção das interfaces e implementação das funcionalidades. Esse processo me permite experimentar novas soluções, aprofundar conhecimentos e desenvolver minha capacidade de transformar ideias em produtos digitais.",
      "Na próxima página, você pode conhecer melhor esses projetos, explorar suas funcionalidades e conferir algumas das soluções que desenvolvi.",
    ],
  },
];

/** Ordem no mobile (coluna única). */
const EXPERIENCE_MOBILE = [EXPERIENCE_LEFT, ...EXPERIENCE_RIGHT];

// =============================================================================
// TIPOS
// =============================================================================

type ExperiencePageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a seção Projetos. */
  onProjects: () => void;
};

// =============================================================================
// FUNÇÕES AUXILIARES / SUBCOMPONENTES
// =============================================================================

/**
 * Intro da trajetória — sem card; rótulo editorial acima do texto.
 * Corpo no mesmo tamanho das descrições das experiências; texto em cinza.
 */
function TrajectoryIntro() {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 text-left md:gap-1">
      <p className="mb-0.5 text-sm tracking-[0.2em] text-purple-300/90 uppercase md:text-xs">
        Minha trajetória
      </p>
      {EXPERIENCE_SUMMARY.map((paragraph) => (
        <p
          key={paragraph.slice(0, 24)}
          className="experience-copy text-pretty text-neutral-300"
        >
          {avoidOrphan(paragraph)}
        </p>
      ))}
    </div>
  );
}

/**
 * Bloco de uma experiência (título + parágrafos).
 * Título e espaçamentos padronizados nas três experiências (como labels de Sobre Mim).
 */
function ExperienceBlock({ item }: { item: ExperienceItem }) {
  return (
    <article className="experience-block min-w-0 text-left">
      <h2 className="text-[clamp(1.12rem,4.2vw,1.3rem)] font-semibold tracking-wide text-purple-300 md:text-[clamp(1.02rem,1.55vw,1.22rem)]">
        {item.title}
      </h2>
      <div className="mt-1.5 flex flex-col gap-1.5 md:mt-1 md:gap-1">
        {item.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 28)}
            className="experience-copy text-pretty text-neutral-100"
          >
            {avoidOrphan(paragraph)}
          </p>
        ))}
      </div>
    </article>
  );
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Experiência compacta no desktop (sem depender de overflow hidden).
 * Esquerda: resumo + Residência | Direita: Escreva+ + Projetos Independentes.
 */
function ExperiencePage({ onBack, onProjects }: ExperiencePageProps) {
  // ----- handlers -----

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Navega para Projetos. */
  function handleProjects(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onProjects();
  }

  // ----- interface -----
  return (
    <main className="experience-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white">
      {/* Marca d’água — posição alinhada à de Sobre Mim */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Experiência
      </h1>

      {/* Sem h-svh fixo: a página cresce com o conteúdo e permite scroll natural. */}
      <section className="experience-layout about-layout relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-3 min-[390px]:px-6 md:justify-center md:px-10 md:pb-2 lg:px-14 xl:px-20">
        {/* ----- Desktop: duas colunas equilibradas ----- */}
        <div className="about-layout__row hidden w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch md:grid">
          {/* Esquerda — topo alinhado com a coluna direita (Escreva+) */}
          <div className="about-enter__bio flex min-w-0 flex-col justify-start gap-3 pr-3 lg:gap-3.5 lg:pr-4 xl:pr-5">
            <TrajectoryIntro />
            <ExperienceBlock item={EXPERIENCE_LEFT} />
          </div>

          {/* Divisória */}
          <div
            className="about-enter__divider about-layout__divider mx-4 min-w-0 self-stretch lg:mx-6 xl:mx-8"
            aria-hidden="true"
          />

          {/* Direita — mesmo início vertical do intro; espaçamento entre projetos padronizado */}
          <div className="about-enter__facts flex min-w-0 flex-col justify-start gap-3 pl-3 lg:gap-3.5 lg:pl-4 xl:pl-5">
            {EXPERIENCE_RIGHT.map((item) => (
              <ExperienceBlock key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* ----- Mobile: coluna única com scroll natural ----- */}
        <div className="flex w-full flex-col gap-6 md:hidden">
          <div className="about-enter__bio">
            <TrajectoryIntro />
          </div>

          <div
            className="about-enter__divider about-layout__divider"
            aria-hidden="true"
          />

          <div className="about-enter__facts flex flex-col gap-5">
            {EXPERIENCE_MOBILE.map((item) => (
              <ExperienceBlock key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer — após o conteúdo, sem overlay */}
      <footer className="about-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label="Navegação da página Experiência"
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
            href="#projects"
            onClick={handleProjects}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <span className="truncate">Projetos</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default ExperiencePage;
