"use client";
import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, X, MapPin, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";

export type SearchType = "nicho" | "fallecido";

export interface NichoSearchFilters {
	cementerio?: string;
	sector?: string;
	fila?: string;
	numero?: string;
}

interface NichoSearchBarProps {
	onSearchFallecido: (busqueda: string) => void;
	onSearchNicho: (filters: NichoSearchFilters) => void;
	onClear: () => void;
	isSearching: boolean;
	searchTerm: string;
	searchType: SearchType;
	onSearchTypeChange: (type: SearchType) => void;
}

export function NichoSearchBar({
	onSearchFallecido,
	onSearchNicho,
	onClear,
	isSearching,
	searchTerm,
	searchType,
	onSearchTypeChange,
}: NichoSearchBarProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
	const [nichoFilters, setNichoFilters] = useState<NichoSearchFilters>({
		cementerio: "",
		sector: "",
		fila: "",
		numero: "",
	});

	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleFallecidoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (localSearchTerm.trim().length >= 2) {
			onSearchFallecido(localSearchTerm.trim());
		}
	};

	const handleNichoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const hasFilters = Object.values(nichoFilters).some(value => value && value.trim().length > 0);
		if (hasFilters) {
			onSearchNicho(nichoFilters);
		}
	};

	const handleClear = () => {
		setLocalSearchTerm("");
		setNichoFilters({
			cementerio: "",
			sector: "",
			fila: "",
			numero: "",
		});
		onClear();
	};

	const hasNichoFilters = Object.values(nichoFilters).some(value => value && value.trim().length > 0);

	return (
		<div className="bg-card border rounded-lg p-4">
			<Tabs value={searchType} onValueChange={(value) => onSearchTypeChange(value as SearchType)}>
				<TabsList className="grid w-full grid-cols-2 mb-4">
					<TabsTrigger value="nicho" className="gap-2">
						<MapPin className="w-4 h-4" />
						Buscar por Nicho
					</TabsTrigger>
					<TabsTrigger value="fallecido" className="gap-2">
						<User className="w-4 h-4" />
						Buscar por Fallecido
					</TabsTrigger>
				</TabsList>

				<TabsContent value="nicho" className="space-y-4">
					<form onSubmit={handleNichoSubmit} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
							<Input
								type="text"
								placeholder="Cementerio..."
								value={nichoFilters.cementerio}
								onChange={(e) => setNichoFilters({ ...nichoFilters, cementerio: e.target.value })}
							/>
							<Input
								type="text"
								placeholder="Sector..."
								value={nichoFilters.sector}
								onChange={(e) => setNichoFilters({ ...nichoFilters, sector: e.target.value })}
							/>
							<Input
								type="text"
								placeholder="Fila..."
								value={nichoFilters.fila}
								onChange={(e) => setNichoFilters({ ...nichoFilters, fila: e.target.value })}
							/>
							<Input
								type="text"
								placeholder="Número..."
								value={nichoFilters.numero}
								onChange={(e) => setNichoFilters({ ...nichoFilters, numero: e.target.value })}
							/>
						</div>
						<div className="flex items-center gap-3">
							<Button
								type="submit"
								disabled={!hasNichoFilters || isSearching}
								className="gap-2"
							>
								<Search className="w-4 h-4" />
								{isSearching ? "Buscando..." : "Buscar Nichos"}
							</Button>
							{hasNichoFilters && (
								<Button type="button" variant="outline" onClick={handleClear} className="gap-2">
									<X className="w-4 h-4" />
									Limpiar
								</Button>
							)}
						</div>
					</form>
					<p className="text-xs text-muted-foreground">
						Filtra nichos por cementerio, sector, fila o número. Puedes usar uno o varios criterios.
					</p>
				</TabsContent>

				<TabsContent value="fallecido">
					<form onSubmit={handleFallecidoSubmit} className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input
									type="text"
									placeholder="Buscar por cédula, nombres o apellidos..."
									value={localSearchTerm}
									onChange={(e) => setLocalSearchTerm(e.target.value)}
									className="pl-10 pr-10"
								/>
								{localSearchTerm && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
										onClick={handleClear}
									>
										<X className="w-4 h-4" />
									</Button>
								)}
							</div>
							<Button
								type="submit"
								disabled={localSearchTerm.trim().length < 2 || isSearching}
								className="gap-2"
							>
								<Search className="w-4 h-4" />
								{isSearching ? "Buscando..." : "Buscar"}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							Busca fallecidos por cédula, nombres o apellidos para ver su ubicación (mínimo 2 caracteres)
						</p>
					</form>
				</TabsContent>
			</Tabs>
		</div>
	);
}

