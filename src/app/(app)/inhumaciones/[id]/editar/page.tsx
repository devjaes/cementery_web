"use client";

import InhumacionEditView from "@/features/inhumaciones/presentation/views/inhumacion-edit.view";
import { useParams } from "next/navigation";

export default function InhumacionEditarPage() {
    const params = useParams();
    return <InhumacionEditView inhumacionId={params.id as string} />;
}