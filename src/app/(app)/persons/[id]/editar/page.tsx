import PersonEditView from "@/features/person/presentation/views/person-edit.view";

interface PersonEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonEditPage({ params }: PersonEditPageProps) {
  const { id } = await params;
  return <PersonEditView personId={id} />;
} 