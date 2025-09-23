import NichoDetailView from "@/features/nichos/presentation/views/nicho-detail.view";

interface NichoDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NichoDetailPage({ params }: NichoDetailPageProps) {
  const { id } = await params;
  return <NichoDetailView nichoId={id} />;
} 