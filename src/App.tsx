import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import AboutPage from "./components/AboutPage";
import IntroPresentation from "./components/IntroPresentation";

// =============================================================================
// DADOS
// =============================================================================

/** Lista completa de projetos do portfólio. */
const projects = [
  { id: "monsterland", name: "Monsterland", href: "#monsterland" },
  {
    id: "plataforma-educacao",
    name: "Plataforma Educação",
    href: "#plataforma-educacao",
  },
  { id: "rotina-tracker", name: "Rotina Tracker", href: "#rotina-tracker" },
  { id: "portfolio", name: "Portfólio", href: "#portfolio" },
];

/** Projetos exibidos no menu (hoje: os 4 primeiros). */
const visibleProjects = projects.slice(0, 4);

// =============================================================================
// TIPOS
// =============================================================================

/** IDs válidos de navegação (home + seções + projetos). */
type NavId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "curriculum"
  | (typeof projects)[number]["id"];

// =============================================================================
// FUNÇÕES AUXILIARES (fora do componente)
// =============================================================================

/**
 * Converte o hash da URL em um NavId.
 * Hash vazio / "#" = home (não trata mais "about" como padrão).
 */
function navFromHash(hash: string): NavId {
  const id = hash.replace(/^#/, "");

  if (!id) {
    return "home";
  }

  if (
    id === "about" ||
    id === "experience" ||
    id === "projects" ||
    id === "curriculum" ||
    id === "home"
  ) {
    return id;
  }

  if (projects.some((project) => project.id === id)) {
    return id as NavId;
  }

  return "home";
}

/**
 * Diz se o id informado pertence a um projeto da lista visível.
 */
function isProjectId(id: NavId): boolean {
  return visibleProjects.some((project) => project.id === id);
}

/**
 * Lê o hash atual com segurança no primeiro render (SSR-safe).
 */
function initialNav(): NavId {
  if (typeof window === "undefined") {
    return "home";
  }
  return navFromHash(window.location.hash);
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

/**
 * Shell do portfólio: intro + home, ou páginas internas (ex.: Sobre Mim).
 */
function App() {
  // ----- estado -----
  const [active, setActive] = useState<NavId>(initialNav);

  /** Controla se a lista de projetos está aberta ou fechada (aberta por padrão). */
  const [projectsOpen, setProjectsOpen] = useState(true);

  /**
   * Intro só na primeira visita à home nesta sessão de página.
   * Não repete ao voltar de Sobre Mim.
   */
  const [showIntro, setShowIntro] = useState(() => initialNav() === "home");

  /** Já terminou (ou pulou) a intro — libera a cascata da home. */
  const [introDone, setIntroDone] = useState(() => initialNav() !== "home");

  // ----- efeitos -----

  /**
   * Sincroniza a view com o hash da URL ao carregar e em hashchange.
   */
  useEffect(() => {
    const syncFromUrl = () => {
      const next = navFromHash(window.location.hash);
      setActive(next);

      if (next === "projects" || isProjectId(next)) {
        setProjectsOpen(true);
      }
    };

    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);

    return () => window.removeEventListener("hashchange", syncFromUrl);
  }, []);

  // ----- handlers / helpers -----

  /**
   * Marca um item como ativo ao clicar.
   * Se for projeto, também abre a lista (sem fechar ao clicar em outras opções).
   */
  const select = (id: NavId) => () => {
    setActive(id);

    if (id === "projects" || isProjectId(id)) {
      setProjectsOpen(true);
    }
  };

  /**
   * Abre ou fecha a lista de projetos ao clicar em "Projetos".
   * Só esse clique fecha a lista.
   */
  const toggleProjects = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    setProjectsOpen((open) => {
      const next = !open;

      if (next) {
        setActive("projects");
        window.history.replaceState(null, "", "#projects");
      } else if (active === "projects" || isProjectId(active)) {
        setActive("projects");
      }

      return next;
    });
  };

  /**
   * Verifica se um item do menu deve aparecer como ativo (cor lilás).
   */
  const isActive = (id: NavId) =>
    active === id ||
    (id === "projects" && (active === "projects" || isProjectId(active)));

  /**
   * Monta as classes CSS de um item do menu (hover lilás + desloca pra frente).
   */
  const itemClass = (id: NavId) =>
    [
      "relative block translate-x-0 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300",
      isActive(id) ? "text-purple-300" : "",
    ].join(" ");

  /** Encerra a intro e libera a animação de entrada da home. */
  function finishIntro() {
    setShowIntro(false);
    setIntroDone(true);
  }

  /** Volta à home sem repetir a intro cinemática. */
  function goHome() {
    setActive("home");
    setShowIntro(false);
    setIntroDone(true);
    window.history.pushState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  }

  /** Vai para Experiências (hash; página completa ainda não existe). */
  function goExperience() {
    setActive("experience");
    window.location.hash = "experience";
  }

  // ----- interface: página Sobre Mim -----
  if (active === "about") {
    return <AboutPage onBack={goHome} onExperience={goExperience} />;
  }

  // ----- interface: home -----
  return (
    <main
      className={[
        "relative isolate flex min-h-svh max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white",
        introDone ? "home-enter--play" : "",
      ].join(" ")}
    >
      {/* ----- Apresentação cinemática inicial (só 1ª vez na home) ----- */}
      {showIntro ? <IntroPresentation onComplete={finishIntro} /> : null}

      {/* ----- Foto de fundo (entra depois do nome/cargo) ----- */}
      <div className="home-enter__photo pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 overflow-hidden md:hidden">
          <img
            src="/profile/renan-profile.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full max-w-none object-cover object-[72%_30%] brightness-[0.96]"
          />
          <div className="photo-edge-fade-mobile absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-b from-neutral-950/35 via-transparent to-neutral-950/75" />
        </div>

        <div className="absolute inset-y-0 right-10 hidden w-[min(70vw,980px)] overflow-hidden md:block lg:right-14">
          <img
            src="/profile/renan-profile.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[68%_32%] brightness-[0.96]"
          />
          <div className="photo-edge-fade-desktop absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-neutral-950/50" />
          <div className="absolute inset-0 bg-linear-to-t from-transparent to-neutral-950/25" />
        </div>
      </div>

      {/* ----- Conteúdo: nome, cargo e menu ----- */}
      <section className="relative z-10 flex min-w-0 flex-1 flex-col justify-start px-5 pt-6 pb-10 min-[390px]:pt-12 min-[390px]:pb-12 sm:px-6 md:justify-center md:px-24 md:py-12 lg:px-32">
        <div className="flex w-full min-w-0 max-w-[88%] flex-col items-start text-left min-[390px]:max-w-[82%] sm:max-w-[75%] md:max-w-[46%] lg:max-w-[44%]">
          <div className="home-enter__identity mt-0 flex min-w-0 flex-col items-start min-[390px]:mt-3 md:mt-0">
            <h1 className="font-script max-w-full overflow-x-clip whitespace-nowrap pt-[0.2em] text-[clamp(2.35rem,10.5vw,4.25rem)] leading-none text-purple-300 min-[390px]:pt-[0.25em] min-[390px]:text-[clamp(3.5rem,13vw,5.5rem)] min-[430px]:text-[clamp(4rem,14vw,6rem)] md:text-8xl lg:text-9xl">
              Renan&nbsp;Naves
            </h1>

            <p className="mt-1.5 text-sm tracking-widest text-neutral-400 uppercase min-[390px]:mt-2 min-[390px]:text-base min-[430px]:text-lg md:mt-3 md:text-lg">
              Desenvolvedor de Software
            </p>
          </div>

          <nav className="home-enter__nav mt-10 flex w-fit max-w-full flex-col items-start gap-2.5 text-base font-semibold tracking-wide uppercase min-[390px]:mt-20 min-[390px]:gap-3 min-[390px]:text-lg min-[430px]:mt-24 min-[430px]:gap-3.5 min-[430px]:text-xl md:mt-12 md:gap-3.5 md:text-lg lg:mt-14">
            <a
              href="#about"
              onClick={select("about")}
              className={itemClass("about")}
            >
              Sobre Mim
            </a>

            <a
              href="#experience"
              onClick={select("experience")}
              className={itemClass("experience")}
            >
              Experiência
            </a>

            <div className="flex w-fit flex-col items-start gap-2.5 min-[390px]:gap-3 min-[430px]:gap-3.5 md:gap-3">
              <a
                href="#projects"
                onClick={toggleProjects}
                aria-expanded={projectsOpen}
                className={`${itemClass("projects")} inline-flex items-center gap-1.5`}
              >
                Projetos
                <ChevronDown
                  aria-hidden="true"
                  className={[
                    "h-4 w-4 shrink-0 transition-transform duration-300 ease-out min-[390px]:h-5 min-[390px]:w-5",
                    projectsOpen ? "rotate-0" : "rotate-180",
                  ].join(" ")}
                />
              </a>

              <div
                className={[
                  "grid w-fit transition-[grid-template-rows,opacity] duration-300 ease-out",
                  projectsOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <div className="flex w-fit flex-col gap-2.5 border-l-2 border-purple-300/90 pt-1 pl-6 text-left min-[390px]:gap-3 min-[430px]:gap-3.5 md:gap-3 md:pl-8">
                    {visibleProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.href}
                        onClick={select(project.id)}
                        tabIndex={projectsOpen ? 0 : -1}
                        className={[
                          "block translate-x-0 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300",
                          active === project.id
                            ? "translate-x-1 text-purple-300"
                            : "",
                        ].join(" ")}
                      >
                        {project.name}
                      </a>
                    ))}

                    <a
                      href="#projects"
                      onClick={select("projects")}
                      tabIndex={projectsOpen ? 0 : -1}
                      className="inline-flex translate-x-0 items-center gap-2 text-purple-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-200"
                    >
                      Ver todos os projetos
                      <ArrowRight className="h-4 w-4 min-[390px]:h-5 min-[390px]:w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#curriculum"
              onClick={select("curriculum")}
              className={itemClass("curriculum")}
            >
              Currículo
            </a>
          </nav>
        </div>
      </section>

      {/* ----- Rodapé: email, WhatsApp e LinkedIn ----- */}
      <footer className="home-enter__footer relative z-20 mt-auto w-full shrink-0 border-t border-dotted border-neutral-700 bg-neutral-950 px-5 py-5 sm:px-6 md:px-24 md:py-6 lg:px-32">
        <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-stretch md:gap-0">
          <div className="min-w-0 md:pr-16 lg:pr-20">
            <p className="text-sm tracking-widest text-purple-300 uppercase min-[390px]:text-base">
              Email
            </p>
            <a
              href="mailto:renan.naves.frontend@gmail.com"
              className="mt-1 block text-base break-all transition hover:text-purple-300 min-[390px]:text-lg md:truncate md:text-base"
            >
              renan.naves.frontend@gmail.com
            </a>
          </div>

          <div className="shrink-0 md:border-l md:border-neutral-600 md:px-16 lg:px-20">
            <p className="text-sm tracking-widest text-purple-300 uppercase min-[390px]:text-base">
              Celular/Whatsapp
            </p>
            <a
              href="https://wa.me/5562982941455"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-base transition hover:text-purple-300 min-[390px]:text-lg md:text-base"
            >
              +55 (62) 98294-1455
            </a>
          </div>

          <div className="min-w-0 md:border-l md:border-neutral-600 md:pl-16 lg:pl-20">
            <p className="text-sm tracking-widest text-purple-300 uppercase min-[390px]:text-base">
              LinkedIn
            </p>
            <a
              href="https://www.linkedin.com/in/renannavesfrontend"
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-base break-all transition hover:text-purple-300 min-[390px]:text-lg md:truncate md:text-base"
            >
              linkedin.com/in/renannavesfrontend
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
