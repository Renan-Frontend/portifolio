import { ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { publicUrl } from "../utils/publicUrl";
import { avoidOrphan } from "../utils/text";

// =============================================================================
// DADOS
// =============================================================================

/** Status de disponibilidade. */
const CV_STATUS = "Aberto a novas oportunidades";

/** Chamada principal da página. */
const CV_HEADLINE = "Vamos trabalhar juntos?";

/** Apresentação da página, alinhada ao estágio em software com foco em IA. */
const CV_INTRO = [
  "Busco um estágio em engenharia de software com foco em inteligência artificial.",
  "Construo e integro produtos digitais. No Escreva+, entreguei o front-end e a integração com serviços de IA para correção textual. Na Residência em TIC (UFG/BRISA), desenvolvi o BP Company: gestão comercial com CRM e geração de BPMN por IA, em React e FastAPI.",
  "Quero entrar em um time em que eu continue construindo software, aprenda com IA na prática e evolua em produtos reais.",
];

/** Preview visual do currículo (imagem fornecida — não recriar o conteúdo). */
const CV_PREVIEW_SRC = publicUrl("cv/curriculo-preview.png");
const CV_PREVIEW_ALT =
  "Prévia do currículo de Renan Naves — Desenvolvedor de Software";

/** PDF completo para download. */
const CV_PDF_HREF = publicUrl("cv/renan-naves.pdf");

/**
 * Mesmos canais do rodapé da home (Email, WhatsApp, LinkedIn, GitHub).
 */
const CV_CONTACTS = [
  {
    id: "email",
    label: "Email",
    value: "renan.naves.frontend@gmail.com",
    href: "mailto:renan.naves.frontend@gmail.com",
    external: false,
  },
  {
    id: "whatsapp",
    label: "Celular/Whatsapp",
    value: "+55 (62) 98294-1455",
    href: "https://wa.me/5562982941455",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/renannavesfrontend",
    href: "https://www.linkedin.com/in/renannavesfrontend",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/Renan-Frontend",
    href: "https://github.com/Renan-Frontend",
    external: true,
  },
] as const;

// =============================================================================
// TIPOS
// =============================================================================

type CurriculumPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a página Sobre Mim. */
  onAbout: () => void;
};

type CurriculumActionsProps = {
  /** Se o painel de redes está aberto. */
  contactOpen: boolean;
  /** Alterna a exibição das redes sociais. */
  onToggleContact: () => void;
};

// =============================================================================
// SUBCOMPONENTES
// =============================================================================

/** Botões de download e contato (abre as redes abaixo). */
function CurriculumActions({
  contactOpen,
  onToggleContact,
}: CurriculumActionsProps) {
  return (
    <div className="flex w-full flex-wrap items-center gap-3 md:gap-3.5">
      <a
        href={CV_PDF_HREF}
        download="Renan-Naves-Curriculo.pdf"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-purple-500 px-5 py-2.5 text-sm font-medium tracking-wide text-white transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-purple-400"
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        Baixar currículo
      </a>

      <button
        type="button"
        onClick={onToggleContact}
        aria-expanded={contactOpen}
        aria-controls="curriculum-contacts"
        className={[
          "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-[transform,background-color,border-color,color] duration-200 hover:scale-[1.02]",
          contactOpen
            ? "border-purple-200 bg-purple-500/20 text-purple-100"
            : "border-purple-300/55 bg-transparent text-neutral-100 hover:border-purple-200 hover:bg-purple-500/10",
        ].join(" ")}
      >
        <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
        Entrar em contato
      </button>
    </div>
  );
}

