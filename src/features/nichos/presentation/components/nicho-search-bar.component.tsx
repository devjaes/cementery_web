"use client";
import { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, X, User } from "lucide-react";

interface NichoSearchBarProps {
	onSearchFallecido: (busqueda: string) => void;
	onClear: () => void;
	isSearching: boolean;
	searchTerm: string;
}

export function NichoSearchBar({
	onSearchFallecido,
	onClear,
	isSearching,
	searchTerm,
}: NichoSearchBarProps) {
	const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

	useEffect(() => {
		setLocalSearchTerm(searchTerm);
	}, [searchTerm]);

	const handleFallecidoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (localSearchTerm.trim().length >= 2) {
			onSearchFallecido(localSearchTerm.trim());
		}
	};

	const handleClear = () => {
		setLocalSearchTerm("");
		onClear();
	};

	return (
		<div className="bg-card border rounded-lg p-4">
			<div className="flex items-center gap-2 mb-4">
				<User className="w-4 h-4" />
				<h3 className="font-medium">Buscar por Fallecido</h3>
			</div>
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
		</div>
	);
}

