import NichoEditView from "@/features/nichos/presentation/views/nicho-edit.view";

interface NichoEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NichoEditPage({ params }: NichoEditPageProps) {
  const { id } = await params;
  return <NichoEditView nichoId={id} />;
} 