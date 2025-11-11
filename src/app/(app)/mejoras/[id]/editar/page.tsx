import MejoraEditView from "@/features/mejoras/presentation/views/mejora-edit.view";

interface ParamsProps { 
  params: Promise<{ id: string }>; 
}

export default async function MejoraEditPage({ params }: ParamsProps) {
  const { id } = await params;
  return <MejoraEditView id={id} />;
}
