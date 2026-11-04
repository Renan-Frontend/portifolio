// =============================================================================
// TEXTO — helpers tipográficos
// =============================================================================

/**
 * Une as últimas palavras com espaço inseparável para evitar
 * linha final com uma palavra só (órfão tipográfico).
 * Preserva espaços no início/fim (ex.: " de Goiânia...").
 */
export function avoidOrphan(text: string, words = 2): string {
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const core = text.trim();
  const parts = core.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return text;
  }

  if (parts.length <= words) {
    return `${leading}${parts.join("\u00A0")}${trailing}`;
  }

  const body = `${parts.slice(0, -words).join(" ")} ${parts
    .slice(-words)
    .join("\u00A0")}`;

  return `${leading}${body}${trailing}`;
}
