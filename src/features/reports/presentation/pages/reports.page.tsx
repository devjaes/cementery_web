"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { OwnersReport } from "../components/owners-report";
import { DeceasedReportComponent } from "../components/deceased-report";

export function ReportsPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-8">Reportes</h1>
			<Tabs defaultValue="owners" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="owners">Propietarios</TabsTrigger>
					<TabsTrigger value="deceased">Personas Sepultadas</TabsTrigger>
				</TabsList>
				<TabsContent value="owners">
					<OwnersReport />
				</TabsContent>
				<TabsContent value="deceased">
					<DeceasedReportComponent />
				</TabsContent>
			</Tabs>
		</div>
	);
}
