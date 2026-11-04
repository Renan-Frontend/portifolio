import ProjectsPage from "./ProjectsPage";

// =============================================================================
// TIPOS
// =============================================================================

type CertificatesPageProps = {
  /** Volta para a home (sem repetir a intro). */
  onBack: () => void;
  /** Vai para a página Currículo. */
  onCurriculum: () => void;
  /** Id do certificado a focar no carrossel (hash individual). */
  initialCertificateId?: string;
};

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Página Certificados: reutiliza o carrossel de Projetos com outro conteúdo.
 */
function CertificatesPage({
  onBack,
  onCurriculum,
  initialCertificateId,
}: CertificatesPageProps) {
  return (
    <ProjectsPage
      variant="certificates"
      onBack={onBack}
      onNext={onCurriculum}
      nextLabel="Currículo"
      nextHref="#curriculum"
      initialSlideId={initialCertificateId}
    />
  );
}

export default CertificatesPage;