/** Painel com as redes do rodapé da home. */
function CurriculumContacts({ open }: { open: boolean }) {
  return (
    <div
      id="curriculum-contacts"
      className={[
        "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out",
        open
          ? "mt-4 grid-rows-[1fr] opacity-100 md:mt-5"
          : "mt-0 grid-rows-[0fr] opacity-0",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div className="overflow-hidden">
        <div className="grid min-w-0 grid-cols-1 gap-4 border-t border-neutral-800 pt-4 sm:grid-cols-2 sm:gap-5">
          {CV_CONTACTS.map((item) => (
            <div key={item.id} className="min-w-0 text-left">
              <p className="text-xs tracking-widest text-purple-300 uppercase md:text-[0.7rem]">
                {item.label}
              </p>
              <a
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                tabIndex={open ? 0 : -1}
                className="mt-1 block text-sm break-all text-neutral-100 transition hover:text-purple-300 md:text-[0.9rem]"
              >
                {item.value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bloco com a imagem do currículo (object-contain, borda discreta). */
function CurriculumPreview() {
  return (
    <figure className="mx-auto flex w-full min-w-0 max-w-full flex-col">
      <div className="mb-2.5 flex min-w-0 items-end justify-between gap-3 md:mb-3">
        <h3 className="text-base font-semibold tracking-wide text-white md:text-lg">
          Meu currículo
        </h3>
        <p className="shrink-0 text-xs tracking-wide text-neutral-500 md:text-sm">
          Documento profissional
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-purple-300/25 bg-white shadow-[0_0_0_1px_rgb(168_85_247_/_0.18),0_18px_40px_-20px_rgb(0_0_0_/_0.85)]">
        <img
          src={CV_PREVIEW_SRC}
          alt={CV_PREVIEW_ALT}
          width={905}
          height={734}
          decoding="async"
          className="mx-auto block h-auto max-h-[min(62dvh,34rem)] w-full max-w-full object-contain object-top md:max-h-[min(68dvh,38rem)]"
        />
      </div>
      <figcaption className="sr-only">Prévia visual do currículo em PDF</figcaption>
    </figure>
  );
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Currículo em duas colunas no desktop (texto | imagem).
 * “Entrar em contato” revela Email, WhatsApp, LinkedIn e GitHub.
 */
function CurriculumPage({ onBack, onAbout }: CurriculumPageProps) {
  // ----- estado -----
  const [contactOpen, setContactOpen] = useState(false);

  // ----- handlers -----

  /** Volta para a home. */
  function handleBack(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onBack();
  }

  /** Navega para Sobre Mim. */
  function handleAbout(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onAbout();
  }

  /** Abre/fecha o painel de redes sociais. */
  function toggleContact() {
    setContactOpen((open) => !open);
  }

  // ----- interface -----
  return (
    <main className="curriculum-page relative isolate flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-clip bg-neutral-950 text-white md:h-svh md:max-h-svh md:overflow-y-auto">
      {/* Título (marca d’água) */}
      <h1
        className="about-enter__title font-script pointer-events-none absolute inset-x-0 top-2 z-0 px-4 text-center text-[clamp(2.25rem,9vw,5.75rem)] leading-none whitespace-nowrap text-[#9a92ad] select-none md:top-2"
        aria-hidden="true"
      >
        Currículo
      </h1>

      <section className="about-layout relative z-10 mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col justify-start px-5 pb-6 pt-[clamp(4.25rem,11vw,5.75rem)] min-[390px]:px-6 md:justify-center md:px-10 md:pb-4 lg:px-14 xl:px-20">
        {/* ----- Desktop: lado a lado ----- */}
        <div className="about-layout__row hidden w-full grid-cols-[minmax(0,0.88fr)_auto_minmax(0,1.12fr)] items-center md:grid">
          {/* Esquerda: apresentação + CTAs + redes */}
          <div className="about-enter__bio flex min-w-0 flex-col justify-center gap-3.5 pr-3 text-left lg:gap-4 lg:pr-4 xl:pr-5">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.22em] text-purple-300 uppercase">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300"
                aria-hidden="true"
              />
              {CV_STATUS}
            </p>

            <h2 className="font-script text-[clamp(2.1rem,3.4vw,3.1rem)] leading-none text-purple-300">
              {CV_HEADLINE}
            </h2>

            <div className="flex flex-col gap-2.5 lg:gap-3">
              {CV_INTRO.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="page-copy text-pretty"
                >
                  {avoidOrphan(paragraph)}
                </p>
              ))}
            </div>

            <div>
              <CurriculumActions
                contactOpen={contactOpen}
                onToggleContact={toggleContact}
              />
              <CurriculumContacts open={contactOpen} />
            </div>
          </div>

          {/* Divisória vertical */}
          <div
            className="about-enter__divider about-layout__divider mx-4 min-w-0 self-stretch lg:mx-6 xl:mx-8"
            aria-hidden="true"
          />

          {/* Direita: imagem do CV */}
          <div className="about-enter__facts min-w-0 pl-3 lg:pl-4 xl:pl-5">
            <CurriculumPreview />
          </div>
        </div>

        {/* ----- Mobile: coluna única ----- */}
        <div className="flex w-full flex-col gap-7 md:hidden">
          <div className="about-enter__bio flex flex-col gap-4 text-left">
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.22em] text-purple-300 uppercase min-[390px]:text-sm">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300"
                aria-hidden="true"
              />
              {CV_STATUS}
            </p>

            <h2 className="font-script text-[clamp(2rem,8vw,2.75rem)] leading-none text-purple-300">
              {CV_HEADLINE}
            </h2>

            <div className="flex flex-col gap-3">
              {CV_INTRO.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="page-copy text-pretty"
                >
                  {avoidOrphan(paragraph)}
                </p>
              ))}
            </div>
          </div>

          <div
            className="about-enter__divider about-layout__divider"
            aria-hidden="true"
          />

          <div className="about-enter__facts">
            <CurriculumPreview />
          </div>

          <div>
            <CurriculumActions
              contactOpen={contactOpen}
              onToggleContact={toggleContact}
            />
            <CurriculumContacts open={contactOpen} />
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
            href="#about"
            onClick={handleAbout}
            className="inline-flex min-w-0 shrink translate-x-0 items-center gap-1.5 text-neutral-300 transition-[color,transform] duration-200 ease-out hover:translate-x-1.5 hover:text-purple-300 min-[390px]:gap-2"
          >
            <span className="truncate">Sobre Mim</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </nav>
      </footer>
    </main>
  );
}

export default CurriculumPage;
