// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Monta a URL de um arquivo em public/.
 * BASE_URL acompanha o `base` do Vite ("/" em local e no GitHub Pages raiz).
 */
export function publicUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
