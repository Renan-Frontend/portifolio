import { Download, ExternalLink, X } from "lucide-react";
import { useEffect, useRef } from "react";

// =============================================================================
// TIPOS
// =============================================================================

type CertificateViewerProps = {
  /** Nome do certificado (título do diálogo). */
  title: string;
  /** URL do PDF ou imagem em public/. */
  fileUrl: string;
  /** Fecha o overlay (Esc, backdrop, X ou Voltar do browser). */
  onClose: () => void;
};

// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/** Indica se a URL aponta para uma imagem (JPEG/PNG/etc.), não PDF. */
function isImageFile(url: string): boolean {
  return /\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(url);
}

/** Extrai um nome de arquivo seguro para o atributo download. */
function fileNameFromUrl(url: string): string {
  const segment = url.split("/").pop() ?? "certificado";
  return segment.split("?")[0] || "certificado";
}

/** Detecta Safari/iOS, onde iframe de PDF costuma ficar em branco. */
function prefersExternalPdf(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iP(ad|hone|od)/i.test(ua);
  const isSafari =
    /Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Edg|OPR|Firefox/i.test(ua);
  return isIOS || isSafari;
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Overlay para ver o certificado no próprio site (imagem ou PDF)
 * e baixar o arquivo original. Entra no histórico para o Voltar fechar o modal.
 */
export function CertificateViewer({
  title,
  fileUrl,
  onClose,
}: CertificateViewerProps) {
  const showImage = isImageFile(fileUrl);
  const useExternalPdf = !showImage && prefersExternalPdf();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // ----- efeitos -----

  /** Fecha com Esc e trava o scroll do body enquanto o viewer está aberto. */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  /**
   * Empilha uma entrada no histórico ao abrir.
   * Voltar do browser fecha o overlay; fechar pelo X/Esc remove essa entrada.
   * Em Strict Mode (dev), o remount não deve empilhar duas entradas.
   */
  useEffect(() => {
    let closedByPop = false;
    let pushedByThisEffect = false;

    const state = window.history.state as { certificateViewer?: boolean } | null;
    if (state?.certificateViewer !== true) {
      window.history.pushState({ certificateViewer: true }, "");
      pushedByThisEffect = true;
    }

    function onPopState() {
      closedByPop = true;
      onCloseRef.current();
    }

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (
        pushedByThisEffect &&
        !closedByPop &&
        (window.history.state as { certificateViewer?: boolean } | null)
          ?.certificateViewer
      ) {
        window.history.back();
      }
    };
  }, []);

  // ----- interface -----
  const actionClass =
    "inline-flex items-center gap-1.5 rounded-full border border-purple-300/55 bg-purple-500/20 px-3 py-1.5 text-xs font-medium tracking-wide text-purple-100 transition-[background-color,border-color] hover:border-purple-200 hover:bg-purple-500/30 md:text-sm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-3 backdrop-blur-sm md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => onClose()}
    >
      <div
        className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Cabeçalho */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
          <h2 className="min-w-0 truncate text-sm font-medium tracking-wide text-neutral-100 md:text-base">
            {title}
          </h2>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {!showImage ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>Abrir em nova aba</span>
              </a>
            ) : null}
            <a
              href={fileUrl}
              download={fileNameFromUrl(fileUrl)}
              className={actionClass}
            >
              <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Baixar</span>
            </a>
            <button
              type="button"
              onClick={() => onClose()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-[color,background-color,border-color] hover:border-white/30 hover:bg-white/5 hover:text-white"
              aria-label="Fechar certificado"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Conteúdo: imagem, PDF embutido ou fallback externo */}
        <div className="min-h-0 flex-1 overflow-auto bg-neutral-950 p-2 md:p-4">
          {showImage ? (
            <img
              src={fileUrl}
              alt={title}
              className="mx-auto max-h-[min(80dvh,52rem)] w-auto max-w-full object-contain"
            />
          ) : useExternalPdf ? (
            <div className="flex min-h-[min(60dvh,28rem)] flex-col items-center justify-center gap-4 px-4 text-center">
              <p className="max-w-md text-sm text-neutral-300 md:text-base">
                Neste navegador o PDF abre melhor em uma nova aba.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>Abrir certificado</span>
              </a>
            </div>
          ) : (
            <iframe
              src={fileUrl}
              title={title}
              className="h-[min(80dvh,52rem)] w-full rounded-lg border-0 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
