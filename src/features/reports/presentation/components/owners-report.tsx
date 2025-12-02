"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { FileDown } from "lucide-react";
import {
	OwnerReport,
	reportsService,
} from "../../services/reports.service";
import { reportsPdfService } from "../../services/reports-pdf.service";

export function OwnersReport() {
	const [owners, setOwners] = useState<OwnerReport[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOwners = async () => {
			try {
				const data = await reportsService.getOwners();
				setOwners(data);
			} catch (error) {
				console.error("Error fetching owners:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchOwners();
	}, []);

	const handleExportPdf = async () => {
		await reportsPdfService.generateOwnersReportPdf(owners);
	};

	if (loading) {
		return <div>Cargando reporte de propietarios...</div>;
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Reporte de Propietarios</CardTitle>
				<Button onClick={handleExportPdf} variant="outline" size="sm">
					<FileDown className="mr-2 h-4 w-4" />
					Exportar PDF
				</Button>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead>Cédula</TableHead>
							<TableHead>Nicho</TableHead>
							<TableHead>Tipo</TableHead>
							<TableHead>Fecha Adquisición</TableHead>
							<TableHead>Teléfono</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{owners.map((owner) => (
							<TableRow key={owner.id_propietario_nicho}>
								<TableCell>
									{owner.id_persona.nombres} {owner.id_persona.apellidos}
								</TableCell>
								<TableCell>{owner.id_persona.cedula}</TableCell>
								<TableCell>
									{owner.id_nicho?.numero
										? `${owner.id_nicho.tipo} - ${owner.id_nicho.numero}`
										: `Bloque ${owner.id_nicho?.id_bloque?.numero || "?"} - F${owner.id_nicho?.fila
										} C${owner.id_nicho?.columna}`}
								</TableCell>
								<TableCell>{owner.tipo}</TableCell>
								<TableCell>{owner.fecha_adquisicion}</TableCell>
								<TableCell>{owner.id_persona.telefono}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
