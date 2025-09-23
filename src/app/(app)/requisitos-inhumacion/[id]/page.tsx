import RequisitoInhumacionDetailView from "@/features/requisitos-inhumacion/presentation/views/requisito-inhumacion-detail.view";

interface RequisitoInhumacionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RequisitoInhumacionDetailPage({ params }: RequisitoInhumacionDetailPageProps) {
  const { id } = await params;
  
  return <RequisitoInhumacionDetailView requisitoInhumacionId={id} />;
} 