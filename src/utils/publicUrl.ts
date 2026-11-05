// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Monta a URL de um arquivo em public/.
 * BASE_URL é "/" no local e "/portifolio/" no GitHub Pages.
 */
export function publicUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}
