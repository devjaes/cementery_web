import MejoraDetailView from "@/features/mejoras/presentation/views/mejora-detail.view";

interface ParamsProps { params: Promise<{ id: string }>; }

export default async function MejoraDetailPage({ params }: ParamsProps) {
  const { id } = await params;
  return <MejoraDetailView id={id} />;
}


