import { Download, X } from "lucide-react";
import { useEffect } from "react";

// =============================================================================
// TIPOS
// =============================================================================

type CertificateViewerProps = {
  /** Nome do certificado (título do diálogo). */
  title: string;
  /** URL do PDF ou imagem em public/. */
  fileUrl: string;
  /** Fecha o overlay (Esc, backdrop ou botão). */
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

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Overlay para ver o certificado no próprio site (imagem ou PDF)
 * e baixar o arquivo original.
 */
export function CertificateViewer({
  title,
  fileUrl,
  onClose,
}: CertificateViewerProps) {
  const showImage = isImageFile(fileUrl);

  // ----- efeitos -----

  /** Fecha com Esc e trava o scroll do body enquanto o viewer está aberto. */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  // ----- interface -----
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-3 backdrop-blur-sm md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
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
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={fileUrl}
              download={fileNameFromUrl(fileUrl)}
              className="inline-flex items-center gap-1.5 rounded-full border border-purple-300/55 bg-purple-500/20 px-3 py-1.5 text-xs font-medium tracking-wide text-purple-100 transition-[background-color,border-color] hover:border-purple-200 hover:bg-purple-500/30 md:text-sm"
            >
              <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Baixar</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition-[color,background-color,border-color] hover:border-white/30 hover:bg-white/5 hover:text-white"
              aria-label="Fechar certificado"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Conteúdo: imagem ou PDF embutido */}
        <div className="min-h-0 flex-1 overflow-auto bg-neutral-950 p-2 md:p-4">
          {showImage ? (
            <img
              src={fileUrl}
              alt={title}
              className="mx-auto max-h-[min(80dvh,52rem)] w-auto max-w-full object-contain"
            />
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
