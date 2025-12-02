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
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { FileDown } from "lucide-react";
import {
	DeceasedReport,
	reportsService,
	DeceasedFilters,
} from "../../services/reports.service";
import { reportsPdfService } from "../../services/reports-pdf.service";

export function DeceasedReportComponent() {
	const [deceased, setDeceased] = useState<DeceasedReport[]>([]);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState<DeceasedFilters>({
		startDate: "",
		endDate: "",
		nicheId: "",
		cause: "",
	});

	const fetchDeceased = async () => {
		setLoading(true);
		try {
			const data = await reportsService.getDeceased(filters);
			setDeceased(data);
		} catch (error) {
			console.error("Error fetching deceased:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDeceased();
	}, []);

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const handleSearch = () => {
		fetchDeceased();
	};

	const handleExportPdf = async () => {
		await reportsPdfService.generateDeceasedReportPdf(deceased, filters);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Reporte de Personas Sepultadas</CardTitle>
				<Button onClick={handleExportPdf} variant="outline" size="sm">
					<FileDown className="mr-2 h-4 w-4" />
					Exportar PDF
				</Button>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end">
					<div>
						<Label htmlFor="startDate">Fecha Inicio</Label>
						<Input
							id="startDate"
							name="startDate"
							type="date"
							value={filters.startDate}
							onChange={handleFilterChange}
						/>
					</div>
					<div>
						<Label htmlFor="endDate">Fecha Fin</Label>
						<Input
							id="endDate"
							name="endDate"
							type="date"
							value={filters.endDate}
							onChange={handleFilterChange}
						/>
					</div>
					<div>
						<Label htmlFor="nicheId">ID Nicho</Label>
						<Input
							id="nicheId"
							name="nicheId"
							placeholder="ID del Nicho"
							value={filters.nicheId}
							onChange={handleFilterChange}
						/>
					</div>
					<div>
						<Label htmlFor="cause">Causa Defunción</Label>
						<Input
							id="cause"
							name="cause"
							placeholder="Causa"
							value={filters.cause}
							onChange={handleFilterChange}
						/>
					</div>
					<Button onClick={handleSearch} disabled={loading}>
						{loading ? "Buscando..." : "Buscar"}
					</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nombre</TableHead>
							<TableHead>Fecha Defunción</TableHead>
							<TableHead>Causa</TableHead>
							<TableHead>Nicho</TableHead>
							<TableHead>Fecha Inhumación</TableHead>
							<TableHead>Responsable</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{deceased.map((record) => (
							<TableRow key={record.id_inhumacion}>
								<TableCell>
									{record.id_fallecido.nombres} {record.id_fallecido.apellidos}
								</TableCell>
								<TableCell>{record.id_fallecido.fecha_defuncion}</TableCell>
								<TableCell>{record.id_fallecido.causa_defuncion}</TableCell>
								<TableCell>
									{record.id_nicho?.numero
										? `${record.id_nicho.tipo} - ${record.id_nicho.numero}`
										: `Bloque ${record.id_nicho?.id_bloque?.numero || "?"} - F${record.id_nicho?.fila
										} C${record.id_nicho?.columna}`}
								</TableCell>
								<TableCell>{record.fecha_inhumacion}</TableCell>
								<TableCell>{record.responsable_inhumacion}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
