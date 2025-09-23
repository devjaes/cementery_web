import CementeryEditView from "@/features/cementery/presentation/views/cementery-edit.view";

interface CementeryEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CementeryEditPage({ params }: CementeryEditPageProps) {
  const { id } = await params;
  return <CementeryEditView cementeryId={id} />;
} 