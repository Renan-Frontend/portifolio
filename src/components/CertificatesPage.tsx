import ProjectsPage from "./ProjectsPage";

// =============================================================================
// TIPOS
// =============================================================================

type CertificatesPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a página Currículo. */
  onCurriculum: () => void;
};

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Certificados: reutiliza o carrossel de Projetos com outro conteúdo.
 */
function CertificatesPage({ onBack, onCurriculum }: CertificatesPageProps) {
  return (
    <ProjectsPage
      variant="certificates"
      onBack={onBack}
      onNext={onCurriculum}
      nextLabel="Currículo"
      nextHref="#curriculum"
    />
  );
}

export default CertificatesPage;
