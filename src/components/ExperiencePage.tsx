import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// TIPOS
// =============================================================================

type ExperienceItem = {
  id: string;
  title: string;
  paragraphs: string[];
};

/** Parte 1: trajetória + Residência. Parte 2: Escreva+ e independentes. */
type ExperienceStep = 1 | 2;

type ExperiencePageProps = {
  /** Qual das duas partes está na tela. */
  step: ExperienceStep;
  /** Volta: home na parte 1, parte 1 na parte 2. */
  onBack: () => void;
  /** Avança: parte 2 na parte 1, Projetos na parte 2. */
  onNext: () => void;
};

// =============================================================================
// DADOS
// =============================================================================

/** Parte 1, coluna esquerda: mesmo título e corpo das outras experiências. */
const EXPERIENCE_INTRO: ExperienceItem = {
  id: "trajetoria",
  title: "Minha trajetória",
  paragraphs: [
    "Sou desenvolvedor de software em Goiânia e curso Tecnologia em Análise e Desenvolvimento de Sistemas no IPOG desde 2025. A base veio de HTML, CSS, JavaScript, React e UI, que fui colocando em prática em interfaces e em produtos com inteligência artificial.",
    "No front-end uso React, TypeScript, Next.js, Tailwind CSS e Vite. Também trabalho com Python, APIs REST e bancos de dados, com Git, GitHub e Figma. Me importo com responsividade, acessibilidade e com código que outra pessoa consiga manter.",
    "Na prática, entreguei o front-end do Escreva+ e a integração com serviços de IA para correção textual. Na Residência em TIC da UFG/BRISA, desenvolvi o BP Company, gestão comercial com CRM e diagramas BPMN por IA, em React e FastAPI.",
    "Em paralelo mantenho projetos próprios, como este portfólio e outros estudos em React e JavaScript. Busco um estágio em engenharia de software com foco em IA, para continuar construindo e integrando produtos reais.",
  ],
};

/** Parte 1, coluna direita: Residência em TIC. */
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

/** Parte 2: Escreva+ (esquerda) e Projetos Independentes (direita). */
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
      "Além do trabalho em equipe, desenvolvo projetos por conta própria para estudar tecnologias e publicar o resultado. O Bikcraft é um site institucional de bicicletas elétricas, em HTML e CSS, com páginas de produtos, orçamento e contato. O Dogs é uma rede social para cachorros, feita em React no fechamento dos estudos de JavaScript, CSS e HTML.",
      "Também construí a primeira versão deste currículo, em HTML, CSS e JavaScript, com experiência, formação e contato. Este portfólio veio depois, em React, TypeScript e Vite: a introdução, a navegação entre as páginas, o carrossel de projetos, os certificados e o download do PDF.",
      "Em cada um eu percorro o caminho inteiro, da ideia e do planejamento até a interface, as funcionalidades e a publicação. É onde experimento soluções novas e consolido o que aprendo nos cursos e nas experiências em equipe. Na próxima página dá para abrir cada projeto, ver o que ele faz e acessar o site.",
    ],
  },
];

// =============================================================================
// FUNÇÕES AUXILIARES / SUBCOMPONENTES
// =============================================================================

/**
 * Bloco de uma experiência (título + parágrafos).
 * Título e corpo iguais em trajetória, Residência, Escreva+ e projetos independentes.
 */
function ExperienceBlock({ item }: { item: ExperienceItem }) {
  return (
    <article className="experience-block min-w-0 text-left">
      <h2 className="page-heading">{item.title}</h2>
      <div className="mt-1.5 flex flex-col gap-1.5 md:mt-1 md:gap-1">
        {item.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 28)}
            className="page-copy text-pretty"
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
 * Uma grade só, no mesmo ritmo de Sobre Mim.
 * Esquerda entra pela esquerda, direita pela direita; a key da parte remonta e repete a entrada.
 */
function ExperienceSplit({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="about-layout__row grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-start md:gap-0">
      <div className="about-enter__bio flex min-w-0 flex-col justify-start gap-4 md:pr-3 lg:pr-4 xl:pr-5">
        {left}
      </div>

      <div
        className="about-enter__divider about-layout__divider min-w-0 md:mx-4 lg:mx-6 xl:mx-8"
        aria-hidden="true"
      />

      <div className="about-enter__facts flex min-w-0 flex-col justify-start gap-4 md:pl-3 lg:pl-4 xl:pl-5">
        {right}
      </div>
    </div>
  );
}

/**
 * Experiência em duas partes para não empilhar resumo e os três blocos na mesma tela.
 * Parte 1: trajetória + Residência. Parte 2: Escreva+ + Projetos Independentes.
 */
function ExperiencePage({ step, onBack, onNext }: ExperiencePageProps) {
  const isFirst = step === 1;
  const backLabel = isFirst ? "Página inicial" : "Parte anterior";
  const nextLabel = isFirst ? "Próxima parte" : "Projetos";
  const backHref = isFirst ? "#" : "#experience";
  const nextHref = isFirst ? "#experience-2" : "#projects";

  // ----- handlers -----

  /** Volta para a home (parte 1) ou para a parte 1 (parte 2). */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Avança para a parte 2 ou para Projetos. */
  function handleNext(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onNext();
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
      <section className="experience-layout about-layout relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-4 min-[390px]:px-6 md:justify-center md:px-10 md:pb-2 lg:px-14 xl:px-20">
        <ExperienceSplit
          key={step}
          left={
            <ExperienceBlock
              item={isFirst ? EXPERIENCE_INTRO : EXPERIENCE_RIGHT[0]}
            />
          }
          right={
            <ExperienceBlock
              item={isFirst ? EXPERIENCE_LEFT : EXPERIENCE_RIGHT[1]}
            />
          }
        />
      </section>

      {/* Contagem — mesma faixa do carrossel (acima do footer, fora do rodapé) */}
      <p
        className="relative z-20 mb-3 shrink-0 text-center text-sm tracking-[0.18em] text-neutral-400 tabular-nums md:mb-4 md:text-base"
        aria-live="polite"
      >
        <span className="text-neutral-300">
          {String(step).padStart(2, "0")}
        </span>
        <span className="mx-1.5 text-neutral-600">/</span>
        <span>02</span>
      </p>

      <footer className="about-enter__footer relative z-20 w-full shrink-0 border-t border-dotted border-neutral-700 px-5 py-3 min-[390px]:px-6 md:px-10 md:py-2.5 lg:px-14 xl:px-20">
        <nav
          className="flex min-w-0 items-center justify-between gap-3 text-xs tracking-wide uppercase min-[390px]:gap-4 min-[390px]:text-sm md:text-base"
          aria-label={`Navegação da Experiência, parte ${step} de 2`}
        >
          <a
            href={backHref}
            onClick={handleBack}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:-translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{backLabel}</span>
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

export default ExperiencePage;
